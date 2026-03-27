require('dotenv').config();
const { Client } = require('pg');

async function main() {
    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const tak = await client.query(`SELECT "idVeiculo", placa, descricao FROM veiculos_sascar WHERE placa LIKE '%TAK%' OR placa LIKE '%2H50%'`);
    console.log('\nDados TAK:');
    console.table(tak.rows);

    await client.end();
}
main();
