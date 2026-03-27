const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    // Check specific viagem paradas and base coords
    const viagem = await prisma.viagem.findFirst({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });
    
    if (!viagem) { console.log("Sem viagens ativas"); await prisma.$disconnect(); return; }
    
    console.log(`Viagem: ${viagem.id}`);
    for (const pv of viagem.paradasViagem) {
        console.log(`  Parada ${pv.ordem}: ${pv.base.nome} | lat: ${pv.base.latitude} | lon: ${pv.base.longitude} | raio: ${pv.base.raioMetros}`);
    }
    
    // Just check all bases with coords
    const basesComCoords = await prisma.base.count({ where: { latitude: { not: null } } });
    const basesTotais = await prisma.base.count();
    console.log(`\nBases com coords: ${basesComCoords}/${basesTotais}`);
    
    await prisma.$disconnect();
}

main().catch(console.error);
