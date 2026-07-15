module.exports = {
  apps: [
    // ── Aplicação Principal (Next.js) ────────────────────────────────────────
    {
      name: "transferencia",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 3001,
      },
    },
    // ── Cron: Processador de E-mails AngelLira ───────────────────────────────
    // Fica em loop a cada 60 segundos verificando novos alarmes na caixa de entrada.
    // Se o Next.js (transferencia) cair, este processo também para de ter destino,
    // mas se reiniciará quando o Next.js voltar (restart_delay garante a espera).
    {
      name: "email-cron",
      script: "scripts/email-cron.mjs",
      interpreter: "node",
      watch: false,
      restart_delay: 5000,    // Aguarda 5s antes de reiniciar em caso de crash
      max_restarts: 10,       // Limite de reinícios automáticos
      env: {
        APP_URL: "http://localhost:3001",
        CRON_SECRET: "torre-cron-secret-angellira-2025",
        NODE_ENV: "production",
      },
    },
    // ── Cron: Relatório Semanal de Ocorrências ───────────────────────────────
    // Envia o consolidado por gerente toda sexta-feira às 8h
    {
      name: "relatorio-semanal",
      script: "scripts/relatorio-semanal-cron.mjs",
      interpreter: "node",
      cron_restart: "0 8 * * 5",
      autorestart: false,
      env: {
        APP_URL: "http://localhost:3001",
        CRON_SECRET: "torre-cron-secret-angellira-2025",
        NODE_ENV: "production",
      },
    },
  ],
};