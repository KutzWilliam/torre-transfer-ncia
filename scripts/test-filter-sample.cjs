const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  console.log('Testando amostragem com filtro de segundo...');
  const t0 = Date.now();
  const r = await c.query(`
    SELECT count(*) as count_amostra
    FROM (
      SELECT "dataHoraLocal"
      FROM "Telemetria"
      WHERE "dataHoraLocal" >= NOW() - INTERVAL '15 days'
        AND EXTRACT(SECOND FROM "dataHoraLocal") < 5
      LIMIT 100000
    ) s
  `);
  console.table(r.rows);
  console.log(`Tempo: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  await c.end();
})();
