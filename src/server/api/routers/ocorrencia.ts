import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        const ocorrencias = await ctx.db.ocorrencia.findMany({
            where: {
                status: { in: ["ABERTA", "EM_ATENDIMENTO"] },
            },
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
     * Atualiza o status de uma ocorrência (ABERTA → EM_ATENDIMENTO).
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
     * Resolve (fecha) uma ocorrência com um texto de resolução.
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
});
