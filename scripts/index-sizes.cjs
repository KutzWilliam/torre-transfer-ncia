const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const dbSize = await c.query(`select pg_size_pretty(pg_database_size(current_database())) as db_size`);
  console.log('Tamanho total da base no Postgres:', dbSize.rows[0].db_size);
  const total = await c.query(`
    select 
      pg_size_pretty(pg_relation_size('"Telemetria"')) as table_data,
      pg_size_pretty(pg_indexes_size('"Telemetria"')) as indexes_total,
      pg_size_pretty(pg_total_relation_size('"Telemetria"')) as total_telemetria
  `);
  console.table(total.rows);
  await c.end();
})();
