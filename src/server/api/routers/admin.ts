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
// Sub-router de Rotas Padrão
// ============================
const rotasRouter = createTRPCRouter({

    criar: adminProcedure
        .input(z.object({
            nome: z.string().min(2, "Nome da rota obrigatório"),
            origem: z.string().min(2, "Origem obrigatória"),
            destino: z.string().min(2, "Destino obrigatória"),
        }))
        .mutation(async ({ ctx, input }) => {
            const existing = await ctx.db.rotaPadrao.findUnique({ where: { nome: input.nome } });
            if (existing) throw new TRPCError({ code: "CONFLICT", message: "Já existe uma rota com este nome." });

            // Busca ou cria as bases
            let baseOrigem = await ctx.db.base.findUnique({ where: { nome: input.origem } });
            if (!baseOrigem) baseOrigem = await ctx.db.base.create({ data: { nome: input.origem, cidade: input.origem } });

            let baseDestino = await ctx.db.base.findUnique({ where: { nome: input.destino } });
            if (!baseDestino) baseDestino = await ctx.db.base.create({ data: { nome: input.destino, cidade: input.destino } });

            return ctx.db.rotaPadrao.create({
                data: {
                    nome: input.nome.toUpperCase(),
                    paradas: {
                        create: [
                            { baseId: baseOrigem.id, ordem: 0 },
                            { baseId: baseDestino.id, ordem: 1 },
                        ],
                    },
                },
            });
        }),

    listar: adminProcedure.query(async ({ ctx }) => {
        return ctx.db.rotaPadrao.findMany({
            include: {
                _count: { select: { paradas: true, viagens: true } },
            },
            orderBy: { nome: "asc" },
        });
    }),

    obterComParadas: adminProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const rota = await ctx.db.rotaPadrao.findUnique({
                where: { id: input.id },
                include: {
                    paradas: {
                        include: { base: true },
                        orderBy: { ordem: "asc" },
                    },
                },
            });
            if (!rota) throw new TRPCError({ code: "NOT_FOUND", message: "Rota não encontrada." });
            return rota;
        }),

    atualizarParada: adminProcedure
        .input(z.object({
            paradaId: z.string(),
            prevChegada: z.string().nullable(),  // "HH:MM:SS" ou null
            prevSaida: z.string().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.paradaPadrao.update({
                where: { id: input.paradaId },
                data: {
                    prevChegada: input.prevChegada,
                    prevSaida: input.prevSaida,
                },
            });
        }),

    adicionarParada: adminProcedure
        .input(z.object({
            rotaId: z.string(),
            baseNome: z.string().min(2, "Nome da base obrigatório"),
            ordem: z.number().int().min(0),
            prevChegada: z.string().nullable(),
            prevSaida: z.string().nullable(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Busca ou cria a base
            let base = await ctx.db.base.findUnique({ where: { nome: input.baseNome } });
            if (!base) {
                base = await ctx.db.base.create({
                    data: { nome: input.baseNome, cidade: input.baseNome, raioMetros: 500 },
                });
            }

            // Empurra para frente as paradas que estão na posição >= ordem informada
            await ctx.db.paradaPadrao.updateMany({
                where: { rotaId: input.rotaId, ordem: { gte: input.ordem } },
                data: { ordem: { increment: 1 } },
            });

            return ctx.db.paradaPadrao.create({
                data: {
                    rotaId: input.rotaId,
                    baseId: base.id,
                    ordem: input.ordem,
                    prevChegada: input.prevChegada,
                    prevSaida: input.prevSaida,
                },
                include: { base: true },
            });
        }),

    removerParada: adminProcedure
        .input(z.object({ paradaId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const parada = await ctx.db.paradaPadrao.findUnique({ where: { id: input.paradaId } });
            if (!parada) throw new TRPCError({ code: "NOT_FOUND", message: "Parada não encontrada." });

            // Não permite remover origem ou destino (primeira e última)
            const totalParadas = await ctx.db.paradaPadrao.count({ where: { rotaId: parada.rotaId } });
            if (parada.ordem === 0 || parada.ordem === totalParadas - 1) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "Não é possível remover a Origem ou o Destino da rota. Apenas paradas intermediárias podem ser excluídas.",
                });
            }

            await ctx.db.paradaPadrao.delete({ where: { id: input.paradaId } });

            // Renumera as paradas seguintes
            await ctx.db.$executeRaw`
                UPDATE "ParadaPadrao"
                SET ordem = ordem - 1
                WHERE "rotaId" = ${parada.rotaId} AND ordem > ${parada.ordem}
            `;

            return { ok: true };
        }),
});

// ============================
// Router principal de Admin
// ============================
export const adminRouter = createTRPCRouter({
    usuarios: usuariosRouter,
    bases: basesRouter,
    rotas: rotasRouter,

    // Estatísticas para o Hub
    stats: adminProcedure.query(async ({ ctx }) => {
        const [totalUsuarios, totalBases, totalViagens, totalRotas] = await Promise.all([
            ctx.db.user.count(),
            ctx.db.base.count(),
            ctx.db.viagem.count(),
            ctx.db.rotaPadrao.count(),
        ]);
        return { totalUsuarios, totalBases, totalViagens, totalRotas };
    }),
});
