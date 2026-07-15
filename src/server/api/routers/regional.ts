import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

// ─── Helpers de autorização ───────────────────────────────────────────────────

function assertAdmin(ctx: { session: { user: { role: string } } }) {
    if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Apenas administradores podem realizar esta ação." });
    }
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const regionalRouter = createTRPCRouter({

    // ── Regionais ─────────────────────────────────────────────────────────────

    /** Lista todas as regionais com seus veículos */
    listar: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.regional.findMany({
            orderBy: { nome: "asc" },
            include: {
                veiculos: {
                    orderBy: { placa: "asc" },
                },
                _count: { select: { veiculos: true } },
            },
        });
    }),

    /** Cria uma nova regional (admin only) */
    criar: protectedProcedure
        .input(z.object({ nome: z.string().min(2).max(100) }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.regional.create({ data: { nome: input.nome.trim().toUpperCase() } });
        }),

    /** Renomeia uma regional (admin only) */
    editar: protectedProcedure
        .input(z.object({ id: z.string(), nome: z.string().min(2).max(100) }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.regional.update({
                where: { id: input.id },
                data: { nome: input.nome.trim().toUpperCase() },
            });
        }),

    /** Exclui uma regional e todos os seus veículos (admin only) */
    excluir: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.regional.delete({ where: { id: input.id } });
        }),

    // ── Veículos da Regional ──────────────────────────────────────────────────

    /** Adiciona um veículo a uma regional (admin only) */
    adicionarVeiculo: protectedProcedure
        .input(z.object({
            regionalId:  z.string(),
            placa:       z.string().min(5).max(10),
            unidade:     z.string().optional(),
            proprietario: z.string().optional(),
            responsavel: z.string().optional(),
            gerente:     z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            const placa = input.placa.trim().toUpperCase();
            return ctx.db.veiculoRegional.upsert({
                where: { placa },
                update: {
                    unidade: input.unidade,
                    proprietario: input.proprietario,
                    responsavel: input.responsavel,
                    gerente: input.gerente,
                    regionalId: input.regionalId,
                },
                create: {
                    placa,
                    unidade: input.unidade,
                    proprietario: input.proprietario,
                    responsavel: input.responsavel,
                    gerente: input.gerente,
                    regionalId: input.regionalId,
                },
            });
        }),

    /** Edita os dados de um veículo (admin only) */
    editarVeiculo: protectedProcedure
        .input(z.object({
            id:          z.string(),
            placa:       z.string().min(5).max(10),
            unidade:     z.string().optional(),
            proprietario: z.string().optional(),
            responsavel: z.string().optional(),
            gerente:     z.string().optional(),
            regionalId:  z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.veiculoRegional.update({
                where: { id: input.id },
                data: {
                    placa: input.placa.trim().toUpperCase(),
                    unidade: input.unidade,
                    proprietario: input.proprietario,
                    responsavel: input.responsavel,
                    gerente: input.gerente,
                    regionalId: input.regionalId,
                },
            });
        }),

    /** Remove um veículo de uma regional (admin only) */
    removerVeiculo: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.veiculoRegional.delete({ where: { id: input.id } });
        }),

    // ── Destinatários do Relatório Semanal ────────────────────────────────────

    /** Lista usuários com flag de recebimento do relatório semanal */
    listarDestinatarios: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true, email: true, role: true, recebeRelatorioSemanal: true },
        });
    }),

    /** Alterna o recebimento do relatório semanal para um usuário (admin only) */
    toggleRelatorioSemanal: protectedProcedure
        .input(z.object({ userId: z.string(), recebe: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            assertAdmin(ctx);
            return ctx.db.user.update({
                where: { id: input.userId },
                data: { recebeRelatorioSemanal: input.recebe },
            });
        }),
});
