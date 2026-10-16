const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const [minDate, maxDate] = await Promise.all([
    prisma.$queryRawUnsafe(`
      SELECT "dataHoraLocal" FROM "Telemetria" 
      ORDER BY "veiculoId", "dataHoraLocal" ASC 
      LIMIT 1;
    `),
    prisma.$queryRawUnsafe(`
      SELECT "dataHoraLocal" FROM "Telemetria" 
      ORDER BY "veiculoId", "dataHoraLocal" DESC 
      LIMIT 1;
    `)
  ]);

  console.log('Primeira Telemetria:', minDate);
  console.log('Última Telemetria:', maxDate);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
