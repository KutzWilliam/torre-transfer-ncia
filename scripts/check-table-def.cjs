const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const r = await c.query(`
    select tgname from pg_trigger where tgrelid = '"Telemetria"'::regclass and not tgisinternal
  `);
  console.log('Triggers customizados em Telemetria:', r.rows);
  const def = await c.query(`
    select column_name, data_type, is_nullable, column_default
    from information_schema.columns
    where table_name = 'Telemetria'
    order by ordinal_position
  `);
  console.table(def.rows);
  await c.end();
})();
