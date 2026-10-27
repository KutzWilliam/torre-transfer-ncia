const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkRota() {
  const r = await pool.query("SELECT * FROM rotas WHERE id IN (66, 1, 2, 3, 4, 5) LIMIT 10;");
  console.table(r.rows);
}

checkRota().catch(console.error).finally(() => pool.end());
