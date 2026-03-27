const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function fullSync() {
  const sascar = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });
  const local = new Pool({ connectionString: "postgresql://admin:1234@localhost:5432/transferencias_db" });

  console.log("=== Sincronizando Todos os Veículos ===");
  const vRows = await sascar.query(`SELECT "idVeiculo", "placa", "descricao" FROM veiculos_sascar WHERE "placa" IS NOT NULL`);
  
  for (const row of vRows.rows) {
      const placaLimpa = row.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
      const idNew = String(row.idVeiculo);

      // check if exists local
      const ex = await local.query(`SELECT "id" FROM "Veiculo" WHERE "placa" = $1`, [placaLimpa]);
      if (ex.rows.length > 0) {
          const idOld = ex.rows[0].id;
          if (idOld !== idNew) {
             console.log(`Updating ${placaLimpa} from ${idOld} to ${idNew}...`);
             // To avoid Unique Constraint we delete any row that already has idNew but a different placa
             await local.query(`DELETE FROM "Veiculo" WHERE "id" = $1 AND "placa" != $2`, [idNew, placaLimpa]);

             await local.query(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, [idNew, idOld]);
             await local.query(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, [idNew, idOld]);
             await local.query(`UPDATE "Veiculo" SET "id" = $1 WHERE "id" = $2`, [idNew, idOld]);
          }
      } else {
          // If the real ID is occupied by a wrongly prefixed plate?
          await local.query(`DELETE FROM "Veiculo" WHERE "id" = $1`, [idNew]);
          await local.query(`INSERT INTO "Veiculo" ("id", "placa", "descricao", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())`, [idNew, placaLimpa, row.descricao]);
      }
  }

  console.log("=== Sincronizando Telemetria Massiva ===");
  const ultimaSync = await local.query(`SELECT "dataHoraUtc" FROM "Telemetria" ORDER BY "dataHoraUtc" DESC LIMIT 1`);
  let dataIso = '2020-01-01T00:00:00.000Z';
  if (ultimaSync.rows.length > 0) dataIso = ultimaSync.rows[0].dataHoraUtc.toISOString();

  console.log(`Fetching from Sascar after ${dataIso}...`);
  const tRows = await sascar.query(`
    SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed" 
    FROM rastreamento_sascar 
    WHERE "positionDateUtc" > $1 AND "vehicleId" IS NOT NULL
    ORDER BY "positionDateUtc" ASC LIMIT 10000
  `, [dataIso]);

  console.log(`Fetched ${tRows.rows.length} rows.`);

  if (tRows.rows.length > 0) {
      let insertQuery = `INSERT INTO "Telemetria" ("id", "veiculoId", "latitude", "longitude", "ignicao", "velocidade", "dataHoraUtc", "dataHoraLocal", "createdAt") VALUES `;
      const values = [];
      let i = 1;
      for (const row of tRows.rows) {
          const dataUtc = new Date(row.positionDateUtc);
          const dataLocal = new Date(dataUtc);
          dataLocal.setHours(dataLocal.getHours() - 3);
          
          insertQuery += `(gen_random_uuid(), $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, NOW()),`;
          values.push(String(row.vehicleId), Number(row.latitude), Number(row.longitude), Boolean(row.ignition), Number(row.speed) || 0, dataUtc.toISOString(), dataLocal.toISOString());
      }
      insertQuery = insertQuery.slice(0, -1) + ` ON CONFLICT DO NOTHING;`;
      await local.query(insertQuery, values);
      console.log(`Inserted ${tRows.rows.length} telemetrias!`);
  }

  await local.end();
  await sascar.end();
  console.log("Full sync done.");
}

fullSync().catch(console.error);
