const { Client } = require('pg');

async function check() {
  const client = new Client({
    connectionString: "postgresql://admin:1234@localhost:5432/transferencias_db"
  });

  await client.connect();

  console.log('--- Rota Padrao ---');
  const rotas = await client.query(`SELECT "id", "nome" FROM "RotaPadrao" LIMIT 10`);
  console.dir(rotas.rows);

  // Check how many rotas total
  const tc = await client.query(`SELECT count(*) as c FROM "RotaPadrao"`);
  console.log(`Total RotaPadrao: ${tc.rows[0].c}`);

  console.log('\n--- Veiculos for ATB5H78 ---');
  const veiculos = await client.query(`SELECT * FROM "Veiculo" WHERE "placa" LIKE '%ATB5%'`);
  console.dir(veiculos.rows);

  console.log('\n--- Random Telemetrias ---');
  const randv = await client.query(`SELECT "veiculoId", count(*) as total FROM "Telemetria" GROUP BY "veiculoId" ORDER BY total DESC LIMIT 5`);
  console.dir(randv.rows);

  if (randv.rows.length > 0) {
    const sampleV = await client.query(`SELECT * FROM "Veiculo" WHERE "id" = $1`, [randv.rows[0].veiculoId]);
    console.log(`Top Veiculo with telemetrias is: `);
    console.dir(sampleV.rows);
  }

  await client.end();
}

check().catch(console.error);
