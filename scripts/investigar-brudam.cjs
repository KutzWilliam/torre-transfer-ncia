const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 10000 });

async function main() {
  try {
    const res = await pool.query(`
      SELECT table_schema, table_name, table_type
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
    `);
    console.log('Total de tabelas:', res.rows.length);
    console.table(res.rows);
  } catch (err) {
    console.error('Erro:', err.message);
  } finally {
    await pool.end();
  }
}
main();
