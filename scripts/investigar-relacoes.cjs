const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkRelations() {
  console.log("=== 1. Amostra de manifesto com transf_origem e transf_destino ===");
  const transfSample = await pool.query(`
    SELECT m.id_manifesto, m.tipo, mt.tipo as nome_tipo, m.status, ms.descricao as nome_status,
           m.base, u_base.cidade as cidade_base, u_base.fantasia as nome_base,
           m.transf_origem, u_orig.cidade as cidade_origem,
           m.transf_destino, u_dest.cidade as cidade_destino,
           m.veiculo, v.placa, v.modelo, v.capacidade, v."capM3",
           m.veiculo_terceiro,
           m.motorista,
           m.custo_motorista, m.custo_transf, m.valor_total_km,
           m.prev_saida_data
    FROM manifesto m
    LEFT JOIN manifesto_tipo mt ON mt.id_tipo = m.tipo
    LEFT JOIN manifesto_status ms ON ms.id_status = m.status
    LEFT JOIN unidades u_base ON u_base.id_unidade::text = m.base
    LEFT JOIN unidades u_orig ON u_orig.id_unidade::text = m.transf_origem
    LEFT JOIN unidades u_dest ON u_dest.id_unidade::text = m.transf_destino
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    WHERE (m.transf_origem IS NOT NULL OR m.tipo IN (1, 2, 4))
      AND m.prev_saida_data >= '2026-10-20'
    ORDER BY m.id_manifesto DESC
    LIMIT 10;
  `);
  console.table(transfSample.rows);

  console.log("\n=== 2. Verificando manifesto_list e minuta vinculadas aos manifestos acima ===");
  if (transfSample.rows.length > 0) {
    const ids = transfSample.rows.map(r => r.id_manifesto).slice(0, 5);
    for (const id of ids) {
      const q = await pool.query(`
        SELECT ml.id_manifesto, count(ml.minuta) as total_minutas,
               sum(mn.total_volumes) as soma_volumes,
               sum(mn.total_peso) as soma_peso,
               sum(mn.total_cubo) as soma_cubo,
               sum(mn.frete_total) as soma_frete_cliente,
               sum(mn.total_nf_valor) as soma_valor_notas
        FROM manifesto_list ml
        LEFT JOIN minuta mn ON mn.id_minuta = ml.minuta
        WHERE ml.id_manifesto = $1
        GROUP BY ml.id_manifesto;
      `, [id]);
      console.log(`Manifesto ${id}:`, q.rows[0]);
    }
  }
}

checkRelations().catch(console.error).finally(() => pool.end());
