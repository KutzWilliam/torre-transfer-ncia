/**
 * CLEAR + REPROCESS: Limpa todos os dados contaminados de dataChegadaEfetiva/dataSaidaEfetiva
 * e re-processa usando a lógica cronológica correta (stop-by-stop, sem contaminação de viagens passadas).
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

async function main() {
    // 1. Limpar todos os dados de chegada/saída das paradas (resetar a verdade)
    await prisma.paradaViagem.updateMany({
        data: { dataChegadaEfetiva: null, dataSaidaEfetiva: null }
    });
    console.log("✅ Dados de chegada/saída limpos em todas as ParadaViagem.");

    // 2. Re-processar todas as viagens ativas com lógica cronológica
    const viagens = await prisma.viagem.findMany({
        where: { status: { in: ['PROGRAMADA', 'EM_ANDAMENTO'] } },
        include: {
            veiculo: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: 'asc' } }
        }
    });

    console.log(`\nRe-processando ${viagens.length} viagens com lógica cronológica...`);

    for (const viagem of viagens) {
        if (viagem.paradasViagem.length === 0) continue;

        const paradas = viagem.paradasViagem;

        // Busca telemetria a partir do início previsto (SEM janela negativa!)
        const dataInicio = viagem.prevInicioReal;
        const telemetrias = await prisma.telemetria.findMany({
            where: { veiculoId: viagem.veiculo.id, dataHoraLocal: { gte: dataInicio } },
            orderBy: { dataHoraLocal: 'asc' }
        });

        if (telemetrias.length === 0) {
            console.log(`  [${viagem.id}] Sem telemetrias desde ${dataInicio.toLocaleDateString('pt-BR')}`);
            continue;
        }

        // Caminhar cronologicamente pelas paradas
        let paradaIdx = 0;
        let dentroDaParada = false;
        let primeiraEntrada = null;
        let ultimaDentro = null;

        const resultados = paradas.map(p => ({ id: p.id, ordem: p.ordem, chegada: null, saida: null }));

        for (const t of telemetrias) {
            if (paradaIdx >= paradas.length) break;

            const parada = paradas[paradaIdx];
            const base = parada.base;

            if (!base.latitude || !base.longitude) { paradaIdx++; continue; }

            const raio = base.raioMetros ?? 5000;
            const d = dist(t.latitude, t.longitude, base.latitude, base.longitude);
            const estaDentro = d <= raio;

            if (estaDentro) {
                if (!dentroDaParada) {
                    dentroDaParada = true;
                    primeiraEntrada = t.dataHoraLocal;
                }
                ultimaDentro = t.dataHoraLocal;
            } else if (dentroDaParada) {
                // Saiu da geofence: gravar resultado para esta parada e avançar
                const ehOrigem = parada.ordem === 0;
                const ehDestino = parada.ordem === paradas.length - 1;
                resultados[paradaIdx].chegada = ehOrigem ? null : primeiraEntrada;
                resultados[paradaIdx].saida = ehDestino ? null : ultimaDentro;
                dentroDaParada = false;
                primeiraEntrada = null;
                ultimaDentro = null;
                paradaIdx++;
            }
        }

        // Se terminou ainda dentro de uma parada
        if (dentroDaParada && paradaIdx < paradas.length) {
            const parada = paradas[paradaIdx];
            const ehOrigem = parada.ordem === 0;
            const ehDestino = parada.ordem === paradas.length - 1;
            resultados[paradaIdx].chegada = ehOrigem ? null : primeiraEntrada;
            resultados[paradaIdx].saida = ehDestino ? null : ultimaDentro;
        }

        // Persistir
        let savedCount = 0;
        for (const res of resultados) {
            if (!res.chegada && !res.saida) continue;
            await prisma.paradaViagem.update({
                where: { id: res.id },
                data: {
                    dataChegadaEfetiva: res.chegada,
                    dataSaidaEfetiva: res.saida,
                }
            });
            savedCount++;
        }

        const paradas_nomes = resultados.filter(r => r.chegada || r.saida).map(r => `Parada ${r.ordem}`);
        console.log(`  [${viagem.id}] ${viagem.veiculo.placa}: salvou ${savedCount} paradas — ${paradas_nomes.join(', ')}`);
    }

    console.log("\n✅ Re-processamento concluído.");
    await prisma.$disconnect();
}

main().catch(console.error);
