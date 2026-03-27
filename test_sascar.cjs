const { Pool } = require('pg');

async function testSascar() {
  const sascar = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL || "postgresql://torre_vw:!Epc%23Torre2%40@172.20.10.205:5432/torre_controle"
  });

  console.log("=== Verificando Veiculos Sascar ===");
  const v = await sascar.query(`SELECT "placa" FROM veiculos_sascar WHERE "placa" LIKE '%AQC%' OR "placa" LIKE '%BAR%' OR "placa" LIKE '%7030%' OR "placa" LIKE '%7I87%'`);
  console.dir(v.rows);

  await sascar.end();
}

testSascar().catch(console.error);
