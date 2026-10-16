const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '30 days') AS ultimos_30d,
      count(*) FILTER (WHERE "dataHoraLocal" < NOW() - INTERVAL '30 days') AS mais_de_30d
    FROM (
      SELECT "dataHoraLocal" FROM "Telemetria" LIMIT 100000
    ) sub;
  `);
  console.log('Proporção recente vs antigo:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
