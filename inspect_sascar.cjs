const { Pool } = require('pg');

async function check() {
  const telemetriaDb = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL || "postgresql://torre_vw:!Epc%23Torre2%40@172.20.10.205:5432/torre_controle"
  });

  const res = await telemetriaDb.query(`
    SELECT * FROM veiculos_sascar WHERE "placa" LIKE '%ATB%' OR "placa" LIKE '%5H78%'
  `);
  console.log("Checking veiculos_sascar for ATB5H78:");
  console.dir(res.rows);

  // Check how many veiculos in Sascar
  const count = await telemetriaDb.query(`SELECT count(*) as c FROM veiculos_sascar`);
  console.log(`\nTotal veiculos_sascar: ${count.rows[0].c}`);

  await telemetriaDb.end();
}

check().catch(console.error);
