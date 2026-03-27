const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function debug() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: "37696752" },
        include: { baseDestino: true }
    });

    const lastTeleTries = await prisma.telemetria.findMany({
        where: { veiculoId: viagem.veiculoId },
        orderBy: { dataHoraLocal: 'desc' },
        take: 3
    });

    console.log("Destino Londrina:", viagem.baseDestino);
    console.log("Últimas posições do veículo:", lastTeleTries.map(t => ({
        lat: t.latitude,
        lng: t.longitude,
        speed: t.velocidade,
        date: t.dataHoraLocal.toISOString()
    })));
}
debug().finally(() => prisma.$disconnect());
