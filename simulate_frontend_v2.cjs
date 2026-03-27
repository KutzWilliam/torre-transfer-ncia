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
        where: { id: '37669539' },
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

    let paradaIdx = paradas.length > 1 ? 1 : 0;
    let primeiraEntrada = null;
    let ultimaDentro = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;
        const paradaAtual = paradas[paradaIdx];
        if (!paradaAtual.latitude || !paradaAtual.longitude) { paradaIdx++; continue; }

        const raioAtual = paradaAtual.raioMetros ?? 5000;
        const distAtual = calcularDistanciaGeocerca(t.latitude, t.longitude, paradaAtual.latitude, paradaAtual.longitude);

        if (distAtual <= raioAtual) {
            if (!primeiraEntrada) primeiraEntrada = new Date(t.dataHoraLocal);
            ultimaDentro = new Date(t.dataHoraLocal);
        } else if (primeiraEntrada) {
            // Verifica se não entrou na próxima parada
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

    console.log("== Resultados RT ==");
    resultadosRT.forEach((r, i) => {
        console.log(`[${i}] ${paradas[i].nome}: Chegada = ${r.horaChegada ? r.horaChegada.toLocaleString('pt-BR') : null} | Saida = ${r.horaSaida ? r.horaSaida.toLocaleString('pt-BR') : null}`);
    });

    await prisma.$disconnect();
}
main().catch(console.error);
