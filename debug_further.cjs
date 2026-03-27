const { Pool } = require('pg');
const { PrismaClient } = require('./generated/prisma/index.js');

async function debug() {
  const prisma = new PrismaClient();
  const sascar = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL
  });

  console.log("=== RotaPadrao Busca ===");
  const rotas = await prisma.rotaPadrao.findMany();
  // match against "CURITIBA", "PONTA GROSSA", "GUARAPUAVA", "CASCAVEL"
  const matches = rotas.filter(r => 
    r.nome.includes("PONTA GROSSA") && r.nome.includes("GUARAPUAVA")
  );
  console.log("Rotas com PONTA GROSSA e GUARAPUAVA:");
  matches.forEach(r => console.log(r.nome));

  console.log("\nRotas com CASCAVEL:");
  rotas.filter(r => r.nome.includes("CASCAVEL")).forEach(r => console.log(r.nome));

  console.log("\n=== Verificando Sascar para 'ATB' ===");
  const veiculosATB = await sascar.query(`SELECT * FROM veiculos_sascar WHERE "placa" LIKE '%ATB%'`);
  console.log("Placas parecidas com ATB:", veiculosATB.rows);

  console.log("\n=== Verificando Viagens com ATB5H78 ===");
  const viagemQuery = await prisma.viagem.findMany({
    where: { veiculo: { placa: "ATB5H78" } }
  });
  console.log("Viagens com este veículo:", viagemQuery.map(v => ({ id: v.id, rota: v.rotaDescricao })));

  await prisma.$disconnect();
  await sascar.end();
}

debug().catch(console.error);
