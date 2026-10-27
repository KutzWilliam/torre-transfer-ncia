const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkManifestosTransferencia() {
  console.log("=== Manifestos de tipo 2 (Transferencia) recentes ===");
  const m2 = await pool.query(`
    SELECT m.id_manifesto, m.tipo, m.status, m.base, 
           a_orig.aeroporto as orig_nome, a_dest.aeroporto as dest_nome,
           v.placa, v.modelo, v.capacidade, v."capM3",
           t.nome as terceiro_nome, t.ve_placa as terceiro_placa,
           m.custo_motorista, m.custo_transf, m.valor_total_km,
           m.km_rodado, m.prev_saida_data,
           (SELECT count(*) FROM manifesto_list ml WHERE ml.id_manifesto = m.id_manifesto) as qtd_minutas,
           (SELECT sum(mn.total_peso) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as peso_minutas,
           (SELECT sum(mn.total_cubo) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as cubo_minutas,
           (SELECT sum(mn.total_volumes) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as vol_minutas,
           (SELECT sum(mn.frete_total) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as receita_frete
    FROM manifesto m
    LEFT JOIN aero a_orig ON a_orig.id_aero::text = m.transf_origem
    LEFT JOIN aero a_dest ON a_dest.id_aero::text = m.transf_destino
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    WHERE m.tipo = 2 AND m.prev_saida_data >= '2026-10-01'
    ORDER BY m.id_manifesto DESC
    LIMIT 10;
  `);
  console.table(m2.rows);

  console.log("\n=== Manifestos de tipo 4 (Terceiro) recentes com minutas ===");
  const m4 = await pool.query(`
    SELECT m.id_manifesto, m.tipo, m.status, m.base,
           a_orig.aeroporto as orig_nome, a_dest.aeroporto as dest_nome,
           v.placa,
           t.nome as terceiro_nome, t.ve_placa as terceiro_placa,
           m.custo_motorista, m.custo_transf, m.valor_total_km,
           m.km_rodado, m.prev_saida_data,
           (SELECT count(*) FROM manifesto_list ml WHERE ml.id_manifesto = m.id_manifesto) as qtd_minutas,
           (SELECT sum(mn.total_peso) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as peso_minutas,
           (SELECT sum(mn.total_cubo) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as cubo_minutas,
           (SELECT sum(mn.total_volumes) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as vol_minutas,
           (SELECT sum(mn.frete_total) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as receita_frete
    FROM manifesto m
    LEFT JOIN aero a_orig ON a_orig.id_aero::text = m.transf_origem
    LEFT JOIN aero a_dest ON a_dest.id_aero::text = m.transf_destino
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    WHERE m.tipo = 4 AND m.prev_saida_data >= '2026-10-20'
      AND (SELECT count(*) FROM manifesto_list ml WHERE ml.id_manifesto = m.id_manifesto) > 5
    ORDER BY m.id_manifesto DESC
    LIMIT 10;
  `);
  console.table(m4.rows);
}

checkManifestosTransferencia().catch(console.error).finally(() => pool.end());
