const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const r = await c.query(`
    SELECT 
      count(*) as total_viagens_15d,
      count(*) filter (where status in ('PROGRAMADA', 'EM_ANDAMENTO')) as ativas,
      count(*) filter (where status = 'FINALIZADA') as finalizadas
    FROM "Viagem"
    WHERE "prevInicioReal" >= NOW() - INTERVAL '15 days'
  `);
  console.table(r.rows);
  await c.end();
})();
