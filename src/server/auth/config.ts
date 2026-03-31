import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "GERENTE" | "OPERADOR";
      baseId: string | null;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Forçando o Prisma a trazer exatamente os campos que a nossa regra de negócio precisa
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
            select: {
              id: true,
              name: true,
              email: true,
              senhaHash: true,
              role: true,
              baseId: true,
            }
          });

          if (!user || !user.senhaHash) {
            console.error("Usuário não encontrado ou sem senha registrada no banco.");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.senhaHash);

          if (!isValid) {
            console.error("Senha inválida digitada.");
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            baseId: user.baseId,
          };
        } catch (error) {
          console.error("Erro interno no authorize do NextAuth (Banco de dados fora ar ou outro erro):", error);
          return null; // Retorna null para sinalizar credenciais inválidas em vez de quebrar a API com erro 500
        }
      },
    }),
  ],
  // A linha do PrismaAdapter foi removida aqui!
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        // @ts-expect-error - ignorando tipagem customizada
        token.role = user.role;
        // @ts-expect-error
        token.baseId = user.baseId;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "ADMIN" | "GERENTE" | "OPERADOR",
          baseId: token.baseId as string | null,
        },
      };
    },
    // Garante que os redirects SEMPRE usem a baseUrl como prefixo para evitar erros do tipo "Invalid URL"
    redirect({ url, baseUrl }) {
      // Se for um path relativo (ex: "/dashboard"), converta para absoluto
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      try {
        const parsed = new URL(url);
        // Garantimos que a URL final retorne usando o baseUrl apropriado, mas com o path correto
        return `${baseUrl}${parsed.pathname}${parsed.search}`;
      } catch {
        return `${baseUrl}/dashboard`;
      }
    },
  },
} satisfies NextAuthConfig;