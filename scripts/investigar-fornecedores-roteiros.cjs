const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function fixQueries() {
  console.log("=== Colunas fornecedores ===");
  const cF = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'fornecedores' ORDER BY ordinal_position LIMIT 15;");
  console.log(cF.rows.map(r => r.column_name).join(', '));

  console.log("\n=== Colunas roteiros ===");
  const cR = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'roteiros' ORDER BY ordinal_position LIMIT 15;");
  console.log(cR.rows.map(r => r.column_name).join(', '));

  console.log("\n=== Fornecedores encontrados por nome da planilha ===");
  const forns = await pool.query(`
    SELECT fornecedor, fantasia, razao, cnpj
    FROM fornecedores
    WHERE fantasia ILIKE '%Emiko%' OR fantasia ILIKE '%Transvel%' OR fantasia ILIKE '%Abra%' 
       OR fantasia ILIKE '%Dalla%' OR fantasia ILIKE '%ABC%'
       OR razao ILIKE '%Emiko%' OR razao ILIKE '%Transvel%' OR razao ILIKE '%Abra%' 
       OR razao ILIKE '%Dalla%' OR razao ILIKE '%ABC%'
    LIMIT 20;
  `);
  console.table(forns.rows);

  console.log("\n=== Amostra de roteiros ===");
  const rots = await pool.query("SELECT * FROM roteiros LIMIT 5;");
  console.table(rots.rows);

  console.log("\n=== Onde está o valor 100375? ===");
  // Vamos buscar em unidades se tem algum campo com 100375
  const uSample = await pool.query("SELECT id_unidade, fantasia, cidade, sigla, id_local FROM unidades LIMIT 5;");
  console.table(uSample.rows);
}

fixQueries().catch(console.error).finally(() => pool.end());
