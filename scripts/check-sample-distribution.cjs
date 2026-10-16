const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '7 days') AS ultimos_7d,
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '15 days' AND "dataHoraLocal" < NOW() - INTERVAL '7 days') AS de_7d_a_15d,
      count(*) FILTER (WHERE "dataHoraLocal" >= NOW() - INTERVAL '30 days' AND "dataHoraLocal" < NOW() - INTERVAL '15 days') AS de_15d_a_30d,
      count(*) FILTER (WHERE "dataHoraLocal" < NOW() - INTERVAL '30 days') AS mais_de_30d
    FROM (
      SELECT "dataHoraLocal" FROM "Telemetria" LIMIT 1000000
    ) sub;
  `);
  console.log('Distribuicao da amostra de 1 milhão de telemetrias:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
