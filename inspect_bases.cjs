const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function inspectBases() {
  const bases = await prisma.base.findMany({
      orderBy: { nome: 'asc' }
  });
  
  console.log("=== Todas as Bases ===");
  bases.forEach(b => console.log(`[${b.id}] Nome: "${b.nome}" | Cidade: "${b.cidade}"`));

  await prisma.$disconnect();
}

inspectBases().catch(console.error);
