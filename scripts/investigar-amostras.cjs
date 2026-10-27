const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function querySamples() {
  console.log("=== 1. manifesto_tipo ===");
  const mt = await pool.query("SELECT * FROM manifesto_tipo LIMIT 20;");
  console.table(mt.rows);

  console.log("\n=== 2. manifesto_status ===");
  const ms = await pool.query("SELECT * FROM manifesto_status LIMIT 20;");
  console.table(ms.rows);

  console.log("\n=== 3. Distribuição de manifesto por tipo e status nos últimos 30 dias com dados ===");
  const dist = await pool.query(`
    SELECT tipo, status, count(*) 
    FROM manifesto 
    WHERE prev_saida_data >= '2024-01-01' 
    GROUP BY tipo, status 
    ORDER BY count(*) DESC 
    LIMIT 15;
  `);
  console.table(dist.rows);

  console.log("\n=== 4. Amostra de 3 manifestos recentes de transferência ===");
  // Vamos buscar onde tipo indique transferência ou onde transf_origem/transf_destino não sejam nulos
  const sample = await pool.query(`
    SELECT id_manifesto, tipo, status, base, destino, transf_origem, transf_destino, 
           veiculo, motorista, custo_motorista, custo_transf, valor_total_km, km_rodado,
           prev_saida_data, saida_efetiva_data, chegada_efetiva_data, data_finalizado
    FROM manifesto
    ORDER BY id_manifesto DESC
    LIMIT 5;
  `);
  console.table(sample.rows);
}

querySamples().catch(console.error).finally(() => pool.end());
