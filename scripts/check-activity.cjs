const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const acts = await prisma.$queryRawUnsafe(`
    SELECT pid, state, (now() - query_start)::text as duration, wait_event_type, wait_event, query
    FROM pg_stat_activity
    WHERE state != 'idle' AND pid != pg_backend_pid();
  `);
  console.log('Active queries:', acts);
}

run().catch(console.error).finally(() => prisma.$disconnect());
