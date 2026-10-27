const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

async function testQuery() {
  const dataInicio = '2026-10-20';
  const dataFim = '2026-10-26';
  
  const query = `
    WITH rateio_minuta AS (
        SELECT 
            ml.minuta,
            COUNT(DISTINCT ml.id_manifesto) as total_trechos
        FROM manifesto_list ml
        WHERE ml.id_manifesto IN (
            SELECT m_sub.id_manifesto 
            FROM manifesto m_sub 
            WHERE m_sub.prev_saida_data::text NOT LIKE '0000%'
              AND LEFT(m_sub.prev_saida_data::text, 10) >= $1
              AND LEFT(m_sub.prev_saida_data::text, 10) <= $2
              AND m_sub.status != 3
        )
        GROUP BY ml.minuta
    ),
    manifesto_agregado AS (
        SELECT 
            ml.id_manifesto,
            COUNT(DISTINCT ml.minuta) as total_minutas,
            COALESCE(SUM(mn.total_peso), 0) as soma_peso_kg,
            COALESCE(SUM(mn.total_cubo), 0) as soma_cubo_m3,
            COALESCE(SUM(mn.total_volumes), 0) as soma_volumes,
            COALESCE(SUM(mn.total_nf_valor), 0) as soma_nf_valor,
            COALESCE(SUM(mn.frete_total), 0) as soma_frete_bruto,
            COALESCE(SUM(mn.frete_total / GREATEST(rm.total_trechos, 1)), 0) as soma_frete_rateado
        FROM manifesto_list ml
        JOIN minuta mn ON mn.id_minuta = ml.minuta
        LEFT JOIN rateio_minuta rm ON rm.minuta = ml.minuta
        GROUP BY ml.id_manifesto
    )
    SELECT 
        m.id_manifesto::text,
        LEFT(m.prev_saida_data::text, 10) as prev_saida_data,
        COALESCE(v.placa, t.ve_placa) as placa,
        COALESCE(fv.fantasia, ft.fantasia) as fornecedor_nome,
        ao.aeroporto as origem_aero,
        ad.aeroporto as destino_aero,
        COALESCE(ma.total_minutas, 0) as total_minutas,
        ma.soma_peso_kg,
        ma.soma_cubo_m3,
        ma.soma_frete_rateado
    FROM manifesto m
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    LEFT JOIN fornecedores ft ON t.fornecedor::text = ft.id_local::text
    LEFT JOIN aero ao ON ao.id_aero::text = m.transf_origem::text
    LEFT JOIN aero ad ON ad.id_aero::text = m.transf_destino::text
    LEFT JOIN manifesto_agregado ma ON ma.id_manifesto = m.id_manifesto
    WHERE m.prev_saida_data::text NOT LIKE '0000%'
      AND LEFT(m.prev_saida_data::text, 10) >= $1
      AND LEFT(m.prev_saida_data::text, 10) <= $2
      AND m.tipo IN (1, 2, 4)
      AND m.status != 3
      AND (ma.total_minutas > 0 OR m.veiculo IS NOT NULL OR m.veiculo_terceiro IS NOT NULL)
    ORDER BY m.id_manifesto DESC
    LIMIT 5;
  `;
  
  const res = await pool.query(query, [dataInicio, dataFim]);
  console.log('Total registros na amostra:', res.rows.length);
  console.table(res.rows);
  await pool.end();
}
testQuery().catch(console.error);
