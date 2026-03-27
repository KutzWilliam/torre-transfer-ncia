require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    console.log("== Diagnóstico da Viagem 37672874 ==");
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37672874' },
    });

    if (!viagem) {
        console.log("Viagem não encontrada no Postgres local.");
        return;
    }

    console.log(`Viagem encontrada!`);
    console.log(`Status: ${viagem.status}`);
    console.log(`dataInicioEfetivo: ${viagem.dataInicioEfetivo}`);
    console.log(`dataFimEfetivo: ${viagem.dataFimEfetivo}`);
    console.log(`prevInicioReal: ${viagem.prevInicioReal}`);

    await prisma.$disconnect();
}
main().catch(console.error);
