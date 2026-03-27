/**
 * Recalcula os horários previstos (prevChegada/prevSaida) de TODAS as ParadaViagem
 * usando a lógica correta: ancora ao DIA da viagem (meia-noite), não ao hor. de prevInicio.
 */
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

function calcularDataAbsoluta(dataBase, dataReferencia, horarioStr) {
    if (!horarioStr) return null;
    const [horas, minutos] = horarioStr.split(':').map(Number);
    
    // Ancora ao DIA da viagem (meia-noite)
    const novaData = new Date(dataBase);
    novaData.setHours(0, 0, 0, 0);
    novaData.setHours(horas, minutos, 0, 0);
    
    // Rola para o dia seguinte APENAS se for anterior à parada anterior (cruzamento de meia-noite real)
    if (novaData.getTime() < dataReferencia.getTime()) {
        novaData.setDate(novaData.getDate() + 1);
    }
    return novaData;
}

async function main() {
    const viagens = await prisma.viagem.findMany({
        include: {
            paradasViagem: {
                orderBy: { ordem: 'asc' }
            },
            rotaPadrao: {
                include: {
                    paradas: { orderBy: { ordem: 'asc' } }
                }
            }
        }
    });

    let fixedViagens = 0;
    let fixedParadas = 0;

    for (const viagem of viagens) {
        if (!viagem.rotaPadrao || viagem.paradasViagem.length === 0) continue;

        const paradas = viagem.paradasViagem;
        const matriz = viagem.rotaPadrao.paradas;

        // Ancora ao dia da viagem
        const dataBase = new Date(viagem.prevInicioReal);
        dataBase.setHours(0, 0, 0, 0);
        let dataReferencia = new Date(dataBase);

        let viagemFixed = false;

        for (let i = 0; i < matriz.length; i++) {
            const matrizParada = matriz[i];
            const paradaViagem = paradas.find(p => p.baseId === matrizParada.baseId && p.ordem === matrizParada.ordem);
            if (!paradaViagem) continue;

            const prevChegadaCalc = calcularDataAbsoluta(dataBase, dataReferencia, matrizParada.prevChegada);
            if (prevChegadaCalc) dataReferencia = prevChegadaCalc;

            const prevSaidaCalc = calcularDataAbsoluta(dataBase, dataReferencia, matrizParada.prevSaida);
            if (prevSaidaCalc) dataReferencia = prevSaidaCalc;

            // Para a última parada, garante prevChegada
            const ehUltimaParada = i === matriz.length - 1;
            const prevChegadaFinal = (!prevChegadaCalc && ehUltimaParada) ? viagem.prevFimReal : prevChegadaCalc;

            await prisma.paradaViagem.update({
                where: { id: paradaViagem.id },
                data: {
                    prevChegada: prevChegadaFinal,
                    prevSaida: prevSaidaCalc,
                }
            });

            fixedParadas++;
            viagemFixed = true;
        }

        if (viagemFixed) {
            fixedViagens++;
            // Exemplo de saída para diagnose
            if (viagem.id === '37669539') {
                console.log(`\n✅ Viagem 37669539 recalculada:`);
                const pv = await prisma.paradaViagem.findMany({ where: { viagemId: viagem.id }, orderBy: { ordem: 'asc' }, include: { base: true } });
                pv.forEach(p => console.log(`   ${p.base.nome}: prevChegada=${p.prevChegada?.toLocaleString('pt-BR')} prevSaida=${p.prevSaida?.toLocaleString('pt-BR')}`));
            }
        }
    }

    console.log(`\n✅ Recalculadas ${fixedParadas} paradas em ${fixedViagens} viagens.`);
    await prisma.$disconnect();
}

main().catch(console.error);
