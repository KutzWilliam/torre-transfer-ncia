"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type NivelAlerta = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO";
type PeriodoFiltro = "HOJE" | "SEMANA" | "MES" | "DIA_CUSTOM" | "MES_CUSTOM";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtMin(min: number): string {
    if (min <= 0) return "No prazo";
    const h = Math.floor(min / 60);
    const m = min % 60;
    if (h === 0) return `+${m}min`;
    return `+${h}h${m > 0 ? m + "min" : ""}`;
}

function fmtDuracao(min: number | null): string {
    if (min === null) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h${m.toString().padStart(2, "0")}min`;
}

function fmtDataHora(d: Date | string | null): string {
    if (!d) return "—";
    return format(new Date(d), "dd/MM HH:mm", { locale: ptBR });
}

function fmtHora(d: Date | string | null): string {
    if (!d) return "—";
    return format(new Date(d), "HH:mm");
}

const NIVEL_CONFIG: Record<NivelAlerta, { label: string; bg: string; text: string; bar: string; dot: string }> = {
    PONTUAL:  { label: "Pontual",  bg: "bg-emerald-50",  text: "text-emerald-700", bar: "bg-emerald-500", dot: "bg-emerald-500" },
    ATENCAO:  { label: "Atenção",  bg: "bg-amber-50",    text: "text-amber-700",   bar: "bg-amber-400",   dot: "bg-amber-400"   },
    ATRASADO: { label: "Atrasado", bg: "bg-orange-50",   text: "text-orange-700",  bar: "bg-orange-500",  dot: "bg-orange-500"  },
    CRITICO:  { label: "Crítico",  bg: "bg-red-50",      text: "text-red-700",     bar: "bg-red-600",     dot: "bg-red-600"     },
};

// ─── Componentes Auxiliares ───────────────────────────────────────────────────

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

function BarraHorizontal({ label, value, maxValue, count, atrasadas }: {
    label: string; value: number; maxValue: number; count: number; atrasadas: number;
}) {
    const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    const cor = value >= 120 ? "bg-red-500" : value >= 60 ? "bg-orange-500" : value >= 30 ? "bg-amber-400" : "bg-emerald-400";
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-gray-700 truncate flex-1 min-w-0" title={label}>{label}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-400">{atrasadas}/{count} viagens</span>
                    <span className="font-bold text-gray-800 w-16 text-right">{fmtMin(value)}</span>
                </div>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-500 ${cor}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function DonutPontualidade({ dist, total }: {
    dist: Record<NivelAlerta, number>; total: number;
}) {
    const itens: { nivel: NivelAlerta; count: number }[] = [
        { nivel: "PONTUAL",  count: dist.PONTUAL  },
        { nivel: "ATENCAO",  count: dist.ATENCAO  },
        { nivel: "ATRASADO", count: dist.ATRASADO },
        { nivel: "CRITICO",  count: dist.CRITICO  },
    ];

    return (
        <div className="flex flex-col gap-3">
            {itens.map(({ nivel, count }) => {
                const cfg = NIVEL_CONFIG[nivel];
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                    <div key={nivel} className="space-y-0.5">
                        <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                <span className={`font-semibold ${cfg.text}`}>{cfg.label}</span>
                            </div>
                            <span className="font-bold text-gray-700">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div className={`h-2 rounded-full ${cfg.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function AnalisePage() {
    const hoje = new Date();
    const [periodo, setPeriodo] = useState<PeriodoFiltro>("SEMANA");
    const [diaCustom, setDiaCustom] = useState(format(hoje, "yyyy-MM-dd"));
    const [mesCustom, setMesCustom] = useState(format(hoje, "yyyy-MM"));
    const [baseOrigemNome, setBaseOrigemNome] = useState<string>("");

    // Calcula intervalo de datas com base no filtro
    const { dataInicio, dataFim } = useMemo(() => {
        switch (periodo) {
            case "HOJE":
                return { dataInicio: format(hoje, "yyyy-MM-dd"), dataFim: format(hoje, "yyyy-MM-dd") };
            case "SEMANA": {
                const s = startOfWeek(hoje, { weekStartsOn: 1 });
                const e = endOfWeek(hoje, { weekStartsOn: 1 });
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
            case "MES": {
                const s = startOfMonth(hoje);
                const e = endOfMonth(hoje);
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
            case "DIA_CUSTOM":
                return { dataInicio: diaCustom, dataFim: diaCustom };
            case "MES_CUSTOM": {
                const base = new Date(mesCustom + "-01");
                const s = startOfMonth(base);
                const e = endOfMonth(base);
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodo, diaCustom, mesCustom]);

    const { data, isLoading } = api.viagem.obterAnalytics.useQuery(
        { dataInicio, dataFim, baseOrigemNome: baseOrigemNome || undefined },
        { refetchOnWindowFocus: false }
    );

    const [ordenacao, setOrdenacao] = useState<"atrasoChegadaMin" | "prevInicio">("prevInicio");

    const viagensOrdenadas = useMemo(() => {
        if (!data?.viagens) return [];
        return [...data.viagens].sort((a, b) =>
            ordenacao === "atrasoChegadaMin"
                ? b.atrasoChegadaMin - a.atrasoChegadaMin
                : new Date(b.prevInicio).getTime() - new Date(a.prevInicio).getTime()
        );
    }, [data?.viagens, ordenacao]);

    const labelPeriodo = {
        HOJE: "Hoje",
        SEMANA: "Esta Semana",
        MES: "Este Mês",
        DIA_CUSTOM: format(new Date(diaCustom + "T12:00:00"), "dd/MM/yyyy"),
        MES_CUSTOM: format(new Date(mesCustom + "-01"), "MMMM yyyy", { locale: ptBR }),
    }[periodo];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Cabeçalho ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1600px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">📊 Analytics Operacional</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Página de análise gerencial das viagens finalizadas • {labelPeriodo}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link href="/analise/origem" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                            Atrasos por Origem →
                        </Link>
                        <Link href="/dashboard" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                            ← Dashboard Operacional
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">

                {/* ── Filtros ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-4 items-end">
                    {/* Período */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Período</p>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
                            {(["HOJE", "SEMANA", "MES", "DIA_CUSTOM", "MES_CUSTOM"] as PeriodoFiltro[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriodo(p)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                        periodo === p ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {{ HOJE: "Hoje", SEMANA: "Semana", MES: "Mês", DIA_CUSTOM: "Dia específico", MES_CUSTOM: "Mês específico" }[p]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Seletor data customizada */}
                    {periodo === "DIA_CUSTOM" && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selecione o dia</p>
                            <input
                                type="date" value={diaCustom}
                                onChange={(e) => setDiaCustom(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}
                    {periodo === "MES_CUSTOM" && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Selecione o mês</p>
                            <input
                                type="month" value={mesCustom}
                                onChange={(e) => setMesCustom(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    {/* Filtro Unidade */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unidade</p>
                        <select
                            value={baseOrigemNome}
                            onChange={(e) => setBaseOrigemNome(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px]"
                        >
                            <option value="">Todas as Unidades</option>
                            {data?.basesDisponiveis.map((b) => (
                                <option key={b.nome} value={b.nome}>{b.cidade}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
                        ))}
                    </div>
                ) : data ? (
                    <>
                        {/* ── KPIs ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            <KpiCard icon="🚛" label="Total Finalizadas"  value={data.kpis.total}         colorClass="border-l-blue-400"    sub="no período" />
                            <KpiCard icon="✅" label="Pontualidade"       value={`${data.kpis.pontualidade}%`} colorClass={data.kpis.pontualidade >= 80 ? "border-l-emerald-500" : "border-l-red-500"} sub="chegaram no prazo" />
                            <KpiCard icon="⏱" label="Média de Atraso"    value={fmtMin(data.kpis.mediaAtraso)} colorClass="border-l-amber-400" sub="das viagens atrasadas" />
                            <KpiCard icon="🔴" label="Viagens Críticas"   value={data.kpis.criticas}     colorClass={data.kpis.criticas > 0 ? "border-l-red-600" : "border-l-slate-200"} sub="atraso > 60 min" />
                            <KpiCard icon="⚡" label="Atraso Acumulado"   value={`${Math.floor(data.kpis.somaAtrasos / 60)}h`} colorClass="border-l-orange-400" sub={`${data.kpis.somaAtrasos % 60 > 0 ? (data.kpis.somaAtrasos % 60) + "min" : ""} em atrasos`} />
                        </div>

                        {/* ── Gráficos ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Ranking de rotas */}
                            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">📉 Média de Atraso por Rota (Top 10)</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Ordenado pelas rotas com maior atraso médio nas chegadas</p>
                                </div>
                                {data.rankingRotas.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Nenhum dado de rota disponível para o período</p>
                                ) : (
                                    <div className="space-y-3">
                                        {data.rankingRotas.map((r) => (
                                            <BarraHorizontal
                                                key={r.rota}
                                                label={r.rota}
                                                value={r.mediaAtrasoMin}
                                                maxValue={data.rankingRotas[0]?.mediaAtrasoMin ?? 1}
                                                count={r.totalViagens}
                                                atrasadas={r.viagensAtrasadas}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Distribuição de pontualidade */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🎯 Distribuição de Pontualidade</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Classificação das {data.kpis.total} viagens finalizadas</p>
                                </div>
                                <DonutPontualidade dist={data.distribuicao} total={data.kpis.total} />

                                {/* Mini legenda */}
                                <div className="border-t border-slate-100 pt-4 space-y-1.5">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Pontual</span><span className="font-bold">&lt; +10 min</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-amber-600">
                                        <span>Atenção</span><span className="font-bold">+10 a +29 min</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-orange-600">
                                        <span>Atrasado</span><span className="font-bold">+30 a +59 min</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-red-600">
                                        <span>Crítico</span><span className="font-bold">+60 min ou mais</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Tabela Detalhada ── */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">📋 Viagens Finalizadas no Período</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">{data.kpis.total} viagem(ns) encontrada(s)</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Ordenar por:</span>
                                    <select
                                        value={ordenacao}
                                        onChange={(e) => setOrdenacao(e.target.value as typeof ordenacao)}
                                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    >
                                        <option value="prevInicio">Data da Viagem</option>
                                        <option value="atrasoChegadaMin">Maior Atraso Primeiro</option>
                                    </select>
                                </div>
                            </div>

                            {data.kpis.total === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-4xl mb-3">📭</p>
                                    <p className="text-lg font-semibold text-gray-500">Nenhuma viagem finalizada no período</p>
                                    <p className="text-sm text-gray-400 mt-1">Experimente ampliar o intervalo de datas</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {["Viagem / Rota", "Motorista / Placa", "Saída Prev.", "Saída Real", "Δ Saída", "Chegada Prev.", "Chegada Real", "Δ Chegada", "Duração", "Status"].map((h) => (
                                                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {viagensOrdenadas.map((v) => {
                                                const cfg = NIVEL_CONFIG[v.nivelAlerta as NivelAlerta];
                                                return (
                                                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <Link href={`/viagens/${v.id}`} className="font-bold text-blue-600 hover:underline text-sm">#{v.id}</Link>
                                                            <p className="text-[10px] text-gray-500 mt-0.5 max-w-[140px] truncate" title={v.rotaDescricao}>{v.rotaDescricao}</p>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="text-sm font-medium text-gray-800">{v.motorista}</p>
                                                            <p className="text-xs text-gray-500 font-mono">{v.placa}</p>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{fmtDataHora(v.prevInicio)}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {v.dataInicioEfetivo ? (
                                                                <span className="text-blue-700 font-medium">{fmtDataHora(v.dataInicioEfetivo)}</span>
                                                            ) : <span className="text-gray-400">—</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold">
                                                            {v.atrasoSaidaMin !== null ? (
                                                                <span className={v.atrasoSaidaMin > 0 ? "text-red-600" : "text-emerald-600"}>
                                                                    {v.atrasoSaidaMin > 0 ? fmtMin(v.atrasoSaidaMin) : v.atrasoSaidaMin < 0 ? fmtMin(v.atrasoSaidaMin) : "Pontual"}
                                                                </span>
                                                            ) : <span className="text-gray-400">—</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{fmtDataHora(v.prevFim)}</td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                            {v.dataFimEfetivo ? (
                                                                <span className="text-emerald-700 font-medium">{fmtDataHora(v.dataFimEfetivo)}</span>
                                                            ) : <span className="text-gray-400">—</span>}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {v.atrasoChegadaMin > 0 ? (
                                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                                                                    {fmtMin(v.atrasoChegadaMin)}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                                                                    ✓ Pontual
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                                            <span className="text-gray-800 font-medium">{fmtDuracao(v.duracaoRealMin)}</span>
                                                            {v.duracaoPrevistaMin && (
                                                                <p className="text-gray-400">Prev: {fmtDuracao(v.duracaoPrevistaMin)}</p>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                                                                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                                                {cfg.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}
