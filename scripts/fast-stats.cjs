const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const corte = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  console.log('Data de corte (90 dias atrás):', corte.toISOString());
  
  // Usar explain/estatísticas para resposta instantânea
  const [dbSize, tableInfo] = await Promise.all([
    prisma.$queryRawUnsafe(`SELECT pg_size_pretty(pg_database_size('transferencias_db')) AS db_size;`),
    prisma.$queryRawUnsafe(`
      SELECT 
        pg_size_pretty(pg_total_relation_size('"Telemetria"')) AS total,
        pg_size_pretty(pg_relation_size('"Telemetria"')) AS dados,
        pg_size_pretty(pg_indexes_size('"Telemetria"')) AS indices,
        (SELECT reltuples::bigint FROM pg_class WHERE relname = 'Telemetria') AS estimativa_linhas;
    `)
  ]);

  console.log('Tamanho DB:', dbSize);
  console.log('Info Telemetria:', tableInfo);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
