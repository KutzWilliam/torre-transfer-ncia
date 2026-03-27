require('dotenv').config();
const { Client } = require('pg');

async function main() {
    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    `);
    
    console.log("Tabelas no SASCAR DB:");
    tables.rows.forEach(r => console.log(r.table_name));

    await client.end();
}
main();
