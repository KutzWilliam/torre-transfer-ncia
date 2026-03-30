import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { normalizeString, normalizeCityName } from "@/server/utils/stringUtils";
import { getPlacaAtivaSascar } from "@/server/utils/sascarUtils";
import { calcularDistanciaGeocerca } from "@/server/utils/geolocalizacao";

// Definimos o formato exato que esperamos receber do frontend (planilha convertida)
const viagemSchema = z.object({
    numeroViagem: z.string(),
    motorista: z.string(),
    placa: z.string(),
    placaMob: z.string().default(""),
    reboque: z.string().default(""),
    origem: z.string(),
    destino: z.string(),
    rotaDescricao: z.string(),
    prevInicio: z.string(), // Receberemos como string ISO para facilitar
    prevFim: z.string(),
    status: z.enum(["PROGRAMADA", "EM_ANDAMENTO", "FINALIZADA", "CANCELADA"]).default("PROGRAMADA"),
    // Campos reais do Excel (opcionais)
    dataInicioEfetivo: z.string().optional().nullable(),
    dataFimEfetivo: z.string().optional().nullable(),
});


/**
 * Calcula a data absoluta de uma parada com base na data do DIA da viagem e um horário ("HH:MM").
 * 
 * @param dataBase        Data da viagem (dia de referência — usa apenas o dia, não o horário)
 * @param dataReferencia  Última data calculada (parada anterior) — usada SÓ para detectar cruzamento de meia-noite
 * @param horarioStr      Horário no formato "HH:MM"
 */
const calcularDataAbsoluta = (dataBase: Date, dataReferencia: Date, horarioStr: string | null) => {
    if (!horarioStr) return null;
    const [horas = 0, minutos = 0] = horarioStr.split(':').map(Number);

    // Anchora no DIA (meia-noite) do início da viagem para evitar salto indevido de dia
    const novaData = new Date(dataBase);
    novaData.setHours(0, 0, 0, 0);         // zera para meia-noite do dia
    novaData.setHours(horas, minutos, 0, 0); // aplica o horário

    // Só rola para o dia seguinte se o horário calculado for ANTERIOR à última parada (cruzou meia-noite)
    if (novaData.getTime() < dataReferencia.getTime()) {
        novaData.setDate(novaData.getDate() + 1);
    }
    return novaData;
};

