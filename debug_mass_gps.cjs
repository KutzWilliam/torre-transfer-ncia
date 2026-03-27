require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function main() {
    console.log("== Diagnóstico de Veículos sem GPS ==");

    const viagensAtivas = await prisma.viagem.findMany({
        where: { status: { in: ["PROGRAMADA", "EM_ANDAMENTO"] } },
        include: { veiculo: true }
    });

    console.log(`Viagens ativas/programadas locais: ${viagensAtivas.length}`);

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    let missingCount = 0;
    let foundCount = 0;

    for (const v of viagensAtivas) {
        const placa = v.veiculo.placa;
        const sascarQuery = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${placa}%`]);
        
        if (sascarQuery.rows.length === 0) {
            console.log(`❌ Viagem ${v.id} | Veículo ${placa}: NÃO EXISTE no banco Sascar`);
            missingCount++;
        } else {
            // Check if there are telemetrias for it
            const idVeiculo = sascarQuery.rows[0].idVeiculo;
            const dataInicio = new Date(v.prevInicioReal.getTime() - 12 * 60 * 60 * 1000); // look 12h before
            const telQuery = await client.query(`SELECT COUNT(*) FROM rastreamento_sascar WHERE "vehicleId" = $1 AND "positionDateUtc" >= $2`, [idVeiculo, dataInicio]);
            const count = parseInt(telQuery.rows[0].count);
            
            if (count === 0) {
                console.log(`⚠️ Viagem ${v.id} | Veículo ${placa}: EXISTE no Sascar (ID: ${idVeiculo}), mas SEM TELEMETRIAS desde ${dataInicio.toISOString()}`);
            } else {
                console.log(`✅ Viagem ${v.id} | Veículo ${placa}: Encontrado com ${count} posições`);
            }
            foundCount++;
        }
    }

    console.log(`\nResumo: ${missingCount} veículos ausentes na Sascar. ${foundCount} encontrados.`);

    await client.end();
    await prisma.$disconnect();
}
main().catch(console.error);
