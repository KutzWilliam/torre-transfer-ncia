import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { SENHA_INICIAL } from "./admin";

export const contaRouter = createTRPCRouter({
    // Troca de senha pelo próprio usuário (usada no primeiro acesso)
    trocarSenha: protectedProcedure
        .input(z.object({
            senhaAtual: z.string().min(1, "Informe a senha atual"),
            novaSenha: z.string().min(8, "A nova senha deve ter ao menos 8 caracteres"),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id } });
            if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado." });

            const atualOk = await bcrypt.compare(input.senhaAtual, user.senhaHash);
            if (!atualOk) throw new TRPCError({ code: "BAD_REQUEST", message: "Senha atual incorreta." });

            if (input.novaSenha === SENHA_INICIAL || input.novaSenha === input.senhaAtual) {
                throw new TRPCError({ code: "BAD_REQUEST", message: "A nova senha deve ser diferente da senha atual/inicial." });
            }

            const senhaHash = await bcrypt.hash(input.novaSenha, 10);
            await ctx.db.user.update({
                where: { id: user.id },
                data: { senhaHash, precisaTrocarSenha: false },
            });
            return { ok: true };
        }),
});
