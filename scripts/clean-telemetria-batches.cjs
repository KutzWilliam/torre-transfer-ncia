const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- Iniciando limpeza controlada de telemetrias (> 90 dias) ---');
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  console.log('Data de corte:', cutoff.toISOString());

  let totalDeleted = 0;
  const batchSize = 100000;
  let batchNum = 1;

  while (true) {
    const t0 = Date.now();
    // Deleta os lotes mais antigos ordenados por ctid ou id
    const deleted = await prisma.$executeRawUnsafe(`
      WITH to_delete AS (
        SELECT ctid
        FROM "Telemetria"
        WHERE "dataHoraLocal" < $1
        LIMIT ${batchSize}
      )
      DELETE FROM "Telemetria"
      WHERE ctid IN (SELECT ctid FROM to_delete);
    `, cutoff);

    totalDeleted += deleted;
    const dur = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`Lote #${batchNum}: ${deleted} removidos em ${dur}s | Acumulado: ${totalDeleted}`);

    if (deleted < batchSize) {
      console.log('Finalizado! Não há mais registros anteriores a 90 dias.');
      break;
    }
    batchNum++;
    // Pausa rápida de 500ms entre lotes
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('Total final de telemetrias deletadas:', totalDeleted);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
