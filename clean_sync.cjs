const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function cleanSync() {
  const sascar = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });
  const prisma = new PrismaClient();

  console.log("=== Sincronizando Veículos de forma segura ===");
  const vRows = await sascar.query(`SELECT "idVeiculo", "placa", "descricao" FROM veiculos_sascar WHERE "placa" IS NOT NULL`);
  
  let merged = 0; let updated = 0; let created = 0;

  for (const row of vRows.rows) {
      if (!row.placa) continue;
      const placaLimpa = row.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
      const idNew = String(row.idVeiculo);

      const byPlate = await prisma.veiculo.findUnique({ where: { placa: placaLimpa } });
      const byId = await prisma.veiculo.findUnique({ where: { id: idNew } });

      if (byPlate && byPlate.id !== idNew) {
          // Plate exists but with a wrong ID (e.g. temp ID)
          if (byId) {
              // Both exist! We must merge byPlate into byId
              const idOld = byPlate.id;
              await prisma.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
              await prisma.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
              await prisma.$executeRawUnsafe(`DELETE FROM "Veiculo" WHERE "id" = $1`, idOld);
              await prisma.veiculo.update({ where: { id: idNew }, data: { placa: placaLimpa, descricao: row.descricao } });
              merged++;
          } else {
             // Change the temp ID to the real ID
             const idOld = byPlate.id;
             await prisma.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
             await prisma.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
             await prisma.$executeRawUnsafe(`UPDATE "Veiculo" SET "id" = $1 WHERE "id" = $2`, idNew, idOld);
             await prisma.veiculo.update({ where: { id: idNew }, data: { descricao: row.descricao } });
             updated++;
          }
      } else if (!byPlate) {
          if (byId) {
              // ID exists but has wrong plate (e.g. BAR7I871 instead of BAR7I87)
              await prisma.veiculo.update({ where: { id: idNew }, data: { placa: placaLimpa, descricao: row.descricao } });
              updated++;
          } else {
              // Create new
              await prisma.veiculo.create({ data: { id: idNew, placa: placaLimpa, descricao: row.descricao } });
              created++;
          }
      } else {
          // Everything is matching correctly
      }
  }
  console.log(`Vehicles: ${merged} merged, ${updated} updated IDs/plates, ${created} newly created.`);

  console.log("=== Sincronizando Telemetria Massiva ===");
  // We just fetch the last 1 day of telemetria to fix missing points for everyone quickly
  const dateLimit = new Date();
  dateLimit.setHours(dateLimit.getHours() - 36);

  console.log(`Fetching from Sascar after ${dateLimit.toISOString()}...`);
  const tRows = await sascar.query(`
    SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed" 
    FROM rastreamento_sascar 
    WHERE "positionDateUtc" > $1 AND "vehicleId" IS NOT NULL
    ORDER BY "positionDateUtc" ASC LIMIT 20000
  `, [dateLimit.toISOString()]);

  let inserted = 0;
  if (tRows.rows.length > 0) {
      const chunkSize = 2000;
      for (let c = 0; c < tRows.rows.length; c += chunkSize) {
          const chunk = tRows.rows.slice(c, c + chunkSize);
          
          let insertQuery = `INSERT INTO "Telemetria" ("id", "veiculoId", "latitude", "longitude", "ignicao", "velocidade", "dataHoraUtc", "dataHoraLocal", "createdAt") VALUES `;
          const values = [];
          let i = 1;
          for (const row of chunk) {
              const dataUtc = new Date(row.positionDateUtc);
              const dataLocal = new Date(dataUtc);
              dataLocal.setHours(dataLocal.getHours() - 3);
              
              insertQuery += `(gen_random_uuid(), $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}::timestamp, $${i++}::timestamp, NOW()),`;
              values.push(String(row.vehicleId), Number(row.latitude), Number(row.longitude), Boolean(row.ignition), Number(row.speed) || 0, dataUtc.toISOString(), dataLocal.toISOString());
          }
          insertQuery = insertQuery.slice(0, -1) + ` ON CONFLICT DO NOTHING;`;
          await prisma.$executeRawUnsafe(insertQuery, ...values);
          inserted += chunk.length;
      }
      console.log(`Inserted ~${inserted} telemetrias!`);
  }

  await prisma.$disconnect();
  await sascar.end();
}

cleanSync().catch(console.error);
