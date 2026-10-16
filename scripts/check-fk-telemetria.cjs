const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const r = await c.query(`
    select
      conname,
      conrelid::regclass as table_from,
      confrelid::regclass as table_to
    from pg_constraint
    where confrelid = '"Telemetria"'::regclass
  `);
  console.log('Chaves estrangeiras apontando para Telemetria:', r.rows);
  await c.end();
})();
