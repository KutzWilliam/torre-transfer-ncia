import { auth } from "@/server/auth";
import { NextResponse } from "next/server";
import { syncUserSession } from "@/lib/monitor";

// Rotas públicas que NÃO precisam de autenticação
const PUBLIC_ROUTES = ["/login"];
// Prefixos de rotas técnicas que sempre devem passar
// /api/process-emails → autenticado por Bearer token próprio (CRON_SECRET), não por sessão
// /api/sync           → chamado internamente pelo cliente
const PUBLIC_PREFIXES = ["/api/auth", "/api/process-emails", "/api/sync", "/api/relatorio-semanal", "/_next", "/favicon", "/logo", "/cropped"];

export default auth(async (req) => {
    const { pathname } = req.nextUrl;

    // Injeta o pathname como header para o layout poder ler
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    // Libera rotas públicas e assets estáticos
    if (
        PUBLIC_ROUTES.includes(pathname) ||
        PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Se não tem sessão, redireciona para /login
    if (!req.auth) {
        const loginUrl = new URL("/login", req.url);
        // Usa apenas o pathname (não a URL completa) para evitar redirect para localhost
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Integração Torre de Monitoria: Sincronização de Presença & Deslogue Remoto ──
    const user = req.auth.user;
    if (user) {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined;
        const sessionId = (user as any).loginSessionId || user.id || user.email || "sessao-transferencia";

        const monitorStatus = await syncUserSession({
            sessionId,
            userRef: user.email || user.id,
            userName: user.name || user.email || "Usuário Transferência",
            userRole: user.role,
            ip,
        });

        // Se a sessão foi revogada remotamente pelo painel da monitoria:
        if (monitorStatus.revoked) {
            const revokedUrl = new URL("/login", req.url);
            const res = NextResponse.redirect(revokedUrl);
            const cookieOptions = { path: "/", maxAge: 0, expires: new Date(0) };
            res.cookies.set("authjs.session-token", "", cookieOptions);
            res.cookies.set("__Secure-authjs.session-token", "", cookieOptions);
            res.cookies.set("next-auth.session-token", "", cookieOptions);
            res.cookies.set("__Secure-next-auth.session-token", "", cookieOptions);
            res.cookies.delete("authjs.session-token");
            res.cookies.delete("__Secure-authjs.session-token");
            res.cookies.delete("next-auth.session-token");
            res.cookies.delete("__Secure-next-auth.session-token");
            return res;
        }
    }

    // Primeiro acesso: obriga a troca da senha inicial antes de usar o sistema
    const precisaTrocar = req.auth.user?.precisaTrocarSenha === true;
    if (precisaTrocar && pathname !== "/trocar-senha" && !pathname.startsWith("/api/trpc")) {
        return NextResponse.redirect(new URL("/trocar-senha", req.url));
    }
    if (!precisaTrocar && pathname === "/trocar-senha") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
    // Aplica o middleware em todas as rotas exceto arquivos estáticos do Next.js
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)" ],
};

