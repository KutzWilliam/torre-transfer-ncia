require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function main() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37675568' },
        include: { veiculo: true }
    });

    if (!viagem) {
        console.log("Viagem 37675568 não encontrada no Postgres local.");
        return;
    }

    const placa = viagem.veiculo.placa;
    console.log(`Viagem encontrada. Veículo local: ${placa} | Prev Início: ${viagem.prevInicioReal.toISOString()}`);

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const sascarQuery = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${placa}%`]);
    
    if (sascarQuery.rows.length === 0) {
        console.log(`❌ Veículo ${placa} NÃO EXISTE no banco Sascar`);
    } else {
        const idVeiculo = sascarQuery.rows[0].idVeiculo;
        console.log(`✅ Veículo ${placa} existe no Sascar com ID ${idVeiculo}`);

        const dataInicio = new Date(viagem.prevInicioReal.getTime() - 12 * 60 * 60 * 1000);
        const telQuery = await client.query(`
            SELECT COUNT(*) FROM rastreamento_sascar 
            WHERE "vehicleId" = $1 AND "positionDateUtc" >= $2
        `, [idVeiculo, dataInicio]);
        
        console.log(`Telemetrias no Sascar desde ${dataInicio.toISOString()}: ${telQuery.rows[0].count} posições`);
        
        // Let's also check if it exists in local postgres
        const localTelQuery = await prisma.telemetria.count({
            where: { veiculoId: viagem.veiculo.id, dataHoraUtc: { gte: dataInicio } }
        });
        console.log(`Telemetrias no Postgres local desde ${dataInicio.toISOString()}: ${localTelQuery} posições`);
    }

    await client.end();
    await prisma.$disconnect();
}
main().catch(console.error);
