"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TruckLoader } from "@/components/TruckLoader";

type ManifestoItem = RouterOutputs["manifesto"]["manifestosPorUnidade"]["manifestos"][number];

function MinutasPanel({ idManifesto, idAero }: { idManifesto: number; idAero: string }) {
    const { data: minutas, isLoading } = api.manifesto.minutasPorManifesto.useQuery(
        { idManifesto, idAero },
        { staleTime: 5 * 60 * 1000 }
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-6">
                <TruckLoader tamanho="sm" mensagem="Carregando minutas..." />
            </div>
        );
    }

    if (!minutas || minutas.length === 0) {
        return (
            <div className="text-center py-6 text-sm text-slate-500">
                Nenhuma minuta encontrada para este manifesto.
            </div>
        );
    }

    function fmtData(d: string | null): string {
        if (!d) return "—";
        // Tenta extrair YYYY-MM-DD usando regex para evitar bugs de fuso horário (UTC vs Local)
        const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
        }
        try {
            const parsed = new Date(d);
            if (isNaN(parsed.getTime())) return d;
            return format(parsed, "dd/MM/yyyy");
        } catch { return d; }
    }

    const minutasDestinoFinal = minutas.filter(m => m.isDestinoFinal);
    const minutasPassagem     = minutas.filter(m => !m.isDestinoFinal);

    return (
        <div className="overflow-x-auto">
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {minutas.length} minuta{minutas.length !== 1 ? "s" : ""}
                </span>
                {minutasPassagem.length > 0 && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                        ⚠️ {minutasPassagem.length} de passagem
                    </span>
                )}
            </div>
            <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead>
                    <tr className="bg-slate-50/80">
                        {["N Minuta", "Remetente", "Destinatario", "Prev. Entrega", "Volumes", "Origem Destino"].map(h => (
                            <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {minutas.map((m) => {
                        const styleClasses = m.isDestinoFinal
                            ? "bg-white hover:bg-slate-50"
                            : "bg-amber-50/30 hover:bg-amber-50/60 opacity-80 border-l-2 border-l-amber-300";

                        const textClasses = m.isDestinoFinal ? "text-slate-700" : "text-amber-900/80";

                        return (
                            <tr key={m.idMinuta} className={`transition-colors ${styleClasses}`}>
                                <td className="px-4 py-2.5 font-mono font-bold text-slate-700 whitespace-nowrap">#{m.idMinuta}</td>
                                <td className={`px-4 py-2.5 max-w-[200px] truncate ${textClasses}`} title={m.clienteRemetente}>{m.clienteRemetente}</td>
                                <td className={`px-4 py-2.5 max-w-[200px] truncate ${textClasses}`} title={m.clienteDestinatario}>{m.clienteDestinatario}</td>
                                <td className="px-4 py-2.5 font-mono text-slate-600 whitespace-nowrap">{fmtData(m.prevEntrega)}</td>
                                <td className="px-4 py-2.5 text-center whitespace-nowrap">
                                    <span className="inline-block bg-slate-100 text-slate-700 font-bold rounded px-2 py-0.5">{m.totalVolumes ?? "—"}</span>
                                </td>
                                <td className="px-4 py-2.5 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1 ${textClasses}`}>
                                        <span className="font-semibold">{m.unidadeOrigem}</span>
                                        <span className="text-slate-400">→</span>
                                        <span className={`font-semibold ${m.isDestinoFinal ? "text-indigo-700" : "text-amber-700"}`}>
                                            {m.unidadeDestino}
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function ManifestoCard({ manifesto, idAero }: { manifesto: ManifestoItem; idAero: string }) {
    const [expandido, setExpandido] = useState(false);

    const corBorda = manifesto.chegou
        ? "border-emerald-200 bg-emerald-50/20"
        : manifesto.viagem
        ? "border-blue-200 bg-blue-50/20"
        : "border-amber-200 bg-amber-50/20";

    return (
        <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${corBorda}`}>
            <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/60 transition-colors gap-4"
                onClick={() => setExpandido(v => !v)}
            >
                <div className="flex items-center gap-4 flex-wrap min-w-0">
                    <span className="font-mono font-extrabold text-slate-800 text-sm whitespace-nowrap">
                        #{manifesto.idManifesto}
                    </span>
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold tracking-wider whitespace-nowrap">
                        {manifesto.placa}
                    </span>
                    {manifesto.origem !== "—" && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">
                            <span className="text-slate-400">de</span>
                            <span className="font-semibold text-blue-700">{manifesto.origem}</span>
                        </span>
                    )}
                    {manifesto.viagem && (
                        <Link
                            href={`/viagens/${manifesto.viagem.id}`}
                            onClick={e => e.stopPropagation()}
                            className="text-xs text-blue-600 hover:underline font-mono whitespace-nowrap"
                        >
                            Viagem #{manifesto.viagem.id}
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {manifesto.chegou ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Chegou
                        </span>
                    ) : manifesto.viagem ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Em Rota
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 whitespace-nowrap">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Sem Viagem
                        </span>
                    )}
                    <span
                        className="text-slate-400 text-xs select-none"
                        style={{ transform: expandido ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}
                    >
                        ▼
                    </span>
                </div>
            </div>

            {expandido && (
                <div className="border-t border-slate-200 bg-white">
                    <MinutasPanel idManifesto={manifesto.idManifesto} idAero={idAero} />
                </div>
            )}
        </div>
    );
}

function Secao({ titulo, cor, manifestos, idAero }: { titulo: string; cor: string; manifestos: ManifestoItem[]; idAero: string }) {
    if (manifestos.length === 0) return null;
    return (
        <section>
            <h2 className={`text-sm font-extrabold uppercase tracking-widest mb-3 flex items-center gap-2 ${cor}`}>
                {titulo} ({manifestos.length})
            </h2>
            <div className="space-y-2">
                {manifestos.map(m => (
                    <ManifestoCard key={m.idManifesto} manifesto={m} idAero={idAero} />
                ))}
            </div>
        </section>
    );
}

export default function DetalheUnidadePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const idAero = String(params.id ?? "");
    const hoje = format(new Date(), "yyyy-MM-dd");
    const data = searchParams.get("data") ?? hoje;

    const { data: resultado, isLoading, isFetching, refetch } = api.manifesto.manifestosPorUnidade.useQuery(
        { idAero, data },
        { refetchOnWindowFocus: false, staleTime: 2 * 60 * 1000 }
    );

    const manifestos = resultado?.manifestos ?? [];
    const nomeUnidade = resultado?.nomeUnidade ?? `Unidade ${idAero}`;

    const chegaram  = manifestos.filter(m => m.chegou);
    const chegando  = manifestos.filter(m => !m.chegou && m.viagem);
    const semViagem = manifestos.filter(m => !m.viagem);

    const labelData = format(new Date(data + "T12:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="min-h-screen bg-slate-50">

            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1200px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <Link
                            href="/chegadas-unidade"
                            className="text-slate-500 hover:text-slate-700 transition-colors text-sm font-semibold whitespace-nowrap flex-shrink-0"
                        >
                            ← Voltar
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-xl font-extrabold text-slate-900 truncate">
                                {isLoading ? "Carregando..." : nomeUnidade}
                            </h1>
                            <p className="text-xs text-slate-500 capitalize">{labelData}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex-shrink-0"
                        id="btn-atualizar-detalhe-unidade"
                    >
                        {isFetching ? "Atualizando..." : "Atualizar"}
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-[1200px] px-6 py-6 space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <TruckLoader tamanho="lg" mensagem="Carregando manifestos..." />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 border-l-4 border-l-emerald-500">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chegaram</p>
                                <p className="text-3xl font-extrabold text-emerald-600 mt-1">{chegaram.length}</p>
                                <p className="text-xs text-slate-400 mt-0.5">viagens finalizadas</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 border-l-4 border-l-blue-500">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">A Chegar</p>
                                <p className="text-3xl font-extrabold text-blue-600 mt-1">{chegando.length}</p>
                                <p className="text-xs text-slate-400 mt-0.5">em rota ou programadas</p>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 border-l-4 border-l-amber-400">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sem Viagem</p>
                                <p className="text-3xl font-extrabold text-amber-600 mt-1">{semViagem.length}</p>
                                <p className="text-xs text-slate-400 mt-0.5">sem rastreio vinculado</p>
                            </div>
                        </div>

                        {manifestos.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 text-center">
                                <p className="text-5xl mb-4">📭</p>
                                <p className="text-lg font-semibold text-slate-500">
                                    Nenhum manifesto encontrado para esta unidade nesta data
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
                                <Secao titulo="Chegaram" cor="text-emerald-700" manifestos={chegaram} idAero={idAero} />
                                <Secao titulo="A Chegar" cor="text-blue-700" manifestos={chegando} idAero={idAero} />
                                <Secao titulo="Sem Viagem Vinculada" cor="text-amber-700" manifestos={semViagem} idAero={idAero} />
                            </div>
                        )}
                    </>
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