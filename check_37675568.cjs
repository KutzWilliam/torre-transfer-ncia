require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37675568' }
    });
    console.log(`Viagem 37675568 -> Status: ${viagem.status} | Fim Efetivo: ${viagem.dataFimEfetivo}`);
    await prisma.$disconnect();
}
main().catch(console.error);
