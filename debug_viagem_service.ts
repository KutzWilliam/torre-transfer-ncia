import 'dotenv/config';
import { db } from './src/server/db';
import { calcularDistanciaGeocerca } from './src/server/utils/geolocalizacao';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37675568' },
        include: {
            veiculo: true,
            paradasViagem: {
                include: { base: true },
                orderBy: { ordem: 'asc' }
            }
        }
    });

    if (!viagem) {
        console.log("Viagem não encontrada.");
        return;
    }

    const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
    const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

    const telemetrias = await db.telemetria.findMany({
        where: {
            veiculoId: viagem.veiculo.id,
            dataHoraLocal: { gte: dataCorteInicio, lte: dataCorteEfim }
        },
        orderBy: { dataHoraLocal: 'asc' }
    });

    console.log(`Viagem: ${viagem.id} | Telemetrias: ${telemetrias.length}`);
    if (telemetrias.length > 0) {
        console.log(`Primeira Tell: ${telemetrias[0].dataHoraLocal.toISOString()}`);
        console.log(`Última Tell: ${telemetrias[telemetrias.length - 1].dataHoraLocal.toISOString()}`);
    }

    const paradas = viagem.paradasViagem;
    const resultados: any[] = paradas.map(p => ({ id: p.id, chegada: null, saida: null }));
    let paradaIdx = 0;

    if (paradas.length > 0 && telemetrias.length > 0) {
        const origem = paradas[0]!;
        const primeiraTel = telemetrias[0]!;
        if (origem.base.latitude && origem.base.longitude) {
            const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.base.latitude, origem.base.longitude);
            console.log(`\nOrigem (${origem.base.nome}): Distância inicial = ${distOrigem.toFixed(2)}m (Raio = ${origem.base.raioMetros})`);
            if (distOrigem > (origem.base.raioMetros ?? 5000)) {
                console.log(`=> Ignorando Origem (Longe da base). Parada Inicial = 1`);
                paradaIdx = paradas.length > 1 ? 1 : 0;
            } else {
                console.log(`=> Começou DENTRO da Origem. Esperando saída.`);
            }
        }
    }

    let primeiraEntrada: Date | null = null;
    let ultimaDentro: Date | null = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;

        const parada = paradas[paradaIdx]!;
        const base = parada.base;

        if (!base.latitude || !base.longitude) {
            paradaIdx++;
            continue;
        }

        const raio = base.raioMetros ?? 5000;
        const dist = calcularDistanciaGeocerca(t.latitude, t.longitude, base.latitude, base.longitude);
        const estaDentro = dist <= raio;

        if (estaDentro) {
            if (!primeiraEntrada) {
                primeiraEntrada = t.dataHoraLocal;
                console.log(`Entrou na Parada ${paradaIdx} (${base.nome}) em ${t.dataHoraLocal.toISOString()}`);
            }
            ultimaDentro = t.dataHoraLocal;
        } else if (primeiraEntrada) {
            // Saiu. Verificar se entrou na próxima (anti-jitter)
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1]!;
                const proxBase = proxParada.base;

                if (proxBase.latitude && proxBase.longitude) {
                    const proxRaio = proxBase.raioMetros ?? 5000;
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxBase.latitude, proxBase.longitude);

                    if (distProx <= proxRaio) {
                        console.log(`Entrou na PRÓXIMA parada (${proxBase.nome}) em ${t.dataHoraLocal.toISOString()}! Fechando atual.`);
                        resultados[paradaIdx] = {
                            id: parada.id,
                            chegada: parada.ordem === 0 ? null : primeiraEntrada,
                            saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro,
                        };
                        paradaIdx++;
                        primeiraEntrada = t.dataHoraLocal;
                        ultimaDentro = t.dataHoraLocal;
                    }
                }
            } else {
                // Se é a ÚLTIMA parada da viagem e ele saiu dela, podemos fechar!
                // O código frontend não faz isso explicitamente, mas vamos ver.
            }
        }
    }

    // Se terminou com uma parada em andamento
    if (primeiraEntrada && paradaIdx < paradas.length) {
        const parada = paradas[paradaIdx]!;
        console.log(`Viagem terminou. Fechando parada atual ${paradaIdx} (${parada.base.nome})`);
        resultados[paradaIdx] = {
            id: parada.id,
            chegada: parada.ordem === 0 ? null : primeiraEntrada,
            saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro,
        };
    }

    console.log(`\nResultados Acumulados:`);
    console.table(resultados);
    process.exit(0);
}
main().catch(console.error);
