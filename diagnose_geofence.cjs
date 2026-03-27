const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
    // 1. Show one active viagem with its vehicle
    const viagem = await prisma.viagem.findFirst({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            veiculo: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });
    
    if (!viagem) { console.log("Nenhuma viagem ativa!"); await prisma.$disconnect(); return; }
    
    console.log(`Viagem: ${viagem.id} | Veiculo: ${viagem.veiculo.placa} (ID: ${viagem.veiculo.id})`);
    console.log(`Início previsto: ${viagem.prevInicioReal}\n`);
    
    // 2. Check how many telemetrias this vehicle has
    const tCount = await prisma.telemetria.count({ where: { veiculoId: viagem.veiculo.id } });
    console.log(`Telemetrias para ${viagem.veiculo.placa}: ${tCount}`);
    
    // 3. Get latest telemetria for this vehicle
    const latest = await prisma.telemetria.findFirst({
        where: { veiculoId: viagem.veiculo.id },
        orderBy: { dataHoraLocal: 'desc' }
    });
    console.log(`Última telemetria: ${latest?.dataHoraLocal} at (${latest?.latitude}, ${latest?.longitude})`);
    
    // 4. Check each parada with coords
    console.log("\nParadas e distâncias da última posição:");
    for (const pv of viagem.paradasViagem) {
        const b = pv.base;
        if (!b.latitude) { console.log(`  ${b.nome}: SEM COORDS`); continue; }
        const dist = latest ? calcularDistancia(latest.latitude, latest.longitude, b.latitude, b.longitude) : null;
        console.log(`  ${b.nome}: coords=(${b.latitude}, ${b.longitude}) raio=${b.raioMetros}m dist=${dist ? Math.round(dist) + 'm' : 'N/A'}`);
    }
    
    // 5. Check if telemetrias within the viagem date window
    const dataCorte = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const tNaJanela = await prisma.telemetria.count({
        where: { veiculoId: viagem.veiculo.id, dataHoraLocal: { gte: dataCorte } }
    });
    console.log(`\nDataCorte: ${dataCorte}`);
    console.log(`Telemetrias DENTRO da janela (>=dataCorte): ${tNaJanela}`);
    
    await prisma.$disconnect();
}

main().catch(console.error);
