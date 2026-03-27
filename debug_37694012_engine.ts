import 'dotenv/config';
import { db } from './src/server/db';
import { calcularDistanciaGeocerca } from './src/server/utils/geolocalizacao';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37694012' },
        include: { veiculo: true, baseOrigem: true, baseDestino: true, paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } } }
    });

    if (!viagem) return;

    const telemetrias = await db.telemetria.findMany({
        where: { veiculoId: viagem.veiculoId, dataHoraLocal: { gte: viagem.prevInicioReal } },
        orderBy: { dataHoraLocal: 'asc' }
    });

    const paradasDb = await db.paradaViagem.findMany({
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

    const resultados = paradas.map(p => ({ id: p.id, chegada: null, saida: null, isFake: p.isFake }));
    let paradaIdx = 0;

    let debugTxt = `\nTrip 37694012 - ${paradas.length} paradas. Tel = ${telemetrias.length}\n`;

    if (paradas.length > 0 && telemetrias.length > 0) {
        const origem = paradas[0]!;
        const primeiraTel = telemetrias[0]!;
        if (origem.base?.latitude && origem.base?.longitude) {
            const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.base.latitude, origem.base.longitude);
            debugTxt += `Distância Origem INÍCIO: ${distOrigem.toFixed(2)}m (Raio ${origem.base.raioMetros})\n`;
            if (distOrigem > (origem.base.raioMetros ?? 5000)) {
                debugTxt += `(Skip Origem)\n`;
                paradaIdx = paradas.length > 1 ? 1 : 0;
            }
        }
    }

    let primeiraEntrada: any = null;
    let ultimaDentro: any = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;
        const parada = paradas[paradaIdx]!;
        const base = parada.base;

        if (!base?.latitude || !base?.longitude) { paradaIdx++; continue; }

        const raio = base.raioMetros ?? 5000;
        const dist = calcularDistanciaGeocerca(t.latitude, t.longitude, base.latitude, base.longitude);
        const estaDentro = dist <= raio;

        if (estaDentro) {
            if (!primeiraEntrada) primeiraEntrada = t.dataHoraLocal;
            ultimaDentro = t.dataHoraLocal;
        } else if (primeiraEntrada) {
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1]!;
                const proxBase = proxParada.base;
                if (proxBase?.latitude && proxBase?.longitude) {
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxBase.latitude, proxBase.longitude);
                    if (distProx <= (proxBase.raioMetros ?? 5000)) {
                        debugTxt += `Fechou ${paradaIdx} com saída em ${ultimaDentro}\n`;
                        resultados[paradaIdx] = { ...resultados[paradaIdx], chegada: parada.ordem === 0 ? null : primeiraEntrada, saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro };
                        paradaIdx++;
                        primeiraEntrada = t.dataHoraLocal;
                        ultimaDentro = t.dataHoraLocal;
                    }
                } else {
                    debugTxt += `Prox sem coords. Fechou ${paradaIdx} em ${ultimaDentro}\n`;
                    resultados[paradaIdx] = { ...resultados[paradaIdx], chegada: parada.ordem === 0 ? null : primeiraEntrada, saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro };
                    paradaIdx++;
                    primeiraEntrada = null;
                    ultimaDentro = null;
                }
            }
        }
    }

    console.log(debugTxt);
    console.table(resultados);
    process.exit(0);
}
main().catch(console.error);
