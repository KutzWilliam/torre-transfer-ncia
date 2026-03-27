const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const v = await prisma.viagem.findUnique({
        where: { id: "37696752" },
        select: { prevInicioReal: true, dataInicioEfetivo: true, status: true, prevFimReal: true, dataFimEfetivo: true }
    });
    console.log("Viagem 37696752:", v);
    await prisma.$disconnect();
}
check();
