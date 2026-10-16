const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db'
  });

  await client.connect();
  const res = await client.query(`
    SELECT "veiculoId", "dataHoraUtc", count(*) as qtd
    FROM "Telemetria"
    GROUP BY "veiculoId", "dataHoraUtc"
    HAVING count(*) > 1
    LIMIT 10;
  `);

  console.log('Exemplos de duplicados por (veiculoId, dataHoraUtc):', res.rows);
  await client.end();
}

run().catch(console.error);
