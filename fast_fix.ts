import { db } from './src/server/db';

async function fastFix() {
    try {
        console.log("Applying fast SQL timezone fix to Telemetria...");
        const resTel = await db.$executeRawUnsafe(`
            UPDATE "Telemetria" 
            SET "dataHoraLocal" = "dataHoraUtc" - INTERVAL '3 hours'
            WHERE "dataHoraLocal" = "dataHoraUtc"
        `);
        console.log(`Corrigido ${resTel} telemetrias.`);

        console.log("Applying fast SQL timezone fix to Viagens...");
        const resV = await db.$executeRawUnsafe(`
            UPDATE "Viagem" 
            SET "dataInicioEfetivo" = "dataInicioEfetivo" - INTERVAL '3 hours',
                "dataFimEfetivo" = "dataFimEfetivo" - INTERVAL '3 hours'
            WHERE id = '37706909' OR id = '37696752'
        `);
        console.log(`Corrigido ${resV} viagens.`);

        console.log("Applying fast SQL timezone fix to Paradas...");
        const resP = await db.$executeRawUnsafe(`
            UPDATE "ParadaViagem" 
            SET "dataChegadaEfetiva" = "dataChegadaEfetiva" - INTERVAL '3 hours',
                "dataSaidaEfetiva" = "dataSaidaEfetiva" - INTERVAL '3 hours'
            WHERE "viagemId" IN ('37706909', '37696752')
        `);
        console.log(`Corrigido ${resP} paradas.`);
        
    } catch(e) {
        console.error(e);
    } finally {
        await db.$disconnect();
    }
}

fastFix();
