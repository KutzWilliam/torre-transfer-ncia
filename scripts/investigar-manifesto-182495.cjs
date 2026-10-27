const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkVolumesManifesto() {
  const q = await pool.query(`
    SELECT v.id_volume, v.id_minuta::text, v.peso, v.comprimento, v.largura, v.altura, v.cubagem
    FROM volumes v
    WHERE v.id_minuta::text IN (
      SELECT ml.minuta::text FROM manifesto_list ml WHERE ml.id_manifesto = 182495
    )
    LIMIT 10;
  `);
  console.log("Amostra volumes do manifesto 182495:");
  console.table(q.rows);

  console.log("\nSoma da tabela volumes no manifesto 182495:");
  const sumV = await pool.query(`
    SELECT 
      COUNT(*) as total_vols,
      SUM(v.peso) as soma_peso,
      SUM(v.cubagem) as soma_cubagem
    FROM volumes v
    WHERE v.id_minuta::text IN (
      SELECT ml.minuta::text FROM manifesto_list ml WHERE ml.id_manifesto = 182495
    );
  `);
  console.table(sumV.rows);

  console.log("\nSoma da tabela MINUTA para o manifesto 182495:");
  const sumM = await pool.query(`
    SELECT 
      COUNT(DISTINCT mn.id_minuta) as total_minutas,
      SUM(mn.total_volumes) as soma_total_volumes,
      SUM(mn.total_peso) as soma_total_peso,
      SUM(mn.total_cubo) as soma_total_cubo,
      SUM(mn.metragem_cubica) as soma_metragem_cubica,
      SUM(mn.cubagem_rodoviario) as soma_cubagem_rodoviario
    FROM minuta mn
    WHERE mn.id_minuta IN (
      SELECT ml.minuta FROM manifesto_list ml WHERE ml.id_manifesto = 182495
    );
  `);
  console.table(sumM.rows);
}

checkVolumesManifesto().catch(console.error).finally(() => pool.end());
