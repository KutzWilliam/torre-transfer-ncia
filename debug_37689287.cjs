require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const { Client } = require('pg');

const prisma = new PrismaClient();

async function main() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37689287' },
        include: { veiculo: true, rotaPadrao: true, paradasViagem: { include: { base: true } } }
    });

    if (!viagem) {
        console.log("Viagem 37689287 não encontrada no Postgres local.");
        return;
    }

    console.log(`=== VIAGEM 37689287 ===`);
    console.log(`Veículo local: ${viagem.veiculo.placa}`);
    console.log(`Rota Descrição: ${viagem.rotaDescricao}`);
    console.log(`Rota Padrão vinculada: ${viagem.rotaPadrao ? viagem.rotaPadrao.nome : 'NENHUMA (NULL)'}`);
    console.log(`Data Início Efetivo (Salvo no Banco): ${viagem.dataInicioEfetivo?.toISOString()}`);
    
    console.log(`\nParadas atuais registradas para essa viagem no Banco:`);
    for (const p of viagem.paradasViagem) {
        console.log(`- Ordem ${p.ordem}: ${p.base.nome}`);
    }

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const sascarQuery = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${viagem.veiculo.placa}%`]);
    
    if (sascarQuery.rows.length === 0) {
        console.log(`\n❌ Veículo ${viagem.veiculo.placa} NÃO EXISTE no banco Sascar`);
    } else {
        const idVeiculo = sascarQuery.rows[0].idVeiculo;
        console.log(`\n✅ Veículo ${viagem.veiculo.placa} existe no Sascar com ID ${idVeiculo}`);

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
