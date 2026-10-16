const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  console.log('PostgreSQL conectado! Executando CHECKPOINT...');
  await c.query('CHECKPOINT;');
  console.log('CHECKPOINT concluído com sucesso!');

  // Remove Telemetria_nova se sobrou da tentativa anterior
  await c.query('DROP TABLE IF EXISTS "Telemetria_nova" CASCADE;');
  console.log('Tabela temporária Telemetria_nova removida.');

  const r = await c.query(`
    SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
  `);
  console.log('Tamanho da base no Postgres:', r.rows[0].db_size);
  await c.end();
})();
