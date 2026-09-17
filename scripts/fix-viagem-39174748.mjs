import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const viagem = await db.viagem.findUnique({
    where: { id: '39174748' },
    include: {
      rotaPadrao: { include: { paradas: { orderBy: { ordem: 'asc' } } } },
      baseOrigem: true,
      baseDestino: true,
    }
  });

  if (!viagem) { console.log('Viagem não encontrada'); return; }

  console.log('=== Estado atual da viagem ===');
  console.log('  rotaDescricao:', viagem.rotaDescricao);
  console.log('  baseOrigem atual:', viagem.baseOrigem.nome);
  console.log('  baseDestino atual:', viagem.baseDestino.nome);

  if (!viagem.rotaPadrao) {
    console.log('AVISO: Viagem sem rotaPadrao vinculada. Nada a corrigir.');
    return;
  }

  const paradas = viagem.rotaPadrao.paradas;
  console.log('\n=== Rota Padrão ===');
  console.log('  nome:', viagem.rotaPadrao.nome);
  console.log('  paradas:', paradas.length);

  const primeiraParada = paradas[0];
  const ultimaParada = paradas[paradas.length - 1];

  const baseOrigRota = primeiraParada ? await db.base.findUnique({ where: { id: primeiraParada.baseId } }) : null;
  const baseDestRota = ultimaParada ? await db.base.findUnique({ where: { id: ultimaParada.baseId } }) : null;

  console.log('\n=== Bases corretas pela rota ===');
  console.log('  baseOrigem (1ª parada):', baseOrigRota?.nome ?? 'não encontrada');
  console.log('  baseDestino (última parada):', baseDestRota?.nome ?? 'não encontrada');

  if (!baseOrigRota || !baseDestRota) {
    console.log('ERRO: Bases da rota não encontradas. Abortando.');
    return;
  }

  // Aplica a correção
  await db.viagem.update({
    where: { id: '39174748' },
    data: {
      baseOrigemId: baseOrigRota.id,
      baseDestinoId: baseDestRota.id,
    }
  });

  console.log('\n✅ Viagem #39174748 corrigida com sucesso!');
  console.log('  baseOrigem:', baseOrigRota.nome);
  console.log('  baseDestino:', baseDestRota.nome);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
