require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function main() {
    const placaAvo = "AXW6774";
    const viagemId = "37694012";

    console.log(`=== ANALISANDO VIAGEM ${viagemId} (${placaAvo}) ===\n`);

    const viagem = await prisma.viagem.findUnique({
        where: { id: viagemId },
        include: { veiculo: true }
    });

    if (!viagem) {
        console.log(`❌ Viagem ${viagemId} não encontrada localmente.`);
        return;
    }

    console.log(`Viagem encontrada no Postgres Local! `);
    console.log(`Veículo Local Id: ${viagem.veiculoId} | Placa Local: ${viagem.veiculo.placa}`);

    // Telemetrias da viagem (Janela)
    const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
    const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

    const qtLocal = await prisma.telemetria.count({
        where: { veiculoId: viagem.veiculoId, dataHoraLocal: { gte: dataCorteInicio, lte: dataCorteEfim } }
    });

    console.log(`Telemetrias Locais na janela [${dataCorteInicio.toISOString()} - ${dataCorteEfim.toISOString()}]: ${qtLocal}`);

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const sascarVeics = await client.query(`SELECT "idVeiculo", "placa" FROM veiculos_sascar WHERE placa LIKE $1`, [`%AXW6774%`]);
    console.log(`\nVeículos no Sascar batendo com AXW6774: ${sascarVeics.rows.length}`);
    if (sascarVeics.rows.length > 0) {
        console.table(sascarVeics.rows);
        const sascarID = sascarVeics.rows[0].idVeiculo;

        const qtSascar = await client.query(`
            SELECT COUNT(*) 
            FROM rastreamento_sascar 
            WHERE "vehicleId" = $1 AND "positionDateUtc" >= $2
        `, [sascarID, new Date(dataCorteInicio.getTime() + 3 * 3600 * 1000)]); // GMT+3 aproximado pro utc
        
        console.log(`Telemetrias da Sascar brutas para ID ${sascarID} desde a janela: ${qtSascar.rows[0].count}`);
    }

    await client.end();
    await prisma.$disconnect();
}
main().catch(console.error);
