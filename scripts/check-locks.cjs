const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const locks = await prisma.$queryRawUnsafe(`
    SELECT 
      pid,
      pg_blocking_pids(pid) as blocked_by,
      state,
      wait_event_type,
      wait_event,
      EXTRACT(EPOCH FROM (now() - query_start))::int as duracao_seg,
      LEFT(query, 120) as query
    FROM pg_stat_activity
    WHERE state != 'idle';
  `);
  console.log('Queries ativas e bloqueios:', JSON.stringify(locks, (k, v) => typeof v === 'bigint' ? v.toString() : v, 2));
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
