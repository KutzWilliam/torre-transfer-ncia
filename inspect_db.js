const { Client } = require('pg');

async function check() {
  const client = new Client({
    connectionString: "postgresql://admin:1234@localhost:5432/transferencias_db"
  });

  await client.connect();

  console.log('--- Viagem ---');
  const resViagem = await client.query(`SELECT "id", "veiculoId", "rotaPadraoId" FROM "Viagem" WHERE "id" = '37668249'`);
  console.dir(resViagem.rows);

  const veiculoId = resViagem.rows[0]?.veiculoId;

  console.log('\n--- Veiculo ---');
  if (veiculoId) {
    const resVeiculo = await client.query(`SELECT * FROM "Veiculo" WHERE "id" = $1`, [veiculoId]);
    console.dir(resVeiculo.rows);
  }

  console.log('\n--- Paradas Viagem ---');
  const resParadas = await client.query(`SELECT * FROM "ParadaViagem" WHERE "viagemId" = '37668249' ORDER BY "ordem" ASC`);
  console.dir(resParadas.rows);

  console.log('\n--- Telemetrias ---');
  if (veiculoId) {
    const resTelemetrias = await client.query(`SELECT * FROM "Telemetria" WHERE "veiculoId" = $1 LIMIT 5`, [veiculoId]);
    console.log(`Found ${resTelemetrias.rows.length} telemetrias`);
    
    // Test if placa matches
    if (resViagem.rows[0]) {
      const p = await client.query(`SELECT "placa" FROM "Veiculo" WHERE "id" = $1`, [veiculoId]);
      const placa = p.rows[0]?.placa;
      console.log(`Placa for veiculo ${veiculoId} is ${placa}`);
      
      const v = await client.query(`SELECT count(*) as c FROM "Telemetria" WHERE "veiculoId" IN (SELECT "id" FROM "Veiculo" WHERE "placa" = $1)`, [placa]);
      console.log(`Telemetrias by placa: ${v.rows[0].c}`);
    }
  }

  // overall stats
  const vp = await client.query(`SELECT count(*) as c FROM "Veiculo"`);
  console.log(`Total veiculos: ${vp.rows[0].c}`);
  const tp = await client.query(`SELECT count(*) as c FROM "Telemetria"`);
  console.log(`Total telemetrias: ${tp.rows[0].c}`);

  await client.end();
}

check().catch(console.error);
