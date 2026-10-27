const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function deepDiveVolumes() {
  console.log("=== Amostra de 5 minutas com detalhes de volumes na tabela VOLUMES ===");
  const vSample = await pool.query(`
    SELECT 
      v.id_minuta,
      COUNT(v.id_volume) as qtd_volumes_tabela,
      SUM(v.peso) as soma_peso_volumes,
      SUM(v.cubagem) as soma_cubagem_volumes,
      mn.total_volumes,
      mn.total_peso,
      mn.total_cubo,
      mn.metragem_cubica
    FROM volumes v
    JOIN minuta mn ON mn.id_minuta = v.id_minuta
    WHERE v.id_minuta IN (1930321, 1930319, 1930314)
    GROUP BY v.id_minuta, mn.total_volumes, mn.total_peso, mn.total_cubo, mn.metragem_cubica;
  `);
  console.table(vSample.rows);

  console.log("\n=== Tabela VOLUMES individual (primeiras 5 linhas da minuta 1930319) ===");
  const vRows = await pool.query(`
    SELECT id_volume, id_minuta, parcial, total, peso, comprimento, largura, altura, cubagem
    FROM volumes
    WHERE id_minuta = 1930319
    ORDER BY parcial ASC;
  `);
  console.table(vRows.rows);

  console.log("\n=== Manifestos: conferindo peso_transf e volumes_transf em outros tipos ===");
  const mAll = await pool.query(`
    SELECT id_manifesto, tipo, peso_transf, volumes_transf, km_rodado, prev_saida_data
    FROM manifesto
    WHERE (peso_transf IS NOT NULL AND peso_transf != '')
       OR (volumes_transf IS NOT NULL AND volumes_transf != '')
    LIMIT 10;
  `);
  console.table(mAll.rows);
}

deepDiveVolumes().catch(console.error).finally(() => pool.end());
