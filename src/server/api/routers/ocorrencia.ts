import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { enviarNotificacaoOcorrencia } from "@/server/services/emailNotificacaoService";
import { telemetriaDb } from "@/server/db-telemetria";

let colunasOcorrenciaGarantidas = false;
async function garantirColunasOcorrencia(db: { $executeRawUnsafe: (query: string) => Promise<unknown> }) {
    if (colunasOcorrenciaGarantidas) return;
    try {
        await db.$executeRawUnsafe(`
            ALTER TABLE "Ocorrencia"
            ADD COLUMN IF NOT EXISTS "causouParada" BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS "tempoAtrasoMinutos" INTEGER;
        `);
        colunasOcorrenciaGarantidas = true;
    } catch (err) {
        console.warn("[Ocorrencia] Aviso ao verificar colunas de parada/atraso:", err);
    }
}

interface ManifestoViagemRow {
    id_manifesto: string;
    prev_saida_data: string;
    prev_saida_hora: string | null;
    saida_efetiva_data: string | null;
    saida_efetiva_hora: string | null;
    unidade: string;
    placa: string;
    origem: string | null;
    destino: string | null;
    tipo_manifesto: string | null;
    status_id: string | null;
    status_descricao: string | null;
}

const TIPOS_OCORRENCIA = [
    "Pneu Furado",
    "Avaria Mecânica",
    "Acidente",
    "Atraso de Tráfego",
    "Problema com Carga",
    "Combustível",
    "Interdição de Via",
    "Problema com Documentação",
    "Outro",
] as const;

