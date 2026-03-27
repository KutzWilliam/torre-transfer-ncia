const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function link() {
  const viagens = await prisma.viagem.findMany();
  let relink = 0;
  
  for (const viagem of viagens) {
    const rotaPadrao = await prisma.rotaPadrao.findFirst({
        where: { nome: viagem.rotaDescricao.trim() },
        include: { paradas: { orderBy: { ordem: "asc" } } }
    });

    if (rotaPadrao) {
      console.log(`Linking Viagem ${viagem.id} with Rota ${rotaPadrao.nome}`);
      await prisma.viagem.update({
        where: { id: viagem.id },
        data: { rotaPadraoId: rotaPadrao.id }
      });
      
      // Clone paradas
      await prisma.paradaViagem.deleteMany({ where: { viagemId: viagem.id } });

      const calcularDataAbsoluta = (dataReferencia, horarioStr) => {
        if (!horarioStr) return null;
        const [horas = 0, minutos = 0] = horarioStr.split(':').map(Number);
        const novaData = new Date(dataReferencia);
        novaData.setHours(horas, minutos, 0, 0);
        if (novaData.getTime() < dataReferencia.getTime()) {
            novaData.setDate(novaData.getDate() + 1);
        }
        return novaData;
      };

      let dataReferencia = new Date(viagem.prevInicioReal);

      for (const parada of rotaPadrao.paradas) {
          const prevChegadaCalc = calcularDataAbsoluta(dataReferencia, parada.prevChegada);
          if (prevChegadaCalc) dataReferencia = prevChegadaCalc;

          const prevSaidaCalc = calcularDataAbsoluta(dataReferencia, parada.prevSaida);
          if (prevSaidaCalc) dataReferencia = prevSaidaCalc;

          await prisma.paradaViagem.create({
              data: {
                  viagemId: viagem.id, 
                  baseId: parada.baseId, 
                  ordem: parada.ordem,
                  prevChegada: prevChegadaCalc, 
                  prevSaida: prevSaidaCalc
              }
          });
      }
      relink++;
    } else {
      console.log(`RotaPadrao Not found for: ${viagem.rotaDescricao}`);
    }
  }

  console.log(`\nLinked ${relink} viagens.`);
  await prisma.$disconnect();
}

link().catch(console.error);
