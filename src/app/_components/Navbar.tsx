import Link from "next/link";
import { type Session } from "next-auth";
import SignOutButton from "./SignOutButton";

export default function Navbar({ session }: { session: Session | null }) {
    if (!session) return null;

    return (
        <nav className="sticky top-0 z-50 w-full bg-gray-900 border-b border-gray-800 shadow-lg">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Lado Esquerdo — Logo + Título + Links */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img src="/logo2.png" alt="Princesa dos Campos" className="h-8 w-auto object-contain rounded" />
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-bold tracking-wider text-green-400">TORRE DE CONTROLE</h1>
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                    Sistema Operacional de Transferência
                                </p>
                            </div>
                        </Link>

                        {/* Links Centrais (Desktop) */}
                        <div className="hidden sm:flex sm:items-center sm:ml-8 gap-1">
                            <Link href="/dashboard" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Dashboard Operacional
                            </Link>
                            <Link href="/viagens" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Lista de Viagens
                            </Link>
                            <Link href="/analise/origem" className="text-princesa-green hover:text-green-400 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Análise de Atrasos
                            </Link>
                            {session?.user?.role === "ADMIN" && (
                                <>
                                    <Link href="/viagens/upload" className="text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                        Upload de Planilha
                                    </Link>
                                    <Link href="/admin" className="text-amber-400 hover:text-amber-300 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-amber-500/30 rounded-md">
                                        ⚙ Administração
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Lado Direito — Usuário e Sair */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-200">
                                {session.user?.name ?? "Operador"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {session.user?.email ?? "Torre de Controle"}
                            </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow">
                            {(session.user?.name ?? "O").charAt(0).toUpperCase()}
                        </div>
                        <div className="border-l border-gray-700 h-6 mx-1 hidden sm:block"></div>
                        <SignOutButton />
                    </div>

                </div>
            </div>
        </nav>
    );
}
