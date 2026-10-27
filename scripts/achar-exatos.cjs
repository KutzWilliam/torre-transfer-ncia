const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function findExact() {
  const terms = ['Emiko', 'Transvel', 'Abrahao', 'Abraão', 'Abrao', 'Dalla Corte', 'Lima'];
  for (const t of terms) {
    const q = await pool.query(`
      SELECT fornecedor, id_local, fantasia, razao, cnpj
      FROM fornecedores
      WHERE (fantasia ILIKE $1 OR razao ILIKE $1) AND fornecedor = '1'
      LIMIT 10;
    `, [`%${t}%`]);
    console.log(`Fornecedor ativo (fornecedor='1') com "${t}":`, q.rows);
  }
}

findExact().catch(console.error).finally(() => pool.end());
