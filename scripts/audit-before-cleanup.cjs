// SOMENTE LEITURA. Verifica se algum horário real de viagem dependeria da telemetria que será apagada.
const { Client } = require('pg');
const DIAS = 15;
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db', statement_timeout: 60000 });
  await c.connect();
  const q = async (t, s) => { console.log('\n== ' + t); try { console.table((await c.query(s)).rows); } catch (e) { console.log('ERRO', e.message); } };
  const cut = `now() - interval '${DIAS} days'`;
  await q('Viagens antigas por status', `select status, count(*) from "Viagem" where coalesce("dataFimEfetivo","prevFimReal") < ${cut} group by 1`);
  await q('Antigas FINALIZADAS sem dataFimEfetivo/dataInicioEfetivo', `select count(*) filter (where "dataFimEfetivo" is null) sem_fim, count(*) filter (where "dataInicioEfetivo" is null) sem_inicio, count(*) total from "Viagem" where status='FINALIZADA' and coalesce("dataFimEfetivo","prevFimReal") < ${cut}`);
  await q('Antigas ainda ATIVAS (PROGRAMADA/EM_ANDAMENTO) - serao reprocessadas', `select count(*) from "Viagem" where status in ('PROGRAMADA','EM_ANDAMENTO') and "prevFimReal" < ${cut}`);
  await q('Paradas de viagens antigas finalizadas sem chegada efetiva (intermediarias)', `select count(*) total_paradas, count(*) filter (where p."dataChegadaEfetiva" is null) sem_chegada, count(*) filter (where p."dataSaidaEfetiva" is null) sem_saida from "ParadaViagem" p join "Viagem" v on v.id=p."viagemId" where v.status='FINALIZADA' and coalesce(v."dataFimEfetivo",v."prevFimReal") < ${cut}`);
  await c.end();
})();
