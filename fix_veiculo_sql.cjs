require('dotenv').config();
const { Client, Pool } = require('pg');

async function fixVehicles() {
  const sascar = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });
  const local = new Client({ connectionString: "postgresql://admin:1234@localhost:5432/transferencias_db" });

  await local.connect();

  console.log("Fixing BAR7I87 via raw SQL...");

  // Update the actual Sascar vehicle '2101643' to have the correct clean plate 'BAR7I87'
  await local.query(`UPDATE "Veiculo" SET "placa" = 'BAR7I87_OLD' WHERE "id" = 'temp_BAR7I87'`); 
  await local.query(`UPDATE "Veiculo" SET "placa" = 'BAR7I87' WHERE "id" = '2101643'`);

  // Re-point all viagens that used 'temp_BAR7I87' to the real '2101643'
  await local.query(`UPDATE "Viagem" SET "veiculoId" = '2101643' WHERE "veiculoId" = 'temp_BAR7I87'`);
  
  // Re-point all telemetrias just in case
  await local.query(`UPDATE "Telemetria" SET "veiculoId" = '2101643' WHERE "veiculoId" = 'temp_BAR7I87'`);

  // Delete temp
  try {
    await local.query(`DELETE FROM "Veiculo" WHERE "id" = 'temp_BAR7I87'`);
    console.log("Merged temp_BAR7I87 into 2101643 successfully.");
  } catch (e) {
    console.log("Could not delete temp_BAR7I87, likely still used:", e.message);
  }

  // Pull telemetria for 2101643
  console.log("Pulling telemetria for BAR7I87...");
  const tRows = await sascar.query(`
    SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed" 
    FROM rastreamento_sascar 
    WHERE "vehicleId" = '2101643' 
    ORDER BY "positionDateUtc" DESC LIMIT 100
  `);
  
  if (tRows.rows.length > 0) {
      let insertQuery = `INSERT INTO "Telemetria" ("id", "veiculoId", "latitude", "longitude", "ignicao", "velocidade", "dataHoraUtc", "dataHoraLocal", "createdAt") VALUES `;
      const values = [];
      let i = 1;
      for (const row of tRows.rows) {
          const dataUtc = new Date(row.positionDateUtc);
          const dataLocal = new Date(dataUtc);
          dataLocal.setHours(dataLocal.getHours() - 3);
          
          insertQuery += `(gen_random_uuid(), $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++}, NOW()),`;
          values.push(row.vehicleId, Number(row.latitude), Number(row.longitude), Boolean(row.ignition), Number(row.speed) || 0, dataUtc.toISOString(), dataLocal.toISOString());
      }
      insertQuery = insertQuery.slice(0, -1) + ` ON CONFLICT DO NOTHING;`;
      await local.query(insertQuery, values);
      console.log(`Inserted ${tRows.rows.length} telemetrias!`);
  }

  await local.end();
  await sascar.end();
}

fixVehicles().catch(console.error);
