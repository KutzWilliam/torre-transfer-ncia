import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  const viagemId = '37668249';
  console.log(`Inspecting Viagem: ${viagemId}`);
  
  const viagem = await prisma.viagem.findUnique({
    where: { id: viagemId },
    include: {
      veiculo: true,
      paradasViagem: { include: { base: true } },
    }
  });

  console.log('--- Viagem ---');
  console.dir(viagem, { depth: null });

  if (viagem) {
    console.log('\n--- Telemetrias para o veiculo da Viagem ---');
    const telemetrias = await prisma.telemetria.findMany({
      where: { veiculoId: viagem.veiculoId },
      take: 5
    });
    console.log(`Found ${telemetrias.length} telemetrias for veiculoId ${viagem.veiculoId}`);
    
    // Check if there are telemetrias for this placa at all
    const todasTelemetriasVeiculo = await prisma.telemetria.findMany({
      where: { veiculo: { placa: viagem.veiculo.placa } },
      take: 5
    });
    console.log(`Found ${todasTelemetriasVeiculo.length} telemetrias via relation on placa: ${viagem.veiculo.placa}`);
  }

  // Count total items
  const countParadas = await prisma.paradaViagem.count();
  const countTelemetrias = await prisma.telemetria.count();
  const countVeiculos = await prisma.veiculo.count();
  console.log(`\nTotals -> ParadaViagem: ${countParadas}, Telemetria: ${countTelemetrias}, Veiculo: ${countVeiculos}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
