// Análise SOMENTE LEITURA do tamanho do banco (não altera dados)
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db', statement_timeout: 120000 });
  await c.connect();
  const q = async (t, s) => { console.log('\n== ' + t); try { console.table((await c.query(s)).rows); } catch (e) { console.log('ERRO', e.message); } };
  await q('Tamanho do DB', `select pg_size_pretty(pg_database_size(current_database())) size`);
  await q('Top tabelas', `select relname, pg_size_pretty(pg_total_relation_size(c.oid)) total, pg_size_pretty(pg_relation_size(c.oid)) tabela, pg_size_pretty(pg_indexes_size(c.oid)) indices, c.reltuples::bigint est_linhas from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' order by pg_total_relation_size(c.oid) desc limit 15`);
  await q('Bloat Telemetria (dead tuples)', `select relname, n_live_tup, n_dead_tup, last_autovacuum, last_vacuum from pg_stat_user_tables order by n_dead_tup desc limit 5`);
  await q('Periodo Telemetria', `select min("dataHoraUtc") min, max("dataHoraUtc") max from "Telemetria"`);
  await q('Telemetria por mes (estimativa rapida)', `select date_trunc('month',"dataHoraUtc") mes, count(*) from "Telemetria" group by 1 order by 1`);
  await q('Veiculos distintos', `select count(distinct "veiculoId") from "Telemetria"`);
  await q('Vacuum/queries ativas', `select pid, state, now()-query_start dur, left(query,80) q from pg_stat_activity where datname=current_database() and state<>'idle'`);
  await c.end();
})();
