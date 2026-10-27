const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function investigateDetails() {
  console.log("=== 1. O que é transf_origem '100328' / '100375'? ===");
  // Testar em unidades, rotas, roteiros
  const u1 = await pool.query("SELECT * FROM unidades WHERE id_unidade = 100375 OR id_local = 100375 LIMIT 5;");
  console.log("Em unidades:", u1.rows);

  const r1 = await pool.query("SELECT * FROM rotas WHERE id = 100375 OR id_rota = '100375' LIMIT 5;");
  console.log("Em rotas:", r1.rows);

  const rot1 = await pool.query("SELECT * FROM roteiros WHERE id::text = '100375' OR id_roteiro::text = '100375' LIMIT 5;").catch(e => ({ rows: e.message }));
  console.log("Em roteiros:", rot1.rows);

  // Buscar em qualquer tabela onde 100375 apareça como id
  const anyTab = await pool.query(`
    SELECT table_name, column_name 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND (column_name LIKE '%id%' OR column_name LIKE '%unidade%' OR column_name LIKE '%praca%' OR column_name LIKE '%base%')
    LIMIT 20;
  `);

  console.log("\n=== 2. Tabela terceiros e fornecedores ===");
  const terc = await pool.query(`
    SELECT t.id_terceiro, t.nome, t.motorista, t.fornecedor, f.fantasia as nome_fornecedor, f.razao as razao_fornecedor,
           t.ve_placa, t.ve_marca, t.ve_modelo, t.ve_capacidade, t."capM3"
    FROM terceiros t
    LEFT JOIN fornecedores f ON f.id_fornecedor = t.fornecedor
    WHERE t.id_terceiro IN (324, 764, 717, 1254)
    LIMIT 10;
  `);
  console.table(terc.rows);

  console.log("\n=== 3. Nomes de Fornecedores na tabela fornecedores ===");
  const forns = await pool.query(`
    SELECT id_fornecedor, fantasia, razao, cnpj
    FROM fornecedores
    WHERE fantasia ILIKE '%Emiko%' OR fantasia ILIKE '%Transvel%' OR fantasia ILIKE '%Abra%' 
       OR fantasia ILIKE '%Dalla%' OR fantasia ILIKE '%ABC%'
       OR razao ILIKE '%Emiko%' OR razao ILIKE '%Transvel%' OR razao ILIKE '%Abra%' 
       OR razao ILIKE '%Dalla%' OR razao ILIKE '%ABC%'
    LIMIT 20;
  `);
  console.table(forns.rows);
}

investigateDetails().catch(console.error).finally(() => pool.end());