export const viagemRouter = createTRPCRouter({
    uploadPlanilha: protectedProcedure
        .input(z.array(viagemSchema))
        .mutation(async ({ ctx, input }) => {
            let viagensCriadas = 0;
            let viagensAtualizadas = 0;

            // Pré-carrega todas as rotas em memória para busca fuzzy rápida e flexível
            const rotasCadastradas = await ctx.db.rotaPadrao.findMany({
                include: { paradas: { orderBy: { ordem: "asc" } } }
            });

            for (const item of input) {
                // 1. Decidir qual placa usar consultado a base da Sascar (Placa Prog, Placa Mobile ou Reboque)
                const placaSascar = await getPlacaAtivaSascar(item.placa, item.placaMob, item.reboque);

                // 2. Bases Origem e Destino
                const origemNorm = normalizeCityName(item.origem);
                const baseOrigem = await ctx.db.base.upsert({
                    where: { nome: origemNorm }, update: {}, create: { nome: origemNorm, cidade: origemNorm },
                });

                const destinoNorm = normalizeCityName(item.destino);
                const baseDestino = await ctx.db.base.upsert({
                    where: { nome: destinoNorm }, update: {}, create: { nome: destinoNorm, cidade: destinoNorm },
                });

                // 3. Veículo (Agora salvo com a placa correta garantida do Sascar)
                const veiculo = await ctx.db.veiculo.upsert({
                    where: { placa: placaSascar }, update: {}, create: { id: `temp_${placaSascar}`, placa: placaSascar, descricao: "Importado via Planilha" },
                });

                // 4. Procurar a Rota Matriz (com tolerância a acentos, maiúsculas e espaços irregulares)
                const rotaNomeDescartavel = normalizeString(item.rotaDescricao).replace(/\s+/g, ' ').trim();
                const rotaPadrao = rotasCadastradas.find(r => 
                    normalizeString(r.nome).replace(/\s+/g, ' ').trim() === rotaNomeDescartavel
                );

                // 5. Upsert da Viagem
                const viagem = await ctx.db.viagem.upsert({
                    where: { id: item.numeroViagem },
                    update: {
                        status: item.status, motorista: item.motorista, veiculoId: veiculo.id,
                        prevInicioReal: new Date(item.prevInicio), prevFimReal: new Date(item.prevFim),
                        rotaPadraoId: rotaPadrao?.id,
                        // Gravar horários reais vindos do Excel (quando disponíveis)
                        dataInicioEfetivo: item.dataInicioEfetivo ? new Date(item.dataInicioEfetivo) : undefined,
                        dataFimEfetivo: item.dataFimEfetivo ? new Date(item.dataFimEfetivo) : undefined,
                    },
                    create: {
                        id: item.numeroViagem, motorista: item.motorista, rotaDescricao: item.rotaDescricao,
                        veiculoId: veiculo.id, baseOrigemId: baseOrigem.id, baseDestinoId: baseDestino.id,
                        prevInicioReal: new Date(item.prevInicio), prevFimReal: new Date(item.prevFim),
                        status: item.status, rotaPadraoId: rotaPadrao?.id,
                        dataInicioEfetivo: item.dataInicioEfetivo ? new Date(item.dataInicioEfetivo) : undefined,
                        dataFimEfetivo: item.dataFimEfetivo ? new Date(item.dataFimEfetivo) : undefined,
                    },
                });

                // 6. Clonar e calcular os horários da Matriz
                if (rotaPadrao) {
                    await ctx.db.paradaViagem.deleteMany({ where: { viagemId: viagem.id } });

                    // dataBase = meia-noite do dia da viagem (ancora os horários ao dia correto)
                    const dataBase = new Date(item.prevInicio);
                    dataBase.setHours(0, 0, 0, 0);
                    let dataReferencia = new Date(dataBase);

                    for (const parada of rotaPadrao.paradas) {
                        const prevChegadaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevChegada);
                        if (prevChegadaCalc) dataReferencia = prevChegadaCalc;

                        const prevSaidaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevSaida);
                        if (prevSaidaCalc) dataReferencia = prevSaidaCalc;

                        // Última parada: garantir que prevChegada existe (usa prevFimReal como fallback)
                        const ehUltimaParada = parada.ordem === rotaPadrao.paradas.length - 1;
                        const prevChegadaFinal = (!prevChegadaCalc && ehUltimaParada) ? new Date(item.prevFim) : prevChegadaCalc;

                        await ctx.db.paradaViagem.create({
                            data: {
                                viagemId: viagem.id, baseId: parada.baseId, ordem: parada.ordem,
                                prevChegada: prevChegadaFinal, prevSaida: prevSaidaCalc
                            }
                        });
                    }
                }

                if (viagem.createdAt.getTime() === viagem.updatedAt.getTime()) viagensCriadas++;
                else viagensAtualizadas++;
            }

            return { success: true, message: `Planilha processada! ${viagensCriadas} criadas e ${viagensAtualizadas} atualizadas com rotas completas.` };
        }),

    listar: protectedProcedure.query(async ({ ctx }) => {
        const viagens = await ctx.db.viagem.findMany({
            orderBy: { prevInicioReal: "desc" }, // Mostra as mais recentes primeiro
            include: {
                veiculo: true,
                baseOrigem: true,
                baseDestino: true,
            },
        });

        return viagens;
    }),
    obterPorId: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const viagem = await ctx.db.viagem.findUnique({
                where: { id: input },
                include: {
                    veiculo: true,
                    baseOrigem: true,
                    baseDestino: true,
                    justificativas: { include: { usuario: true }, orderBy: { createdAt: "desc" } },
                    // Trazemos as paradas exatas da viagem já com a base associada!
                    paradasViagem: {
                        include: { base: true },
                        orderBy: { ordem: "asc" }
                    }
                },
            });

            if (!viagem) throw new Error("Viagem não encontrada");

            // Limites da janela de telemetria baseados no status da viagem
            let dataCorteInicio = new Date(viagem.prevInicioReal.getTime() - 6 * 60 * 60 * 1000);
            let dataCorteEfim = new Date((viagem.dataFimEfetivo ?? viagem.prevFimReal).getTime() + 12 * 60 * 60 * 1000);

            if (viagem.status === "FINALIZADA" && viagem.dataFimEfetivo) {
                // Para viagens finalizadas, corta EXATAMENTE (margem gráfica de 5min) no tempo de chegada.
                // Isso evita puxar a rota que o caminhão fez *depois* da viagem, poluindo o mapa final.
                dataCorteEfim = new Date(viagem.dataFimEfetivo.getTime() + 5 * 60000);
                
                if (viagem.dataInicioEfetivo) {
                    // Usa a hora real de saída para limpar o lixo de garagem (margem -5min)
                    dataCorteInicio = new Date(viagem.dataInicioEfetivo.getTime() - 5 * 60000);
                }
            } else if (viagem.dataInicioEfetivo) {
                // Viagens ativas mas que já saíram, tira o lixo pré-viagem usando o tempo de saída real
                dataCorteInicio = new Date(viagem.dataInicioEfetivo.getTime() - 5 * 60000);
            }

            const telemetrias = await ctx.db.telemetria.findMany({
                where: {
                    veiculoId: viagem.veiculo.id,
                    dataHoraLocal: {
                        gte: dataCorteInicio,
                        lte: dataCorteEfim,  // Limite superior evita dados de novas viagens do mesmo veículo
                    },
                },
                orderBy: { dataHoraLocal: "asc" },
            });

            // Mapear para o formato que o frontend já conhece
            // Incluímos os horários efetivos PERSISTIDOS pelo backend (processarStatusViagens)
            const paradasRota = viagem.paradasViagem.map((pv) => ({
                nome: pv.base.nome,
                latitude: pv.base.latitude,
                longitude: pv.base.longitude,
                raioMetros: pv.base.raioMetros,
                prevChegada: pv.prevChegada,
                prevSaida: pv.prevSaida,
                // Campos persistidos pelo geofence do backend — verdade definitiva
                dataChegadaEfetiva: pv.dataChegadaEfetiva,
                dataSaidaEfetiva: pv.dataSaidaEfetiva,
            }));

            // Se a viagem não tiver a matriz vinculada, faz fallback para origem e destino básicos
            if (paradasRota.length === 0) {
                paradasRota.push({ nome: viagem.baseOrigem.nome, latitude: viagem.baseOrigem.latitude, longitude: viagem.baseOrigem.longitude, raioMetros: viagem.baseOrigem.raioMetros, prevChegada: null, prevSaida: viagem.prevInicioReal, dataChegadaEfetiva: null, dataSaidaEfetiva: null });
                paradasRota.push({ nome: viagem.baseDestino.nome, latitude: viagem.baseDestino.latitude, longitude: viagem.baseDestino.longitude, raioMetros: viagem.baseDestino.raioMetros, prevChegada: viagem.prevFimReal, prevSaida: null, dataChegadaEfetiva: viagem.dataFimEfetivo, dataSaidaEfetiva: null });
            }

            return { ...viagem, telemetrias, paradasRota };
        }),

    // ====================================================================
    //  DASHBOARD OPERACIONAL - Gestão à Vista
    // ====================================================================

    listarDoDia: protectedProcedure.query(async ({ ctx }) => {
        // Janela de hoje: 00:00 até 23:59 no fuso horário local (GMT-3)
        const agora = new Date();
        const inicioDia = new Date(agora);
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date(agora);
        fimDia.setHours(23, 59, 59, 999);

        const viagens = await ctx.db.viagem.findMany({
            where: {
                prevInicioReal: { gte: inicioDia, lte: fimDia },
            },
            orderBy: { prevInicioReal: "asc" },
            include: {
                veiculo: true,
                baseOrigem: true,
                baseDestino: true,
                paradasViagem: {
                    include: { base: true },
                    orderBy: { ordem: "asc" },
                },
            },
        });

        // Para cada viagem, pegar a ÚLTIMA telemetria do veículo
        const result = await Promise.all(
            viagens.map(async (v) => {
                const ultimaTelemetria = await ctx.db.telemetria.findFirst({
                    where: { veiculoId: v.veiculo.id },
                    orderBy: { dataHoraLocal: "desc" },
                });
                return { ...v, ultimaTelemetria };
            })
        );

        return result;
    }),

    obterDashboard: protectedProcedure
        .input(z.object({ horasFiltro: z.enum(["24", "48"]).default("48").optional() }).optional())
        .query(async ({ ctx, input }) => {
        const agora = new Date();
        const horasOffset = parseInt(input?.horasFiltro ?? "48");
        const inicioFiltro = new Date(agora.getTime() - horasOffset * 60 * 60 * 1000);
        const fimJanela = new Date(agora.getTime() + 12 * 60 * 60 * 1000); // +12h para pegar viagens que ainda vão iniciar

        const viagens = await ctx.db.viagem.findMany({
            where: {
                prevInicioReal: { gte: inicioFiltro, lte: fimJanela },
            },
            orderBy: { prevInicioReal: "asc" },
            include: {
                veiculo: true,
                baseOrigem: true,
                baseDestino: true,
                paradasViagem: {
                    include: { base: true },
                    orderBy: { ordem: "asc" },
                },
            },
        });

        const result = await Promise.all(
            viagens.map(async (v) => {

                // Auto-correção instantânea para a UI: 
                // Se a viagem já possui o horário final, ela está finalizada independentemente do ERP.
                if (v.dataFimEfetivo && v.status !== "FINALIZADA" && v.status !== "CANCELADA") {
                    v.status = "FINALIZADA";
                }

                // 1. Última telemetria
                const ultimaTelemetria = await ctx.db.telemetria.findFirst({
                    where: { veiculoId: v.veiculo.id },
                    orderBy: { dataHoraLocal: "desc" },
                });

                // 2. Atraso na saída (em minutos)
                let atrasoSaidaMinutos: number | null = null;
                if (v.dataInicioEfetivo) {
                    atrasoSaidaMinutos = Math.round(
                        (v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000
                    );
                }

                // 3. Qual parada atual (index da próxima parada ainda não concluída)
                const paradas = v.paradasViagem;
                let paradaAtualIndex = 0;
                for (let i = 0; i < paradas.length; i++) {
                    const p = paradas[i]!;
                    if (p.dataSaidaEfetiva || (p.dataChegadaEfetiva && i === paradas.length - 1)) {
                        paradaAtualIndex = i + 1;
                    } else {
                        break;
                    }
                }

                // 4. Previsão preditiva para o PRÓXIMO destino (intermediário ou final)
                let previsaoChegadaCalculada: Date | null = null;
                let semSinalGPS = false;
                
                // Determina o próximo alvo geográfico do caminhão
                let proximaParadaNome = v.baseDestino.nome;
                let latDestino = v.baseDestino.latitude;
                let lngDestino = v.baseDestino.longitude;
                let previsaoBaseRef = v.prevFimReal;

                if (paradaAtualIndex < paradas.length) {
                    const proxParada = paradas[paradaAtualIndex]!;
                    proximaParadaNome = proxParada.base.nome;
                    latDestino = proxParada.base.latitude;
                    lngDestino = proxParada.base.longitude;
                    previsaoBaseRef = proxParada.prevChegada ?? proxParada.prevSaida ?? v.prevFimReal;
                }

                if (ultimaTelemetria) {
                    const minSemSinal = (agora.getTime() - ultimaTelemetria.dataHoraLocal.getTime()) / 60000;
                    semSinalGPS = minSemSinal > 30;

                    if (!semSinalGPS && v.status === "EM_ANDAMENTO") {
                        if (latDestino && lngDestino) {
                            const distanciaMetros = calcularDistanciaGeocerca(
                                ultimaTelemetria.latitude,
                                ultimaTelemetria.longitude,
                                latDestino,
                                lngDestino
                            );
                            const velocidadeKmh = (ultimaTelemetria.velocidade ?? 0) > 10
                                ? (ultimaTelemetria.velocidade ?? 60)
                                : 60; // velocidade média padrão se parado
                            const tempRestanteMs = (distanciaMetros / 1000 / velocidadeKmh) * 3600 * 1000;
                            previsaoChegadaCalculada = new Date(agora.getTime() + tempRestanteMs);
                        }
                    }
                }

                // 5. Atraso na chegada prevista vs calculada (baseado no próximo ponto da rota)
                let atrasoChegadaMinutos: number | null = null;
                if (previsaoChegadaCalculada && previsaoBaseRef) {
                    atrasoChegadaMinutos = Math.round(
                        (previsaoChegadaCalculada.getTime() - previsaoBaseRef.getTime()) / 60000
                    );
                }

                // 6. Nível de alerta
                type NivelAlerta = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO" | "SEM_SINAL";
                let nivelAlerta: NivelAlerta = "PONTUAL";

                if (v.status === "CANCELADA") {
                    nivelAlerta = "PONTUAL"; // canceladas não geram alerta
                } else if (v.status === "FINALIZADA") {
                    // Para viagens finalizadas, calcula o atraso real com base no horário efetivo de chegada
                    if (v.dataFimEfetivo && v.prevFimReal) {
                        const atrasoReal = Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000);
                        if (atrasoReal >= 60) nivelAlerta = "CRITICO";
                        else if (atrasoReal >= 30) nivelAlerta = "ATRASADO";
                        else if (atrasoReal >= 10) nivelAlerta = "ATENCAO";
                        else nivelAlerta = "PONTUAL";
                    } else {
                        nivelAlerta = "PONTUAL";
                    }
                } else if (semSinalGPS && v.status === "EM_ANDAMENTO") {
                    nivelAlerta = "SEM_SINAL";
                } else {
                    const atrasoRef = atrasoChegadaMinutos ?? atrasoSaidaMinutos ?? 0;
                    if (atrasoRef >= 60) nivelAlerta = "CRITICO";
                    else if (atrasoRef >= 30) nivelAlerta = "ATRASADO";
                    else if (atrasoRef >= 10) nivelAlerta = "ATENCAO";
                    else nivelAlerta = "PONTUAL";
                }

                // 7. Total de paradas concluídas
                const paradasConcluidas = paradas.filter(
                    (p) => p.dataChegadaEfetiva || p.dataSaidaEfetiva
                ).length;

                return {
                    ...v,
                    ultimaTelemetria,
                    atrasoSaidaMinutos,
                    paradaAtualIndex,
                    paradasConcluidas,
                    totalParadas: paradas.length,
                    proximaParadaNome,       // Adicionado para o frontend saber o alvo do ETA
                    previsaoBaseRef,         // Horário original da próxima parada
                    previsaoChegadaCalculada,
                    atrasoChegadaMinutos,
                    nivelAlerta,
                    semSinalGPS,
                };
            })
        );

        return result;
    }),

    listarAtrasosOrigem: protectedProcedure.query(async ({ ctx }) => {
        // Busca todas as viagens finalizadas que já possuem horário efetivo de chegada ao destino
        const viagens = await ctx.db.viagem.findMany({
            where: {
                dataFimEfetivo: { not: null }, // Chegou ao destino
            },
            include: {
                veiculo: true,
                baseOrigem: true,
                baseDestino: true,
            },
            orderBy: { prevInicioReal: "desc" }
        });

        const atrasos = [];

        for (const v of viagens) {
            if (!v.dataFimEfetivo || !v.prevFimReal) continue;

            const prev = v.prevFimReal.getTime();
            const real = v.dataFimEfetivo.getTime();
            
            const diffMinutos = Math.floor((real - prev) / 60000);
            
            // Só considera viagens que chegaram ATRASADAS no destino (> 0 min)
            if (diffMinutos > 0) {
                atrasos.push({
                    id: v.id,
                    status: v.status,
                    motorista: v.motorista,
                    veiculo: v.veiculo.placa,
                    origem: v.baseOrigem.cidade,
                    destino: v.baseDestino.cidade,
                    prevChegadaOrigem: v.prevFimReal,        // previsão de chegada ao destino
                    chegadaRealOrigem: v.dataFimEfetivo,     // chegada real ao destino
                    atrasoMinutos: diffMinutos,
                    dataRef: v.prevInicioReal
                });
            }
        }
        
        return atrasos;
    }),

    // ====================================================================
    //  ANALYTICS GERENCIAL - Dashboard de Análise Completo
    // ====================================================================
    obterAnalytics: protectedProcedure
        .input(z.object({
            dataInicio: z.string(), // ISO date string "yyyy-MM-dd"
            dataFim: z.string(),    // ISO date string "yyyy-MM-dd"
            baseOrigemNome: z.string().optional(), // undefined = todas
        }))
        .query(async ({ ctx, input }) => {
            const inicio = new Date(input.dataInicio);
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date(input.dataFim);
            fim.setHours(23, 59, 59, 999);

            const whereClause: Record<string, unknown> = {
                status: "FINALIZADA",
                dataFimEfetivo: { not: null },
                prevInicioReal: { gte: inicio, lte: fim },
            };

            if (input.baseOrigemNome) {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            const viagens = await ctx.db.viagem.findMany({
                where: whereClause,
                include: {
                    veiculo: true,
                    baseOrigem: true,
                    baseDestino: true,
                    paradasViagem: {
                        include: { base: true },
                        orderBy: { ordem: "asc" },
                    },
                },
                orderBy: { prevInicioReal: "desc" },
            });

            // Buscar todas as bases de origem únicas para o filtro (sem restrição de período)
            const todasBases = await ctx.db.base.findMany({
                where: { viagensOrigem: { some: {} } },
                select: { nome: true, cidade: true },
                orderBy: { nome: "asc" },
            });

            // Enriquecer cada viagem com métricas calculadas
            type NivelAlerta = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO";
            const viagensEnriquecidas = viagens.map((v) => {
                const atrasoChegadaMin = v.dataFimEfetivo && v.prevFimReal
                    ? Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000)
                    : 0;

                const atrasoSaidaMin = v.dataInicioEfetivo && v.prevInicioReal
                    ? Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000)
                    : null;

                const duracaoPrevistaMin = Math.round(
                    (v.prevFimReal.getTime() - v.prevInicioReal.getTime()) / 60000
                );
                const duracaoRealMin = v.dataFimEfetivo && v.dataInicioEfetivo
                    ? Math.round((v.dataFimEfetivo.getTime() - v.dataInicioEfetivo.getTime()) / 60000)
                    : null;

                let nivelAlerta: NivelAlerta = "PONTUAL";
                if (atrasoChegadaMin >= 60) nivelAlerta = "CRITICO";
                else if (atrasoChegadaMin >= 30) nivelAlerta = "ATRASADO";
                else if (atrasoChegadaMin >= 10) nivelAlerta = "ATENCAO";

                return {
                    id: v.id,
                    motorista: v.motorista,
                    placa: v.veiculo.placa,
                    rotaDescricao: v.rotaDescricao,
                    baseOrigemNome: v.baseOrigem.nome,
                    baseDestinoNome: v.baseDestino.nome,
                    prevInicio: v.prevInicioReal,
                    prevFim: v.prevFimReal,
                    dataInicioEfetivo: v.dataInicioEfetivo,
                    dataFimEfetivo: v.dataFimEfetivo,
                    atrasoChegadaMin,
                    atrasoSaidaMin,
                    duracaoPrevistaMin,
                    duracaoRealMin,
                    nivelAlerta,
                };
            });

            // KPIs globais
            const total = viagensEnriquecidas.length;
            const atrasadas = viagensEnriquecidas.filter(v => v.atrasoChegadaMin > 0).length;
            const criticas = viagensEnriquecidas.filter(v => v.nivelAlerta === "CRITICO").length;
            const pontualidade = total > 0 ? Math.round(((total - atrasadas) / total) * 100) : 100;
            const somaAtrasos = viagensEnriquecidas.reduce((acc, v) => acc + Math.max(v.atrasoChegadaMin, 0), 0);
            const mediaAtraso = atrasadas > 0 ? Math.round(somaAtrasos / atrasadas) : 0;

            // Distribuição por nível
            const distribuicao = {
                PONTUAL:  viagensEnriquecidas.filter(v => v.nivelAlerta === "PONTUAL").length,
                ATENCAO:  viagensEnriquecidas.filter(v => v.nivelAlerta === "ATENCAO").length,
                ATRASADO: viagensEnriquecidas.filter(v => v.nivelAlerta === "ATRASADO").length,
                CRITICO:  viagensEnriquecidas.filter(v => v.nivelAlerta === "CRITICO").length,
            };

            // Ranking de atrasos por rota (top 10)
            const rotaMap = new Map<string, { totalAtraso: number; count: number; atrasadas: number }>();
            for (const v of viagensEnriquecidas) {
                const rota = v.rotaDescricao;
                const existing = rotaMap.get(rota) ?? { totalAtraso: 0, count: 0, atrasadas: 0 };
                existing.count++;
                existing.totalAtraso += Math.max(v.atrasoChegadaMin, 0);
                if (v.atrasoChegadaMin > 0) existing.atrasadas++;
                rotaMap.set(rota, existing);
            }
            const rankingRotas = Array.from(rotaMap.entries())
                .map(([rota, stats]) => ({
                    rota,
                    totalViagens: stats.count,
                    viagensAtrasadas: stats.atrasadas,
                    mediaAtrasoMin: stats.atrasadas > 0 ? Math.round(stats.totalAtraso / stats.atrasadas) : 0,
                    taxaAtraso: Math.round((stats.atrasadas / stats.count) * 100),
                }))
                .sort((a, b) => b.mediaAtrasoMin - a.mediaAtrasoMin)
                .slice(0, 10);

            return {
                viagens: viagensEnriquecidas,
                kpis: { total, atrasadas, criticas, pontualidade, mediaAtraso, somaAtrasos },
                distribuicao,
                rankingRotas,
                basesDisponiveis: todasBases,
            };
        }),
});