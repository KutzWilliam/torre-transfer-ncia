"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TruckLoader } from "@/components/TruckLoader";

export default function ChegadasUnidadePage() {
    const hoje = format(new Date(), "yyyy-MM-dd");
    const [data, setData] = useState(hoje);

    const { data: unidades, isLoading, isFetching, refetch } = api.manifesto.chegadasPorUnidade.useQuery(
        { data },
        { refetchOnWindowFocus: false, staleTime: 2 * 60 * 1000 }
    );

    const totalChegaram   = unidades?.reduce((s, u) => s + u.chegaram,  0) ?? 0;
    const totalChegando   = unidades?.reduce((s, u) => s + u.chegando,  0) ?? 0;
    const totalManifestos = unidades?.reduce((s, u) => s + u.total,     0) ?? 0;

    const labelData = format(new Date(data + "T12:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* ── Cabecalho ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1400px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Chegadas por Unidade
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5 capitalize">{labelData}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data</span>
                            <input
                                type="date"
                                value={data}
                                onChange={e => setData(e.target.value)}
                                className="text-sm border-0 bg-transparent focus:outline-none text-slate-700 font-medium"
                                id="filtro-data-chegadas"
                            />
                        </div>
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                            id="btn-atualizar-chegadas"
                        >
                            {isFetching ? "Atualizando..." : "Atualizar"}
                        </button>
                        <Link
                            href="/auditoria-manifesto"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Auditoria
                        </Link>
                        <Link
                            href="/dashboard"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">

                {/* ── KPIs ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 border-l-4 border-l-slate-400">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total de Manifestos</p>
                        <p className="text-4xl font-extrabold text-slate-900 mt-1 tabular-nums">{totalManifestos}</p>
                        <p className="text-xs text-slate-400 mt-1">{isLoading ? "..." : `${unidades?.length ?? 0} unidade(s) com manifesto`}</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 border-l-4 border-l-emerald-500">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ja Chegaram</p>
                        <p className="text-4xl font-extrabold text-emerald-600 mt-1 tabular-nums">{totalChegaram}</p>
                        <p className="text-xs text-slate-400 mt-1">viagens finalizadas</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 border-l-4 border-l-blue-500">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chegando</p>
                        <p className="text-4xl font-extrabold text-blue-600 mt-1 tabular-nums">{totalChegando}</p>
                        <p className="text-xs text-slate-400 mt-1">em rota ou programadas</p>
                    </div>
                </div>

                {/* ── Conteudo ── */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <TruckLoader tamanho="lg" mensagem="Carregando chegadas por unidade..." />
                    </div>
                ) : !unidades || unidades.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-24 text-center">
                        <p className="text-5xl mb-4">📭</p>
                        <p className="text-lg font-semibold text-slate-500">Nenhum manifesto com destino registrado nesta data</p>
                        <p className="text-sm text-slate-400 mt-1">Selecione outra data ou verifique os registros no sistema</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {unidades.map(u => {
                            const pctChegaram = u.total > 0 ? (u.chegaram / u.total) * 100 : 0;
                            const tudo = u.chegaram === u.total && u.total > 0;

                            return (
                                <Link
                                    key={u.idAero}
                                    href={`/chegadas-unidade/${u.idAero}?data=${data}`}
                                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 p-5 flex flex-col gap-4 cursor-pointer"
                                    id={`card-unidade-${u.idAero}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h2 className="text-base font-extrabold text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">
                                            {u.nomeUnidade}
                                        </h2>
                                        <span className="text-slate-300 text-lg group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5">→</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1 text-xs font-bold">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {u.chegaram} chegaram
                                        </span>
                                        {u.chegando > 0 && (
                                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1 text-xs font-bold">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                                {u.chegando} chegando
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                                            <span className={tudo ? "text-emerald-600 font-bold" : ""}>
                                                {tudo ? "Todos chegaram" : `${Math.round(pctChegaram)}% concluido`}
                                            </span>
                                            <span>{u.total} manifesto{u.total !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${tudo ? "bg-emerald-500" : "bg-blue-500"}`}
                                                style={{ width: `${pctChegaram}%` }}
                                            />
                                        </div>
                                    </div>

                                    {u.semViagem > 0 && (
                                        <p className="text-[11px] text-amber-600 font-semibold">
                                            {u.semViagem} sem viagem vinculada
                                        </p>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            {isFetching && !isLoading && (
                <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-xs text-slate-600 z-50">
                    <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    Atualizando dados...
                </div>
            )}
        </div>
    );
}
