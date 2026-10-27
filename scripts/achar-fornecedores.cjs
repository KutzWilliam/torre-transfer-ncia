const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function findSuppliers() {
  const terms = ['Emiko', 'Transvel', 'Abraao', 'Abraão', 'Dalla Corte', 'ABC'];
  for (const t of terms) {
    console.log(`\n=== Buscando fornecedor: "${t}" ===`);
    const q = await pool.query(`
      SELECT fornecedor, id_local, fantasia, razao, cnpj, cidade, status
      FROM fornecedores
      WHERE fantasia ILIKE $1 OR razao ILIKE $1
      LIMIT 10;
    `, [`%${t}%`]);
    console.table(q.rows);
  }
}

findSuppliers().catch(console.error).finally(() => pool.end());
