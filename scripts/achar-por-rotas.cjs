const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function findByRoutes() {
  // Vamos buscar manifestos onde aero_orig ou aero_dest seja Curitiba, Londrina, Cascavel, Toledo
  const q = await pool.query(`
    SELECT DISTINCT
      COALESCE(fv.fantasia, ft.fantasia) as fornecedor_nome,
      COALESCE(fv.cnpj, ft.cnpj) as fornecedor_cnpj,
      a_orig.aeroporto as origem,
      a_dest.aeroporto as destino,
      v.placa,
      m.tipo,
      count(*) as qtd
    FROM manifesto m
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    LEFT JOIN fornecedores ft ON t.fornecedor::text = ft.id_local::text
    LEFT JOIN aero a_orig ON a_orig.id_aero::text = m.transf_origem
    LEFT JOIN aero a_dest ON a_dest.id_aero::text = m.transf_destino
    WHERE (a_orig.aeroporto ILIKE '%LONDRINA%' OR a_dest.aeroporto ILIKE '%LONDRINA%'
           OR a_orig.aeroporto ILIKE '%CASCAVEL%' OR a_dest.aeroporto ILIKE '%CASCAVEL%')
      AND m.prev_saida_data >= '2026-09-01'
    GROUP BY 1, 2, 3, 4, 5, 6
    ORDER BY qtd DESC
    LIMIT 20;
  `);
  console.table(q.rows);
}

findByRoutes().catch(console.error).finally(() => pool.end());
