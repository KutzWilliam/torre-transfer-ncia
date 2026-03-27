require('dotenv').config({ path: '.env' });
const { Client } = require('pg');

async function testSascar() {
    console.log("URL:", process.env.TELEMETRIA_DB_URL);
    if (!process.env.TELEMETRIA_DB_URL) return;

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    try {
        await client.connect();
        const res = await client.query('SELECT "placa" FROM veiculos_sascar WHERE "placa" IS NOT NULL');
        
        const plates = res.rows.map(r => String(r.placa).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7));
        
        console.log("Placas ativas no Sascar:", plates.length);
        console.log("Contém BBO9A18?", plates.includes("BBO9A18"));
        
        // Print some sample plates to see their format
        console.log("Samples:", plates.slice(0, 10));

    } catch (error) {
        console.error("Erro na consulta Sascar:", error.message);
    } finally {
        await client.end();
    }
}

testSascar();
