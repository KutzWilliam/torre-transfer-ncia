import { PrismaClient } from "./generated/prisma/index.js";
import { normalizeString } from "./src/server/utils/stringUtils.js";

const prisma = new PrismaClient();

const calcularDataAbsoluta = (dataBase: Date, dataReferencia: Date, horarioStr: string | null) => {
    if (!horarioStr) return null;
    const [horas = 0, minutos = 0] = horarioStr.split(':').map(Number);

    const novaData = new Date(dataBase);
    novaData.setHours(0, 0, 0, 0); 
    novaData.setHours(horas, minutos, 0, 0); 

    if (novaData.getTime() < dataReferencia.getTime()) {
        novaData.setDate(novaData.getDate() + 1);
    }
    return novaData;
};

async function fixRotas() {
    console.log("Pré-carregando rotas corretas...");
    const rotasCadastradas = await prisma.rotaPadrao.findMany({
        include: { paradas: { orderBy: { ordem: "asc" } } }
    });

    const viagensCorrompidas = await prisma.viagem.findMany({
        where: { status: { in: ["PROGRAMADA", "EM_ANDAMENTO"] } },
        include: { paradasViagem: true }
    });

    console.log(`Encontradas ${viagensCorrompidas.length} viagens em andamento ou programadas... Analisando quem perdeu pontos intermediários.`);
    
    let corrigidas = 0;
    for (const v of viagensCorrompidas) {
        const rotaNomeLimpo = normalizeString(v.rotaDescricao).replace(/\s+/g, ' ').trim();
        const rp = rotasCadastradas.find(r => normalizeString(r.nome).replace(/\s+/g, ' ').trim() === rotaNomeLimpo);

        if (rp && rp.paradas.length > 0) {
            // Se as paradas salvas na viagem não batem com o gabarito original, ou for vazio
            if (v.paradasViagem.length !== rp.paradas.length) {
                console.log(`\nViagem #${v.id} - ${v.rotaDescricao}\n   >> Tinha ${v.paradasViagem.length} paradas. Remapeando para as ${rp.paradas.length} corriqueiras de '${rp.nome}'`);
                
                await prisma.paradaViagem.deleteMany({ where: { viagemId: v.id } });

                const dataBase = new Date(v.prevInicioReal);
                dataBase.setHours(0, 0, 0, 0);
                let dataReferencia = new Date(dataBase);

                for (const parada of rp.paradas) {
                    const prevChegadaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevChegada);
                    if (prevChegadaCalc) dataReferencia = prevChegadaCalc;

                    const prevSaidaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevSaida);
                    if (prevSaidaCalc) dataReferencia = prevSaidaCalc;

                    const ehUltimaParada = parada.ordem === rp.paradas.length - 1;
                    const prevChegadaFinal = (!prevChegadaCalc && ehUltimaParada) ? new Date(v.prevFimReal) : prevChegadaCalc;

                    await prisma.paradaViagem.create({
                        data: {
                            viagemId: v.id, baseId: parada.baseId, ordem: parada.ordem,
                            prevChegada: prevChegadaFinal, prevSaida: prevSaidaCalc
                        }
                    });
                }

                await prisma.viagem.update({ where: { id: v.id }, data: { rotaPadraoId: rp.id } });
                corrigidas++;
            }
        }
    }
    
    console.log(`\nFeito! Corrigidas ${corrigidas} viagens!`);
    await prisma.$disconnect();
}

fixRotas().catch(console.error);
