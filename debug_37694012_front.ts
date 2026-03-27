import 'dotenv/config';
import { db } from './src/server/db';
import { calcularDistanciaGeocerca } from './src/server/utils/geolocalizacao';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37694012' },
        include: { veiculo: true, baseOrigem: true, baseDestino: true, paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } } }
    });

    const telemetrias = await db.telemetria.findMany({
        where: {
            veiculoId: viagem.veiculoId,
            dataHoraLocal: { gte: viagem.prevInicioReal }
        },
        orderBy: { dataHoraLocal: 'asc' }
    });

    console.log(`Viagem: ${viagem?.id} | Telemetrias: ${telemetrias.length}`);
    
    // Simular o que o Frontend tem em "paradas"
    const paradas = [
        { nome: viagem.baseOrigem.nome, latitude: viagem.baseOrigem.latitude, longitude: viagem.baseOrigem.longitude, raioMetros: viagem.baseOrigem.raioMetros, dataSaidaEfetiva: null },
        { nome: viagem.baseDestino.nome, latitude: viagem.baseDestino.latitude, longitude: viagem.baseDestino.longitude, raioMetros: viagem.baseDestino.raioMetros, dataSaidaEfetiva: null }
    ];

    const resultadosRT = paradas.map(() => ({ horaChegada: null, horaSaida: null }));
    let paradaIdx = 0;

    let debugTxt = `Paradas Length: ${paradas.length}\n`;

    if (paradas.length > 0 && telemetrias.length > 0) {
        const origem = paradas[0]!;
        const primeiraTel = telemetrias[0]!;
        debugTxt += `Frontend Init: Lat ${primeiraTel.latitude}, Lng ${primeiraTel.longitude}\n`;
        debugTxt += `Origem: Lat ${origem.latitude}, Lng ${origem.longitude}, Raio ${origem.raioMetros}\n`;
        
        if (origem.latitude && origem.longitude) {
            const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.latitude, origem.longitude);
            debugTxt += `>> distOrigem = ${distOrigem}m <<\n`;
            if (distOrigem > (origem.raioMetros ?? 5000)) {
                debugTxt += `Skip Origem Frontend!\n`;
                paradaIdx = paradas.length > 1 ? 1 : 0;
            }
        }
    }

    let primeiraEntrada: any = null;
    let ultimaDentro: any = null;

    for (const t of telemetrias) {
        if (paradaIdx >= paradas.length) break;
        const paradaAtual = paradas[paradaIdx]!;
        if (!paradaAtual.latitude || !paradaAtual.longitude) { paradaIdx++; continue; }

        const raioAtual = paradaAtual.raioMetros ?? 5000;
        const distAtual = calcularDistanciaGeocerca(t.latitude, t.longitude, paradaAtual.latitude, paradaAtual.longitude);

        if (distAtual <= raioAtual) {
            if (!primeiraEntrada) primeiraEntrada = new Date(t.dataHoraLocal);
            ultimaDentro = new Date(t.dataHoraLocal);
        } else if (primeiraEntrada) {
            if (paradaIdx + 1 < paradas.length) {
                const proxParada = paradas[paradaIdx + 1]!;
                if (proxParada.latitude && proxParada.longitude) {
                    const proxRaio = proxParada.raioMetros ?? 5000;
                    const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxParada.latitude, proxParada.longitude);
                    if (distProx <= proxRaio) {
                        debugTxt += `Frontend Fechou ${paradaIdx} c/ Saida ${ultimaDentro}\n`;
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

    console.log(debugTxt);
    console.log("Resultados RT:", resultadosRT);
    process.exit(0);
}
main().catch(console.error);
