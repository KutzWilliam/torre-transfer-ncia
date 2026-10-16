const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const locks = await prisma.$queryRawUnsafe(`
    SELECT pid, EXTRACT(EPOCH FROM (now() - query_start))::int AS duracao_seg, LEFT(query, 100) AS q, state
    FROM pg_stat_activity
    WHERE state != 'idle';
  `);
  console.log('Queries ativas:', locks);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