export const ocorrenciaRouter = createTRPCRouter({

    /**
     * Dado uma placa, busca a viagem EM_ANDAMENTO mais recente do veículo.
     * Retorna os dados da viagem, a posição atual e os contatos das bases da rota.
     */
    buscarViagemPorPlaca: protectedProcedure
        .input(z.object({ placa: z.string().trim().toUpperCase() }))
        .query(async ({ ctx, input }) => {
            // 1. Encontrar o veículo pela placa
            const veiculo = await ctx.db.veiculo.findUnique({
                where: { placa: input.placa },
            });

            if (!veiculo) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Nenhum veículo encontrado com a placa "${input.placa}".`,
                });
            }

            // 2. Buscar viagem EM_ANDAMENTO mais recente deste veículo
            const viagem = await ctx.db.viagem.findFirst({
                where: {
                    veiculoId: veiculo.id,
                    status: "EM_ANDAMENTO",
                },
                orderBy: { prevInicioReal: "desc" },
                include: {
                    veiculo: true,
                    baseOrigem: true,
                    baseDestino: true,
                    paradasViagem: {
                        include: { base: true },
                        orderBy: { ordem: "asc" },
                    },
                    ocorrencias: {
                        where: { status: { in: ["ABERTA", "EM_ATENDIMENTO"] } },
                        orderBy: { createdAt: "desc" },
                    },
                },
            });

            if (!viagem) {
                // Tenta encontrar uma viagem PROGRAMADA como fallback
                const viagemProgramada = await ctx.db.viagem.findFirst({
                    where: {
                        veiculoId: veiculo.id,
                        status: "PROGRAMADA",
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
                            where: { status: { in: ["ABERTA", "EM_ATENDIMENTO"] } },
                            orderBy: { createdAt: "desc" },
                        },
                    },
                });

                if (!viagemProgramada) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: `O veículo "${input.placa}" não possui nenhuma viagem ativa (EM_ANDAMENTO ou PROGRAMADA) no momento.`,
                    });
                }

                // Retorna viagem programada sem posição GPS
                return { ...viagemProgramada, ultimaTelemetria: null };
            }

            // 3. Buscar última telemetria (posição atual)
            const ultimaTelemetria = await ctx.db.telemetria.findFirst({
                where: { veiculoId: veiculo.id },
                orderBy: { dataHoraLocal: "desc" },
            });

            return { ...viagem, ultimaTelemetria };
        }),

    /**
     * Cria uma nova ocorrência vinculada a uma viagem.
     */
    abrir: protectedProcedure
        .input(z.object({
            viagemId: z.string(),
            tipoOcorrencia: z.string(),
            descricao: z.string().min(10, "Descreva a ocorrência com ao menos 10 caracteres."),
            latOcorrencia: z.number().optional().nullable(),
            lngOcorrencia: z.number().optional().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            const viagem = await ctx.db.viagem.findUnique({ where: { id: input.viagemId } });
            if (!viagem) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Viagem não encontrada." });
            }

            return ctx.db.ocorrencia.create({
                data: {
                    viagemId: input.viagemId,
                    tipoOcorrencia: input.tipoOcorrencia,
                    descricao: input.descricao,
                    latOcorrencia: input.latOcorrencia ?? null,
                    lngOcorrencia: input.lngOcorrencia ?? null,
                    abertaPorId: ctx.session.user.id,
                    status: "ABERTA",
                },
                include: {
                    viagem: {
                        include: {
                            veiculo: true,
                            baseOrigem: true,
                            baseDestino: true,
                        },
                    },
                    abertaPor: { select: { id: true, name: true } },
                },
            });
        }),

    /**
     * Lista todas as ocorrências abertas ou em atendimento, com dados completos da viagem e telemetria atual.
     */
    listarAbertas: protectedProcedure.query(async ({ ctx }) => {
        await garantirColunasOcorrencia(ctx.db);
        const usuario = await ctx.db.user.findUnique({
            where: { id: ctx.session.user.id },
            select: { baseId: true },
        });

        const where: any = {};
        if (usuario?.baseId) {
            // Se o usuário tem unidade atrelada, vê apenas as que estão em atendimento pela sua unidade
            where.status = "EM_ATENDIMENTO";
            where.unidadeResponsavelId = usuario.baseId;
        } else {
            // Se não tem unidade (Torre), vê todas abertas e em atendimento
            where.status = { in: ["ABERTA", "EM_ATENDIMENTO"] };
        }

        const ocorrencias = await ctx.db.ocorrencia.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                viagem: {
                    include: {
                        veiculo: true,
                        baseOrigem: true,
                        baseDestino: true,
                        paradasViagem: {
                            include: { base: true },
                            orderBy: { ordem: "asc" },
                        },
                    },
                },
                abertaPor: { select: { id: true, name: true } },
                resolvidaPor: { select: { id: true, name: true } },
                acionadoPor: { select: { id: true, name: true } },
                unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
            },
        });

        // Para cada ocorrência, busca a última telemetria do veículo
        const result = await Promise.all(
            ocorrencias.map(async (oc) => {
                const ultimaTelemetria = await ctx.db.telemetria.findFirst({
                    where: { veiculoId: oc.viagem.veiculo.id },
                    orderBy: { dataHoraLocal: "desc" },
                });
                return { ...oc, ultimaTelemetria };
            })
        );

        return result;
    }),

    /**
     * Lista todas as bases (unidades) disponíveis para selecionar como responsável.
     */
    listarBases: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.base.findMany({
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, cidade: true },
        });
    }),

    /**
     * Busca todo o contexto necessário para o Modal de Atendimento e para montar
     * a mensagem de atraso para o WhatsApp:
     * - Dados da viagem, rota completa, atraso na saída da origem, próxima parada e destino final
     * - Manifesto(s) da viagem puxados pela placa do veículo no banco Brudam (minutas e volumes)
     */
    obterContextoAtendimento: protectedProcedure
        .input(z.object({ ocorrenciaId: z.string() }))
        .query(async ({ ctx, input }) => {
            await garantirColunasOcorrencia(ctx.db);

            const oc = await ctx.db.ocorrencia.findUnique({
                where: { id: input.ocorrenciaId },
                include: {
                    viagem: {
                        include: {
                            veiculo: true,
                            baseOrigem: true,
                            baseDestino: true,
                            paradasViagem: {
                                include: { base: true },
                                orderBy: { ordem: "asc" },
                            },
                        },
                    },
                    unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
                    acionadoPor: { select: { id: true, name: true } },
                },
            });

            if (!oc) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Ocorrência não encontrada." });
            }

            const v = oc.viagem;
            const paradas = v.paradasViagem ?? [];
            const primeiraPD = paradas[0];
            const ultimaPD = paradas[paradas.length - 1];

            // 1. Atraso de saída da origem
            const prevSaidaOrigem = primeiraPD?.prevSaida ?? v.prevInicioReal;
            const saidaEfetivaOrigem = v.dataInicioEfetivo ?? primeiraPD?.dataSaidaEfetiva ?? null;
            let atrasoSaidaMinutos: number | null = null;
            if (saidaEfetivaOrigem && prevSaidaOrigem) {
                atrasoSaidaMinutos = Math.round(
                    (new Date(saidaEfetivaOrigem).getTime() - new Date(prevSaidaOrigem).getTime()) / 60000
                );
            }

            // 2. Rota formatada (todas as cidades da rota em sequência)
            const cidadesParadas = paradas.length > 0
                ? paradas.map((p) => p.base.cidade || p.base.nome)
                : [v.baseOrigem.cidade || v.baseOrigem.nome, v.baseDestino.cidade || v.baseDestino.nome];
            const rotaSequencial = cidadesParadas.join(" → ");
            const rotaDescricao = v.rotaDescricao || rotaSequencial;

            // 3. Próxima parada intermediária pendente (se houver) e Destino Final
            let proximaParada: {
                nome: string;
                nomeBase: string;
                ordem: number;
                prevChegada: Date | null;
            } | null = null;

            for (let i = 1; i < paradas.length - 1; i++) {
                const p = paradas[i]!;
                if (!p.dataChegadaEfetiva && !p.dataSaidaEfetiva) {
                    proximaParada = {
                        nome: p.base.cidade || p.base.nome,
                        nomeBase: p.base.nome,
                        ordem: p.ordem,
                        prevChegada: p.prevChegada ?? p.prevSaida ?? null,
                    };
                    break;
                }
            }

            const destinoFinal = {
                nome: ultimaPD ? (ultimaPD.base.cidade || ultimaPD.base.nome) : (v.baseDestino.cidade || v.baseDestino.nome),
                nomeBase: ultimaPD ? ultimaPD.base.nome : v.baseDestino.nome,
                prevChegada: ultimaPD?.prevChegada ?? v.prevFimReal,
            };

            // 4. Busca manifesto(s) no banco Brudam (telemetriaDb) pela placa do veículo
            // seguindo a mesma lógica da página de Auditoria de Manifestos
            const placaOriginal = (v.veiculo.placa ?? "").trim().toUpperCase();
            const placaSemTraco = placaOriginal.replace(/[^A-Z0-9]/g, "");
            const placaComTraco = placaSemTraco.length === 7
                ? `${placaSemTraco.slice(0, 3)}-${placaSemTraco.slice(3)}`
                : placaSemTraco;

            // Janela de busca: 1 dia antes do início previsto até 1 dia após o fim previsto
            const refInicio = new Date(v.prevInicioReal.getTime() - 24 * 60 * 60 * 1000);
            const refFim = new Date(
                Math.max(v.prevFimReal.getTime(), (v.dataFimEfetivo ?? v.prevFimReal).getTime()) + 24 * 60 * 60 * 1000
            );
            const dataInicioStr = refInicio.toISOString().split("T")[0]!;
            const dataFimStr = refFim.toISOString().split("T")[0]!;

            const inicioDiaViagem = new Date(v.prevInicioReal);
            inicioDiaViagem.setHours(0, 0, 0, 0);
            const fimDiaViagem = new Date(v.prevFimReal);
            fimDiaViagem.setHours(23, 59, 59, 999);

            let manifestosEncontrados: Array<{
                idManifesto: number;
                prevSaidaData: string;
                prevSaidaHora: string | null;
                unidade: string;
                placa: string;
                origem: string | null;
                destino: string | null;
                tipoManifesto: string;
                statusManifesto: string;
                qtdMinutas: number;
                totalVolumes: number;
                valorTotal: number;
                selecionadoPadrao: boolean;
                score: number;
                timeDiffMs: number;
            }> = [];

            if (placaSemTraco) {
                try {
                    const manifestosQuery = await telemetriaDb.query<ManifestoViagemRow>(`
                        SELECT
                            m.id_manifesto::text                                      AS id_manifesto,
                            LEFT(m.prev_saida_data::text, 10)                         AS prev_saida_data,
                            m.prev_saida_hora::text                                   AS prev_saida_hora,
                            LEFT(m.saida_efetiva_data::text, 10)                      AS saida_efetiva_data,
                            m.saida_efetiva_hora::text                                AS saida_efetiva_hora,
                            COALESCE(u.fantasia,  m.base::text)                       AS unidade,
                            COALESCE(v.placa, t.ve_placa, '—')                        AS placa,
                            COALESCE(ao.aeroporto, u.fantasia)                        AS origem,
                            COALESCE(ad.aeroporto, ud.fantasia, CASE WHEN (m.tipo = 4 OR m.transf_destino IS NULL OR m.transf_destino = '0') THEN 'Coleta / Entrega Local' ELSE 'Destino não inf.' END) AS destino,
                            mt.tipo                                                   AS tipo_manifesto,
                            m.status::text                                            AS status_id,
                            ms.descricao                                              AS status_descricao
                        FROM manifesto m
                        LEFT JOIN unidades         u  ON u.id_unidade::text   = m.base::text
                        LEFT JOIN unidades         ud ON ud.id_unidade::text  = m.destino::text
                        LEFT JOIN veiculos         v  ON v.id_veiculo = COALESCE(NULLIF(m.veiculo, 0), NULLIF(m.veiculo_terceiro, 0), NULLIF(m.veiculo_agente, 0))
                        LEFT JOIN terceiros        t  ON t.id_terceiro = m.veiculo_terceiro
                        LEFT JOIN aero             ao ON ao.id_aero::text      = m.transf_origem::text
                        LEFT JOIN aero             ad ON ad.id_aero::text      = m.transf_destino::text
                        LEFT JOIN manifesto_tipo   mt ON mt.id_tipo::text     = m.tipo::text
                        LEFT JOIN manifesto_status ms ON ms.id_status::text = m.status::text
                        WHERE m.prev_saida_data::text NOT LIKE '0000%'
                          AND LEFT(m.prev_saida_data::text, 10) >= $1
                          AND LEFT(m.prev_saida_data::text, 10) <= $2
                          AND (m.status IS NULL OR m.status != 3)
                          AND (
                              UPPER(COALESCE(v.placa, '')) IN ($3, $4)
                              OR UPPER(COALESCE(t.ve_placa, '')) IN ($3, $4)
                          )
                        ORDER BY m.id_manifesto DESC
                    `, [dataInicioStr, dataFimStr, placaSemTraco, placaComTraco]);

                    const rows = manifestosQuery.rows;
                    if (rows.length > 0) {
                        const idsManifesto = rows.map((r) => r.id_manifesto);
                        const minutasVolumesQuery = await telemetriaDb.query<{
                            id_manifesto: string;
                            qtd_minutas: string;
                            total_volumes: string;
                            valor_total: string;
                        }>(`
                            SELECT
                                x.id_manifesto::text                                        AS id_manifesto,
                                COUNT(*)::text                                              AS qtd_minutas,
                                COALESCE(SUM(mn.total_volumes), 0)::text                    AS total_volumes,
                                COALESCE(SUM(CAST(mn.total_nf_valor AS NUMERIC)), 0)::text  AS valor_total
                            FROM (
                                SELECT DISTINCT ml.id_manifesto, ml.minuta
                                FROM manifesto_list ml
                                WHERE ml.id_manifesto = ANY($1::bigint[])
                            ) x
                            LEFT JOIN minuta mn ON mn.id_minuta = x.minuta
                            GROUP BY x.id_manifesto
                        `, [idsManifesto]);

                        const mapaMinutas = new Map(minutasVolumesQuery.rows.map((r) => [r.id_manifesto, r]));

                        const rotaUpper = (v.rotaDescricao ?? "").toUpperCase();
                        const cidadesUpper = cidadesParadas.map((c) => c.toUpperCase());

                        const candidatos = rows.map((m) => {
                            const mv = mapaMinutas.get(m.id_manifesto);
                            const qtdMinutas = mv ? parseInt(mv.qtd_minutas, 10) : 0;
                            const totalVolumes = mv ? parseInt(mv.total_volumes, 10) : 0;
                            const valorTotal = mv ? parseFloat(mv.valor_total ?? "0") : 0;

                            let score = 0;
                            const mOrig = (m.origem ?? "").toUpperCase();
                            const mDest = (m.destino ?? "").toUpperCase();

                            const dataMan = new Date(m.prev_saida_data + "T12:00:00");
                            const dentroDiasViagem = dataMan >= inicioDiaViagem && dataMan <= fimDiaViagem;
                            if (dentroDiasViagem) score += 2;

                            if (mOrig && (rotaUpper.includes(mOrig) || cidadesUpper.some((c) => c.includes(mOrig) || mOrig.includes(c)))) {
                                score += 2;
                            }
                            if (mDest && (rotaUpper.includes(mDest) || cidadesUpper.some((c) => c.includes(mDest) || mDest.includes(c)))) {
                                score += 2;
                            }
                            if (mOrig && rotaUpper.startsWith(mOrig)) score += 2;
                            if (mDest && rotaUpper.endsWith(mDest)) score += 2;

                            let timeDiff = Infinity;
                            if (v.prevInicioReal) {
                                let diffPrev = Infinity;
                                let diffEfetiva = Infinity;

                                if (m.prev_saida_hora && m.prev_saida_data) {
                                    const [h, min, s] = m.prev_saida_hora.split(":");
                                    const mDate = new Date(m.prev_saida_data + "T00:00:00");
                                    mDate.setHours(parseInt(h || "0", 10), parseInt(min || "0", 10), parseInt(s || "0", 10));
                                    diffPrev = Math.abs(mDate.getTime() - v.prevInicioReal.getTime());
                                }

                                if (m.saida_efetiva_hora && m.saida_efetiva_data && m.saida_efetiva_data !== "0000-00-00") {
                                    const [h, min, s] = m.saida_efetiva_hora.split(":");
                                    const mDateEfetiva = new Date(m.saida_efetiva_data + "T00:00:00");
                                    mDateEfetiva.setHours(parseInt(h || "0", 10), parseInt(min || "0", 10), parseInt(s || "0", 10));
                                    diffEfetiva = Math.abs(mDateEfetiva.getTime() - v.prevInicioReal.getTime());
                                }

                                timeDiff = Math.min(diffPrev, diffEfetiva);
                            }

                            return {
                                idManifesto: parseInt(m.id_manifesto, 10),
                                prevSaidaData: m.prev_saida_data,
                                prevSaidaHora: m.prev_saida_hora ?? null,
                                unidade: m.unidade ?? "—",
                                placa: m.placa ?? placaOriginal,
                                origem: m.origem ?? null,
                                destino: m.destino ?? null,
                                tipoManifesto: m.tipo_manifesto ?? "—",
                                statusManifesto: m.status_descricao ?? "—",
                                qtdMinutas,
                                totalVolumes,
                                valorTotal,
                                score,
                                timeDiffMs: timeDiff,
                                dentroDiasViagem,
                                selecionadoPadrao: false,
                            };
                        });

                        // Ordena pelos melhores candidatos (maior score, menor diferença de horário, mais minutas)
                        candidatos.sort((a, b) => {
                            if (b.score !== a.score) return b.score - a.score;
                            if (a.timeDiffMs !== b.timeDiffMs) return a.timeDiffMs - b.timeDiffMs;
                            return b.qtdMinutas - a.qtdMinutas;
                        });

                        // Marca como selecionadoPadrao o(s) manifesto(s) da viagem:
                        // Se houver manifestos dentro de 4h da saída da viagem e com score >= 4, seleciona-os;
                        // caso contrário, seleciona o melhor candidato se houver ao menos 1 com minutas > 0 (ou o 1º da lista).
                        const seisHorasMs = 4 * 60 * 60 * 1000;
                        const vinculadosFortes = candidatos.filter(
                            (c) => c.dentroDiasViagem && c.timeDiffMs <= seisHorasMs && c.score >= 4 && c.qtdMinutas > 0
                        );

                        if (vinculadosFortes.length > 0) {
                            const idsFortes = new Set(vinculadosFortes.map((c) => c.idManifesto));
                            for (const c of candidatos) {
                                c.selecionadoPadrao = idsFortes.has(c.idManifesto);
                            }
                        } else if (candidatos.length > 0) {
                            const melhorComMinuta = candidatos.find((c) => c.dentroDiasViagem && c.qtdMinutas > 0)
                                ?? candidatos.find((c) => c.qtdMinutas > 0)
                                ?? candidatos[0]!;
                            melhorComMinuta.selecionadoPadrao = true;
                        }

                        manifestosEncontrados = candidatos;
                    }
                } catch (err) {
                    console.error("[Ocorrencia] Erro ao buscar manifesto no Brudam:", err);
                }
            }

            const selecionados = manifestosEncontrados.filter((m) => m.selecionadoPadrao);
            const qtdMinutasTotal = selecionados.reduce((acc, m) => acc + m.qtdMinutas, 0);
            const totalVolumesTotal = selecionados.reduce((acc, m) => acc + m.totalVolumes, 0);

            return {
                ocorrencia: {
                    id: oc.id,
                    tipoOcorrencia: oc.tipoOcorrencia,
                    descricao: oc.descricao,
                    status: oc.status,
                    notaTorre: oc.notaTorre,
                    unidadeResponsavelId: oc.unidadeResponsavelId,
                    unidadeResponsavelNome: oc.unidadeResponsavel?.nome ?? null,
                    causouParada: oc.causouParada ?? false,
                    tempoAtrasoMinutos: oc.tempoAtrasoMinutos ?? null,
                    createdAt: oc.createdAt,
                },
                viagem: {
                    id: v.id,
                    placa: v.veiculo.placa,
                    motorista: v.motorista,
                    rotaDescricao,
                    rotaSequencial,
                    origemCidade: v.baseOrigem.cidade || v.baseOrigem.nome,
                    destinoCidade: v.baseDestino.cidade || v.baseDestino.nome,
                    prevSaidaOrigem,
                    saidaEfetivaOrigem,
                    atrasoSaidaMinutos,
                    proximaParada,
                    destinoFinal,
                },
                manifesto: {
                    encontrado: manifestosEncontrados.length > 0,
                    qtdMinutas: qtdMinutasTotal,
                    totalVolumes: totalVolumesTotal,
                    itens: manifestosEncontrados,
                },
            };
        }),

    /**
     * Fase 2: Operador da torre assume o atendimento.
     * Registra a nota do que foi conversado com o motorista, se houve parada e tempo de atraso,
     * e define a unidade responsável.
     */
    iniciarAtendimento: protectedProcedure
        .input(z.object({
            id: z.string(),
            notaTorre: z.string().min(10, "Descreva o que foi conversado com o motorista (mínimo 10 caracteres)."),
            unidadeResponsavelId: z.string({ required_error: "Selecione a unidade responsável." }),
            causouParada: z.boolean().optional().default(false),
            tempoAtrasoMinutos: z.number().int().min(0).optional().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            await garantirColunasOcorrencia(ctx.db);

            const oc = await ctx.db.ocorrencia.findUnique({ 
                where: { id: input.id },
                include: {
                    viagem: {
                        include: {
                            veiculo: true,
                            baseOrigem: true,
                            baseDestino: true,
                        }
                    },
                    abertaPor: true,
                }
            });
            if (!oc) throw new TRPCError({ code: "NOT_FOUND", message: "Ocorrência não encontrada." });
            if (oc.status === "RESOLVIDA") {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Esta ocorrência já foi resolvida." });
            }

            const atualizada = await ctx.db.ocorrencia.update({
                where: { id: input.id },
                data: {
                    status: "EM_ATENDIMENTO",
                    notaTorre: input.notaTorre,
                    acionadoEm: new Date(),
                    acionadoPorId: ctx.session.user.id,
                    unidadeResponsavelId: input.unidadeResponsavelId,
                    causouParada: input.causouParada ?? false,
                    tempoAtrasoMinutos: input.causouParada ? (input.tempoAtrasoMinutos ?? null) : null,
                },
            });

            // Busca os usuários da unidade destino para notificar
            const usuariosDestino = await ctx.db.user.findMany({
                where: { 
                    baseId: input.unidadeResponsavelId, 
                    email: { not: "" } 
                },
                select: { email: true, name: true }
            });

            if (usuariosDestino.length > 0) {
                // Dispara os e-mails em background (fire and forget)
                Promise.allSettled(
                    usuariosDestino.map(u => 
                        enviarNotificacaoOcorrencia({
                            destinatarioEmail: u.email!,
                            destinatarioNome: u.name ?? "Equipe da Unidade",
                            tipoOcorrencia: oc.tipoOcorrencia,
                            placa: oc.viagem.veiculo.placa,
                            motorista: oc.viagem.motorista ?? "Não informado",
                            origem: oc.viagem.baseOrigem.cidade,
                            destino: oc.viagem.baseDestino.cidade,
                            descricao: oc.descricao,
                            notaTorre: input.notaTorre,
                            dataAbertura: oc.createdAt,
                            abertaPor: oc.abertaPor?.name ?? "Sistema",
                            ocorrenciaId: oc.id,
                        })
                    )
                ).catch(err => console.error("Erro ao enviar e-mail para unidade:", err));
            }

            return atualizada;
        }),

    /**
     * Atualiza o status de uma ocorrência (mantido para compatibilidade, mas o fluxo principal usa iniciarAtendimento).
     */
    atualizarStatus: protectedProcedure
        .input(z.object({
            id: z.string(),
            status: z.enum(["ABERTA", "EM_ATENDIMENTO"]),
        }))
        .mutation(async ({ ctx, input }) => {
            const oc = await ctx.db.ocorrencia.findUnique({ where: { id: input.id } });
            if (!oc) throw new TRPCError({ code: "NOT_FOUND", message: "Ocorrência não encontrada." });
            if (oc.status === "RESOLVIDA") {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Esta ocorrência já foi resolvida." });
            }

            return ctx.db.ocorrencia.update({
                where: { id: input.id },
                data: { status: input.status },
            });
        }),

    /**
     * Fase 3: Operador da unidade responsável registra a resolução.
     */
    resolver: protectedProcedure
        .input(z.object({
            id: z.string(),
            resolucao: z.string().min(5, "Descreva como a ocorrência foi resolvida."),
        }))
        .mutation(async ({ ctx, input }) => {
            const oc = await ctx.db.ocorrencia.findUnique({ where: { id: input.id } });
            if (!oc) throw new TRPCError({ code: "NOT_FOUND", message: "Ocorrência não encontrada." });
            if (oc.status === "RESOLVIDA") {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Esta ocorrência já foi resolvida." });
            }

            return ctx.db.ocorrencia.update({
                where: { id: input.id },
                data: {
                    status: "RESOLVIDA",
                    resolucao: input.resolucao,
                    resolvidaPorId: ctx.session.user.id,
                    resolvidaEm: new Date(),
                },
            });
        }),

    /**
     * Lista o histórico de ocorrências de uma viagem específica (incluindo resolvidas).
     */
    listarPorViagem: protectedProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            return ctx.db.ocorrencia.findMany({
                where: { viagemId: input },
                orderBy: { createdAt: "asc" },
                include: {
                    abertaPor: { select: { id: true, name: true } },
                    acionadoPor: { select: { id: true, name: true } },
                    unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
                    resolvidaPor: { select: { id: true, name: true } },
                },
            });
        }),

    /**
     * Retorna os tipos de ocorrência disponíveis.
     */
    listarTipos: protectedProcedure.query(() => {
        return TIPOS_OCORRENCIA;
    }),

    /**
     * Lista ocorrências criadas automaticamente via e-mail da AngelLira.
     * Usado pela página de auditoria /admin/emails.
     */
    listarDoEmail: protectedProcedure
        .input(z.object({
            limite: z.number().min(1).max(200).default(50),
        }).optional())
        .query(async ({ ctx, input }) => {
            return ctx.db.ocorrencia.findMany({
                where: { origem: "EMAIL_ANGELLIRA" },
                orderBy: { createdAt: "desc" },
                take: input?.limite ?? 50,
                include: {
                    viagem: {
                        select: {
                            id: true,
                            motorista: true,
                            rotaDescricao: true,
                            veiculo: { select: { placa: true } },
                            baseOrigem: { select: { nome: true } },
                            baseDestino: { select: { nome: true } },
                        },
                    },
                    abertaPor: { select: { id: true, name: true } },
                    acionadoPor: { select: { id: true, name: true } },
                    unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
                    resolvidaPor: { select: { id: true, name: true } },
                },
            });
        }),

    /**
     * Lista todos os usuários ativos do sistema para o modal de notificação.
     * Exclui o bot da AngelLira e retorna apenas quem tem e-mail cadastrado.
     */
    listarUsuariosParaNotificacao: protectedProcedure
        .query(async ({ ctx }) => {
            const usuarios = await ctx.db.user.findMany({
                where: {
                    id: { not: "bot0angellira00000000000001" },
                },
                select: { id: true, name: true, email: true },
                orderBy: { name: "asc" },
            });
            // Filtra client-side quem tem email para evitar problemas de tipos com Prisma nullable
            return usuarios.filter(u => u.email !== null && u.email !== "");
        }),

    /**
     * Envia um e-mail de notificação de ocorrência para o usuário selecionado.
     * Não altera o status da ocorrência.
     */
    notificar: protectedProcedure
        .input(z.object({
            ocorrenciaId: z.string(),
            usuarioDestinatarioId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            // 1. Busca os dados completos da ocorrência
            const ocorrencia = await ctx.db.ocorrencia.findUnique({
                where: { id: input.ocorrenciaId },
                include: {
                    abertaPor: { select: { name: true } },
                    viagem: {
                        include: {
                            veiculo: { select: { placa: true } },
                            baseOrigem: { select: { cidade: true } },
                            baseDestino: { select: { cidade: true } },
                        },
                    },
                },
            });

            if (!ocorrencia) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Ocorrência não encontrada." });
            }

            // 2. Busca o usuário destinatário
            const destinatario = await ctx.db.user.findUnique({
                where: { id: input.usuarioDestinatarioId },
                select: { name: true, email: true },
            });

            if (!destinatario?.email) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Usuário selecionado não possui e-mail cadastrado.",
                });
            }

            // 3. Envia o e-mail (sem alterar status da ocorrência)
            try {
                await enviarNotificacaoOcorrencia({
                    destinatarioEmail: destinatario.email,
                    destinatarioNome: destinatario.name ?? "Responsável",
                    tipoOcorrencia: ocorrencia.tipoOcorrencia,
                    placa: ocorrencia.viagem.veiculo.placa,
                    motorista: ocorrencia.viagem.motorista ?? "Não informado",
                    origem: ocorrencia.viagem.baseOrigem.cidade,
                    destino: ocorrencia.viagem.baseDestino.cidade,
                    descricao: ocorrencia.descricao,
                    dataAbertura: ocorrencia.createdAt,
                    abertaPor: ocorrencia.abertaPor?.name ?? "Sistema",
                    ocorrenciaId: ocorrencia.id,
                });
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Erro desconhecido";
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Falha ao enviar e-mail: ${msg}`,
                });
            }

            return { sucesso: true, destinatario: destinatario.name, email: destinatario.email };
        }),

    /**
     * Lista o histórico completo de ocorrências (todas, incluindo resolvidas).
     * Suporta filtros opcionais e paginação.
     */
    listarHistorico: protectedProcedure
        .input(z.object({
            pagina: z.number().min(1).default(1),
            porPagina: z.number().min(1).max(100).default(20),
            status: z.enum(["TODAS", "ABERTA", "EM_ATENDIMENTO", "RESOLVIDA"]).default("TODAS"),
            placa: z.string().optional(),
            dataInicio: z.string().optional(),
            dataFim: z.string().optional(),
        }).optional())
        .query(async ({ ctx, input }) => {
            await garantirColunasOcorrencia(ctx.db);
            const pagina = input?.pagina ?? 1;
            const porPagina = input?.porPagina ?? 20;
            const skip = (pagina - 1) * porPagina;

            const where: any = {};

            if (input?.status && input.status !== "TODAS") {
                where.status = input.status;
            }
            if (input?.placa) {
                where.viagem = {
                    veiculo: { placa: { contains: input.placa.toUpperCase() } },
                };
            }
            if (input?.dataInicio || input?.dataFim) {
                where.createdAt = {};
                if (input?.dataInicio) where.createdAt.gte = new Date(input.dataInicio);
                if (input?.dataFim) {
                    const fim = new Date(input.dataFim);
                    fim.setHours(23, 59, 59, 999);
                    where.createdAt.lte = fim;
                }
            }

            const [total, ocorrencias] = await Promise.all([
                ctx.db.ocorrencia.count({ where }),
                ctx.db.ocorrencia.findMany({
                    where,
                    skip,
                    take: porPagina,
                    orderBy: { createdAt: "desc" },
                    include: {
                        viagem: {
                            include: {
                                veiculo: { select: { placa: true } },
                                baseOrigem: { select: { cidade: true, nome: true } },
                                baseDestino: { select: { cidade: true, nome: true } },
                            },
                        },
                        abertaPor: { select: { id: true, name: true, email: true } },
                        acionadoPor: { select: { id: true, name: true } },
                        unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
                        resolvidaPor: { select: { id: true, name: true, email: true } },
                    },
                }),
            ]);

            return {
                ocorrencias,
                total,
                paginas: Math.ceil(total / porPagina),
                paginaAtual: pagina,
            };
        }),

    /**
     * Busca TODAS as ocorrências de um período para geração de relatório PDF.
     * Sem paginação — retorna no máximo 500 registros.
     */
    listarParaRelatorio: protectedProcedure
        .input(z.object({
            dataInicio: z.string(),
            dataFim: z.string(),
        }))
        .query(async ({ ctx, input }) => {
            const inicio = new Date(input.dataInicio);
            const fim = new Date(input.dataFim);
            fim.setHours(23, 59, 59, 999);

            return ctx.db.ocorrencia.findMany({
                where: {
                    createdAt: { gte: inicio, lte: fim },
                },
                orderBy: { createdAt: "desc" },
                take: 500,
                include: {
                    viagem: {
                        include: {
                            veiculo: { select: { placa: true } },
                            baseOrigem: { select: { cidade: true } },
                            baseDestino: { select: { cidade: true } },
                        },
                    },
                    abertaPor: { select: { name: true } },
                    acionadoPor: { select: { name: true } },
                    unidadeResponsavel: { select: { nome: true, cidade: true } },
                    resolvidaPor: { select: { name: true } },
                },
            });
        }),

    /**
     * Painel de Gestão para a Torre de Controle:
     * Agrupa as unidades responsáveis que possuem ocorrências ativas (EM_ATENDIMENTO ou ABERTA com unidade),
     * incluindo os usuários vinculados à unidade, contatos, ocorrências detalhadas e última telemetria.
     */
    painelUnidades: protectedProcedure.query(async ({ ctx }) => {
        await garantirColunasOcorrencia(ctx.db);
        // Busca todas as bases que possuem ocorrências ativas vinculadas
        const bases = await ctx.db.base.findMany({
            where: {
                ocorrenciasResponsavel: {
                    some: {
                        status: { in: ["EM_ATENDIMENTO", "ABERTA"] },
                    },
                },
            },
            orderBy: { nome: "asc" },
            include: {
                usuarios: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                    orderBy: { name: "asc" },
                },
                ocorrenciasResponsavel: {
                    where: {
                        status: { in: ["EM_ATENDIMENTO", "ABERTA"] },
                    },
                    orderBy: { createdAt: "desc" },
                    include: {
                        abertaPor: { select: { id: true, name: true, email: true } },
                        acionadoPor: { select: { id: true, name: true, email: true } },
                        viagem: {
                            include: {
                                veiculo: true,
                                baseOrigem: { select: { id: true, nome: true, cidade: true } },
                                baseDestino: { select: { id: true, nome: true, cidade: true } },
                            },
                        },
                    },
                },
            },
        });

        // Para cada ocorrência de cada base, busca a última telemetria do veículo
        const basesComTelemetria = await Promise.all(
            bases.map(async (base) => {
                const ocorrenciasComTelemetria = await Promise.all(
                    base.ocorrenciasResponsavel.map(async (oc) => {
                        const ultimaTelemetria = await ctx.db.telemetria.findFirst({
                            where: { veiculoId: oc.viagem.veiculo.id },
                            orderBy: { dataHoraLocal: "desc" },
                        });
                        return {
                            ...oc,
                            ultimaTelemetria,
                        };
                    })
                );

                return {
                    id: base.id,
                    nome: base.nome,
                    cidade: base.cidade,
                    responsavelNome: base.responsavelNome,
                    responsavelContato: base.responsavelContato,
                    totalOcorrencias: ocorrenciasComTelemetria.length,
                    usuarios: base.usuarios,
                    ocorrencias: ocorrenciasComTelemetria,
                };
            })
        );

        // Também retornamos estatísticas gerais para os KPIs do topo
        const totalGeralOcorrencias = basesComTelemetria.reduce(
            (acc, b) => acc + b.totalOcorrencias,
            0
        );

        return {
            unidades: basesComTelemetria,
            totalUnidadesComOcorrencias: basesComTelemetria.length,
            totalGeralOcorrencias,
        };
    }),

    /**
     * Consulta otimizada para o Painel de TV:
     * Retorna ocorrências criadas ou atualizadas nas últimas 24 horas para alimentar
     * o modal de alerta em tempo real e avisos sonoros (novas, em atendimento ou resolvidas).
     */
    obterAlertasRecentesTV: protectedProcedure.query(async ({ ctx }) => {
        await garantirColunasOcorrencia(ctx.db);
        const limiteHoras = 24;
        const desde = new Date(Date.now() - limiteHoras * 60 * 60 * 1000);

        return ctx.db.ocorrencia.findMany({
            where: {
                updatedAt: { gte: desde },
            },
            orderBy: { updatedAt: "desc" },
            take: 40,
            select: {
                id: true,
                viagemId: true,
                tipoOcorrencia: true,
                descricao: true,
                latOcorrencia: true,
                lngOcorrencia: true,
                status: true,
                origem: true,
                notaTorre: true,
                causouParada: true,
                tempoAtrasoMinutos: true,
                acionadoEm: true,
                resolucao: true,
                resolvidaEm: true,
                createdAt: true,
                updatedAt: true,
                abertaPor: { select: { id: true, name: true } },
                acionadoPor: { select: { id: true, name: true } },
                resolvidaPor: { select: { id: true, name: true } },
                unidadeResponsavel: { select: { id: true, nome: true, cidade: true } },
                viagem: {
                    select: {
                        id: true,
                        motorista: true,
                        rotaDescricao: true,
                        veiculo: { select: { id: true, placa: true } },
                        baseOrigem: { select: { id: true, nome: true, cidade: true } },
                        baseDestino: { select: { id: true, nome: true, cidade: true } },
                    },
                },
            },
        });
    }),
});

