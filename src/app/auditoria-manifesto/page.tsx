"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TruckLoader } from "@/components/TruckLoader";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMoeda(valor: number): string {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDataHora(d: Date | string | null): string {
    if (!d) return "—";
    return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusItem = "OK" | "ALERTA";

interface AuditoriaItem {
    idManifesto: number;
    prevSaidaData: string;
    prevSaidaHora: string | null;
    unidade: string;
    placa: string;
    origem: string | null;
    destino: string | null;
    valorTotal: number;
    temViagem: boolean;
    viagemId: string | null;
    status: StatusItem;
    tipoManifesto: string;
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, colorClass }: {
    icon: string; label: string; value: string | number; sub?: string; colorClass: string;
}) {
    return (
        <div className={`rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 ${colorClass}`}>
            <div className="flex items-center gap-2 text-gray-500">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 tabular-nums">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

function StatusBadge({ status }: { status: StatusItem }) {
    if (status === "OK") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Viagem OK
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            ⚠ Sem Viagem
        </span>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function AuditoriaManifestoPage() {
    const hoje = format(new Date(), "yyyy-MM-dd");
    const [dataSelecionada, setDataSelecionada] = useState(hoje);
    const [buscaPlaca, setBuscaPlaca] = useState("");
    const [buscaUnidade, setBuscaUnidade] = useState("");
    const [filtroStatus, setFiltroStatus] = useState<"TODOS" | "ALERTA" | "OK">("TODOS");
    const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");

    // Datas disponíveis (últimas com manifesto)
    const { data: datasDisp } = api.manifesto.datasDisponiveis.useQuery(undefined, {
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    });

    // Auditoria do dia selecionado
    const { data, isLoading, isFetching, error, refetch } = api.manifesto.auditoria.useQuery(
        { data: dataSelecionada },
        {
            refetchOnWindowFocus: false,
            staleTime: 2 * 60 * 1000,
        }
    );

    // Itens filtrados
    const itensFiltrados = useMemo<AuditoriaItem[]>(() => {
        if (!data?.itens) return [];
        return (data.itens as AuditoriaItem[]).filter(item => {
            const matchPlaca = !buscaPlaca || item.placa.toLowerCase().includes(buscaPlaca.toLowerCase());
            const matchUnidade = !buscaUnidade || item.unidade.toLowerCase().includes(buscaUnidade.toLowerCase());
            const matchStatus = filtroStatus === "TODOS" || item.status === filtroStatus;
            const matchTipo = filtroTipo === "TODOS" || item.tipoManifesto === filtroTipo;
            return matchPlaca && matchUnidade && matchStatus && matchTipo;
        });
    }, [data?.itens, buscaPlaca, buscaUnidade, filtroStatus, filtroTipo]);

    const tiposDisponiveis = useMemo(() => {
        if (!data?.itens) return [];
        const tipos = (data.itens as AuditoriaItem[]).map(i => i.tipoManifesto).filter(Boolean);
        return Array.from(new Set(tipos)).sort();
    }, [data?.itens]);

    const labelData = dataSelecionada
        ? format(new Date(dataSelecionada + "T12:00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
        : "—";

    const kpiTotal = itensFiltrados.length;
    const kpiComAlerta = itensFiltrados.filter(i => i.status === "ALERTA").length;
    const kpiSemAlerta = itensFiltrados.filter(i => i.status === "OK").length;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Cabeçalho ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1600px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            🛡 Auditoria de Manifestos
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Verificação de viagens registradas para manifestos com valor acima de <strong>R$ 140.000</strong> • {labelData}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            href="/analise"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Análise de Atrasos
                        </Link>
                        <Link
                            href="/dashboard"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            ← Dashboard Operacional
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">

                {/* ── Painel de Explicação ── */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <div>
                        <p className="text-sm font-bold text-amber-800">Como funciona esta auditoria?</p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            Para cada manifesto com <strong>valor total de notas acima de R$ 140.000</strong>, verificamos se há uma
                            viagem cadastrada no sistema com a <strong>mesma placa</strong> e a <strong>mesma data de saída prevista</strong>.
                            Manifestos sem viagem registrada representam um <strong>risco operacional</strong>: o veículo pode estar
                            realizando uma transferência de alto valor sem monitoramento ativo.
                        </p>
                    </div>
                </div>

                {/* ── Filtros ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-4 items-end">

                    {/* Seletor de Data */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data do Manifesto</p>
                        <input
                            type="date"
                            value={dataSelecionada}
                            onChange={(e) => setDataSelecionada(e.target.value)}
                            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                            id="filtro-data-manifesto"
                        />
                    </div>

                    {/* Datas rápidas com manifesto */}
                    {datasDisp && datasDisp.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Datas Recentes</p>
                            <div className="flex gap-1 flex-wrap max-w-xs">
                                {datasDisp.slice(0, 6).map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setDataSelecionada(d)}
                                        className={`px-2 py-1 text-xs rounded-md font-medium transition-all ${
                                            dataSelecionada === d
                                                ? "bg-amber-500 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                    >
                                        {format(new Date(d + "T12:00:00"), "dd/MM")}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filtro Status */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</p>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
                            {([
                                { key: "TODOS", label: "Todos", icon: "📋" },
                                { key: "ALERTA", label: "Sem Viagem", icon: "🔴" },
                                { key: "OK",     label: "Com Viagem", icon: "✅" },
                            ] as { key: "TODOS" | "ALERTA" | "OK"; label: string; icon: string }[]).map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setFiltroStatus(key)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                                        filtroStatus === key
                                            ? "bg-white text-amber-700 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    <span>{icon}</span>
                                    <span className="hidden sm:inline">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Busca Placa */}
                    <div className="space-y-1.5 min-w-[160px]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placa</p>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                            <input
                                type="text"
                                placeholder="Ex: ABC1234"
                                value={buscaPlaca}
                                onChange={(e) => setBuscaPlaca(e.target.value)}
                                className="w-full text-sm pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                id="filtro-placa-manifesto"
                            />
                        </div>
                    </div>

                    {/* Busca Unidade */}
                    <div className="space-y-1.5 min-w-[180px]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade de Origem</p>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                            <input
                                type="text"
                                placeholder="Nome da unidade..."
                                value={buscaUnidade}
                                onChange={(e) => setBuscaUnidade(e.target.value)}
                                className="w-full text-sm pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                id="filtro-unidade-manifesto"
                            />
                        </div>
                    </div>

                    {/* Filtro Tipo de Manifesto */}
                    {tiposDisponiveis.length > 0 && (
                        <div className="space-y-1.5 min-w-[140px]">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</p>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all cursor-pointer"
                                id="filtro-tipo-manifesto"
                            >
                                <option value="TODOS">Todos</option>
                                {tiposDisponiveis.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Atualizar */}
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                        id="btn-atualizar-auditoria"
                    >
                        🔄 {isFetching ? "Atualizando..." : "Atualizar"}
                    </button>
                </div>

                {/* ── Conteúdo ── */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <TruckLoader tamanho="lg" mensagem="Auditando manifestos do dia..." />
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <p className="text-3xl mb-3">❌</p>
                        <p className="text-lg font-semibold text-red-700">Erro ao carregar dados</p>
                        <p className="text-sm text-red-500 mt-1">{error.message}</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : data ? (
                    <>
                        {/* ── KPIs ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <KpiCard
                                icon="📋"
                                label="Manifestos Auditados"
                                value={kpiTotal}
                                sub="com valor acima de R$ 140.000"
                                colorClass="border-l-amber-400"
                            />
                            <KpiCard
                                icon="✅"
                                label="Com Viagem Registrada"
                                value={kpiSemAlerta}
                                sub="monitoramento confirmado"
                                colorClass="border-l-emerald-500"
                            />
                            <KpiCard
                                icon="🚨"
                                label="Sem Viagem no Sistema"
                                value={kpiComAlerta}
                                sub={kpiComAlerta > 0 ? "⚠ requer atenção imediata" : "nenhum pendente"}
                                colorClass={kpiComAlerta > 0 ? "border-l-red-600" : "border-l-slate-200"}
                            />
                        </div>

                        {/* ── Banner de alerta ── */}
                        {kpiComAlerta > 0 && (
                            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex gap-3 items-center">
                                <span className="text-3xl flex-shrink-0">🚨</span>
                                <div>
                                    <p className="text-sm font-extrabold text-red-800">
                                        {kpiComAlerta} manifesto{kpiComAlerta > 1 ? "s" : ""} sem viagem cadastrada!
                                    </p>
                                    <p className="text-xs text-red-600 mt-0.5">
                                        Estes veículos estão realizando transferências de alto valor sem monitoramento registrado no sistema.
                                        Verifique imediatamente com a unidade de origem.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ── Tabela ── */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                        📦 Manifestos com Valor Acima de R$ 140.000
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {itensFiltrados.length} de {data.totalManifestos} manifesto(s) exibido(s) •{" "}
                                        {format(new Date(dataSelecionada + "T12:00:00"), "dd/MM/yyyy")}
                                    </p>
                                </div>
                                {isFetching && !isLoading && (
                                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                        Atualizando...
                                    </span>
                                )}
                            </div>

                            {data.totalManifestos === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-4xl mb-3">📭</p>
                                    <p className="text-lg font-semibold text-gray-500">
                                        Nenhum manifesto acima de R$ 140.000 nesta data
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Selecione outra data ou verifique se há manifestos registrados no sistema
                                    </p>
                                </div>
                            ) : itensFiltrados.length === 0 ? (
                                <div className="py-16 text-center">
                                    <p className="text-3xl mb-3">🔍</p>
                                    <p className="text-base font-semibold text-gray-500">Nenhum resultado para os filtros aplicados</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {[
                                                    "Nº Manifesto",
                                                    "Tipo",
                                                    "Data / Hora Saída",
                                                    "Unidade de Origem",
                                                    "Origem → Destino",
                                                    "Placa",
                                                    "Valor Total das Notas",
                                                    "Viagem no Sistema",
                                                    "Código da Viagem",
                                                    "Status",
                                                ].map(h => (
                                                    <th
                                                        key={h}
                                                        className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {itensFiltrados.map((item) => (
                                                <tr
                                                    key={item.idManifesto}
                                                    className={`transition-colors ${
                                                        item.status === "ALERTA"
                                                            ? "bg-red-50/60 hover:bg-red-50"
                                                            : "hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {/* Nº Manifesto */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="font-bold text-slate-800 text-sm font-mono">
                                                            #{item.idManifesto}
                                                        </span>
                                                    </td>

                                                    {/* Tipo */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {item.tipoManifesto}
                                                        </span>
                                                    </td>

                                                    {/* Data/Hora */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="text-sm text-slate-700">
                                                            {format(new Date(item.prevSaidaData + "T12:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                                                        </span>
                                                        {item.prevSaidaHora && (
                                                            <span className="ml-1.5 text-xs text-slate-500 font-mono">
                                                                {String(item.prevSaidaHora).substring(0, 5)}
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Unidade */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="text-sm font-medium text-slate-800">
                                                            {item.unidade || "—"}
                                                        </span>
                                                    </td>

                                                    {/* Origem → Destino */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {(item.origem ?? item.destino) ? (
                                                            <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                                                                <span className="font-semibold text-blue-700">{item.origem ?? "—"}</span>
                                                                <span className="text-slate-400">→</span>
                                                                <span className="font-semibold text-indigo-700">{item.destino ?? "—"}</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-slate-400">—</span>
                                                        )}
                                                    </td>

                                                    {/* Placa */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className="text-sm font-mono font-bold text-slate-900 tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                                                            {item.placa}
                                                        </span>
                                                    </td>

                                                    {/* Valor Total */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <span className={`text-sm font-extrabold tabular-nums ${
                                                            item.valorTotal >= 200000
                                                                ? "text-red-700"
                                                                : item.valorTotal >= 170000
                                                                ? "text-orange-600"
                                                                : "text-amber-700"
                                                        }`}>
                                                            {fmtMoeda(item.valorTotal)}
                                                        </span>
                                                    </td>

                                                    {/* Viagem no Sistema */}
                                                    <td className="px-4 py-3 whitespace-nowrap text-center">
                                                        {item.temViagem ? (
                                                            <span className="text-emerald-600 text-lg">✅</span>
                                                        ) : (
                                                            <span className="text-red-600 text-lg">❌</span>
                                                        )}
                                                    </td>

                                                    {/* Código da Viagem */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {item.viagemId ? (
                                                            <Link
                                                                href={`/viagens/${item.viagemId}`}
                                                                className="text-blue-600 font-bold hover:underline text-sm font-mono"
                                                            >
                                                                #{item.viagemId}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-xs text-red-500 font-medium">
                                                                Não encontrado
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <StatusBadge status={item.status} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* ── Legenda ── */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">📖 Legenda</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-600">
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-600 mt-0.5">✅</span>
                                    <span><strong>Viagem OK:</strong> Encontramos uma viagem cadastrada no sistema com a mesma placa e data do manifesto. O veículo está sendo monitorado.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-red-600 mt-0.5">❌</span>
                                    <span><strong>Sem Viagem:</strong> Nenhuma viagem foi encontrada para esta placa nesta data. O veículo pode estar realizando uma transferência sem monitoramento.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-600 mt-0.5">⚠️</span>
                                    <span><strong>Critério:</strong> Apenas manifestos cujo somatório das notas (minutas) ultrapassa <strong>R$ 140.000</strong> são auditados.</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </main>

            {/* Indicador de refetch */}
            {isFetching && !isLoading && (
                <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-xs text-slate-600 z-50">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    Atualizando dados...
                </div>
            )}
        </div>
    );
}
