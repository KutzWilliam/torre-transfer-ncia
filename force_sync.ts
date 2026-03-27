import 'dotenv/config';

async function main() {
    console.log("Chamando o worker de sincronização local API (/api/sync)...");
    
    // Simulate what the cron job does by importing the function directly
    const { GET } = await import('./src/app/api/sync/route');
    const response = await GET();
    const result = await response.json();
    
    console.log("\nResultado da Sincronização:");
    console.log(result);
}

main().catch(console.error);
