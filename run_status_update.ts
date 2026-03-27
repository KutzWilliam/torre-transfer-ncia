import 'dotenv/config';
import { processarStatusViagens } from "./src/server/services/viagemService";
import { db } from "./src/server/db";

async function main() {
    console.log("== Rodando processarStatusViagens() ==");
    
    // Check trip 37669539 before
    const before = await db.viagem.findUnique({ where: { id: "37669539" } });
    console.log(`Antes -> 37669539 status: ${before?.status} | dataFim: ${before?.dataFimEfetivo?.toLocaleString()}`);

    const viagensAtualizadas = await processarStatusViagens();
    console.log(`\n✅ ${viagensAtualizadas} viagens atualizadas pelo Geofence Backend.`);

    // Check trip 37669539 after
    const after = await db.viagem.findUnique({ where: { id: "37669539" } });
    console.log(`Depois -> 37669539 status: ${after?.status} | dataFim: ${after?.dataFimEfetivo?.toLocaleString()}`);

    process.exit(0);
}

main().catch(console.error);
