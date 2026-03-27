const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const telemetrias = await prisma.telemetria.findMany({
        orderBy: { dataHoraUtc: 'desc' },
        take: 5
    });
    console.log("Últimas telemetrias cadastradas (dataHoraUtc):");
    telemetrias.forEach(t => {
        console.log(`- ID: ${t.id}, Veículo: ${t.veiculoId}, Viagem: ${t.viagemId}, DataUTC: ${t.dataHoraUtc.toISOString()}, DataLocal: ${t.dataHoraLocal.toISOString()}`);
    });
    
    // Check trip 37696752 latest telemetry
    console.log("\nTelemetria da viagem 37696752:");
    const viagemTel = await prisma.telemetria.findMany({
        where: {
            veiculo: {
                viagens: { some: { id: "37696752" } }
            }
        },
        orderBy: { dataHoraUtc: 'desc' },
        take: 5
    });
    viagemTel.forEach(t => {
        console.log(`- ID: ${t.id}, Veículo: ${t.veiculoId}, DataUTC: ${t.dataHoraUtc.toISOString()}`);
    });

    await prisma.$disconnect();
}
check();
