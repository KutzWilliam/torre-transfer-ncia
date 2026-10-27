const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 10000 });

async function inspectManifestoMinuta() {
  const tables = ['manifesto', 'manifesto_list', 'minuta'];
  for (const t of tables) {
    const cols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [t]);
    console.log(`\n================ TABELA: ${t} (${cols.rows.length} colunas) ================`);
    console.log(cols.rows.map(c => `  ${c.column_name}: ${c.data_type}`).join('\n'));
  }
}

inspectManifestoMinuta().catch(console.error).finally(() => pool.end());
