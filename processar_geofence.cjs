/**
 * Roda a lógica de processamento de chegadas/saídas nas bases (geofence)
 * para todas as viagens ativas — sem precisar do endpoint HTTP.
 */
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function processarViagens() {
    const viagens = await prisma.viagem.findMany({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            veiculo: true,
            baseDestino: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });

    console.log(`Processando ${viagens.length} viagens ativas...`);
    let atualizadas = 0;

    for (const viagem of viagens) {
        if (viagem.paradasViagem.length === 0) continue;

        const dataCorte = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
        const telemetrias = await prisma.telemetria.findMany({
            where: { veiculoId: viagem.veiculo.id, dataHoraLocal: { gte: dataCorte } },
            orderBy: { dataHoraLocal: 'asc' }
        });

        if (telemetrias.length === 0) continue;

        let tocouAlgumaParada = false;

        for (const parada of viagem.paradasViagem) {
            const base = parada.base;
            if (!base.latitude || !base.longitude) continue;

            const raio = base.raioMetros ?? 1500;
            let primeiraEntrada = null;
            let ultimaDentro = null;

            for (const t of telemetrias) {
                const dist = calcularDistancia(t.latitude, t.longitude, base.latitude, base.longitude);
                if (dist <= raio) {
                    if (!primeiraEntrada) primeiraEntrada = t.dataHoraLocal;
                    ultimaDentro = t.dataHoraLocal;
                }
            }

            if (primeiraEntrada) {
                tocouAlgumaParada = true;
                const eDestino = parada.ordem === viagem.paradasViagem.length - 1;
                await prisma.paradaViagem.update({
                    where: { id: parada.id },
                    data: {
                        dataChegadaEfetiva: parada.dataChegadaEfetiva ?? primeiraEntrada,
                        dataSaidaEfetiva: eDestino ? null : (parada.dataSaidaEfetiva ?? ultimaDentro)
                    }
                });

                // Marcar viagem como FINALIZADA se chegou ao destino
                if (eDestino && !viagem.dataFimEfetivo) {
                    await prisma.viagem.update({
                        where: { id: viagem.id },
                        data: { status: 'FINALIZADA', dataFimEfetivo: primeiraEntrada }
                    });
                    console.log(`  -> Viagem ${viagem.id} FINALIZADA.`);
                    atualizadas++;
                }
            }
        }

        if (tocouAlgumaParada && viagem.status === 'PROGRAMADA') {
            await prisma.viagem.update({
                where: { id: viagem.id },
                data: { status: 'EM_ANDAMENTO' }
            });
        }
    }

    console.log(`\n✅ Concluído! ${atualizadas} viagens finalizadas.`);
    await prisma.$disconnect();
}

processarViagens().catch(console.error);
