const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

function calcularDistanciaGeocerca(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371e3;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

async function debug() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: "37696752" },
        include: {
            veiculo: true,
            baseOrigem: true,
            baseDestino: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: "asc" } }
        }
    });

    if (!viagem) {
        console.log("Viagem 37696752 não encontrada");
        return;
    }

    const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
    const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

    console.log(`Buscando telemetrias para veiculo ${viagem.veiculo.id} entre ${dataCorteInicio.toISOString()} e ${dataCorteEfim.toISOString()}`);

    const telemetrias = await prisma.telemetria.findMany({
        where: {
            veiculoId: viagem.veiculo.id,
            dataHoraLocal: {
                gte: dataCorteInicio,
                lte: dataCorteEfim
            }
        },
        orderBy: { dataHoraLocal: "asc" }
    });

    console.log(`Encontradas ${telemetrias.length} telemetrias`);

    const paradasDb = await prisma.paradaViagem.findMany({
        where: { viagemId: viagem.id },
        include: { base: true },
        orderBy: { ordem: 'asc' }
    });

    const paradas = paradasDb.length > 0 ? paradasDb.map(p => ({
        id: p.id, base: p.base, ordem: p.ordem, isFake: false
    })) : [
        { id: 'fake_origem', base: viagem.baseOrigem, ordem: 0, isFake: true },
        { id: 'fake_destino', base: viagem.baseDestino, ordem: 1, isFake: true }
    ];

    console.log(`Paradas a inspecionar: ${paradas.length}`);
    paradas.forEach((p, idx) => console.log(`[${idx}] -> Lat: ${p.base?.latitude}, Lng: ${p.base?.longitude}, Raio: ${p.base?.raioMetros || 5000} (Fake: ${p.isFake})`));

    const resultados = paradas.map(p => ({ id: p.id, chegada: null, saida: null, isFake: p.isFake }));

    let paradaIdx = 0;
    let primeiraEntrada = null;
    let ultimaDentro = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;

        while (paradaIdx < paradas.length) {
            const checkParada = paradas[paradaIdx];
            if (checkParada.base?.latitude && checkParada.base?.longitude) break;
            
            resultados[paradaIdx] = { id: checkParada.id, isFake: checkParada.isFake, chegada: null, saida: null };
            console.log(`Parada [${paradaIdx}] pulada por falta de coordenadas`);
            paradaIdx++;
            primeiraEntrada = null;
            ultimaDentro = null;
        }

        if (paradaIdx >= paradas.length) break;

        const parada = paradas[paradaIdx];
        const base = parada.base;
        const raio = base.raioMetros ?? 5000;
        const dist = calcularDistanciaGeocerca(t.latitude, t.longitude, base.latitude, base.longitude);
        const estaDentro = dist <= raio;

        if (estaDentro) {
            if (!primeiraEntrada) {
                primeiraEntrada = t.dataHoraLocal;
                console.log(`>>> ENTROU na parada [${paradaIdx}] ! Data: ${primeiraEntrada.toISOString()} (Dist: ${Math.round(dist)}m)`);
            }
            ultimaDentro = t.dataHoraLocal;
        } else {
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1];
                const proxBase = proxParada.base;
                if (proxBase?.latitude && proxBase?.longitude) {
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxBase.latitude, proxBase.longitude);
                    if (distProx <= (proxBase.raioMetros ?? 5000)) {
                        resultados[paradaIdx] = { id: parada.id, isFake: parada.isFake, chegada: primeiraEntrada, saida: ultimaDentro };
                        console.log(`<<< SAIU da parada [${paradaIdx}] e ENTROU na [${paradaIdx+1}]! Data saída da anterior: ${ultimaDentro ? ultimaDentro.toISOString() : '?'}`);
                        paradaIdx++;
                        primeiraEntrada = t.dataHoraLocal;
                        ultimaDentro = t.dataHoraLocal;
                    }
                } else if (primeiraEntrada) {
                    resultados[paradaIdx] = { id: parada.id, isFake: parada.isFake, chegada: primeiraEntrada, saida: ultimaDentro };
                    console.log(`<<< SAIU da parada [${paradaIdx}] para uma próxima SEM COORD. Data saída: ${ultimaDentro.toISOString()}`);
                    paradaIdx++;
                    primeiraEntrada = null;
                    ultimaDentro = null;
                }
            }
        }
    }

    if (primeiraEntrada && paradaIdx < paradas.length) {
        resultados[paradaIdx] = { id: paradas[paradaIdx].id, chegada: primeiraEntrada, saida: ultimaDentro };
        console.log(`+++ Viagem encerrou com veículo AINDA DENTRO da parada [${paradaIdx}].`);
    }

    console.log("RESULTADO FINAL:", resultados);

    const destinoResult = resultados[paradas.length - 1];
    if (destinoResult?.chegada && !viagem.dataFimEfetivo) {
        console.log("-> MARCARIA COMO FINALIZADA AGORA com dataFim =", destinoResult.chegada.toISOString());
    } else {
        console.log("-> NÃO PODE FINALIZAR. Motivo:", !destinoResult?.chegada ? "Não detectou chegada no destino" : "Já possui dataFimEfetivo");
        
        if (!destinoResult?.chegada) {
            const destBase = paradas[paradas.length - 1].base;
            console.log("Análise da última telemetria relativa ao destino:");
            const lastT = telemetrias[telemetrias.length - 1];
            if (lastT && destBase?.latitude && destBase?.longitude) {
                const distFim = calcularDistanciaGeocerca(lastT.latitude, lastT.longitude, destBase.latitude, destBase.longitude);
                console.log(`Última Telemetria (${lastT.dataHoraLocal.toISOString()}): Distância do destino é ${Math.round(distFim)}m. Raio é ${destBase.raioMetros || 5000}m.`);
            }
        }
    }
}
debug().catch(console.error).finally(() => prisma.$disconnect());
