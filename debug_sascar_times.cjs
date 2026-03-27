const { telemetriaDb } = require('./src/server/db-telemetria');
const { db } = require('./src/server/db');

async function debugSascar() {
    try {
        const v = await db.veiculo.findFirst({ where: { placa: "PLU6I36" } });
        console.log("Veiculo:", v?.id, v?.placa);

        if (v) {
            const result = await telemetriaDb.query(`
                SELECT "positionDateUtc", "latitude", "longitude"
                FROM rastreamento_sascar
                WHERE "vehicleId" = $1
                ORDER BY "positionDateUtc" DESC LIMIT 5
            `, [v.id]);

            console.log("RAW FROM SASCAR:");
            for (const row of result.rows) {
                console.log("->", row.positionDateUtc, typeof row.positionDateUtc);
                if (row.positionDateUtc instanceof Date) {
                    console.log("   As Date object ISO:", row.positionDateUtc.toISOString());
                    console.log("   As Date object string:", row.positionDateUtc.toString());
                }
            }
            
            const lastTel = await db.telemetria.findFirst({
                where: { veiculoId: v.id },
                orderBy: { dataHoraLocal: 'desc' }
            });
            console.log("LOCAL TELEMETRIA:");
            console.log("-> dataHoraUtc:", lastTel?.dataHoraUtc?.toISOString());
            console.log("-> dataHoraLocal:", lastTel?.dataHoraLocal?.toISOString());
            console.log("-> as string via locale:", lastTel?.dataHoraLocal?.toLocaleString('pt-BR'));
        }
    } catch(e) {
        console.error(e);
    }
}
debugSascar();
