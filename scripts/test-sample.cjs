const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT "dataHoraLocal" FROM "Telemetria" LIMIT 10;
  `);
  console.log('Amostra de telemetrias:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
