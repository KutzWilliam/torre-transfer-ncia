const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function syncBar() {
  const sascar = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL
  });
  const prisma = new PrismaClient();

  const v = await sascar.query(`SELECT "idVeiculo", "placa", "descricao" FROM veiculos_sascar WHERE "placa" LIKE '%BAR%'`);
  console.log("Found in Sascar:", v.rows);

  for (const row of v.rows) {
    const placaLimpa = row.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
    console.log(`Plaque ${row.placa} cleaned to ${placaLimpa}`);

    const existing = await prisma.veiculo.findUnique({ where: { placa: placaLimpa } });
    if (existing) {
        console.log(`Updating existing Veiculo ${placaLimpa} ID from ${existing.id} to ${row.idVeiculo}`);
        
        // Update Foreign keys first if necessary? Prisma doesn't have cascade on update. 
        // We will just use raw SQL to avoid Prisma foreign key issues
        const idOld = existing.id;
        const idNew = String(row.idVeiculo);
        
        if (idOld !== idNew) {
            await prisma.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
            await prisma.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNew, idOld);
            await prisma.$executeRawUnsafe(`UPDATE "Veiculo" SET "id" = $1 WHERE "id" = $2`, idNew, idOld);
            console.log("Updated!");
        } else {
            console.log("ID is already correct.");
        }
    } else {
        console.log(`Creating new Veiculo ${placaLimpa}`);
        await prisma.veiculo.create({
            data: { id: String(row.idVeiculo), placa: placaLimpa, descricao: row.descricao }
        });
    }
  }

  await prisma.$disconnect();
  await sascar.end();
}

syncBar().catch(console.error);
