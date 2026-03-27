/**
 * Verifica por que a viagem 37671502 (TAK2H50) não tem telemetria
 */
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function main() {
    console.log("== Diagnóstico da Viagem 37671502 ==");
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37671502' },
        include: { veiculo: true }
    });

    if (!viagem) {
        console.log("Viagem não encontrada no Postgres local.");
        return;
    }

    // Check telemetria no banco SASCAR
    console.log("\n== Conectando ao banco SASCAR ==");
    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    // The plate the user searched is 'TAK2H50'
    const plate = viagem.veiculo.placa;
    const vRes = await client.query(`SELECT DISTINCT "vehicleId", "vehiclePlate" FROM rastreamento_sascar WHERE "vehiclePlate" LIKE '%TAK2%'`);
    
    if (vRes.rows.length === 0) {
        console.log(`Veículo parecido com ${plate} NÃO ENCONTRADO no banco Sascar (rastreamento_sascar)!`);
    } else {
        console.log(`Veículos encontrados parecidos com ${plate}:`);
        console.table(vRes.rows);

        for (const row of vRes.rows) {
            const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
            const dataFim = new Date('2026-03-23T23:59:59.000Z');
            
            const tRes = await client.query(`
                SELECT COUNT(*) FROM rastreamento_sascar 
                WHERE "vehicleId" = $1 AND "positionDateUtc" >= $2 AND "positionDateUtc" <= $3
            `, [row.vehicleId, dataCorteInicio, dataFim]);
            
            console.log(`Telemetrias no Sascar para ${row.vehiclePlate} (${row.vehicleId}) a partir de ${dataCorteInicio.toISOString()}: ${tRes.rows[0].count} pontos`);
        }
    }

    await client.end();
    await prisma.$disconnect();
}
main().catch(console.error);
