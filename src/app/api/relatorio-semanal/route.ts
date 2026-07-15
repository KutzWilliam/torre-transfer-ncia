/**
 * GET /api/relatorio-semanal
 *
 * Endpoint protegido por CRON_SECRET que dispara o envio do relatório
 * semanal de ocorrências por regional para todos os destinatários cadastrados.
 *
 * Chamado toda sexta-feira às 8h pelo script scripts/relatorio-semanal-cron.mjs
 */
import { NextResponse } from "next/server";
import { enviarRelatorioSemanal } from "@/server/services/relatorioSemanalService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    // ── Autenticação ──────────────────────────────────────────────────────────
    const cronSecret   = process.env.CRON_SECRET;
    const authHeader   = request.headers.get("authorization");
    const tokenFornecido = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!cronSecret || tokenFornecido !== cronSecret) {
        return NextResponse.json(
            { error: "Não autorizado. Token inválido ou ausente." },
            { status: 401 },
        );
    }

    const inicio = Date.now();
    console.log(`\n📊 [${new Date().toLocaleString("pt-BR")}] Iniciando envio do relatório semanal...`);

    try {
        const resultado = await enviarRelatorioSemanal();
        const duracao   = Date.now() - inicio;

        return NextResponse.json({
            sucesso: true,
            duracao_ms: duracao,
            timestamp: new Date().toISOString(),
            resultado,
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`❌ Erro no relatório semanal: ${msg}`);
        return NextResponse.json({ sucesso: false, erro: msg }, { status: 500 });
    }
}
