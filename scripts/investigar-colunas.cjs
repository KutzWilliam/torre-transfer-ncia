const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 10000 });

async function inspectTables() {
  const tables = ['manifesto', 'manifesto_list', 'manifesto_tipo', 'manifesto_status', 'minuta', 'minuta_status', 'fornecedores', 'terceiros', 'veiculos', 'rotas', 'roteiros', 'unidades'];
  
  for (const t of tables) {
    console.log(`\n================ TABELA: ${t} ================`);
    const cols = await pool.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `, [t]);
    console.log(cols.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));
  }
}

inspectTables().catch(console.error).finally(() => pool.end());
