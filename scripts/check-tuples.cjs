const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const stats = await prisma.$queryRawUnsafe(`
    SELECT relname, n_live_tup, n_dead_tup, last_vacuum, last_autovacuum, last_analyze, last_autoanalyze
    FROM pg_stat_user_tables
    WHERE relname = 'Telemetria';
  `);
  console.log('Telemetria stats:', stats);
}

run().catch(console.error).finally(() => prisma.$disconnect());
