import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

// Rotas públicas que NÃO precisam de autenticação
const PUBLIC_ROUTES = ["/login"];
// Prefixos de rotas técnicas que sempre devem passar
const PUBLIC_PREFIXES = ["/api/auth", "/_next", "/favicon", "/logo"];

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Libera rotas públicas e assets estáticos
    if (
        PUBLIC_ROUTES.includes(pathname) ||
        PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
        return NextResponse.next();
    }

    // Se não tem sessão, redireciona para /login
    if (!req.auth) {
        const loginUrl = new URL("/login", req.url);
        // Preserva a URL de destino para redirecionar após o login
        loginUrl.searchParams.set("callbackUrl", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    // Aplica o middleware em todas as rotas exceto arquivos estáticos do Next.js
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
