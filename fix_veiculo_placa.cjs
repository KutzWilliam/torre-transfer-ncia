const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function fixVehicles() {
  const prisma = new PrismaClient();
  const sascar = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

  console.log("Fixing BAR7I87...");

  // Delete the wrong one first to free up the ID
  const wrongPlaca = await prisma.veiculo.findUnique({ where: { placa: 'BAR7I871' } });
  if (wrongPlaca) {
    console.log("Deleting wrong placa BAR7I871...");
    await prisma.telemetria.deleteMany({ where: { veiculoId: wrongPlaca.id } });
    await prisma.veiculo.delete({ where: { placa: 'BAR7I871' } });
  }

  // Update temp to real ID
  const idNew = '2101643';
  const existing = await prisma.veiculo.findUnique({ where: { placa: 'BAR7I87' } });
  
  if (existing && existing.id !== idNew) {
      console.log(`Updating existing Veiculo BAR7I87 ID from ${existing.id} to ${idNew}`);
      const idOld = existing.id;
      await prisma.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
      await prisma.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
      await prisma.$executeRawUnsafe(`UPDATE "Veiculo" SET "id" = $1 WHERE "id" = $2`, idNew, idOld);
  } else if (!existing) {
      console.log("Creating new Veiculo BAR7I87");
      await prisma.veiculo.create({
          data: { id: idNew, placa: 'BAR7I87', descricao: 'SASCARGA FULL' }
      });
  }

  // Sync telemetria
  console.log("Pulling telemetria for BAR7I87...");
  const tRows = await sascar.query(`
    SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed" 
    FROM rastreamento_sascar 
    WHERE "vehicleId" = '2101643' 
    ORDER BY "positionDateUtc" DESC LIMIT 100
  `);
  
  const dadosParaInserir = tRows.rows.map(row => {
      const dataUtc = new Date(row.positionDateUtc);
      const dataLocal = new Date(dataUtc);
      dataLocal.setHours(dataLocal.getHours() - 3);

      return {
          veiculoId: String(row.vehicleId),
          latitude: Number(row.latitude),
          longitude: Number(row.longitude),
          ignicao: Boolean(row.ignition),
          velocidade: Number(row.speed) || 0,
          dataHoraUtc: dataUtc,
          dataHoraLocal: dataLocal,
      };
  });

  if (dadosParaInserir.length > 0) {
      await prisma.telemetria.createMany({
          data: dadosParaInserir,
          skipDuplicates: true,
      });
      console.log(`Inserted ${dadosParaInserir.length} telemetrias!`);
  }

  await prisma.$disconnect();
  await sascar.end();
}

fixVehicles().catch(console.error);
