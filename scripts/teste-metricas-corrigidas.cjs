const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function testCorrectedMetrics() {
  const q = await pool.query(`
    SELECT 
      m.id_manifesto,
      LEFT(m.prev_saida_data::text, 10) as data,
      COALESCE(fv.fantasia, ft.fantasia) as fornecedor,
      ao.aeroporto as origem,
      ad.aeroporto as destino,
      v.placa,
      COALESCE(v.capacidade, 12000) as cap_peso_cadastrada,
      COALESCE(v."capM3", 50) as cap_m3_cadastrada,
      COUNT(DISTINCT ml.minuta) as qtd_minutas,
      SUM(mn.total_volumes) as qtd_volumes_caixas,
      SUM(mn.total_peso) as peso_real_kg,
      SUM(mn.total_cubo) as peso_cubado_kg,
      SUM(CASE WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica 
               WHEN mn.total_cubo > 0 THEN mn.total_cubo / 250.0 
               ELSE 0 END) as volume_real_m3,
      SUM(mn.total_taxado) as peso_taxado_kg,
      SUM(mn.frete_total) as frete_bruto
    FROM manifesto m
    JOIN manifesto_list ml ON ml.id_manifesto = m.id_manifesto
    JOIN minuta mn ON mn.id_minuta = ml.minuta
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    LEFT JOIN fornecedores ft ON t.fornecedor::text = ft.id_local::text
    LEFT JOIN aero ao ON ao.id_aero::text = m.transf_origem::text
    LEFT JOIN aero ad ON ad.id_aero::text = m.transf_destino::text
    WHERE m.prev_saida_data >= '2026-10-24'
      AND m.tipo IN (1, 2, 4)
    GROUP BY m.id_manifesto, m.prev_saida_data, fv.fantasia, ft.fantasia, ao.aeroporto, ad.aeroporto, v.placa, v.capacidade, v."capM3"
    ORDER BY m.id_manifesto DESC
    LIMIT 10;
  `);

  console.log("=== Métricas Corrigidas dos Manifestos Recentes ===");
  const formatted = q.rows.map(r => {
    const capPeso = Number(r.cap_peso_cadastrada) > 18000 ? 24000 : 12000;
    const capM3 = capPeso === 24000 ? 100 : 50;
    const pesoReal = Number(r.peso_real_kg) || 0;
    const volM3 = Number(r.volume_real_m3) || 0;
    const ocupPeso = Math.round((pesoReal / capPeso) * 100);
    const ocupM3 = Math.round((volM3 / capM3) * 100);

    return {
      manifesto: r.id_manifesto,
      fornecedor: (r.fornecedor || '—').substring(0, 20),
      trecho: `${r.origem || '?'} -> ${r.destino || '?'}`,
      caixas: r.qtd_volumes_caixas,
      pesoKg: Math.round(pesoReal),
      capKg: capPeso,
      ocupPeso: `${ocupPeso}%`,
      volM3: volM3.toFixed(2),
      capM3: capM3,
      ocupM3: `${ocupM3}%`,
      gargalo: ocupPeso >= ocupM3 ? 'PESO' : 'VOLUME'
    };
  });
  console.table(formatted);
}

testCorrectedMetrics().catch(console.error).finally(() => pool.end());
