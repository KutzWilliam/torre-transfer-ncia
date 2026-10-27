const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 10000 });

async function listManifestoCols() {
  const cols = await pool.query(`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'manifesto'
    ORDER BY ordinal_position;
  `);
  console.log(`Manifesto tem ${cols.rows.length} colunas:`);
  console.log(cols.rows.map(c => `  ${c.column_name}: ${c.data_type}`).join('\n'));
}

listManifestoCols().catch(console.error).finally(() => pool.end());
