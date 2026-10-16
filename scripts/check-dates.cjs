const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db'
  });

  await client.connect();
  const res = await client.query(`
    SELECT 
      column_name, 
      data_type 
    FROM information_schema.columns 
    WHERE table_name = 'Telemetria' AND column_name IN ('dataHoraLocal', 'dataHoraUtc');
  `);

  console.log('Columns:', res.rows);
  await client.end();
}

run().catch(console.error);
