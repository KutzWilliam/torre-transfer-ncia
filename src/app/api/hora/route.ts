import { NextResponse } from "next/server";

/**
 * GET /api/hora
 *
 * Retorna a hora atual do SERVIDOR (não do cliente).
 * Isso resolve o problema de TVs/computadores com relógio do sistema errado:
 * o frontend busca a hora real aqui e usa o offset para corrigir o relógio local.
 */
export function GET() {
    const agora = new Date();
    return NextResponse.json(
        {
            iso: agora.toISOString(),         // UTC ISO 8601
            ts:  agora.getTime(),             // timestamp Unix em ms
            brt: agora.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                year: "numeric", month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit", second: "2-digit",
                hour12: false,
            }),
        },
        {
            headers: {
                // Nunca cachear — sempre retorna a hora atual
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Pragma": "no-cache",
            },
        }
    );
}
