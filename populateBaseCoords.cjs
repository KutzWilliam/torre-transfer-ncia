/**
 * Script one-shot para preencher as coordenadas (latitude/longitude) de todas as Bases
 * usando a API gratuita do OpenStreetMap Nominatim.
 * Executa: node populateBaseCoords.cjs
 */
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getCoords(cityName) {
    // O Nominatim pede User-Agent e respeita 1 req/s
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName + ', Brasil')}&format=json&limit=1&countrycodes=br`;
    const res = await fetch(url, { headers: { 'User-Agent': 'TorreTransferencia/1.0' } });
    const json = await res.json();
    if (json.length === 0) return null;
    return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) };
}

async function main() {
    const bases = await prisma.base.findMany({
        where: {
            AND: [
                { latitude: null },
                { nome: { not: 'DESCONHECIDA' } }
            ]
        }
    });

    console.log(`Encontrei ${bases.length} bases sem coordenadas. Buscando...`);

    for (const base of bases) {
        try {
            const coords = await getCoords(base.nome);
            if (coords) {
                await prisma.base.update({
                    where: { id: base.id },
                    data: {
                        latitude: coords.lat,
                        longitude: coords.lon,
                        raioMetros: base.raioMetros ?? 1500 // 1500m de raio padrão para cidades
                    }
                });
                console.log(`✅ ${base.nome}: ${coords.lat}, ${coords.lon}`);
            } else {
                console.log(`❌ Sem resultado para: ${base.nome}`);
            }
        } catch (e) {
            console.log(`⚠️  Erro em ${base.nome}:`, e.message);
        }
        // Nominatim exige no máximo 1 req/s
        await sleep(1100);
    }

    console.log('\nConcluído!');
    await prisma.$disconnect();
}

main().catch(console.error);
