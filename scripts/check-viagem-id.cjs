const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT 
      count(*) AS total_telemetrias,
      count(CASE WHEN "viagemId" IS NOT NULL THEN 1 END) AS com_viagem_id,
      count(CASE WHEN "viagemId" IS NULL THEN 1 END) AS sem_viagem_id
    FROM (
      SELECT "viagemId" FROM "Telemetria" LIMIT 100000
    ) sub;
  `);
  console.log('Amostra de 100k registros de Telemetria:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
