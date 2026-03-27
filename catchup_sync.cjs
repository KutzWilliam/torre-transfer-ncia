/**
 * Catch-up sync: puxa telemetria dos últimos 3 dias da Sascar 
 * sem depender do endpoint HTTP estar disponível
 */
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function catchupSync() {
    const prisma = new PrismaClient();
    const sascar = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 3); // Últimos 3 dias

    console.log(`Puxando telemetria desde ${cutoff.toISOString()}...`);

    let offset = 0;
    const batchSize = 5000;
    let totalInserido = 0;

    while (true) {
        const result = await sascar.query(`
            SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed"
            FROM rastreamento_sascar
            WHERE "vehicleId" IS NOT NULL AND "positionDateUtc" > $1
            ORDER BY "positionDateUtc" ASC
            LIMIT $2 OFFSET $3
        `, [cutoff.toISOString(), batchSize, offset]);

        if (result.rows.length === 0) break;

        const dados = result.rows.map(row => {
            const dataUtc = new Date(row.positionDateUtc);
            const dataLocal = new Date(dataUtc);
            dataLocal.setHours(dataLocal.getHours() - 3);
            return {
                veiculoId: String(row.vehicleId),
                latitude: Number(row.latitude),
                longitude: Number(row.longitude),
                ignicao: Boolean(row.ignition),
                velocidade: Number(row.speed) || 0,
                dataHoraUtc: dataUtc,
                dataHoraLocal: dataLocal,
            };
        });

        await prisma.telemetria.createMany({ data: dados, skipDuplicates: true });
        totalInserido += dados.length;
        offset += batchSize;
        console.log(`Inseridos ${totalInserido} pontos até agora...`);
    }

    console.log(`\n✅ Catch-up concluído! Total de ${totalInserido} pontos inseridos.`);

    await prisma.$disconnect();
    await sascar.end();
}

catchupSync().catch(console.error);
