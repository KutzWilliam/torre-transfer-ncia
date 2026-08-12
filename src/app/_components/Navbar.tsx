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
        { href: "/dashboard",             label: "Dashboard Operacional" },
        { href: "/viagens",               label: "Lista de Viagens" },
        { href: "/analise",               label: "Análise de Atrasos",       highlight: true },
        { href: "/auditoria-manifesto",   label: "🛡 Auditoria Manifestos",  highlight: true },
        { href: "/chegadas-unidade",      label: "📦 Chegadas por Unidade",  highlight: true },
        ...(isAdmin ? [
            { href: "/viagens/upload", label: "Upload de Planilha" },
            { href: "/admin",          label: "⚙ Administração",  admin: true },
        ] : []),
    ];


    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                        {/* ── Botão Hambúrguer (Substitui Logo antiga) ── */}
                        <button
                            onClick={() => setMenuAberto(true)}
                            className="flex items-center gap-3 flex-shrink-0 hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer group"
                            title="Abrir Menu"
                        >
                            <svg className="h-6 w-6 text-green-400 group-hover:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <img src="/logo2.png" alt="Princesa dos Campos" className="h-8 w-auto object-contain rounded" />
                            <div className="hidden sm:block text-left">
                                <h1 className="text-lg font-bold tracking-wider text-green-400 leading-tight group-hover:text-green-300">TORRE DE CONTROLE</h1>
                                <p className="text-[10px] text-gray-400 group-hover:text-gray-300">Sistema Operacional de Transferência</p>
                            </div>
                        </button>

                    {/* ── Usuário + Sair (Desktop & Mobile integrados na ponta direita) ── */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden lg:flex flex-col items-end">
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
                        <div className="border-l border-gray-700 h-6 mx-1 hidden sm:block" />
                        <div className="hidden sm:block">
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Overlay Escuro ── */}
            {menuAberto && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setMenuAberto(false)}
                />
            )}

            {/* ── Sidebar (Menu Lateral) ── */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-gray-900 border-r border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    menuAberto ? "translate-x-0" : "-translate-x-full"
                } flex flex-col`}
            >
                {/* Header do Sidebar */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 flex-shrink-0">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Menu Principal</span>
                    <button
                        onClick={() => setMenuAberto(false)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Links do Sidebar */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuAberto(false)}
                            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                                (link as { admin?: boolean }).admin
                                    ? "text-amber-400 hover:text-amber-300 hover:bg-gray-800 border border-amber-500/20"
                                    : (link as { highlight?: boolean }).highlight
                                    ? "text-green-400 hover:text-green-300 hover:bg-gray-800"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                            } ${pathname.startsWith(link.href) && link.href !== "/dashboard" ? "bg-gray-800 text-white" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Footer do Sidebar (Mobile apenas, para o botão Sair) */}
                <div className="p-4 border-t border-gray-800 sm:hidden">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
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
            </div>
        </nav>
    );
}
