const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkMetragemVsCubo() {
  console.log("=== Analisando minutas recentes: metragem_cubica vs total_cubo ===");
  const q = await pool.query(`
    SELECT 
      COUNT(*) as total_minutas,
      COUNT(*) FILTER (WHERE total_peso > 0) as com_peso,
      COUNT(*) FILTER (WHERE total_volumes > 0) as com_volumes,
      COUNT(*) FILTER (WHERE metragem_cubica > 0) as com_metragem_cubica,
      COUNT(*) FILTER (WHERE total_cubo > 0) as com_total_cubo,
      COUNT(*) FILTER (WHERE metragem_cubica = 0 AND total_cubo > 0) as zero_metragem_mas_tem_cubo,
      AVG(CASE WHEN metragem_cubica > 0 AND total_cubo > 0 THEN total_cubo / metragem_cubica END) as fator_medio
    FROM minuta
    WHERE id_minuta >= 1900000;
  `);
  console.table(q.rows);

  console.log("\n=== Amostra de minutas onde metragem_cubica = 0 e total_cubo > 0 ===");
  const q2 = await pool.query(`
    SELECT id_minuta, total_volumes, total_peso, total_cubo, metragem_cubica, cubagem_rodoviario
    FROM minuta
    WHERE id_minuta >= 1900000 AND metragem_cubica = 0 AND total_cubo > 0
    LIMIT 10;
  `);
  console.table(q2.rows);

  console.log("\n=== Verificando na tabela volumes para essas minutas sem metragem_cubica ===");
  if (q2.rows.length > 0) {
    const ids = q2.rows.map(r => r.id_minuta).slice(0, 3);
    const q3 = await pool.query(`
      SELECT id_minuta, count(*), sum(comprimento * largura * altura) as vol_m3, sum(cubagem) as cubagem
      FROM volumes
      WHERE id_minuta::bigint = ANY($1::bigint[])
      GROUP BY id_minuta;
    `, [ids]);
    console.table(q3.rows);
  }
}

checkMetragemVsCubo().catch(console.error).finally(() => pool.end());
