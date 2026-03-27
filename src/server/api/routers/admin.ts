import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

// Middleware de segurança: bloqueia qualquer acesso que não seja de ADMIN
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
    if (ctx.session.user.role !== "ADMIN") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Acesso negado. Apenas administradores podem realizar esta operação.",
        });
    }
    return next({ ctx });
});

// ============================
// Sub-router de Usuários
// ============================
const usuariosRouter = createTRPCRouter({
    listar: adminProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findMany({
            select: { id: true, name: true, email: true, role: true, baseId: true, base: { select: { nome: true } }, createdAt: true },
            orderBy: { name: "asc" },
        });
    }),

    criar: adminProcedure
        .input(z.object({
            name: z.string().min(2, "Nome obrigatório"),
            email: z.string().email("Email inválido"),
            senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
            role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]),
            baseId: z.string().optional().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.user.findUnique({ where: { email: input.email } });
            if (existing) throw new TRPCError({ code: "CONFLICT", message: "Já existe um usuário com este email." });

            const senhaHash = await bcrypt.hash(input.senha, 10);
            return ctx.db.user.create({
                data: { name: input.name, email: input.email, senhaHash, role: input.role, baseId: input.baseId ?? null },
            });
        }),

    editar: adminProcedure
        .input(z.object({
            id: z.string(),
            name: z.string().min(2),
            role: z.enum(["ADMIN", "GERENTE", "OPERADOR"]),
            baseId: z.string().optional().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: input.id },
                data: { name: input.name, role: input.role, baseId: input.baseId ?? null },
            });
        }),

    alterarSenha: adminProcedure
        .input(z.object({ id: z.string(), novaSenha: z.string().min(6) }))
        .mutation(async ({ ctx, input }) => {
            const senhaHash = await bcrypt.hash(input.novaSenha, 10);
            return ctx.db.user.update({ where: { id: input.id }, data: { senhaHash } });
        }),

    excluir: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (input.id === ctx.session.user.id) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "Você não pode excluir sua própria conta." });
            }
            return ctx.db.user.delete({ where: { id: input.id } });
        }),
});

// ============================
// Sub-router de Bases
// ============================
const basesRouter = createTRPCRouter({
    listar: adminProcedure.query(async ({ ctx }) => {
        return ctx.db.base.findMany({
            include: {
                _count: { select: { viagensOrigem: true, viagensDestino: true, usuarios: true } },
            },
            orderBy: { nome: "asc" },
        });
    }),

    criar: adminProcedure
        .input(z.object({
            nome: z.string().min(2, "Nome obrigatório"),
            cidade: z.string().min(2, "Cidade obrigatória"),
            latitude: z.number().optional().nullable(),
            longitude: z.number().optional().nullable(),
            raioMetros: z.number().int().min(50).default(500),
        }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.base.findUnique({ where: { nome: input.nome } });
            if (existing) throw new TRPCError({ code: "CONFLICT", message: "Já existe uma base com este nome." });
            return ctx.db.base.create({ data: input });
        }),

    editar: adminProcedure
        .input(z.object({
            id: z.string(),
            nome: z.string().min(2),
            cidade: z.string().min(2),
            latitude: z.number().optional().nullable(),
            longitude: z.number().optional().nullable(),
            raioMetros: z.number().int().min(50),
        }))
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.db.base.update({ where: { id }, data });
        }),

    excluir: adminProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const base = await ctx.db.base.findUnique({
                where: { id: input.id },
                include: { _count: { select: { viagensOrigem: true, viagensDestino: true } } },
            });
            if (!base) throw new TRPCError({ code: "NOT_FOUND", message: "Base não encontrada." });
            if (base._count.viagensOrigem > 0 || base._count.viagensDestino > 0) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: `Não é possível excluir: esta base possui ${base._count.viagensOrigem + base._count.viagensDestino} viagem(ns) vinculada(s).`,
                });
            }
            return ctx.db.base.delete({ where: { id: input.id } });
        }),
});

// ============================
// Router principal de Admin
// ============================
export const adminRouter = createTRPCRouter({
    usuarios: usuariosRouter,
    bases: basesRouter,

    // Estatísticas para o Hub
    stats: adminProcedure.query(async ({ ctx }) => {
        const [totalUsuarios, totalBases, totalViagens] = await Promise.all([
            ctx.db.user.count(),
            ctx.db.base.count(),
            ctx.db.viagem.count(),
        ]);
        return { totalUsuarios, totalBases, totalViagens };
    }),
});
