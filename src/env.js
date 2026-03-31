import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    // AUTH_URL é a URL base do sistema (necessária para redirects corretos em produção)
    // Ex: http://172.20.10.210:3001
    // Se não definido, o NextAuth tentará inferir automaticamente (pode dar localhost).
    AUTH_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url(),
    TELEMETRIA_DB_URL: z.string().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_URL: process.env.AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    TELEMETRIA_DB_URL: process.env.TELEMETRIA_DB_URL,
    NODE_ENV: process.env.NODE_ENV,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
