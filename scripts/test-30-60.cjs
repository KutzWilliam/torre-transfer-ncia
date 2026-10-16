const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '30 days') AS ultimos_30d,
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '60 days' AND "dataHoraLocal" < NOW() - INTERVAL '30 days') AS de_30d_a_60d,
      count(*) FILTER (WHERE "dataHoraLocal" < NOW() - INTERVAL '60 days') AS mais_de_60d
    FROM (
      SELECT "dataHoraLocal" FROM "Telemetria" LIMIT 500000
    ) sub;
  `);
  console.log('Janela 30d / 60d / 60d+:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
