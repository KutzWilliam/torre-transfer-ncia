/**
 * Backfill prevChegada para paradas de destino (ordem = max) onde está null.
 * Usa prevSaida da parada anterior como base e adiciona tempo do percurso estimado,
 * OU usa diretamente prevFimReal da viagem.
 */
require('dotenv').config();
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function main() {
    // Get all ParadaViagem where it's the last stop and prevChegada is null
    const viagens = await prisma.viagem.findMany({
        include: {
            paradasViagem: { orderBy: { ordem: 'asc' } }
        }
    });

    let fixed = 0;
    for (const viagem of viagens) {
        if (viagem.paradasViagem.length === 0) continue;

        // Sort and find last parada
        const paradas = [...viagem.paradasViagem].sort((a, b) => a.ordem - b.ordem);
        const lastParada = paradas[paradas.length - 1];

        if (!lastParada.prevChegada) {
            // Use prevFimReal from the viagem as the expected arrival at destination
            if (viagem.prevFimReal) {
                await prisma.paradaViagem.update({
                    where: { id: lastParada.id },
                    data: { prevChegada: viagem.prevFimReal }
                });
                console.log(`Fixed destination prevChegada for viagem ${viagem.id}: ${viagem.prevFimReal}`);
                fixed++;
            }
        }
    }

    console.log(`\n✅ Fixed ${fixed} destinations.`);
    await prisma.$disconnect();
}

main().catch(console.error);
