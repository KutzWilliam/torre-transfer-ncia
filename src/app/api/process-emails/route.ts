/**
 * GET /api/process-emails
 *
 * Endpoint protegido por token (CRON_SECRET) que dispara o processamento
 * dos e-mails da AngelLira e cria as ocorrências no banco de dados.
 *
 * Chamado automaticamente pelo script de cron (scripts/email-cron.mjs)
 * a cada 60 segundos via PM2.
 *
 * Autenticação: Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from "next/server";
import { processarEmailsAngellira } from "@/server/services/emailProcessorService";

export const dynamic = "force-dynamic"; // Nunca cachear

export async function GET(request: Request) {
  // ── Verificação de autenticação ──────────────────────────────────────────────
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const tokenFornecido = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!cronSecret || tokenFornecido !== cronSecret) {
    return NextResponse.json(
      { error: "Não autorizado. Token inválido ou ausente." },
      { status: 401 }
    );
  }

  // ── Processar e-mails ────────────────────────────────────────────────────────
  const inicio = Date.now();
  console.log(
    `\n🔔 [${new Date().toLocaleString("pt-BR")}] Iniciando processamento de e-mails AngelLira...`
  );

  try {
    const resultado = await processarEmailsAngellira();
    const duracao = Date.now() - inicio;

    console.log(
      `✅ Processamento concluído em ${duracao}ms | ` +
      `Criadas: ${resultado.criados} | Ignoradas: ${resultado.ignorados} | Erros: ${resultado.erros}`
    );

    return NextResponse.json({
      sucesso: true,
      duracao_ms: duracao,
      timestamp: new Date().toISOString(),
      resultado,
    });
  } catch (erro) {
    const msg = erro instanceof Error ? erro.message : String(erro);
    console.error(`❌ Erro fatal no processamento de e-mails: ${msg}`);

    return NextResponse.json(
      {
        sucesso: false,
        erro: msg,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
