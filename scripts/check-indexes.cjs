const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const indexes = await prisma.$queryRawUnsafe(`
    SELECT indexname, indexdef 
    FROM pg_indexes 
    WHERE tablename = 'Telemetria';
  `);
  console.log('Indexes on Telemetria:', indexes);
}

run().catch(console.error).finally(() => prisma.$disconnect());
