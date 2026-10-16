const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT "viagemId", count(*) 
    FROM "Telemetria" 
    WHERE "viagemId" IS NOT NULL 
    GROUP BY "viagemId" 
    LIMIT 5;
  `);
  console.log('Existe algum registro com viagemId não nulo?:', result);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
