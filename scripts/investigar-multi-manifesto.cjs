const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkMinutasMultiManifesto() {
  console.log("=== Minutas vinculadas a mais de um manifesto recente ===");
  const q = await pool.query(`
    SELECT ml.minuta, count(DISTINCT ml.id_manifesto) as qtd_manifestos,
           array_agg(ml.id_manifesto ORDER BY ml.id_manifesto) as manifestos,
           mn.origem, mn.destino, mn.total_volumes, mn.total_peso, mn.total_cubo, mn.frete_total
    FROM manifesto_list ml
    JOIN minuta mn ON mn.id_minuta = ml.minuta
    WHERE ml.id_manifesto >= 180000
    GROUP BY ml.minuta, mn.origem, mn.destino, mn.total_volumes, mn.total_peso, mn.total_cubo, mn.frete_total
    HAVING count(DISTINCT ml.id_manifesto) > 1
    ORDER BY count(DISTINCT ml.id_manifesto) DESC
    LIMIT 10;
  `);
  console.table(q.rows);

  if (q.rows.length > 0) {
    const sampleMinuta = q.rows[0].minuta;
    console.log(`\n=== Detalhe dos manifestos da minuta ${sampleMinuta} ===`);
    const mD = await pool.query(`
      SELECT m.id_manifesto, m.tipo, mt.tipo as tipo_nome, m.status,
             a_orig.aeroporto as aero_orig, a_dest.aeroporto as aero_dest,
             u_orig.fantasia as base_orig, u_dest.fantasia as base_dest,
             m.prev_saida_data, m.saida_efetiva_data,
             v.placa, fv.fantasia as fornecedor
      FROM manifesto m
      JOIN manifesto_list ml ON ml.id_manifesto = m.id_manifesto
      LEFT JOIN manifesto_tipo mt ON mt.id_tipo = m.tipo
      LEFT JOIN aero a_orig ON a_orig.id_aero::text = m.transf_origem
      LEFT JOIN aero a_dest ON a_dest.id_aero::text = m.transf_destino
      LEFT JOIN unidades u_orig ON u_orig.id_unidade::text = m.base
      LEFT JOIN unidades u_dest ON u_dest.id_unidade::text = m.destino
      LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
      LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
      WHERE ml.minuta = $1
      ORDER BY m.id_manifesto ASC;
    `, [sampleMinuta]);
    console.table(mD.rows);
  }
}

checkMinutasMultiManifesto().catch(console.error).finally(() => pool.end());
