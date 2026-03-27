const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function fixDB() {
    console.log("Corrindo Timezones das telemetrias...");
    // Find telemetries where dataHoraLocal == dataHoraUtc (the ones I inserted without subtracting 3h)
    const telemetriasWrong = await prisma.telemetria.findMany({
        where: { createdAt: { gte: new Date(Date.now() - 3 * 3600 * 1000) } }
    });

    let fixedCount = 0;
    for (const t of telemetriasWrong) {
        if (t.dataHoraLocal.getTime() === t.dataHoraUtc.getTime()) {
            await prisma.telemetria.update({
                where: { id: t.id },
                data: { dataHoraLocal: new Date(t.dataHoraUtc.getTime() - 3 * 3600 * 1000) }
            });
            fixedCount++;
        }
    }
    console.log(`Corrigidas ${fixedCount} telemetrias`);

    console.log("Corrigindo Timezones nas viagens afetadas (37696752)...");
    const v = await prisma.viagem.findUnique({ where: { id: "37696752" }});
    if (v) {
        await prisma.viagem.update({
            where: { id: v.id },
            data: {
                dataInicioEfetivo: v.dataInicioEfetivo ? new Date(v.dataInicioEfetivo.getTime() - 3 * 3600 * 1000) : null,
                dataFimEfetivo: v.dataFimEfetivo ? new Date(v.dataFimEfetivo.getTime() - 3 * 3600 * 1000) : null
            }
        });
        
        const paradas = await prisma.paradaViagem.findMany({ where: { viagemId: v.id }});
        for (const p of paradas) {
            await prisma.paradaViagem.update({
                where: { id: p.id },
                data: {
                    dataChegadaEfetiva: p.dataChegadaEfetiva ? new Date(p.dataChegadaEfetiva.getTime() - 3 * 3600 * 1000) : null,
                    dataSaidaEfetiva: p.dataSaidaEfetiva ? new Date(p.dataSaidaEfetiva.getTime() - 3 * 3600 * 1000) : null
                }
            });
        }
        console.log("Viagem 37696752 e suas paradas tiveram o fuso horário corrigido!");
    }
}

fixDB()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
