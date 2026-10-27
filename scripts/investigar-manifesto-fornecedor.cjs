const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function checkManifestoFornecedor() {
  console.log("=== Testando JOIN de Manifesto com Veículos e Fornecedores ===");
  const res = await pool.query(`
    SELECT 
      m.id_manifesto,
      m.tipo,
      mt.tipo as tipo_manifesto_nome,
      m.status,
      m.prev_saida_data,
      m.saida_efetiva_data,
      -- Placa do veículo (pode vir de veiculos ou terceiros)
      COALESCE(v.placa, t.ve_placa) as placa,
      COALESCE(v.modelo, t.ve_modelo) as modelo,
      COALESCE(v.capacidade, t.ve_capacidade) as capacidade_kg,
      COALESCE(v."capM3", t."capM3") as capacidade_m3,
      -- Fornecedor
      COALESCE(fv.fantasia, ft.fantasia) as fornecedor_fantasia,
      COALESCE(fv.razao, ft.razao) as fornecedor_razao,
      -- Origem e Destino
      COALESCE(a_orig.aeroporto, u_orig.fantasia) as origem,
      COALESCE(a_dest.aeroporto, u_dest.fantasia) as destino,
      -- Custo do manifesto registrado no Brudam
      m.custo_motorista,
      m.valor_total_km,
      m.pedagio,
      -- Totais calculados das minutas
      (SELECT COUNT(DISTINCT ml.minuta) FROM manifesto_list ml WHERE ml.id_manifesto = m.id_manifesto) as total_minutas,
      (SELECT SUM(mn.total_volumes) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as total_volumes,
      (SELECT SUM(mn.total_peso) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as total_peso_kg,
      (SELECT SUM(mn.total_cubo) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as total_cubo_m3,
      (SELECT SUM(mn.frete_total) FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta = ml.minuta WHERE ml.id_manifesto = m.id_manifesto) as receita_frete_total
    FROM manifesto m
    LEFT JOIN manifesto_tipo mt ON mt.id_tipo = m.tipo
    LEFT JOIN veiculos v ON v.id_veiculo = m.veiculo
    LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
    LEFT JOIN fornecedores ft ON t.fornecedor::text = ft.id_local::text
    LEFT JOIN aero a_orig ON a_orig.id_aero::text = m.transf_origem
    LEFT JOIN aero a_dest ON a_dest.id_aero::text = m.transf_destino
    LEFT JOIN unidades u_orig ON u_orig.id_unidade::text = m.base
    LEFT JOIN unidades u_dest ON u_dest.id_unidade::text = m.destino
    WHERE m.prev_saida_data >= '2026-10-15'
      AND (SELECT COUNT(*) FROM manifesto_list ml WHERE ml.id_manifesto = m.id_manifesto) > 0
    ORDER BY m.id_manifesto DESC
    LIMIT 15;
  `);
  console.table(res.rows);
}

checkManifestoFornecedor().catch(console.error).finally(() => pool.end());
