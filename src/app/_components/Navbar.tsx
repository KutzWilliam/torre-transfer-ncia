"use client";

import Link from "next/link";
import { type Session } from "next-auth";
import SignOutButton from "./SignOutButton";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ session }: { session: Session | null }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const pathname = usePathname();

    // Não renderiza nada se não há sessão OU se está na página de login
    if (!session || pathname === "/login") return null;

    const isAdmin = session?.user?.role === "ADMIN";

    const links = [
        { href: "/dashboard",    label: "Dashboard Operacional" },
        { href: "/viagens",      label: "Lista de Viagens" },
        { href: "/analise",      label: "Análise de Atrasos",  highlight: true },
        ...(isAdmin ? [
            { href: "/viagens/upload", label: "Upload de Planilha" },
            { href: "/admin",          label: "⚙ Administração",  admin: true },
        ] : []),
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* ── Logo ── */}
                    <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
                        <img src="/logo2.png" alt="Princesa dos Campos" className="h-8 w-auto object-contain rounded" />
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold tracking-wider text-green-400 leading-tight">TORRE DE CONTROLE</h1>
                            <p className="text-[10px] text-gray-400">Sistema Operacional de Transferência</p>
                        </div>
                    </Link>

                    {/* ── Links Desktop ── */}
                    <div className="hidden lg:flex items-center ml-6 gap-0.5 flex-1 min-w-0">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                    (link as { admin?: boolean }).admin
                                        ? "text-amber-400 hover:text-amber-300 hover:bg-gray-800 border border-amber-500/30"
                                        : (link as { highlight?: boolean }).highlight
                                        ? "text-green-400 hover:text-green-300 hover:bg-gray-800"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                                } ${pathname.startsWith(link.href) && link.href !== "/dashboard" ? "bg-gray-800" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* ── Usuário + Sair (Desktop) ── */}
                    <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-200 leading-tight">
                                {session.user?.name ?? "Operador"}
                            </span>
                            <span className="text-[10px] text-gray-500 max-w-[180px] truncate">
                                {session.user?.email ?? "Torre de Controle"}
                            </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow flex-shrink-0">
                            {(session.user?.name ?? "O").charAt(0).toUpperCase()}
                        </div>
                        <div className="border-l border-gray-700 h-6 mx-1" />
                        <SignOutButton />
                    </div>

                    {/* ── Botão Mobile (hamburguer) ── */}
                    <div className="flex lg:hidden items-center gap-3">
                        {/* Avatar reduzido no mobile */}
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow">
                            {(session.user?.name ?? "O").charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={() => setMenuAberto((prev) => !prev)}
                            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            aria-label="Abrir menu"
                        >
                            {menuAberto ? (
                                // X
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Hamburger
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Menu Mobile (dropdown) ── */}
            {menuAberto && (
                <div className="lg:hidden border-t border-gray-800 bg-gray-900 px-4 pb-4 pt-2 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuAberto(false)}
                            className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                (link as { admin?: boolean }).admin
                                    ? "text-amber-400 hover:bg-gray-800 border border-amber-500/30"
                                    : (link as { highlight?: boolean }).highlight
                                    ? "text-green-400 hover:bg-gray-800"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Separador + info usuário no mobile */}
                    <div className="border-t border-gray-800 mt-2 pt-3 flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-200 truncate">
                                {session.user?.name ?? "Operador"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user?.email ?? ""}
                            </p>
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            )}
        </nav>
    );
}
