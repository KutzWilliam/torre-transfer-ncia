const { Client } = require('pg');
(async () => {
  const c = new Client('postgresql://admin:1234@localhost:5433/transferencias_db');
  await c.connect();
  const r = await c.query('SELECT count(*) as total_linhas, min("dataHoraLocal") as min_data, max("dataHoraLocal") as max_data FROM "Telemetria_nova";');
  console.table(r.rows);
  await c.end();
})();
