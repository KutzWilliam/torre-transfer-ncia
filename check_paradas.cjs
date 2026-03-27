const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    // Check the prevChegada for the destination parada of viagem 37669539
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37669539' },
        include: {
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });
    if (!viagem) { console.log("Viagem não encontrada"); await prisma.$disconnect(); return; }

    console.log("prevInicioReal:", viagem.prevInicioReal);
    console.log("prevFimReal:", viagem.prevFimReal);
    for (const pv of viagem.paradasViagem) {
        console.log(`Parada ${pv.ordem} (${pv.base.nome}): prevChegada=${pv.prevChegada} prevSaida=${pv.prevSaida} chegadaEfetiva=${pv.dataChegadaEfetiva} saidaEfetiva=${pv.dataSaidaEfetiva}`);
    }
    await prisma.$disconnect();
}
main().catch(console.error);
