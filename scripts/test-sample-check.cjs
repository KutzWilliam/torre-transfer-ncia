const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const r = await c.query(`
    SELECT "veiculoId", count(*) as total,
           min("dataHoraLocal") as de, max("dataHoraLocal") as ate
    FROM (
      SELECT "veiculoId", "dataHoraLocal"
      FROM "Telemetria"
      WHERE "dataHoraLocal" >= NOW() - INTERVAL '15 days'
        AND EXTRACT(SECOND FROM "dataHoraLocal") < 10
      LIMIT 1000
    ) sub
    GROUP BY "veiculoId"
    LIMIT 5;
  `);
  console.table(r.rows);
  await c.end();
})();
