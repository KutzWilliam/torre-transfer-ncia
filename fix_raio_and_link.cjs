/**
 * Aumenta o raio de todas as bases para 5km para cobrir 
 * caminhões que passam pela cidade mas não necessariamente pelo centro.
 * E linka as viagens sem RotaPadrao tentando casar pela rotaDescricao.
 */
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

const normalizeString = (str) => {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
};

async function main() {
    // 1. Aumentar raio para 5km em todas as bases
    const updated = await prisma.base.updateMany({
        where: { raioMetros: { lte: 1500 } },
        data: { raioMetros: 5000 }
    });
    console.log(`✅ Raio atualizado para 5000m em ${updated.count} bases.`);

    // 2. Tentar re-linkar viagens sem paradas
    const semParadas = await prisma.viagem.findMany({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            paradasViagem: true,
        }
    });

    const viagemsemParadas = semParadas.filter(v => v.paradasViagem.length === 0 && v.rotaDescricao);
    console.log(`\nViagens sem paradas: ${viagemsemParadas.length}. Tentando re-linkar...`);

    const todasRotas = await prisma.rotaPadrao.findMany({
        include: { paradas: { orderBy: { ordem: 'asc' }, include: { base: true } } }
    });

    let linked = 0;
    for (const viagem of viagemsemParadas) {
        const descNorm = normalizeString(viagem.rotaDescricao);
        const rota = todasRotas.find(r => normalizeString(r.nome) === descNorm);
        
        if (!rota) continue;

        const dataRef = new Date(viagem.prevInicioReal);
        let dataReferencia = dataRef;

        for (const parada of rota.paradas) {
            const parseTime = (t) => {
                if (!t) return null;
                const [h, m] = t.split(':').map(Number);
                const d = new Date(dataReferencia);
                d.setHours(h, m, 0, 0);
                if (d < dataReferencia) d.setDate(d.getDate() + 1);
                return d;
            };

            const prevChegada = parseTime(parada.prevChegada);
            const prevSaida = parseTime(parada.prevSaida);
            if (prevChegada) dataReferencia = prevChegada;
            if (prevSaida) dataReferencia = prevSaida;

            await prisma.paradaViagem.create({
                data: {
                    viagemId: viagem.id,
                    baseId: parada.baseId,
                    ordem: parada.ordem,
                    prevChegada: prevChegada,
                    prevSaida: prevSaida,
                }
            });
        }

        await prisma.viagem.update({
            where: { id: viagem.id },
            data: { rotaPadraoId: rota.id }
        });
        console.log(`  ✅ Linkada: ${viagem.rotaDescricao}`);
        linked++;
    }

    console.log(`\n✅ Concluído. ${linked} viagens re-linkadas.`);
    await prisma.$disconnect();
}

main().catch(console.error);
