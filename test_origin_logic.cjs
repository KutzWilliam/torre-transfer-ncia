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

    // CÁLCULO INTELIGENTE
    let paradaIdx = 0;
    let primeiraEntrada = null;
    let ultimaDentro = null;
    let saidaOrigemFallback = null;

    // Detectar momento de partida fallback (primeiro ponto em movimento após inicio)
    for (const t of telemetrias) {
        if (t.velocidade > 5 && !saidaOrigemFallback) {
            saidaOrigemFallback = new Date(t.dataHoraLocal);
            break;
        }
    }

    // Se o usuário tentar rastrear a origem (parada 0) mas o caminhão já começou Giga-Longe, podemos pular a origem!
    if (paradas.length > 0 && telemetrias.length > 0) {
        const origem = paradas[0];
        const primeiraTel = telemetrias[0];
        const distOrigem = calcularDistanciaGeocerca(primeiraTel.latitude, primeiraTel.longitude, origem.latitude, origem.longitude);
        if (distOrigem > (origem.raioMetros ?? 5000)) {
            // Caminhão já começou longe da origem. A geofence tradicional nunca vai ativar!
            paradaIdx = paradas.length > 1 ? 1 : 0; 
        }
    }

    // O restate da logica = igual a v2
    console.log(`Parada InicialIdx: ${paradaIdx} | Origem Fallback: ${saidaOrigemFallback?.toISOString()}`);
    
    await prisma.$disconnect();
}
main().catch(console.error);
