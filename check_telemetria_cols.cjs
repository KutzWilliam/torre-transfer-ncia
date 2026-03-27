require('dotenv').config();
const { Client } = require('pg');

async function main() {
    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const cols = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'rastreamento_sascar'
    `);
    
    console.log("Colunas disponíveis:");
    cols.rows.forEach(r => console.log(r.column_name));

    await client.end();
}
main();
