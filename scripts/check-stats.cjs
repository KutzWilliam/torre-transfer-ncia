const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Consultando contagens das tabelas...');
  const [viagensCount, paradasCount, ocorrenciasCount] = await Promise.all([
    prisma.viagem.count(),
    prisma.paradaViagem.count(),
    prisma.ocorrencia.count()
  ]);
  console.log('Total Viagens:', viagensCount);
  console.log('Total Paradas:', paradasCount);
  console.log('Total Ocorrencias:', ocorrenciasCount);

  // Consulta intervalo de viagens
  const minMaxViagem = await prisma.viagem.aggregate({
    _min: { prevInicioReal: true },
    _max: { prevInicioReal: true }
  });
  console.log('Intervalo Viagens:', minMaxViagem);

  // Consulta intervalo da telemetria
  console.log('Consultando intervalo e dados da Telemetria...');
  const minMaxTele = await prisma.telemetria.aggregate({
    _min: { dataHoraLocal: true },
    _max: { dataHoraLocal: true }
  });
  console.log('Intervalo Telemetria:', minMaxTele);
}

main()
  .catch((e) => {
    console.error('Erro na consulta:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
