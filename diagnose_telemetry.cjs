const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function diagnose() {
    // 1. Count telemetrias
    const t = await prisma.telemetria.count();
    console.log("Total telemetrias no BD:", t);

    // 2. Latest telemetria
    const latest = await prisma.telemetria.findFirst({ orderBy: { dataHoraLocal: 'desc' } });
    console.log("Telemetria mais recente:", latest?.dataHoraLocal, "| veiculoId:", latest?.veiculoId);

    // 3. Sample of vehicles with their Sascar IDs
    const veiculos = await prisma.veiculo.findMany({ take: 10 });
    console.log("\nVeículos (primeiros 10):");
    veiculos.forEach(v => console.log(` - Placa: ${v.placa} | ID: ${v.id}`));

    // 4. Do telemetrias have matching vehicle IDs?
    const telsSample = await prisma.telemetria.findMany({ take: 5, orderBy: { dataHoraLocal: 'desc' } });
    console.log("\nTelemetrias mais recentes:");
    for (const t of telsSample) {
        const veiculo = await prisma.veiculo.findUnique({ where: { id: t.veiculoId } });
        console.log(` - veiculoId: ${t.veiculoId} | Placa: ${veiculo?.placa ?? "???"} | lat: ${t.latitude} | hora: ${t.dataHoraLocal}`);
    }

    // 5. Test the specific vehicle from the screenshot (AFZ0E71)
    const afz = await prisma.veiculo.findUnique({ where: { placa: 'AFZ0E71' } });
    console.log("\nVeículo AFZ0E71:", afz);
    if (afz) {
        const telCount = await prisma.telemetria.count({ where: { veiculoId: afz.id }});
        console.log("Telemetrias para AFZ0E71:", telCount);
    }

    await prisma.$disconnect();
}

diagnose().catch(console.error);
