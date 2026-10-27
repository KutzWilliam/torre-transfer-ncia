const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function inspectAero() {
  const c = await pool.query("SELECT * FROM aero WHERE id_aero IN (100328, 100329, 100375, 100399, 100368, 100331) OR aeroporto ILIKE '%Curitiba%' LIMIT 10;");
  console.table(c.rows);
}

inspectAero().catch(console.error).finally(() => pool.end());
