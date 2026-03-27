import { db } from "@/server/db";
import { calcularDistanciaGeocerca } from "@/server/utils/geolocalizacao";

/**
 * Processa o histórico GPS de todas as viagens ativas.
 *
 * LÓGICA CRONOLÓGICA (correta):
 * Caminhamos pelos pontos GPS em ordem do tempo.
 * Apenas avançamos para o próximo ponto da rota DEPOIS de sair do anterior.
 * Isso garante que dados de viagens passadas não contaminem a viagem atual.
 */
export async function processarStatusViagens() {
    const viagensAtivas = await db.viagem.findMany({
        where: { status: { in: ["PROGRAMADA", "EM_ANDAMENTO"] } },
        include: {
            veiculo: true,
            baseOrigem: true,
            baseDestino: true,
            paradasViagem: { include: { base: true }, orderBy: { ordem: "asc" } }
        }
    });

    let viagensAtualizadas = 0;

    for (const viagem of viagensAtivas) {
        // Busca telemetria com janela negativa de 6h para capturar saídas antecipadas (igual ao frontend)
        const dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
        const dataFimBase = viagem.dataFimEfetivo ?? viagem.prevFimReal;
        const dataCorteEfim = new Date(dataFimBase.getTime() + 12 * 60 * 60 * 1000);

        const telemetrias = await db.telemetria.findMany({
            where: {
                veiculoId: viagem.veiculo.id,
                dataHoraLocal: {
                    gte: dataCorteInicio,
                    lte: dataCorteEfim
                }
            },
            orderBy: { dataHoraLocal: "asc" }
        });

        if (telemetrias.length === 0) continue;

        // Carrega paradas da viagem
        const paradasDb = await db.paradaViagem.findMany({
            where: { viagemId: viagem.id },
            include: { base: true },
            orderBy: { ordem: 'asc' }
        });

        // Monta as paradas para processamento. Se não houver, faz fallback para Origem (0) e Destino (1)
        const paradas: { id: string; base: { latitude: number | null; longitude: number | null; raioMetros: number | null; } | null; ordem: number; isFake: boolean; }[] =
            paradasDb.length > 0 ? paradasDb.map(p => ({
                id: p.id, base: p.base, ordem: p.ordem, isFake: false
            })) : [
                { id: 'fake_origem', base: viagem.baseOrigem, ordem: 0, isFake: true },
                { id: 'fake_destino', base: viagem.baseDestino, ordem: 1, isFake: true }
            ];

        // Se nem isso conseguir montar com latitude, pula
        if (paradas.length === 0) continue;

        // Estrutura para os resultados
        const resultados: { id: string, chegada: Date | null, saida: Date | null, isFake: boolean }[] =
            paradas.map(p => ({ id: p.id, chegada: null, saida: null, isFake: p.isFake }));

        let paradaIdx = 0;
        let primeiraEntrada: Date | null = null;
        let ultimaDentro: Date | null = null;

        for (const t of telemetrias) {
            if (paradaIdx >= paradas.length) break;

            while (paradaIdx < paradas.length) {
                const checkParada = paradas[paradaIdx]!;
                const checkBase = checkParada.base;
                if (checkBase?.latitude && checkBase?.longitude) {
                    break;
                }
                // Stop has no coordinates, we skip it without arrival/departure
                resultados[paradaIdx] = {
                    id: checkParada.id, isFake: checkParada.isFake,
                    chegada: null,
                    saida: null,
                };
                paradaIdx++;
                primeiraEntrada = null;
                ultimaDentro = null;
            }

            if (paradaIdx >= paradas.length) break;

            const parada = paradas[paradaIdx]!;
            const base = parada.base!;
            const raio = base.raioMetros ?? 5000;
            const dist = calcularDistanciaGeocerca(t.latitude, t.longitude, base.latitude!, base.longitude!);
            const estaDentro = dist <= raio;

            if (estaDentro) {
                if (!primeiraEntrada) primeiraEntrada = t.dataHoraLocal;
                ultimaDentro = t.dataHoraLocal;
            } else {
                // Não está na parada atual!
                // Verifica se entrou na PRÓXIMA parada para fechar a atual ou pulá-la
                if (paradaIdx + 1 < paradas.length) {
                    const proxParada = paradas[paradaIdx + 1]!;
                    const proxBase = proxParada.base;
                    if (proxBase?.latitude && proxBase?.longitude) {
                        const distProx = calcularDistanciaGeocerca(t.latitude, t.longitude, proxBase.latitude, proxBase.longitude);
                        if (distProx <= (proxBase.raioMetros ?? 5000)) {
                            // Entrou na próxima! Fechar atual (mesmo que primeiraEntrada seja null)
                            resultados[paradaIdx] = {
                                id: parada.id, isFake: parada.isFake,
                                chegada: parada.ordem === 0 ? null : primeiraEntrada,
                                saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro,
                            };
                            paradaIdx++;
                            primeiraEntrada = t.dataHoraLocal;
                            ultimaDentro = t.dataHoraLocal;
                        }
                    } else if (primeiraEntrada) {
                        // Próxima não tem coord, mas ele já tinha entrado na atual e saiu.
                        resultados[paradaIdx] = {
                            id: parada.id, isFake: parada.isFake,
                            chegada: parada.ordem === 0 ? null : primeiraEntrada,
                            saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro,
                        };
                        paradaIdx++;
                        primeiraEntrada = null;
                        ultimaDentro = null;
                    }
                }
            }
        }

        // Se terminou com uma parada em andamento
        if (primeiraEntrada && paradaIdx < paradas.length) {
            const parada = paradas[paradaIdx]!;
            resultados[paradaIdx] = {
                id: parada.id, isFake: parada.isFake,
                chegada: parada.ordem === 0 ? null : primeiraEntrada,
                saida: parada.ordem === paradas.length - 1 ? null : ultimaDentro,
            };
        }

        // Persistir resultados: só atualizar se for registro de banco verdadeiro
        for (const res of resultados) {
            if (res.isFake) continue;
            if (!res.chegada && !res.saida) continue;
            await db.paradaViagem.update({
                where: { id: res.id },
                data: {
                    dataChegadaEfetiva: res.chegada ?? undefined,
                    dataSaidaEfetiva: res.saida ?? undefined,
                }
            });
        }

        // Verificar se chegou ao destino final (Status FINALIZADA)
        const destinoResult = resultados[paradas.length - 1];
        if (destinoResult?.chegada && (!viagem.dataFimEfetivo || viagem.status !== "FINALIZADA")) {
            const horaChegadaReal = viagem.dataFimEfetivo ?? destinoResult.chegada;
            const horaChegadaPrevista = viagem.prevFimReal;
            let novaPrevisaoSaida: Date | null = viagem.novaPrevisaoSaida;

            if (horaChegadaReal > horaChegadaPrevista && !viagem.dataFimEfetivo) {
                const atraso = horaChegadaReal.getTime() - horaChegadaPrevista.getTime();
                novaPrevisaoSaida = new Date(horaChegadaReal.getTime() + atraso);
            }

            await db.viagem.update({
                where: { id: viagem.id },
                data: { status: "FINALIZADA", dataFimEfetivo: horaChegadaReal, novaPrevisaoSaida }
            });
            viagensAtualizadas++;
        }

        // Se passou pela origem e ainda está programada, marcar como EM_ANDAMENTO
        const origemResult = resultados[0];
        if (origemResult?.saida && viagem.status === "PROGRAMADA") {
            await db.viagem.update({
                where: { id: viagem.id },
                data: { status: "EM_ANDAMENTO", dataInicioEfetivo: origemResult.saida }
            });
            viagensAtualizadas++;
        }
    }

    return viagensAtualizadas;
}