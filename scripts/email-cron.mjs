/**
 * email-cron.mjs
 *
 * Script de cron que chama o endpoint /api/process-emails a cada 60 segundos.
 * Gerenciado pelo PM2 em modo cron ou loop.
 *
 * Uso direto: node scripts/email-cron.mjs
 * Uso via PM2: configurado no ecosystem.config.cjs
 */

import { setInterval } from "timers/promises";

const APP_URL = process.env.APP_URL ?? "http://localhost:3001";
const CRON_SECRET = process.env.CRON_SECRET ?? "torre-cron-secret-angellira-2025";
const INTERVALO_MS = 60_000; // 60 segundos

async function processarEmails() {
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  try {
    const response = await fetch(`${APP_URL}/api/process-emails`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30_000), // Timeout de 30s
    });

    if (!response.ok) {
      const texto = await response.text();
      console.error(`[${agora}] ❌ Erro HTTP ${response.status}: ${texto}`);
      return;
    }

    const dados = await response.json();
    if (dados.resultado?.criados > 0) {
      console.log(
        `[${agora}] ✅ ${dados.resultado.criados} ocorrência(s) criada(s) | ` +
        `Ignoradas: ${dados.resultado.ignorados} | Erros: ${dados.resultado.erros}`
      );
    } else {
      // Silencia quando não há e-mails novos (evitar log excessivo)
      process.stdout.write(".");
    }
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro);
    console.error(`[${agora}] ❌ Falha ao chamar endpoint: ${msg}`);
  }
}

// ── Execução ──────────────────────────────────────────────────────────────────
console.log(`\n🚀 Email Cron iniciado — Intervalo: ${INTERVALO_MS / 1000}s`);
console.log(`   Endpoint: ${APP_URL}/api/process-emails`);
console.log(`   Pressione Ctrl+C para parar.\n`);

// Executa imediatamente ao iniciar
await processarEmails();

// Depois repete a cada INTERVALO_MS
for await (const _ of setInterval(INTERVALO_MS)) {
  await processarEmails();
}
