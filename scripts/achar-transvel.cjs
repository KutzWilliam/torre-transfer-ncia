const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function findTransvel() {
  const q = await pool.query(`
    SELECT fornecedor, id_local, fantasia, razao, cnpj
    FROM fornecedores
    WHERE fantasia ILIKE '%transv%' OR razao ILIKE '%transv%'
    LIMIT 20;
  `);
  console.log("Fornecedores com transv:", q.rows);
}

findTransvel().catch(console.error).finally(() => pool.end());
