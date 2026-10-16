const { Client } = require('pg');

async function run() {
  const client = new Client('postgresql://admin:1234@localhost:5433/transferencias_db');
  await client.connect();
  const res = await client.query('SELECT id, name, email, role FROM "User";');
  console.log('Usuarios encontrados:', res.rows);
  await client.end();
}

run().catch(console.error);
