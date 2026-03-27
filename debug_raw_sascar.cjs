const { Client } = require('pg');

async function check() {
    // URL taken from .env: DATABASE_TELEMETRIA_URL
    const client = new Client({
        connectionString: process.env.DATABASE_TELEMETRIA_URL || "postgresql://torre:Princesa2024@10.150.63.160:5432/torre_controle"
    });
    
    await client.connect();
    
    // Check vehicle ID 1229690
    console.log("Raw rastreamento_sascar para vehicleId 1229690:");
    const res = await client.query(`
        SELECT "positionDateUtc", "latitude", "longitude", "ignition", "speed"
        FROM rastreamento_sascar
        WHERE "vehicleId" = 1229690
        ORDER BY "positionDateUtc" DESC
        LIMIT 5
    `);
    
    res.rows.forEach(r => {
        console.log(`- positionDateUtc: ${r.positionDateUtc} | type: ${typeof r.positionDateUtc} | rawString: ${r.positionDateUtc.toISOString ? r.positionDateUtc.toISOString() : r.positionDateUtc}`);
    });
    
    await client.end();
}
check();
