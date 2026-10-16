const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  console.log('Testando busca de telemetria de 1 veículo nos últimos 15 dias...');
  const t0 = Date.now();
  const v = await c.query(`SELECT id FROM "Veiculo" LIMIT 1`);
  const veiculoId = v.rows[0].id;
  console.log('Veiculo testado:', veiculoId);
  
  const r = await c.query(`
    EXPLAIN ANALYZE
    SELECT DISTINCT ON (date_trunc('minute', "dataHoraLocal"))
      "id", "veiculoId", "latitude", "longitude", "dataHoraLocal"
    FROM "Telemetria"
    WHERE "veiculoId" = $1 AND "dataHoraLocal" >= NOW() - INTERVAL '15 days'
    ORDER BY date_trunc('minute', "dataHoraLocal"), "dataHoraLocal" DESC
    LIMIT 100
  `, [veiculoId]);
  console.log('Plano de execucao:');
  r.rows.forEach(row => console.log(row['QUERY PLAN']));
  console.log(`Tempo total: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await c.end();
})();
