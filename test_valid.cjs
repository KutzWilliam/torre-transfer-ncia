const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function testValid() {
  const viagem = await prisma.viagem.findFirst({
    where: { 
      paradasViagem: { some: {} },
      veiculo: { telemetrias: { some: {} } }
    },
    include: {
      veiculo: true,
      paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } },
      telemetrias: { take: 2 }
    }
  });

  if (viagem) {
    console.log(`Encontrou viagem válida: ${viagem.id} - ${viagem.rotaDescricao}`);
    console.log(`Paradas: ${viagem.paradasViagem.map(p => p.base.nome).join(' -> ')}`);
    console.log(`Telemetrias count relation check: ${viagem.telemetrias.length}`);
  } else {
    console.log("Nenhuma viagem tem paradas E telemetrias simultaneamente.");
    
    // Teste alternativo
    const v2 = await prisma.viagem.findFirst({
      where: { paradasViagem: { some: {} } },
      include: { paradasViagem: { include: { base: true } } }
    });
    console.log(`Viagens com paradas ao menos: ${v2 ? v2.id : 'Nenhuma'}`);
  }

  await prisma.$disconnect();
}

testValid().catch(console.error);
