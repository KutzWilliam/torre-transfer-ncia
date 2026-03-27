const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const v = await prisma.veiculo.findUnique({
        where: { placa: "AJI0C16" }
    });
    console.log("Veículo AJI0C16 no banco local:", v);

    if (v) {
        const lastTele = await prisma.telemetria.findFirst({
            where: { veiculoId: v.id },
            orderBy: { dataHoraLocal: 'desc' },
        });
        console.log("Ultima telemetria desse veículo:", lastTele);
    }
    await prisma.$disconnect();
}
check();
