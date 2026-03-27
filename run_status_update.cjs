const { processarStatusViagens } = require('./src/server/services/viagemService.ts');
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();
require('dotenv').config();

async function main() {
    // Para ts-node require hook no commonjs
    require('ts-node').register({ transpileOnly: true });
    
    const { processarStatusViagens } = require('./src/server/services/viagemService.ts');
    
    console.log("== Rodando processarStatusViagens() ==");
    const viagensAtualizadas = await processarStatusViagens();
    console.log(`\n✅ ${viagensAtualizadas} viagens atualizadas pelo Geofence Backend.`);
}
main().catch(console.error);
