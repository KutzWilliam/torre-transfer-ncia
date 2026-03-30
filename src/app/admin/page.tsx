"use client";

import { api } from "@/trpc/react";
import Link from "next/link";

export default function AdminHubPage() {
    const { data: stats, isLoading } = api.admin.stats.useQuery();

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-8 border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold text-princesa-dark">Painel de Administração</h1>
                    <p className="mt-1 text-gray-500 text-sm">
                        Gerencie usuários, bases e configurações do sistema Torre de Controle.
                    </p>
                </div>

                {/* KPI Strip */}
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Usuários", value: stats?.totalUsuarios, color: "text-blue-600" },
                        { label: "Bases",    value: stats?.totalBases,    color: "text-amber-600" },
                        { label: "Rotas",    value: stats?.totalRotas,    color: "text-purple-600" },
                        { label: "Viagens",  value: stats?.totalViagens,  color: "text-princesa-dark" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-center">
                            <p className="text-sm text-gray-500 mb-1">{label}</p>
                            <p className={`text-3xl font-bold ${color}`}>
                                {isLoading ? "—" : value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link
                        href="/admin/usuarios"
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm p-8 hover:border-princesa-green hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl">
                                👥
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-princesa-dark transition-colors">
                                    Gerenciar Usuários
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Criar, editar, redefinir senhas e excluir usuários do sistema.
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/bases"
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm p-8 hover:border-princesa-green hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-2xl">
                                📍
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-princesa-dark transition-colors">
                                    Gerenciar Bases
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Cadastrar e editar bases operacionais com coordenadas GPS para geocerca.
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/admin/rotas"
                        className="group bg-white rounded-xl border border-gray-200 shadow-sm p-8 hover:border-princesa-green hover:shadow-md transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-2xl">
                                🗺️
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-princesa-dark transition-colors">
                                    Gerenciar Rotas
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Editar horários previstos e adicionar paradas intermediárias às rotas padrão.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/dashboard" className="text-sm text-gray-400 hover:text-princesa-green transition-colors">
                        ← Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
