const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

function calcularDistanciaGeocerca(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
    const viagem = await prisma.viagem.findUnique({
        where: { id: '37672874' },
        include: { veiculo: true, paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } } }
    });

    const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
    const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

    const telemetrias = await prisma.telemetria.findMany({
        where: { veiculoId: viagem.veiculo.id, dataHoraLocal: { gte: dataCorteInicio, lte: dataCorteEfim } },
        orderBy: { dataHoraLocal: 'asc' }
    });

    const paradas = viagem.paradasViagem.map(p => ({
        latitude: p.base.latitude, longitude: p.base.longitude, raioMetros: p.base.raioMetros, nome: p.base.nome, ordem: p.ordem
    }));

    const resultadosRT = paradas.map(() => ({ horaChegada: null, horaSaida: null }));

    // LÓGICA DINÂMICA DE ORIGEM
    let paradaIdx = 0;
    if (paradas.length > 0 && telemetrias.length > 0) {
        const origem = paradas[0];
        const primeiraTel = telemetrias[0];
        if (origem.latitude && origem.longitude) {
            const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.latitude, origem.longitude);
            if (distOrigem > (origem.raioMetros ?? 5000)) {
                // Começou fora, pula a origem (e confia no dataInicioEfetivo dps)
                paradaIdx = paradas.length > 1 ? 1 : 0;
            }
        }
    }

    let primeiraEntrada = null;
    let ultimaDentro = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;
        const paradaAtual = paradas[paradaIdx];
        if (!paradaAtual.latitude || !paradaAtual.longitude) { paradaIdx++; continue; }

        const raioAtual = paradaAtual.raioMetros ?? 5000;
        const distAtual = calcularDistanciaGeocerca(t.latitude, t.longitude, paradaAtual.latitude, paradaAtual.longitude);

        if (distAtual <= raioAtual) {
            // Em movimento lento ou parado dentro da cidade: atualizar ultimaDentro continuamente
            if (!primeiraEntrada) primeiraEntrada = new Date(t.dataHoraLocal);
            ultimaDentro = new Date(t.dataHoraLocal);
        } else if (primeiraEntrada) {
            // Se já tínhamos entrado, mas agora está fora. Verificar se entrou na próxima
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1];
                if (proxParada.latitude && proxParada.longitude) {
                    const proxRaio = proxParada.raioMetros ?? 5000;
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxParada.latitude, proxParada.longitude);
                    if (distProx <= proxRaio) {
                        resultadosRT[paradaIdx] = {
                            horaChegada: paradaIdx === 0 ? null : primeiraEntrada,
                            horaSaida: paradaIdx === paradas.length - 1 ? null : ultimaDentro,
                        };
                        paradaIdx++;
                        primeiraEntrada = new Date(t.dataHoraLocal);
                        ultimaDentro = new Date(t.dataHoraLocal);
                    }
                }
            }
        }
    }

    if (primeiraEntrada && paradaIdx < paradas.length) {
        resultadosRT[paradaIdx] = {
            horaChegada: paradaIdx === 0 ? null : primeiraEntrada,
            horaSaida: paradaIdx === paradas.length - 1 ? null : ultimaDentro,
        };
    }

    console.log("== Resultados RT (Viagem 37672874) ==");
    resultadosRT.forEach((r, i) => {
        console.log(`[${i}] ${paradas[i].nome}: Chegada = ${r.horaChegada ? r.horaChegada.toLocaleString('pt-BR') : null} | Saida = ${r.horaSaida ? r.horaSaida.toLocaleString('pt-BR') : null}`);
    });

    await prisma.$disconnect();
}
main().catch(console.error);
