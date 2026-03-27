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

async function main() {
    const viagens = await prisma.viagem.findMany({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            veiculo: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });

    console.log(`Total de viagens ativas: ${viagens.length}`);
    
    for (const viagem of viagens) {
        const hasParadas = viagem.paradasViagem.length > 0;
        const tCount = await prisma.telemetria.count({ where: { veiculoId: viagem.veiculo.id } });
        const basesComCoords = viagem.paradasViagem.filter(pv => pv.base.latitude).length;
        
        console.log(`Viagem ${viagem.id} | ${viagem.veiculo.placa} | paradas: ${viagem.paradasViagem.length} | tel: ${tCount} | basesComCoords: ${basesComCoords}`);
        
        if (hasParadas && tCount > 0 && basesComCoords > 0) {
            const dataCorte = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
            const telemetrias = await prisma.telemetria.findMany({
                where: { veiculoId: viagem.veiculo.id, dataHoraLocal: { gte: dataCorte } },
                orderBy: { dataHoraLocal: 'asc' }
            });
            console.log(`  -> ${telemetrias.length} telemetrias na janela`);
            
            for (const pv of viagem.paradasViagem) {
                const b = pv.base;
                if (!b.latitude) continue;
                const raio = b.raioMetros ?? 1500;
                let primeiraEntrada = null;
                
                for (const t of telemetrias) {
                    const dist = calcularDistancia(t.latitude, t.longitude, b.latitude, b.longitude);
                    if (dist <= raio) {
                        if (!primeiraEntrada) primeiraEntrada = t.dataHoraLocal;
                    }
                }
                
                if (primeiraEntrada) {
                    console.log(`  ✅ ${b.nome}: chegou às ${primeiraEntrada}`);
                    await prisma.paradaViagem.update({
                        where: { id: pv.id },
                        data: { dataChegadaEfetiva: primeiraEntrada }
                    });
                } else {
                    // Show closest distance
                    const latest = telemetrias[telemetrias.length - 1];
                    if (latest) {
                        const d = calcularDistancia(latest.latitude, latest.longitude, b.latitude, b.longitude);
                        console.log(`  ⚪ ${b.nome}: mais próximo = ${Math.round(d)}m (raio: ${raio}m)`);
                    }
                }
            }
        }
    }
    
    await prisma.$disconnect();
}

main().catch(console.error);
