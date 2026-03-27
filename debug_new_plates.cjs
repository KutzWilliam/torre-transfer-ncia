const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function debugNewPlates() {
  const sascar = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL
  });
  const prisma = new PrismaClient();

  const platesToCheck = ['COR', 'COR7B99', 'AQC', 'AQC7030'];
  console.log("=== Verificando Sascar ===");
  for (const p of platesToCheck) {
      const v = await sascar.query(`SELECT "placa" FROM veiculos_sascar WHERE "placa" LIKE $1`, [`%${p}%`]);
      console.log(`Placas parecidas com ${p}:`, v.rows);
  }

  console.log("\n=== Verificando RotaPadrao ===");
  const r = await prisma.rotaPadrao.findMany({
      where: {
          nome: {
              contains: "CASCAVE"
          }
      }
  });

  console.log("Rotas contendo CASCAVE:");
  r.forEach(rt => console.log(rt.nome));

  await prisma.$disconnect();
  await sascar.end();
}

debugNewPlates().catch(console.error);
