/**
 * Diagnóstico: mostra os pontos GPS do BAR7I87 com distâncias para cada cidade
 */
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

function dist(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const cidades = {
    CASCAVEL:   { lat: -24.9578, lon: -53.4596 },
    MEDIANEIRA: { lat: -25.2945, lon: -54.0944 },
    FOZ:        { lat: -25.5478, lon: -54.5882 },
};

async function main() {
    const veiculo = await prisma.veiculo.findUnique({ where: { placa: 'BAR7I87' } });
    if (!veiculo) { console.log('BAR7I87 nao encontrado'); await prisma.$disconnect(); return; }

    // Window: 20/03 08:00 to 20/03 12:00
    const inicio = new Date('2026-03-20T08:00:00-03:00');
    const fim = new Date('2026-03-20T12:00:00-03:00');

    const tels = await prisma.telemetria.findMany({
        where: { veiculoId: veiculo.id, dataHoraLocal: { gte: inicio, lte: fim } },
        orderBy: { dataHoraLocal: 'asc' }
    });

    console.log(`Telemetrias BAR7I87 de 08:00 a 12:00 (20/03): ${tels.length} pontos`);
    for (const t of tels) {
        const dCas = Math.round(dist(t.latitude, t.longitude, cidades.CASCAVEL.lat, cidades.CASCAVEL.lon));
        const dMed = Math.round(dist(t.latitude, t.longitude, cidades.MEDIANEIRA.lat, cidades.MEDIANEIRA.lon));
        const dFoz = Math.round(dist(t.latitude, t.longitude, cidades.FOZ.lat, cidades.FOZ.lon));
        const hora = t.dataHoraLocal.toLocaleTimeString('pt-BR');
        const inCas = dCas <= 5000 ? '✅CAS' : '';
        const inMed = dMed <= 5000 ? '✅MED' : '';
        const inFoz = dFoz <= 5000 ? '✅FOZ' : '';
        console.log(`${hora} lat=${t.latitude.toFixed(4)} lon=${t.longitude.toFixed(4)} | CAS:${dCas}m MED:${dMed}m FOZ:${dFoz}m ${inCas}${inMed}${inFoz}`);
    }

    // Also check dataInicioEfetivo/dataFimEfetivo on the viagem
    const v = await prisma.viagem.findUnique({ where: { id: '37669539' } });
    console.log('\nViagem 37669539:');
    console.log('  dataInicioEfetivo:', v?.dataInicioEfetivo);
    console.log('  dataFimEfetivo:', v?.dataFimEfetivo);

    await prisma.$disconnect();
}
main().catch(console.error);
