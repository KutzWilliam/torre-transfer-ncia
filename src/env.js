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
    // ── Integração E-mail AngelLira ─────────────────────────────
    EMAIL_IMAP_HOST: z.string().optional(),
    EMAIL_IMAP_PORT: z.coerce.number().optional(),
    EMAIL_IMAP_USER: z.string().optional(),
    EMAIL_IMAP_PASS: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    ANGELLIRA_BOT_USER_ID: z.string().optional(),
    APP_URL: z.string().url().optional(),
    // ── SMTP Notificações ──────────────────────────────────────
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_SECURE: z.string().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
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
    // Integração e-mail AngelLira
    EMAIL_IMAP_HOST: process.env.EMAIL_IMAP_HOST,
    EMAIL_IMAP_PORT: process.env.EMAIL_IMAP_PORT,
    EMAIL_IMAP_USER: process.env.EMAIL_IMAP_USER,
    EMAIL_IMAP_PASS: process.env.EMAIL_IMAP_PASS,
    CRON_SECRET: process.env.CRON_SECRET,
    ANGELLIRA_BOT_USER_ID: process.env.ANGELLIRA_BOT_USER_ID,
    APP_URL: process.env.APP_URL,
    // SMTP
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
