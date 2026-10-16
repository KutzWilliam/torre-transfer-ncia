import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { normalizeString, normalizeCityName } from "@/server/utils/stringUtils";
import { getPlacaAtivaSascar } from "@/server/utils/sascarUtils";
import { calcularDistanciaGeocerca } from "@/server/utils/geolocalizacao";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, parse } from "date-fns";

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
            const inicioLote = Date.now();
            console.log(`[UPLOAD-BACKEND] 🚀 Iniciando processamento de lote com ${input.length} viagens...`);

            // Limite de segurança de 15 segundos para queries deste lote (evita travamentos infinitos por locks)
            try {
                await ctx.db.$executeRawUnsafe(`SET statement_timeout = '15000'`);
            } catch (e) {
                console.warn("[UPLOAD-BACKEND] Aviso ao configurar statement_timeout:", e);
            }

            let viagensCriadas = 0;
            let viagensAtualizadas = 0;

            // 1. Pré-carrega rotas, bases e veículos existentes em memória para reduzir round-trips ao banco
            const [rotasCadastradas, todasBases, todosVeiculos] = await Promise.all([
                ctx.db.rotaPadrao.findMany({
                    include: { paradas: { orderBy: { ordem: "asc" } } }
                }),
                ctx.db.base.findMany(),
                ctx.db.veiculo.findMany()
            ]);

            const basePorNome = new Map<string, typeof todasBases[0]>();
            const basePorId = new Map<string, typeof todasBases[0]>();
            for (const b of todasBases) {
                basePorNome.set(b.nome, b);
                basePorId.set(b.id, b);
            }

            const veiculoPorPlaca = new Map<string, typeof todosVeiculos[0]>();
            for (const v of todosVeiculos) {
                veiculoPorPlaca.set(v.placa, v);
            }

            async function getOrCreateBase(nome: string) {
                let base = basePorNome.get(nome);
                if (!base) {
                    base = await ctx.db.base.upsert({
                        where: { nome },
                        update: {},
                        create: { nome, cidade: nome },
                    });
                    basePorNome.set(nome, base);
                    basePorId.set(base.id, base);
                }
                return base;
            }

            async function getOrCreateVeiculo(placa: string) {
                let veiculo = veiculoPorPlaca.get(placa);
                if (!veiculo) {
                    veiculo = await ctx.db.veiculo.upsert({
                        where: { placa },
                        update: {},
                        create: { id: `temp_${placa}`, placa, descricao: "Importado via Planilha" },
                    });
                    veiculoPorPlaca.set(placa, veiculo);
                }
                return veiculo;
            }

            for (let idx = 0; idx < input.length; idx++) {
                const item = input[idx]!;
                const tViagem0 = Date.now();
                // 1. Decidir qual placa usar consultado a base da Sascar (Placa Prog, Placa Mobile ou Reboque)
                const placaSascar = await getPlacaAtivaSascar(item.placa, item.placaMob, item.reboque);

                // 2. Bases Origem e Destino com cache
                const origemNorm = normalizeCityName(item.origem);
                const baseOrigem = await getOrCreateBase(origemNorm);

                const destinoNorm = normalizeCityName(item.destino);
                const baseDestino = await getOrCreateBase(destinoNorm);

                // 3. Veículo com cache
                const veiculo = await getOrCreateVeiculo(placaSascar);

                // 4. Procurar a Rota Matriz (com tolerância a acentos, maiúsculas e espaços irregulares)
                const rotaNomeDescartavel = normalizeString(item.rotaDescricao).replace(/\s+/g, ' ').trim();
                const rotaPadrao = rotasCadastradas.find(r => 
                    normalizeString(r.nome).replace(/\s+/g, ' ').trim() === rotaNomeDescartavel
                );

                // Quando há rota cadastrada, usa as paradas da rota como origem/destino canônicos
                let baseOrigemFinal = baseOrigem;
                let baseDestinoFinal = baseDestino;
                if (rotaPadrao && rotaPadrao.paradas.length > 0) {
                    const primeiraParada = rotaPadrao.paradas[0]!;
                    const ultimaParada = rotaPadrao.paradas[rotaPadrao.paradas.length - 1]!;
                    baseOrigemFinal = basePorId.get(primeiraParada.baseId) ?? baseOrigem;
                    baseDestinoFinal = basePorId.get(ultimaParada.baseId) ?? baseDestino;
                }

                // 5. Upsert da Viagem
                const viagem = await ctx.db.viagem.upsert({
                    where: { id: item.numeroViagem },
                    update: {
                        status: item.status,
                        motorista: item.motorista,
                        veiculoId: veiculo.id,
                        prevInicioReal: new Date(item.prevInicio),
                        prevFimReal: new Date(item.prevFim),
                        rotaPadraoId: rotaPadrao?.id,
                        baseOrigemId: baseOrigemFinal.id,
                        baseDestinoId: baseDestinoFinal.id,
                        dataInicioEfetivo: item.dataInicioEfetivo ? new Date(item.dataInicioEfetivo) : undefined,
                        dataFimEfetivo: item.dataFimEfetivo ? new Date(item.dataFimEfetivo) : undefined,
                    },
                    create: {
                        id: item.numeroViagem,
                        motorista: item.motorista,
                        rotaDescricao: item.rotaDescricao,
                        veiculoId: veiculo.id,
                        baseOrigemId: baseOrigemFinal.id,
                        baseDestinoId: baseDestinoFinal.id,
                        prevInicioReal: new Date(item.prevInicio),
                        prevFimReal: new Date(item.prevFim),
                        status: item.status,
                        rotaPadraoId: rotaPadrao?.id,
                        dataInicioEfetivo: item.dataInicioEfetivo ? new Date(item.dataInicioEfetivo) : undefined,
                        dataFimEfetivo: item.dataFimEfetivo ? new Date(item.dataFimEfetivo) : undefined,
                    },
                });

                // 6. Clonar e calcular os horários da Matriz em lote
                if (rotaPadrao) {
                    await ctx.db.paradaViagem.deleteMany({ where: { viagemId: viagem.id } });

                    const dataBase = new Date(item.prevInicio);
                    dataBase.setHours(0, 0, 0, 0);
                    let dataReferencia = new Date(dataBase);

                    const paradasParaCriar: Array<{
                        viagemId: string;
                        baseId: string;
                        ordem: number;
                        prevChegada: Date | null;
                        prevSaida: Date | null;
                    }> = [];

                    for (const parada of rotaPadrao.paradas) {
                        const prevChegadaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevChegada);
                        if (prevChegadaCalc) dataReferencia = prevChegadaCalc;

                        const prevSaidaCalc = calcularDataAbsoluta(dataBase, dataReferencia, parada.prevSaida);
                        if (prevSaidaCalc) dataReferencia = prevSaidaCalc;

                        const ehUltimaParada = parada.ordem === rotaPadrao.paradas.length - 1;
                        const prevChegadaFinal = (!prevChegadaCalc && ehUltimaParada) ? new Date(item.prevFim) : prevChegadaCalc;

                        paradasParaCriar.push({
                            viagemId: viagem.id,
                            baseId: parada.baseId,
                            ordem: parada.ordem,
                            prevChegada: prevChegadaFinal,
                            prevSaida: prevSaidaCalc,
                        });
                    }

                    if (paradasParaCriar.length > 0) {
                        await ctx.db.paradaViagem.createMany({ data: paradasParaCriar });
                    }
                }

                if (viagem.createdAt.getTime() === viagem.updatedAt.getTime()) viagensCriadas++;
                else viagensAtualizadas++;
            }

            const tempoTotalMs = Date.now() - inicioLote;
            console.log(`[UPLOAD-BACKEND] ✅ Lote finalizado em ${tempoTotalMs}ms: ${viagensCriadas} criadas, ${viagensAtualizadas} atualizadas.`);

            try {
                await ctx.db.$executeRawUnsafe(`RESET statement_timeout`);
            } catch { /* noop */ }

            return {
                success: true,
                criadas: viagensCriadas,
                atualizadas: viagensAtualizadas,
                tempoMs: tempoTotalMs,
                message: `Lote processado em ${tempoTotalMs}ms! ${viagensCriadas} criadas e ${viagensAtualizadas} atualizadas.`
            };
        }),

    listar: protectedProcedure
        .input(z.object({
            limit: z.number().min(1).max(100).nullish(),
            cursor: z.string().nullish(),
        }).optional())
        .query(async ({ ctx, input }) => {
            const limit = input?.limit ?? 100;
            const { cursor } = input ?? {};

            const viagens = await ctx.db.viagem.findMany({
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { prevInicioReal: "desc" },
                select: {
                    id: true,
                    motorista: true,
                    status: true,
                    prevInicioReal: true,
                    prevFimReal: true,
                    dataInicioEfetivo: true,
                    dataFimEfetivo: true,
                    rotaDescricao: true,
                    veiculo: { select: { id: true, placa: true } },
                    baseOrigem: { select: { id: true, nome: true, cidade: true } },
                    baseDestino: { select: { id: true, nome: true, cidade: true } },
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;
            if (viagens.length > limit) {
                const nextItem = viagens.pop();
                nextCursor = nextItem!.id;
            }

            return {
                items: viagens,
                nextCursor,
            };
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
                    },
                    // Ocorrências registradas nesta viagem
                    ocorrencias: {
                        include: {
                            abertaPor: { select: { id: true, name: true } },
                            resolvidaPor: { select: { id: true, name: true } },
                        },
                        orderBy: { createdAt: "asc" },
                    },
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
                // ⚡ Seleciona apenas campos usados no frontend — reduz payload significativamente
                select: {
                    id: true,
                    veiculoId: true,
                    latitude: true,
                    longitude: true,
                    velocidade: true,
                    ignicao: true,
                    dataHoraLocal: true,
                    dataHoraUtc: true,
                    viagemId: true,
                },
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
                ocorrencias: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        // ⚡ Otimização: 1 única query para todas as últimas telemetrias (elimina N+1)
        const veiculoIds = [...new Set(viagens.map((v) => v.veiculo.id))];
        const ultimasTelemetrias = await Promise.all(
            veiculoIds.map((vid) =>
                ctx.db.telemetria.findFirst({
                    where: { veiculoId: vid },
                    orderBy: { dataHoraLocal: "desc" },
                    select: { id: true, veiculoId: true, latitude: true, longitude: true, velocidade: true, ignicao: true, dataHoraLocal: true, dataHoraUtc: true, viagemId: true },
                })
            )
        );
        const telemetriaMap = new Map(
            ultimasTelemetrias.filter(Boolean).map((t) => [t!.veiculoId, t!])
        );

        const result = viagens.map((v) => ({
            ...v,
            ultimaTelemetria: telemetriaMap.get(v.veiculo.id) ?? null,
        }));

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
                ocorrencias: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        // ⚡ Otimização: busca a última telemetria de TODOS os veículos em paralelo (elimina N+1)
        const veiculoIdsDashboard = [...new Set(viagens.map((v) => v.veiculo.id))];
        const ultimasTelemetriasDashboard = await Promise.all(
            veiculoIdsDashboard.map((vid) =>
                ctx.db.telemetria.findFirst({
                    where: { veiculoId: vid },
                    orderBy: { dataHoraLocal: "desc" },
                    select: { id: true, veiculoId: true, latitude: true, longitude: true, velocidade: true, ignicao: true, dataHoraLocal: true, dataHoraUtc: true, viagemId: true },
                })
            )
        );
        const telemetriaMapDashboard = new Map(
            ultimasTelemetriasDashboard.filter(Boolean).map((t) => [t!.veiculoId, t!])
        );

        const result = viagens.map((v) => {

                // Auto-correção instantânea para a UI:
                // Se a viagem já possui o horário final, ela está finalizada independentemente do ERP.
                if (v.dataFimEfetivo && v.status !== "FINALIZADA" && v.status !== "CANCELADA") {
                    v.status = "FINALIZADA";
                }

                // 1. Última telemetria (resolvida via Map — sem query extra)
                const ultimaTelemetria = telemetriaMapDashboard.get(v.veiculo.id) ?? null;

                // 2. Atraso na saída (em minutos)
                // REGRA: se tem rota cadastrada, usa o horário da 1ª parada (rota); senão usa o do Excel
                const primeiraPD = v.paradasViagem[0];
                const prevSaidaRef = primeiraPD?.prevSaida ?? v.prevInicioReal;
                let atrasoSaidaMinutos: number | null = null;
                if (v.dataInicioEfetivo) {
                    atrasoSaidaMinutos = Math.round(
                        (v.dataInicioEfetivo.getTime() - prevSaidaRef.getTime()) / 60000
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
                // REGRA: usa horário da última parada cadastrada como referência; senão usa o do Excel
                const ultimaPD = v.paradasViagem[v.paradasViagem.length - 1];
                let previsaoBaseRef: Date = ultimaPD?.prevChegada ?? v.prevFimReal;

                if (paradaAtualIndex < paradas.length) {
                    const proxParada = paradas[paradaAtualIndex]!;
                    proximaParadaNome = proxParada.base.nome;
                    latDestino = proxParada.base.latitude;
                    lngDestino = proxParada.base.longitude;
                    previsaoBaseRef = proxParada.prevChegada ?? proxParada.prevSaida ?? ultimaPD?.prevChegada ?? v.prevFimReal;
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
                    // REGRA: usa horário da última parada cadastrada; senão usa o do Excel
                    const ultimaPDFin = v.paradasViagem[v.paradasViagem.length - 1];
                    const prevChegadaRefFin = ultimaPDFin?.prevChegada ?? v.prevFimReal;
                    if (v.dataFimEfetivo && prevChegadaRefFin) {
                        const atrasoReal = Math.round((v.dataFimEfetivo.getTime() - prevChegadaRefFin.getTime()) / 60000);
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
                    // Horários de previsão com prioridade: rota cadastrada > Excel
                    prevSaidaRef,           // Saída prevista correta (rota ou Excel)
                    prevChegadaRef: ultimaPD?.prevChegada ?? v.prevFimReal, // Chegada prevista correta
                    semSinalGPS,
                };
            });

        return result;
    }),

    listarAtrasosOrigem: protectedProcedure.query(async ({ ctx }) => {
        // Busca todas as viagens finalizadas que já possuem horário efetivo de chegada ao destino
        const viagens = await ctx.db.viagem.findMany({
            where: {
                dataFimEfetivo: { not: null }, // Chegou ao destino
            },
            select: {
                id: true,
                status: true,
                motorista: true,
                prevFimReal: true,
                dataFimEfetivo: true,
                prevInicioReal: true,
                veiculo: { select: { placa: true } },
                baseOrigem: { select: { cidade: true } },
                baseDestino: { select: { cidade: true } },
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

            // ⚡ Otimização: calcula pico de velocidade diretamente no banco com uma única query SQL
            // Evita carregar centenas de milhares de linhas de telemetria em memória
            const picMap = new Map<string, number | null>();

            if (viagens.length > 0) {
                type PicRow = { viagem_id: string; pic_velocidade: number | null };
                const picRows = await ctx.db.$queryRaw<PicRow[]>`
                    SELECT
                        v.id AS viagem_id,
                        MAX(t.velocidade)::int AS pic_velocidade
                    FROM "Viagem" v
                    JOIN "Telemetria" t ON t."veiculoId" = v."veiculoId"
                    WHERE v.id = ANY(${viagens.map(v => v.id)}::text[])
                      AND t."dataHoraLocal" BETWEEN
                          COALESCE(v."dataInicioEfetivo", v."prevInicioReal") - INTERVAL '5 minutes'
                          AND
                          COALESCE(v."dataFimEfetivo", v."prevFimReal") + INTERVAL '5 minutes'
                      AND t.velocidade IS NOT NULL
                    GROUP BY v.id
                `;
                for (const row of picRows) {
                    picMap.set(row.viagem_id, row.pic_velocidade);
                }
            }


            const viagensEnriquecidas = viagens.map((v) => {
                // REGRA: se tem rota cadastrada, usa horários das paradas; senão usa o do Excel
                const primeiraParadaA = v.paradasViagem[0];
                const ultimaParadaA = v.paradasViagem[v.paradasViagem.length - 1];
                const prevSaidaRefA = primeiraParadaA?.prevSaida ?? v.prevInicioReal;
                const prevChegadaRefA = ultimaParadaA?.prevChegada ?? v.prevFimReal;

                const atrasoChegadaMin = v.dataFimEfetivo && prevChegadaRefA
                    ? Math.round((v.dataFimEfetivo.getTime() - prevChegadaRefA.getTime()) / 60000)
                    : 0;

                const atrasoSaidaMin = v.dataInicioEfetivo && prevSaidaRefA
                    ? Math.round((v.dataInicioEfetivo.getTime() - prevSaidaRefA.getTime()) / 60000)
                    : null;

                const duracaoPrevistaMin = Math.round(
                    (prevChegadaRefA.getTime() - prevSaidaRefA.getTime()) / 60000
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
                    prevInicio: prevSaidaRefA,
                    prevFim: prevChegadaRefA,
                    dataInicioEfetivo: v.dataInicioEfetivo,
                    dataFimEfetivo: v.dataFimEfetivo,
                    atrasoChegadaMin,
                    atrasoSaidaMin,
                    duracaoPrevistaMin,
                    duracaoRealMin,
                    nivelAlerta,
                    picVelocidade: picMap.get(v.id) ?? null,
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

    // ====================================================================
    //  COMPARATIVO DE ATRASOS — Análise por Semana / Mês (Saída ou Chegada)
    // ====================================================================
    obterComparativoAtrasos: protectedProcedure
        .input(z.object({
            dataInicio: z.string(),         // "yyyy-MM-dd"
            dataFim: z.string(),            // "yyyy-MM-dd"
            agrupamento: z.enum(["SEMANA", "MES"]).default("SEMANA"),
            tipoAnalise: z.enum(["SAIDA", "CHEGADA"]).default("SAIDA"),
            baseOrigemNome: z.string().optional(),
        }))
        .query(async ({ ctx, input }) => {
            const inicio = new Date(input.dataInicio);
            inicio.setHours(0, 0, 0, 0);
            const fim = new Date(input.dataFim);
            fim.setHours(23, 59, 59, 999);

            const whereClause: Record<string, unknown> = {
                // Se for chegada, buscamos viagens baseadas na data de previsão de fim?
                // Ou mantemos agrupando pela data de início da viagem sempre?
                // O mais padrão é agrupar pela data de início da viagem para a mesma coorte.
                prevInicioReal: { gte: inicio, lte: fim },
                status: { in: ["FINALIZADA", "EM_ANDAMENTO", "PROGRAMADA", "CANCELADA"] },
            };
            if (input.baseOrigemNome) {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            const viagens = await ctx.db.viagem.findMany({
                where: whereClause,
                select: {
                    id: true,
                    motorista: true,
                    rotaDescricao: true,
                    prevInicioReal: true,
                    prevFimReal: true,
                    dataInicioEfetivo: true,
                    dataFimEfetivo: true,
                    status: true,
                    veiculo: { select: { placa: true } },
                    baseOrigem: { select: { nome: true, cidade: true } },
                    baseDestino: { select: { nome: true, cidade: true } },
                    paradasViagem: {
                        select: { ordem: true, prevSaida: true, prevChegada: true },
                        orderBy: { ordem: "asc" },
                        take: 1,
                    },
                },
                orderBy: { prevInicioReal: "asc" },
            });

            // Classifica nível de atraso
            type NivelAtraso = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO";
            function classificarAtraso(atrasoMin: number | null): NivelAtraso {
                if (atrasoMin === null || atrasoMin < 10) return "PONTUAL";
                if (atrasoMin < 30) return "ATENCAO";
                if (atrasoMin < 60) return "ATRASADO";
                return "CRITICO";
            }

            // Formata chave de agrupamento
            function chaveAgrupamento(d: Date): string {
                const ano = d.getFullYear();
                if (input.agrupamento === "MES") {
                    const mes = String(d.getMonth() + 1).padStart(2, "0");
                    return `${ano}-${mes}`;
                }
                // Semana do mês (Dom a Sab)
                const mes = d.getMonth();
                const dateNum = d.getDate();
                const firstDay = new Date(ano, mes, 1);
                const daysToFirstSaturday = 6 - firstDay.getDay();
                const firstSaturdayDate = 1 + daysToFirstSaturday;
                
                let weekNum = 1;
                if (dateNum > firstSaturdayDate) {
                    const daysAfterWeek1 = dateNum - firstSaturdayDate;
                    weekNum = 1 + Math.ceil(daysAfterWeek1 / 7);
                }
                const mesStr = String(mes + 1).padStart(2, "0");
                return `${ano}-${mesStr}-W${weekNum}`;
            }

            function labelAgrupamento(chave: string): string {
                if (input.agrupamento === "MES") {
                    const [ano, mes] = chave.split("-");
                    const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
                    return `${nomes[(parseInt(mes ?? "1") - 1)] ?? mes}/${ano}`;
                }
                const [ano, mes, weekStr] = chave.split("-");
                const weekNum = (weekStr ?? "").replace("W", "");
                const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
                const mesNome = nomes[(parseInt(mes ?? "1") - 1)] ?? mes;
                return `${weekNum}ª Sem. ${mesNome}/${ano}`;
            }

            function datasAgrupamento(chave: string): { inicio: Date, fim: Date } {
                if (input.agrupamento === "MES") {
                    const [ano, mes] = chave.split("-");
                    const d = new Date(Number(ano), Number(mes) - 1, 1);
                    return { inicio: startOfMonth(d), fim: endOfMonth(d) };
                }
                const [anoStr, mesStr, weekStr] = chave.split("-");
                const ano = Number(anoStr);
                const mes = Number(mesStr) - 1;
                const weekNum = Number((weekStr ?? "").replace("W", ""));
                
                const firstDay = new Date(ano, mes, 1);
                const daysToFirstSaturday = 6 - firstDay.getDay();
                const firstSaturdayDate = 1 + daysToFirstSaturday;
                
                if (weekNum === 1) {
                    return { inicio: firstDay, fim: new Date(ano, mes, firstSaturdayDate) };
                } else {
                    const inicioNum = firstSaturdayDate + 1 + (weekNum - 2) * 7;
                    let fimNum = inicioNum + 6;
                    
                    const lastDayOfMonth = endOfMonth(firstDay).getDate();
                    if (inicioNum > lastDayOfMonth) {
                        return { inicio: new Date(ano, mes, lastDayOfMonth), fim: new Date(ano, mes, lastDayOfMonth) };
                    }
                    if (fimNum > lastDayOfMonth) fimNum = lastDayOfMonth;
                    
                    return {
                        inicio: new Date(ano, mes, inicioNum),
                        fim: new Date(ano, mes, fimNum)
                    };
                }
            }

            // Detalhes por viagem
            type ViagemDetalhe = {
                id: string;
                motorista: string;
                placa: string;
                rotaDescricao: string;
                baseOrigem: string;
                baseDestino: string;
                dataReferencia: Date;
                dataEfetiva: Date | null;
                atrasoMin: number | null;
                nivel: NivelAtraso;
                status: string;
            };

            const detalhes: ViagemDetalhe[] = viagens.map((v) => {
                let dataReferencia: Date;
                let dataEfetiva: Date | null;
                let atrasoMin: number | null = null;

                if (input.tipoAnalise === "SAIDA") {
                    const primeiraParada = v.paradasViagem[0];
                    dataReferencia = primeiraParada?.prevSaida ?? v.prevInicioReal;
                    dataEfetiva = v.dataInicioEfetivo;
                    if (dataEfetiva) {
                        atrasoMin = Math.round((dataEfetiva.getTime() - dataReferencia.getTime()) / 60000);
                    }
                } else {
                    dataReferencia = v.prevFimReal;
                    dataEfetiva = v.dataFimEfetivo;
                    // Só calcula atraso de chegada se a viagem finalizou ou tem data de chegada
                    if (dataEfetiva) {
                        atrasoMin = Math.round((dataEfetiva.getTime() - dataReferencia.getTime()) / 60000);
                    }
                }

                return {
                    id: v.id,
                    motorista: v.motorista,
                    placa: v.veiculo.placa,
                    rotaDescricao: v.rotaDescricao,
                    baseOrigem: v.baseOrigem.cidade,
                    baseDestino: v.baseDestino.cidade,
                    dataReferencia,
                    dataEfetiva,
                    atrasoMin,
                    nivel: classificarAtraso(atrasoMin),
                    status: v.status,
                };
            });

            // Agrupa por período (sempre agrupando pela data de início real para ter a mesma base de comparação)
            const periodoMap = new Map<string, ViagemDetalhe[]>();
            for (let i = 0; i < viagens.length; i++) {
                const v = viagens[i]!;
                const d = detalhes[i]!;
                
                // Agrupar pela prevInicio da viagem para manter consistência de safra
                const chave = chaveAgrupamento(v.prevInicioReal);
                const bucket = periodoMap.get(chave) ?? [];
                bucket.push(d);
                periodoMap.set(chave, bucket);
            }

            const periodos = Array.from(periodoMap.entries())
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([chave, viagens]) => {
                    const { inicio, fim } = datasAgrupamento(chave);
                    return {
                        chave,
                        label: labelAgrupamento(chave),
                        dataInicio: inicio,
                        dataFim: fim,
                        total: viagens.length,
                        pontual:  viagens.filter(v => v.nivel === "PONTUAL").length,
                        atencao:  viagens.filter(v => v.nivel === "ATENCAO").length,
                        atrasado: viagens.filter(v => v.nivel === "ATRASADO").length,
                        critico:  viagens.filter(v => v.nivel === "CRITICO").length,
                        viagens,
                    };
                });

            const todasBases = await ctx.db.base.findMany({
                where: { viagensOrigem: { some: {} } },
                select: { nome: true, cidade: true },
                orderBy: { nome: "asc" },
            });

            return { periodos, basesDisponiveis: todasBases };
        }),

    // ====================================================================
    // ====================================================================
    //  DIAGNÓSTICO ANALÍTICO DE ATRASOS (O Quê, Onde, Quando, Soluções)
    // ====================================================================
    getAnaliticoAtrasos: protectedProcedure
        .input(
            z.object({
                dias: z.number().default(30),
                tipoEvento: z.enum(["TODOS", "SAIDA", "CHEGADA"]).default("TODOS"),
                baseOrigemNome: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const dias = input?.dias ?? 30;
            const tipoEvento = input?.tipoEvento ?? "TODOS";
            const sinceDate = new Date(Date.now() - dias * 24 * 3600 * 1000);

            const whereClause: Record<string, unknown> = {
                prevInicioReal: { gte: sinceDate },
                OR: [
                    { dataFimEfetivo: { not: null } },
                    { dataInicioEfetivo: { not: null } },
                ],
            };

            if (input?.baseOrigemNome && input.baseOrigemNome !== "TODAS") {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            const [viagens, todasBases] = await Promise.all([
                ctx.db.viagem.findMany({
                    where: whereClause,
                    select: {
                        id: true,
                        rotaDescricao: true,
                        prevInicioReal: true,
                        prevFimReal: true,
                        dataInicioEfetivo: true,
                        dataFimEfetivo: true,
                        baseOrigem: { select: { nome: true, cidade: true } },
                        baseDestino: { select: { nome: true, cidade: true } },
                    },
                    orderBy: { prevInicioReal: "desc" },
                }),
                ctx.db.base.findMany({
                    where: { viagensOrigem: { some: {} } },
                    select: { nome: true, cidade: true },
                    orderBy: { nome: "asc" },
                }),
            ]);

            // Normalizar deltas calculando diretamente com base nos horários previstos e reais da viagem
            const logs = viagens
                .map((v) => {
                    let deltaSaida: number | null = null;
                    if (v.dataInicioEfetivo && v.prevInicioReal) {
                        deltaSaida = Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000);
                    }

                    let deltaChegada: number | null = null;
                    if (v.dataFimEfetivo && v.prevFimReal) {
                        deltaChegada = Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000);
                    }

                    let delta: number | null = null;
                    if (tipoEvento === "SAIDA") {
                        delta = deltaSaida;
                    } else if (tipoEvento === "CHEGADA") {
                        delta = deltaChegada;
                    } else {
                        delta = deltaChegada ?? deltaSaida;
                    }

                    if (delta === null) return null;

                    const rota = v.rotaDescricao || `${v.baseOrigem.cidade} -> ${v.baseDestino.cidade}`;

                    return {
                        id: v.id,
                        rota,
                        data: v.prevInicioReal,
                        deltaMinutos: delta,
                        deltaSaida,
                        deltaChegada,
                    };
                })
                .filter((v): v is NonNullable<typeof v> => v !== null);

            const total = logs.length;
            if (total === 0) {
                return {
                    totalViagens: 0,
                    taxaPontualidade: 0,
                    atrasoMedioGeral: 0,
                    atrasoMedioAtrasados: 0,
                    maiorAtraso: 0,
                    totalAtrasadas: 0,
                    totalPontuais: 0,
                    distribuicao: [
                        { faixa: "PONTUAL", label: "Pontual (<= 5 min)", count: 0, percent: 0, cor: "#10b981" },
                        { faixa: "LEVE", label: "Leve (6 - 15 min)", count: 0, percent: 0, cor: "#f59e0b" },
                        { faixa: "GRAVE", label: "Grave (16 - 30 min)", count: 0, percent: 0, cor: "#f97316" },
                        { faixa: "CRITICO", label: "Crítico (> 30 min)", count: 0, percent: 0, cor: "#ef4444" },
                    ],
                    pioresRotas: [],
                    porTipoEvento: {
                        saidas: { total: 0, taxaPontualidade: 0, atrasoMedio: 0 },
                        chegadas: { total: 0, taxaPontualidade: 0, atrasoMedio: 0 },
                    },
                    basesDisponiveis: todasBases,
                };
            }

            const pontuais = logs.filter((l) => l.deltaMinutos <= 5);
            const atrasadas = logs.filter((l) => l.deltaMinutos > 5);

            const pontualCount = pontuais.length;
            const leveCount = logs.filter((l) => l.deltaMinutos >= 6 && l.deltaMinutos <= 15).length;
            const graveCount = logs.filter((l) => l.deltaMinutos >= 16 && l.deltaMinutos <= 30).length;
            const criticoCount = logs.filter((l) => l.deltaMinutos > 30).length;

            const taxaPontualidade = Number(((pontualCount / total) * 100).toFixed(1));
            const atrasoMedioGeral = Math.round(logs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / total);
            const atrasoMedioAtrasados = atrasadas.length > 0 ? Math.round(atrasadas.reduce((acc, l) => acc + l.deltaMinutos, 0) / atrasadas.length) : 0;
            const maiorAtraso = logs.length > 0 ? Math.max(0, ...logs.map((l) => l.deltaMinutos)) : 0;

            const distribuicao = [
                { faixa: "PONTUAL", label: "Pontual (<= 5 min)", count: pontualCount, percent: Number(((pontualCount / total) * 100).toFixed(1)), cor: "#10b981" },
                { faixa: "LEVE", label: "Leve (6 - 15 min)", count: leveCount, percent: Number(((leveCount / total) * 100).toFixed(1)), cor: "#f59e0b" },
                { faixa: "GRAVE", label: "Grave (16 - 30 min)", count: graveCount, percent: Number(((graveCount / total) * 100).toFixed(1)), cor: "#f97316" },
                { faixa: "CRITICO", label: "Crítico (> 30 min)", count: criticoCount, percent: Number(((criticoCount / total) * 100).toFixed(1)), cor: "#ef4444" },
            ];

            // Agrupar por rota
            const rotasMap = new Map<string, typeof logs>();
            for (const log of logs) {
                const rotaNome = log.rota || "Desconhecida";
                const list = rotasMap.get(rotaNome) || [];
                list.push(log);
                rotasMap.set(rotaNome, list);
            }

            const pioresRotas = Array.from(rotasMap.entries())
                .map(([rota, rotaLogs]) => {
                    const rTotal = rotaLogs.length;
                    const rPontuais = rotaLogs.filter((l) => l.deltaMinutos <= 5).length;
                    const rAtrasadas = rotaLogs.filter((l) => l.deltaMinutos > 5).length;
                    const rTaxaPontualidade = Number(((rPontuais / rTotal) * 100).toFixed(1));
                    const rAtrasoMedio = Math.round(rotaLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / rTotal);
                    const rPiorAtraso = Math.max(0, ...rotaLogs.map((l) => l.deltaMinutos));
                    const rTotalMinutos = rotaLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0);

                    return {
                        rota,
                        total: rTotal,
                        pontuais: rPontuais,
                        atrasadas: rAtrasadas,
                        taxaPontualidade: rTaxaPontualidade,
                        atrasoMedio: rAtrasoMedio,
                        piorAtraso: rPiorAtraso,
                        totalMinutosAtraso: rTotalMinutos,
                    };
                })
                .sort((a, b) => b.atrasoMedio - a.atrasoMedio || b.atrasadas - a.atrasadas)
                .slice(0, 15);

            // Breakdown por tipo de evento
            const calcTipo = (tipo: "SAIDA" | "CHEGADA") => {
                const filtered = logs
                    .map((v) => (tipo === "SAIDA" ? v.deltaSaida : v.deltaChegada))
                    .filter((d): d is number => d !== null);
                if (filtered.length === 0) return { total: 0, taxaPontualidade: 0, atrasoMedio: 0 };
                const pt = filtered.filter((d) => d <= 5).length;
                return {
                    total: filtered.length,
                    taxaPontualidade: Number(((pt / filtered.length) * 100).toFixed(1)),
                    atrasoMedio: Math.round(filtered.reduce((acc, d) => acc + Math.max(0, d), 0) / filtered.length),
                };
            };

            return {
                totalViagens: total,
                taxaPontualidade,
                atrasoMedioGeral,
                atrasoMedioAtrasados,
                maiorAtraso,
                totalAtrasadas: atrasadas.length,
                totalPontuais: pontualCount,
                distribuicao,
                pioresRotas,
                porTipoEvento: {
                    saidas: calcTipo("SAIDA"),
                    chegadas: calcTipo("CHEGADA"),
                },
                basesDisponiveis: todasBases,
            };
        }),

    getHistoricoTendencia: protectedProcedure
        .input(
            z.object({
                dias: z.number().default(30),
                tipoEvento: z.enum(["TODOS", "SAIDA", "CHEGADA"]).default("TODOS"),
                baseOrigemNome: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const dias = input?.dias ?? 30;
            const tipoEvento = input?.tipoEvento ?? "TODOS";
            const sinceDate = new Date(Date.now() - dias * 24 * 3600 * 1000);

            const whereClause: Record<string, unknown> = {
                prevInicioReal: { gte: sinceDate },
                OR: [
                    { dataFimEfetivo: { not: null } },
                    { dataInicioEfetivo: { not: null } },
                ],
            };
            if (input?.baseOrigemNome && input.baseOrigemNome !== "TODAS") {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            const viagens = await ctx.db.viagem.findMany({
                where: whereClause,
                select: {
                    prevInicioReal: true,
                    prevFimReal: true,
                    dataInicioEfetivo: true,
                    dataFimEfetivo: true,
                },
                orderBy: { prevInicioReal: "asc" },
            });

            const logs = viagens
                .map((v) => {
                    let delta: number | null = null;
                    let dataRef = v.prevInicioReal;

                    if (tipoEvento === "SAIDA") {
                        if (!v.dataInicioEfetivo || !v.prevInicioReal) return null;
                        delta = Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000);
                        dataRef = v.prevInicioReal;
                    } else if (tipoEvento === "CHEGADA") {
                        if (!v.dataFimEfetivo || !v.prevFimReal) return null;
                        delta = Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000);
                        dataRef = v.prevFimReal;
                    } else {
                        const deltaChegada = v.dataFimEfetivo && v.prevFimReal
                            ? Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000)
                            : null;
                        const deltaSaida = v.dataInicioEfetivo && v.prevInicioReal
                            ? Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000)
                            : null;
                        delta = deltaChegada ?? deltaSaida;
                        dataRef = v.prevInicioReal;
                    }

                    if (delta === null) return null;
                    return {
                        data: dataRef,
                        deltaMinutos: delta,
                    };
                })
                .filter((v): v is NonNullable<typeof v> => v !== null);

            const groupedByDay = new Map<string, typeof logs>();
            for (const l of logs) {
                const key = format(l.data, "yyyy-MM-dd");
                const list = groupedByDay.get(key) || [];
                list.push(l);
                groupedByDay.set(key, list);
            }

            const diasList = Array.from(groupedByDay.entries()).map(([dataIso, dayLogs]) => {
                const total = dayLogs.length;
                const pontuais = dayLogs.filter((l) => l.deltaMinutos <= 5).length;
                const atrasadas = dayLogs.filter((l) => l.deltaMinutos > 5).length;
                const taxaPontualidade = total > 0 ? Number(((pontuais / total) * 100).toFixed(1)) : 100;
                const atrasoMedio = total > 0 ? Math.round(dayLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / total) : 0;

                const parsedDate = parse(dataIso, "yyyy-MM-dd", new Date());
                const label = format(parsedDate, "dd/MM");

                return {
                    data: dataIso,
                    label,
                    total,
                    pontuais,
                    atrasadas,
                    taxaPontualidade,
                    atrasoMedio,
                };
            });

            return diasList;
        }),

    getAnaliseHorarios: protectedProcedure
        .input(
            z.object({
                dias: z.number().default(30),
                tipoEvento: z.enum(["TODOS", "SAIDA", "CHEGADA"]).default("TODOS"),
                baseOrigemNome: z.string().optional(),
            }).optional()
        )
        .query(async ({ ctx, input }) => {
            const dias = input?.dias ?? 30;
            const tipoEvento = input?.tipoEvento ?? "TODOS";
            const sinceDate = new Date(Date.now() - dias * 24 * 3600 * 1000);

            const whereClause: Record<string, unknown> = {
                prevInicioReal: { gte: sinceDate },
                OR: [
                    { dataFimEfetivo: { not: null } },
                    { dataInicioEfetivo: { not: null } },
                ],
            };
            if (input?.baseOrigemNome && input.baseOrigemNome !== "TODAS") {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            const viagens = await ctx.db.viagem.findMany({
                where: whereClause,
                select: {
                    prevInicioReal: true,
                    prevFimReal: true,
                    dataInicioEfetivo: true,
                    dataFimEfetivo: true,
                },
            });

            const logs = viagens
                .map((v) => {
                    let delta: number | null = null;
                    let dataRef = v.prevInicioReal;

                    if (tipoEvento === "SAIDA") {
                        if (!v.dataInicioEfetivo || !v.prevInicioReal) return null;
                        delta = Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000);
                        dataRef = v.prevInicioReal;
                    } else if (tipoEvento === "CHEGADA") {
                        if (!v.dataFimEfetivo || !v.prevFimReal) return null;
                        delta = Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000);
                        dataRef = v.prevFimReal;
                    } else {
                        const deltaChegada = v.dataFimEfetivo && v.prevFimReal
                            ? Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000)
                            : null;
                        const deltaSaida = v.dataInicioEfetivo && v.prevInicioReal
                            ? Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000)
                            : null;
                        delta = deltaChegada ?? deltaSaida;
                        dataRef = v.dataFimEfetivo ? v.prevFimReal : v.prevInicioReal;
                    }

                    if (delta === null) return null;

                    return {
                        data: dataRef,
                        deltaMinutos: delta,
                    };
                })
                .filter((v): v is NonNullable<typeof v> => v !== null);

            const diasSemanaNomes = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

            // 1. Por Hora (0 a 23)
            const porHora = Array.from({ length: 24 }, (_, h) => {
                const horaLogs = logs.filter((l) => l.data.getHours() === h);
                const total = horaLogs.length;
                const pontuais = horaLogs.filter((l) => l.deltaMinutos <= 5).length;
                const atrasadas = horaLogs.filter((l) => l.deltaMinutos > 5).length;
                const taxaPontualidade = total > 0 ? Number(((pontuais / total) * 100).toFixed(1)) : 100;
                const atrasoMedio = total > 0 ? Math.round(horaLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / total) : 0;

                return {
                    hora: h,
                    label: `${String(h).padStart(2, "0")}:00`,
                    total,
                    pontuais,
                    atrasadas,
                    taxaPontualidade,
                    atrasoMedio,
                };
            });

            // 2. Por Dia da Semana (0 a 6)
            const porDiaSemana = Array.from({ length: 7 }, (_, d) => {
                const diaLogs = logs.filter((l) => l.data.getDay() === d);
                const total = diaLogs.length;
                const pontuais = diaLogs.filter((l) => l.deltaMinutos <= 5).length;
                const atrasadas = diaLogs.filter((l) => l.deltaMinutos > 5).length;
                const taxaPontualidade = total > 0 ? Number(((pontuais / total) * 100).toFixed(1)) : 100;
                const atrasoMedio = total > 0 ? Math.round(diaLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / total) : 0;

                return {
                    diaSemana: d,
                    nome: diasSemanaNomes[d] || "",
                    total,
                    pontuais,
                    atrasadas,
                    taxaPontualidade,
                    atrasoMedio,
                };
            });

            // 3. Heatmap Matriz (DiaSemana x Faixa de Horário)
            const faixasHorario = [
                { id: "madrugada", label: "00h - 06h", start: 0, end: 5 },
                { id: "manha", label: "06h - 12h", start: 6, end: 11 },
                { id: "tarde", label: "12h - 18h", start: 12, end: 17 },
                { id: "noite", label: "18h - 24h", start: 18, end: 23 },
            ];

            const matrizCalor = faixasHorario.map((faixa) => {
                const diasData = Array.from({ length: 7 }, (_, d) => {
                    const celLogs = logs.filter((l) => {
                        const h = l.data.getHours();
                        return l.data.getDay() === d && h >= faixa.start && h <= faixa.end;
                    });

                    const total = celLogs.length;
                    const pontuais = celLogs.filter((l) => l.deltaMinutos <= 5).length;
                    const atrasadas = celLogs.filter((l) => l.deltaMinutos > 5).length;
                    const atrasoMedio = total > 0 ? Math.round(celLogs.reduce((acc, l) => acc + Math.max(0, l.deltaMinutos), 0) / total) : 0;
                    const taxaPontualidade = total > 0 ? Number(((pontuais / total) * 100).toFixed(1)) : 100;

                    return {
                        diaSemana: d,
                        diaNome: diasSemanaNomes[d]!,
                        total,
                        atrasadas,
                        atrasoMedio,
                        taxaPontualidade,
                    };
                });

                return {
                    faixa: faixa.label,
                    start: faixa.start,
                    end: faixa.end,
                    dias: diasData,
                };
            });

            return {
                porHora,
                porDiaSemana,
                matrizCalor,
            };
        }),

    // ====================================================================
    //  DETALHAMENTO MODAL DE VIAGENS (Por Rota ou Célula da Matriz)
    // ====================================================================
    getViagensModalAnalise: protectedProcedure
        .input(
            z.object({
                dias: z.number().default(30),
                tipoEvento: z.enum(["TODOS", "SAIDA", "CHEGADA"]).default("TODOS"),
                baseOrigemNome: z.string().optional(),
                rota: z.string().optional(),
                diaSemana: z.number().min(0).max(6).optional(),
                horaInicio: z.number().min(0).max(23).optional(),
                horaFim: z.number().min(0).max(23).optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const dias = input.dias ?? 30;
            const tipoEvento = input.tipoEvento ?? "TODOS";
            const sinceDate = new Date(Date.now() - dias * 24 * 3600 * 1000);

            const whereClause: Record<string, unknown> = {
                prevInicioReal: { gte: sinceDate },
                OR: [
                    { dataFimEfetivo: { not: null } },
                    { dataInicioEfetivo: { not: null } },
                ],
            };

            if (tipoEvento === "SAIDA") {
                whereClause.dataInicioEfetivo = { not: null };
                delete whereClause.OR;
            } else if (tipoEvento === "CHEGADA") {
                whereClause.dataFimEfetivo = { not: null };
                delete whereClause.OR;
            }

            if (input.baseOrigemNome && input.baseOrigemNome !== "TODAS") {
                whereClause.baseOrigem = { nome: input.baseOrigemNome };
            }

            if (input.rota) {
                whereClause.rotaDescricao = input.rota;
            }

            const viagens = await ctx.db.viagem.findMany({
                where: whereClause,
                select: {
                    id: true,
                    motorista: true,
                    rotaDescricao: true,
                    prevInicioReal: true,
                    prevFimReal: true,
                    dataInicioEfetivo: true,
                    dataFimEfetivo: true,
                    status: true,
                    veiculo: { select: { placa: true } },
                    baseOrigem: { select: { nome: true, cidade: true } },
                    baseDestino: { select: { nome: true, cidade: true } },
                },
                orderBy: { prevInicioReal: "desc" },
            });

            const result = viagens
                .map((v) => {
                    let deltaSaida: number | null = null;
                    if (v.dataInicioEfetivo && v.prevInicioReal) {
                        deltaSaida = Math.round((v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000);
                    }

                    let deltaChegada: number | null = null;
                    if (v.dataFimEfetivo && v.prevFimReal) {
                        deltaChegada = Math.round((v.dataFimEfetivo.getTime() - v.prevFimReal.getTime()) / 60000);
                    }

                    let delta: number | null = null;
                    let dataRef = v.prevInicioReal;

                    if (tipoEvento === "SAIDA") {
                        delta = deltaSaida;
                        dataRef = v.prevInicioReal;
                    } else if (tipoEvento === "CHEGADA") {
                        delta = deltaChegada;
                        dataRef = v.prevFimReal;
                    } else {
                        delta = deltaChegada ?? deltaSaida;
                        dataRef = v.dataFimEfetivo ? v.prevFimReal : v.prevInicioReal;
                    }

                    if (delta === null) return null;

                    // Filtro por dia da semana (0=Dom, 1=Seg, ..., 6=Sáb)
                    if (input.diaSemana !== undefined && dataRef.getDay() !== input.diaSemana) {
                        return null;
                    }

                    // Filtro por faixa horária
                    if (input.horaInicio !== undefined && input.horaFim !== undefined) {
                        const h = dataRef.getHours();
                        if (h < input.horaInicio || h > input.horaFim) {
                            return null;
                        }
                    }

                    return {
                        id: v.id,
                        motorista: v.motorista,
                        placa: v.veiculo.placa,
                        rotaDescricao: v.rotaDescricao || `${v.baseOrigem.cidade} -> ${v.baseDestino.cidade}`,
                        origem: v.baseOrigem.cidade || v.baseOrigem.nome,
                        destino: v.baseDestino.cidade || v.baseDestino.nome,
                        prevInicioReal: v.prevInicioReal,
                        prevFimReal: v.prevFimReal,
                        dataInicioEfetivo: v.dataInicioEfetivo,
                        dataFimEfetivo: v.dataFimEfetivo,
                        deltaSaida,
                        deltaChegada,
                        delta,
                        status: v.status,
                    };
                })
                .filter((v): v is NonNullable<typeof v> => v !== null)
                .sort((a, b) => b.delta - a.delta);

            return result;
        }),
});



