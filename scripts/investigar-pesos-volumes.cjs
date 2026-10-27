const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function inspectWeightsAndVolumes() {
  console.log("=== 1. Amostra de campos de peso/volume em MINUTA ===");
  const minutasSample = await pool.query(`
    SELECT 
      id_minuta,
      total_volumes,
      total_peso,
      total_cubo,
      metragem_cubica,
      cubagem_rodoviario,
      cubagem_aereo,
      total_taxado,
      frete_peso,
      total_nf_valor,
      frete_total
    FROM minuta
    WHERE total_volumes > 0 AND total_peso > 0
    ORDER BY id_minuta DESC
    LIMIT 10;
  `);
  console.table(minutasSample.rows);

  console.log("\n=== 2. Amostra de campos em MANIFESTO (peso_transf, volumes_transf, etc) ===");
  const manifestoSample = await pool.query(`
    SELECT 
      id_manifesto,
      tipo,
      peso_transf,
      volumes_transf,
      custo_transf,
      total_nf_valor,
      prev_saida_data
    FROM manifesto
    WHERE prev_saida_data >= '2026-10-20' AND (peso_transf IS NOT NULL OR volumes_transf IS NOT NULL)
    ORDER BY id_manifesto DESC
    LIMIT 10;
  `);
  console.table(manifestoSample.rows);

  console.log("\n=== 3. Comparação: Minutas somadas vs Tabela Volumes vs Bipagens para 5 manifestos ===");
  const testManifestos = [182498, 182495, 182493, 182485, 182482];
  for (const id of testManifestos) {
    const q = await pool.query(`
      SELECT 
        m.id_manifesto,
        m.peso_transf,
        m.volumes_transf,
        -- Soma das minutas vinculadas
        COUNT(DISTINCT ml.minuta) as qtd_minutas,
        SUM(mn.total_volumes) as sum_minuta_volumes,
        SUM(mn.total_peso) as sum_minuta_peso,
        SUM(mn.total_cubo) as sum_minuta_cubo,
        SUM(mn.metragem_cubica) as sum_metragem_cubica,
        SUM(mn.cubagem_rodoviario) as sum_cubagem_rodoviario,
        -- Contagem na tabela volumes
        (SELECT COUNT(*) FROM volumes v WHERE v.id_minuta IN (SELECT minuta FROM manifesto_list WHERE id_manifesto = $1)) as count_tabela_volumes,
        -- Bipagens de embarque
        (SELECT COUNT(DISTINCT hv.id_volume) FROM historico_volume hv WHERE hv.manifesto = $1 AND hv.tipo = 1) as count_bipados_embarque
      FROM manifesto m
      JOIN manifesto_list ml ON ml.id_manifesto = m.id_manifesto
      LEFT JOIN minuta mn ON mn.id_minuta = ml.minuta
      WHERE m.id_manifesto = $1
      GROUP BY m.id_manifesto, m.peso_transf, m.volumes_transf;
    `, [id]);
    console.log(`Manifesto ${id}:`, q.rows[0]);
  }

  console.log("\n=== 4. Colunas da tabela VOLUMES ===");
  const colsVol = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'volumes'
    ORDER BY ordinal_position
    LIMIT 20;
  `);
  console.log(colsVol.rows.map(c => `${c.column_name} (${c.data_type})`).join(', '));
}

inspectWeightsAndVolumes().catch(console.error).finally(() => pool.end());
