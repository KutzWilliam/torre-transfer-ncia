// Backfill: persiste em ParadaViagem os horários de chegada/saída que hoje só existem
// "calculados ao vivo" a partir da telemetria. Rodar ANTES de apagar telemetria antiga.
// Replica o algoritmo da página /viagens/[id] (geofence sequencial). Só preenche campos NULOS.
// Uso:  node scripts/backfill-paradas.cjs          (dry-run, não grava)
//       node scripts/backfill-paradas.cjs --apply  (grava)
process.env.TZ = 'UTC'; // Prisma grava timestamp sem fuso como UTC; evita deslocamento no driver pg
const { Client } = require('pg');
const APPLY = process.argv.includes('--apply');

function dist(lat1, lon1, lat2, lon2) {
  const R = 6371e3, r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r, dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcular(paradas, tels) {
  const res = paradas.map(() => ({ ch: null, sa: null }));
  let idx = 0;
  if (paradas.length > 0 && tels.length > 0) {
    const o = paradas[0];
    if (o.latitude && o.longitude) {
      const d = dist(tels[0].latitude, tels[0].longitude, o.latitude, o.longitude);
      if (d > (o.raioMetros ?? 5000)) idx = paradas.length > 1 ? 1 : 0;
    }
  }
  let prim = null, ult = null;
  for (const t of tels) {
    if (idx >= paradas.length) break;
    const p = paradas[idx];
    if (!p.latitude || !p.longitude) { idx++; continue; }
    const d = dist(t.latitude, t.longitude, p.latitude, p.longitude);
    if (d <= (p.raioMetros ?? 5000)) {
      if (!prim) prim = t.dataHoraLocal;
      ult = t.dataHoraLocal;
    } else if (prim) {
      if (idx + 1 < paradas.length) {
        const n = paradas[idx + 1];
        if (n.latitude && n.longitude && dist(t.latitude, t.longitude, n.latitude, n.longitude) <= (n.raioMetros ?? 5000)) {
          res[idx] = { ch: idx === 0 ? null : prim, sa: idx === paradas.length - 1 ? null : ult };
          idx++; prim = t.dataHoraLocal; ult = t.dataHoraLocal;
        }
      }
    }
  }
  if (prim && idx < paradas.length) {
    res[idx] = { ch: idx === 0 ? null : prim, sa: idx === paradas.length - 1 ? null : ult };
  }
  return res;
}

(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const { rows: viagens } = await c.query(`
    select v.id, v."veiculoId", v.status, v."prevInicioReal", v."prevFimReal", v."dataInicioEfetivo", v."dataFimEfetivo"
    from "Viagem" v
    where exists (select 1 from "ParadaViagem" p where p."viagemId"=v.id and (p."dataChegadaEfetiva" is null or p."dataSaidaEfetiva" is null))
    order by v."prevInicioReal"`);
  console.log(`Viagens a analisar: ${viagens.length} | modo: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);
  let nViagens = 0, nCampos = 0, semTel = 0;
  for (const v of viagens) {
    let ini = new Date(v.prevInicioReal.getTime() - 6 * 3600e3);
    let fim = new Date((v.dataFimEfetivo ?? v.prevFimReal).getTime() + 12 * 3600e3);
    if (v.status === 'FINALIZADA' && v.dataFimEfetivo) {
      fim = new Date(v.dataFimEfetivo.getTime() + 5 * 60000);
      if (v.dataInicioEfetivo) ini = new Date(v.dataInicioEfetivo.getTime() - 5 * 60000);
    } else if (v.dataInicioEfetivo) ini = new Date(v.dataInicioEfetivo.getTime() - 5 * 60000);

    const { rows: tels } = await c.query(
      `select latitude, longitude, "dataHoraLocal" from "Telemetria" where "veiculoId"=$1 and "dataHoraLocal">=$2 and "dataHoraLocal"<=$3 order by "dataHoraLocal" asc`,
      [v.veiculoId, ini, fim]);
    if (tels.length === 0) { semTel++; continue; }
    const { rows: paradas } = await c.query(
      `select p.id, p.ordem, p."dataChegadaEfetiva", p."dataSaidaEfetiva", b.latitude, b.longitude, b."raioMetros"
       from "ParadaViagem" p join "Base" b on b.id=p."baseId" where p."viagemId"=$1 order by p.ordem asc`, [v.id]);
    const r = calcular(paradas, tels);
    let mexeu = false;
    for (let i = 0; i < paradas.length; i++) {
      const p = paradas[i];
      const ch = !p.dataChegadaEfetiva && r[i].ch ? r[i].ch : null;
      const sa = !p.dataSaidaEfetiva && r[i].sa ? r[i].sa : null;
      if (!ch && !sa) continue;
      mexeu = true; nCampos += (ch ? 1 : 0) + (sa ? 1 : 0);
      if (APPLY) await c.query(`update "ParadaViagem" set "dataChegadaEfetiva"=coalesce("dataChegadaEfetiva",$2), "dataSaidaEfetiva"=coalesce("dataSaidaEfetiva",$3) where id=$1`, [p.id, ch, sa]);
    }
    if (mexeu) nViagens++;
  }
  console.log(`Viagens com paradas preenchidas: ${nViagens} | campos preenchidos: ${nCampos} | viagens sem telemetria (nada a recuperar): ${semTel}`);
  await c.end();
})();
