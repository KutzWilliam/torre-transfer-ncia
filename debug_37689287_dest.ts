import 'dotenv/config';
import { db } from './src/server/db';
import { calcularDistanciaGeocerca } from './src/server/utils/geolocalizacao';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37689287' },
        include: { veiculo: true, baseOrigem: true, baseDestino: true, paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } } }
    });

    if (!viagem) return;

    const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
    const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
    const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

    const telemetrias = await db.telemetria.findMany({
        where: { veiculoId: viagem.veiculoId, dataHoraLocal: { gte: dataCorteInicio, lte: dataCorteEfim } },
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

    let debugTxt = `\nTrip 37689287\nTotal Paradas: ${paradas.length}\nTotal Teles: ${telemetrias.length}\n`;
    paradas.forEach((p, i) => {
         debugTxt += `Parada ${i}: ${p.base?.nome} (Lat: ${p.base?.latitude}, Lng: ${p.base?.longitude}, Raio: ${p.base?.raioMetros})\n`;
    });

    let primeiraEntrada: any = null;
    let ultimaDentro: any = null;

    let logIdx = 0;

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
            
            // Logar última posição que ele estava dentro para debugar o destino
            if (paradaIdx === paradas.length - 1) {
                logIdx++;
                if (logIdx === 1) debugTxt += `\n>> ENTROU NO DESTINO EM ${t.dataHoraLocal.toISOString()} ! Distância: ${dist.toFixed(2)}m\n`;
            }

        } else {
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1]!;
                const proxBase = proxParada.base;
                if (proxBase?.latitude && proxBase?.longitude) {
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxBase.latitude, proxBase.longitude);
                    if (distProx <= (proxBase.raioMetros ?? 5000)) {
                        debugTxt += `>> TRANSIÇÃO da parada ${paradaIdx} para a próxima (${paradaIdx+1}) em ${t.dataHoraLocal.toISOString()}\n`;
                        resultados[paradaIdx] = { ...resultados[paradaIdx], chegada: parada.ordem === 0 ? null : primeiraEntrada, saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro };
                        paradaIdx++;
                        primeiraEntrada = t.dataHoraLocal;
                        ultimaDentro = t.dataHoraLocal;
                    }
                } else if (primeiraEntrada) {
                    resultados[paradaIdx] = { ...resultados[paradaIdx], chegada: parada.ordem === 0 ? null : primeiraEntrada, saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro };
                    paradaIdx++;
                    primeiraEntrada = null;
                    ultimaDentro = null;
                }
            }
        }
    }

    if (primeiraEntrada && paradaIdx < paradas.length) {
        const parada = paradas[paradaIdx]!;
        resultados[paradaIdx] = { ...resultados[paradaIdx], chegada: parada.ordem === 0 ? null : primeiraEntrada, saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro };
    }
    
    // Mostar a menor distancia do destino só por curiosidade
    if (telemetrias.length > 0 && paradas.length > 0) {
         const destino = paradas[paradas.length - 1].base;
         if (destino?.latitude) {
            let minDist = 99999999;
            let closestT = null;
            for(const t of telemetrias) {
                const d = calcularDistanciaGeocerca(t.latitude, t.longitude, destino.latitude, destino.longitude);
                if (d < minDist) { minDist = d; closestT = t; }
            }
            debugTxt += `\nDISTÂNCIA RECORDE MÍNIMA AO DESTINO: ${minDist.toFixed(2)}m às ${closestT?.dataHoraLocal.toISOString()} (Raio alvo: ${destino.raioMetros})\n`;
         }
    }

    console.log(debugTxt);
    console.table(resultados);
    process.exit(0);
}
main().catch(console.error);
