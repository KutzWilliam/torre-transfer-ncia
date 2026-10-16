const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT 
      date_trunc('day', "dataHoraLocal") AS dia,
      count(*) AS total
    FROM "Telemetria"
    GROUP BY 1
    ORDER BY 1 ASC
    LIMIT 20;
  `);
  console.log('Distribuicao por dia (primeiros 20 dias):', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
