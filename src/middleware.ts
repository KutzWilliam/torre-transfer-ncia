import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

// Rotas públicas que NÃO precisam de autenticação
const PUBLIC_ROUTES = ["/login"];
// Prefixos de rotas técnicas que sempre devem passar
const PUBLIC_PREFIXES = ["/api/auth", "/_next", "/favicon", "/logo", "/cropped"];

export default auth((req) => {
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

    return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
    // Aplica o middleware em todas as rotas exceto arquivos estáticos do Next.js
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)" ],
};

