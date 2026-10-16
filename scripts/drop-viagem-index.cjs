const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Removendo índice desnecessário Telemetria_viagemId_idx...');
  const t0 = Date.now();
  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "Telemetria_viagemId_idx";`);
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Índice Telemetria_viagemId_idx removido em ${sec}s!`);

  const res = await prisma.$queryRawUnsafe(`
    SELECT pg_size_pretty(pg_total_relation_size('"Telemetria"')) AS total_telemetria;
  `);
  console.log('Novo tamanho da Telemetria:', res);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
