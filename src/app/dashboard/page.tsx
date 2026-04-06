"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/trpc/react";
import { type RouterOutputs } from "@/trpc/react";
import Link from "next/link";

// ─── Tipos inferidos do backend ───────────────────────────────────────────────
type DadosDashboard = RouterOutputs["viagem"]["obterDashboard"][number];

type NivelAlerta = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO" | "SEM_SINAL";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarHorario(date: Date | string | null | undefined): string {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarMinutos(min: number | null): string {
    if (min === null) return "—";
    if (min <= 0) return "No horário";
    if (min < 60) return `+${min} min`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `+${h}h${m > 0 ? m + "min" : ""}`;
}

function tempoDesdeUltimoSinal(date: Date | string | null | undefined, agora: Date): string {
    if (!date) return "Sem sinal";
    const d = new Date(date);
    const diff = Math.floor((agora.getTime() - d.getTime()) / 60000);
    if (diff < 1) return "Agora";
    if (diff < 60) return `${diff} min atrás`;
    return `${Math.floor(diff / 60)}h atrás`;
}

// ─── Config visual dos níveis de alerta ──────────────────────────────────────

const ALERTA_CONFIG: Record<NivelAlerta, { label: string; bg: string; text: string; border: string; dot: string; cardBorder: string }> = {
    PONTUAL:   { label: "Pontual",   bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", cardBorder: "border-l-emerald-400" },
    ATENCAO:   { label: "Atenção",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-500",   cardBorder: "border-l-amber-400"   },
    ATRASADO:  { label: "Atrasado",  bg: "bg-orange-50",   text: "text-orange-700",  border: "border-orange-200",  dot: "bg-orange-500",  cardBorder: "border-l-orange-500"  },
    CRITICO:   { label: "Crítico",   bg: "bg-red-50",      text: "text-red-700",     border: "border-red-200",     dot: "bg-red-500",     cardBorder: "border-l-red-600"     },
    SEM_SINAL: { label: "Sem Sinal", bg: "bg-gray-100",    text: "text-gray-500",    border: "border-gray-200",    dot: "bg-gray-400",    cardBorder: "border-l-gray-400"    },
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
    PROGRAMADA:   { label: "Programada",   bg: "bg-slate-100",   text: "text-slate-600"   },
    EM_ANDAMENTO: { label: "Em Andamento", bg: "bg-blue-100",    text: "text-blue-700"    },
    FINALIZADA:   { label: "Finalizada",   bg: "bg-emerald-100", text: "text-emerald-700" },
    CANCELADA:    { label: "Cancelada",    bg: "bg-red-100",     text: "text-red-700"     },
};

// ─── Componente: KPI Card ─────────────────────────────────────────────────────

function KpiCard({
    label, value, sub, color,
}: { label: string; value: number | string; sub?: string; color: string }) {
    return (
        <div className={`rounded-2xl border bg-white p-5 shadow-sm ${color}`}>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">{label}</p>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
    );
}

// ─── Componente: Barra de Progresso da Rota ───────────────────────────────────

function BarraProgresso({ concluidas, total }: { concluidas: number; total: number }) {
    const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
                <span>{concluidas}/{total} paradas</span>
                <span>{pct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Componente: Badge de Alerta ──────────────────────────────────────────────

function BadgeAlerta({ nivel }: { nivel: NivelAlerta }) {
    const cfg = ALERTA_CONFIG[nivel];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

// ─── Componente: Card de Viagem ───────────────────────────────────────────────

function CardViagem({ v, isMounted, agora }: { v: DadosDashboard, isMounted: boolean, agora: Date }) {
    const nivel = v.nivelAlerta as NivelAlerta;
    const cfg = ALERTA_CONFIG[nivel];
    const statusCfg = STATUS_CONFIG[v.status] ?? STATUS_CONFIG["PROGRAMADA"]!;

    const prevFimReal = v.prevFimReal ? new Date(v.prevFimReal) : null;
    const previsaoBaseRef = v.previsaoBaseRef ? new Date(v.previsaoBaseRef) : null;
    const previsaoChegada = v.previsaoChegadaCalculada ? new Date(v.previsaoChegadaCalculada) : null;

    return (
        <div className={`flex flex-col rounded-2xl border-l-4 border border-gray-100 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md ${cfg.cardBorder}`}>
            {/* Header do card */}
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-gray-800">#{v.id}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
                            {statusCfg.label}
                        </span>
                        <BadgeAlerta nivel={nivel} />
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-gray-500 truncate">{v.motorista}</p>
                </div>
                <div className="ml-3 flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-blue-600">{v.veiculo.placa}</p>
                    <p className="text-xs text-gray-400">Placa</p>
                </div>
            </div>

            {/* Rota */}
            <div className="flex items-center gap-2 px-5 py-2 bg-gray-50 border-y border-gray-100">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-blue-700 truncate">{v.baseOrigem.cidade}</span>
                <span className="text-gray-300 flex-shrink-0">→</span>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-700 truncate">{v.baseDestino.cidade}</span>
            </div>

            <div className="flex flex-col gap-4 px-5 py-4 flex-1">
                {/* Horários */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                    {/* Linha Saída */}
                    <div>
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Saída Prev.</p>
                        <p className="text-sm font-semibold text-gray-700">{isMounted ? formatarHorario(v.prevInicioReal) : "--:--"}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Saída Real</p>
                        <p className={`text-sm font-semibold ${v.dataInicioEfetivo ? "text-blue-700" : "text-gray-400"}`}>
                            {isMounted && v.dataInicioEfetivo ? formatarHorario(v.dataInicioEfetivo) : (isMounted ? "—" : "--:--")}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Δ Saída</p>
                        <p className={`text-sm font-bold ${
                            v.atrasoSaidaMinutos && v.atrasoSaidaMinutos > 0 ? "text-red-600" :
                            v.atrasoSaidaMinutos && v.atrasoSaidaMinutos < 0 ? "text-emerald-600" : "text-gray-400"
                        }`}>
                            {v.atrasoSaidaMinutos !== null
                                ? v.atrasoSaidaMinutos > 0 ? formatarMinutos(v.atrasoSaidaMinutos) : v.atrasoSaidaMinutos < 0 ? `${v.atrasoSaidaMinutos}min` : "Pontual"
                                : "—"}
                        </p>
                    </div>

                    {/* Linha Chegada */}
                    {(() => {
                        const chegadaReal = v.dataFimEfetivo ? new Date(v.dataFimEfetivo) : null;
                        const deltaChegada = chegadaReal && prevFimReal
                            ? Math.round((chegadaReal.getTime() - prevFimReal.getTime()) / 60000)
                            : null;

                        return (
                            <>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Chegada Prev.</p>
                                    <p className="text-sm font-semibold text-gray-700">{isMounted ? formatarHorario(prevFimReal) : "--:--"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Chegada Real</p>
                                    <p className={`text-sm font-semibold ${chegadaReal ? "text-emerald-700" : "text-gray-400"}`}>
                                        {isMounted && chegadaReal ? formatarHorario(chegadaReal) : (isMounted ? "—" : "--:--")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Δ Chegada</p>
                                    <p className={`text-sm font-bold ${
                                        deltaChegada !== null && deltaChegada > 0 ? "text-red-600" :
                                        deltaChegada !== null && deltaChegada < 0 ? "text-emerald-600" : "text-gray-400"
                                    }`}>
                                        {deltaChegada !== null
                                            ? deltaChegada > 0 ? formatarMinutos(deltaChegada) : deltaChegada < 0 ? `${deltaChegada}min` : "Pontual"
                                            : "—"}
                                    </p>
                                </div>
                            </>
                        );
                    })()}
                </div>

                {/* Barra de progresso */}
                <BarraProgresso concluidas={v.paradasConcluidas} total={v.totalParadas} />

                {/* Previsão preditiva */}
                <div className="rounded-xl border bg-gray-50 p-3 space-y-1">
                    <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                        🕐 Chegada em <span className="font-bold text-gray-700">{v.proximaParadaNome}</span>
                    </p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                        <div>
                            <p className="text-[10px] text-gray-400">Previsto</p>
                            <p className="text-sm font-semibold text-gray-700">{isMounted ? formatarHorario(previsaoBaseRef) : "--:--"}</p>
                        </div>
                        {isMounted && previsaoChegada && (
                            <>
                                <span className="text-gray-300 text-sm">→</span>
                                <div>
                                    <p className="text-[10px] text-gray-400">Estimado agora</p>
                                    <p className={`text-sm font-bold ${
                                        v.atrasoChegadaMinutos && v.atrasoChegadaMinutos > 30 ? "text-red-600" :
                                        v.atrasoChegadaMinutos && v.atrasoChegadaMinutos > 0 ? "text-amber-600" :
                                        "text-emerald-600"
                                    }`}>
                                        {formatarHorario(previsaoChegada)}
                                    </p>
                                </div>
                                <span className={`ml-auto text-xs font-bold rounded-full px-2 py-0.5 ${
                                    v.atrasoChegadaMinutos && v.atrasoChegadaMinutos >= 60 ? "bg-red-100 text-red-700" :
                                    v.atrasoChegadaMinutos && v.atrasoChegadaMinutos >= 30 ? "bg-orange-100 text-orange-700" :
                                    v.atrasoChegadaMinutos && v.atrasoChegadaMinutos >= 10 ? "bg-amber-100 text-amber-700" :
                                    "bg-emerald-100 text-emerald-700"
                                }`}>
                                    {formatarMinutos(v.atrasoChegadaMinutos)}
                                </span>
                            </>
                        )}
                        {!previsaoChegada && v.status === "EM_ANDAMENTO" && (
                            <span className="text-xs text-gray-400 italic">
                                {isMounted && v.semSinalGPS ? "⚠️ Sem sinal GPS há mais de 30min" : "Aguardando posição..."}
                            </span>
                        )}
                        {v.status === "FINALIZADA" && (
                            <span className="text-xs text-emerald-600 font-semibold">✅ Viagem concluída</span>
                        )}
                        {v.status === "PROGRAMADA" && (
                            <span className="text-xs text-gray-400 italic">Não iniciada</span>
                        )}
                    </div>
                </div>

                {/* Último sinal GPS */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${v.ultimaTelemetria && !v.semSinalGPS ? "bg-emerald-400 animate-pulse" : "bg-gray-300"}`} />
                        <span>
                            {isMounted ? (v.ultimaTelemetria
                                ? `GPS: ${tempoDesdeUltimoSinal(v.ultimaTelemetria.dataHoraLocal, agora)}`
                                : "Sem telemetria") : "Carregando..."}
                        </span>
                    </div>
                    {v.ultimaTelemetria?.velocidade !== null && v.ultimaTelemetria?.velocidade !== undefined && (
                        <span className="font-medium">{v.ultimaTelemetria.velocidade ?? 0} km/h</span>
                    )}
                    <Link
                        href={`/viagens/${v.id}`}
                        className="text-xs text-blue-500 hover:text-blue-700 font-bold transition-colors"
                    >
                        Ver Detalhes →
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Componente: Painel de Alertas ────────────────────────────────────────────

function PainelAlertas({ viagens }: { viagens: DadosDashboard[] }) {
    const alertas = viagens.filter(
        (v) => v.nivelAlerta !== "PONTUAL" && v.status !== "FINALIZADA" && v.status !== "CANCELADA"
    ).sort((a, b) => {
        const ordem: Record<string, number> = { CRITICO: 0, SEM_SINAL: 1, ATRASADO: 2, ATENCAO: 3, PONTUAL: 4 };
        return (ordem[a.nivelAlerta] ?? 5) - (ordem[b.nivelAlerta] ?? 5);
    });

    if (alertas.length === 0) {
        return (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">
                <p className="text-2xl mb-1">✅</p>
                <p className="text-sm font-semibold text-emerald-700">Todas as viagens no prazo!</p>
                <p className="text-xs text-emerald-500">Nenhum alerta ativo no momento.</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-red-50 border-b border-red-100">
                <span className="text-red-500">🔔</span>
                <h3 className="text-sm font-bold text-red-700">Alertas Ativos ({alertas.length})</h3>
            </div>
            <div className="divide-y divide-gray-50">
                {alertas.map((v) => {
                    const nivel = v.nivelAlerta as NivelAlerta;
                    const cfg = ALERTA_CONFIG[nivel];
                    return (
                        <div key={v.id} className={`flex items-center justify-between px-5 py-3 ${cfg.bg}`}>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <BadgeAlerta nivel={nivel} />
                                    <span className="text-sm font-semibold text-gray-800">#{v.id} — {v.veiculo.placa}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                    {v.baseOrigem.cidade} → {v.baseDestino.cidade}
                                </p>
                            </div>
                            <div className="ml-3 text-right flex-shrink-0">
                                {v.atrasoChegadaMinutos !== null && v.atrasoChegadaMinutos > 0 ? (
                                    <p className="text-sm font-bold text-red-600">{formatarMinutos(v.atrasoChegadaMinutos)}</p>
                                ) : v.semSinalGPS ? (
                                    <p className="text-xs text-gray-500 font-medium">Sem GPS</p>
                                ) : (
                                    <p className="text-xs text-gray-400">Monitorando...</p>
                                )}
                                <Link href={`/viagens/${v.id}`} className="text-xs text-blue-500 hover:underline">
                                    Ver →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

type Filtro = "todos" | "em_andamento" | "atrasadas" | "com_alerta";

export default function DashboardOperacionalPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [filtro, setFiltro] = useState<Filtro>("todos");
    const [horasFiltro, setHorasFiltro] = useState<"24" | "48">("48");
    const [baseFiltro, setBaseFiltro] = useState<string>("todas");
    const [agora, setAgora] = useState(new Date());

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Atualiza o relógio em tempo real
    useEffect(() => {
        const timer = setInterval(() => setAgora(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Dados com toda a lógica de enriquecimento
    const { data: viagens, isLoading, dataUpdatedAt, refetch } = api.viagem.obterDashboard.useQuery({ horasFiltro }, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });

    // Auto-sync Sascar em background
    useEffect(() => {
        const syncSascar = async () => {
            try { await fetch("/api/sync"); } catch (err) { console.error("Falha no sync Sascar", err); }
        };
        syncSascar();
        const interval = setInterval(syncSascar, 60000);
        return () => clearInterval(interval);
    }, []);

    // KPIs calculados
    const kpis = useMemo(() => {
        if (!viagens) return null;
        return {
            total: viagens.length,
            emAndamento: viagens.filter((v) => v.status === "EM_ANDAMENTO").length,
            atrasadas: viagens.filter((v) => v.nivelAlerta !== "PONTUAL" && v.status !== "FINALIZADA" && v.status !== "CANCELADA").length,
            finalizadas: viagens.filter((v) => v.status === "FINALIZADA").length,
            semSinal: viagens.filter((v) => v.semSinalGPS && v.status === "EM_ANDAMENTO").length,
        };
    }, [viagens]);

    // Bases Únicas para o Filtro
    const basesGerais = useMemo(() => {
        if (!viagens) return [];
        const setBases = new Set<string>();
        viagens.forEach(v => {
            setBases.add(v.baseOrigem.nome);
            setBases.add(v.baseDestino.nome);
            v.paradasViagem.forEach(p => setBases.add(p.base.nome));
        });
        return Array.from(setBases).sort();
    }, [viagens]);

    // Filtragem combinada (Status + Base)
    const viagensFiltradas = useMemo(() => {
        if (!viagens) return [];
        let r = viagens;

        // 1. Filtro de Base
        if (baseFiltro !== "todas") {
            r = r.filter(v => {
                return v.baseOrigem.nome === baseFiltro || 
                       v.baseDestino.nome === baseFiltro || 
                       v.paradasViagem.some(p => p.base.nome === baseFiltro);
            });
        }

        // 2. Filtro de Status Rapido
        switch (filtro) {
            case "em_andamento": return r.filter((v) => v.status === "EM_ANDAMENTO");
            case "atrasadas":    return r.filter((v) => v.nivelAlerta !== "PONTUAL" && v.status !== "FINALIZADA" && v.status !== "CANCELADA");
            case "com_alerta":   return r.filter((v) => ["ATRASADO", "CRITICO", "SEM_SINAL"].includes(v.nivelAlerta));
            default:             return r;
        }
    }, [viagens, filtro, baseFiltro]);

    const ultimaAtualizacao = dataUpdatedAt
        ? new Date(dataUpdatedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : "—";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Cabeçalho ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1600px] flex items-center justify-between px-6 py-3">
                    <div className="flex gap-6 items-center flex-wrap">
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                🚛 Dashboard Operacional
                            </h1>
                            <p className="text-xs text-slate-500">Gestão à Vista — Acompanhamento Logístico</p>
                        </div>

                        {/* Controles de Topo (Período e Unidade) */}
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                            <button
                                onClick={() => setHorasFiltro("24")}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${horasFiltro === "24" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                Últimas 24h
                            </button>
                            <button
                                onClick={() => setHorasFiltro("48")}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${horasFiltro === "48" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                Últimas 48h
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unidade:</label>
                            <select 
                                value={baseFiltro} 
                                onChange={(e) => setBaseFiltro(e.target.value)}
                                className="text-sm bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            >
                                <option value="todas">Todas as Unidades</option>
                                {basesGerais.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-mono font-bold text-slate-800 tabular-nums">
                                {isMounted ? agora.toLocaleTimeString("pt-BR") : "--:--:--"}
                            </p>
                            <p className="text-xs text-slate-400">
                                {isMounted ? agora.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }) : "--/--/--"}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <button
                                onClick={() => refetch()}
                                className="rounded-lg bg-princesa-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition-colors shadow-sm"
                            >
                                ↻ Atualizar
                            </button>
                            <p className="text-[10px] text-slate-400 tabular-nums">
                                Atualizado: {isMounted ? ultimaAtualizacao : "--:--"}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">

                {/* ── KPIs ── */}
                {isLoading && !viagens ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
                        ))}
                    </div>
                ) : kpis ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <KpiCard label="Total do Dia"   value={kpis.total}       color="border-l-4 border-l-blue-400"    sub="viagens programadas" />
                        <KpiCard label="Em Andamento"   value={kpis.emAndamento} color="border-l-4 border-l-blue-500"    sub="em rota agora" />
                        <KpiCard label="Atrasadas"      value={kpis.atrasadas}   color={`border-l-4 ${kpis.atrasadas > 0 ? "border-l-red-500" : "border-l-emerald-400"}`} sub="atenção / crítico" />
                        <KpiCard label="Finalizadas"    value={kpis.finalizadas} color="border-l-4 border-l-emerald-500" sub="chegaram ao destino" />
                        <KpiCard label="Sem Sinal GPS"  value={kpis.semSinal}    color={`border-l-4 ${kpis.semSinal > 0 ? "border-l-amber-500" : "border-l-gray-300"}`} sub="> 30 min sem posição" />
                    </div>
                ) : null}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* ── Coluna principal: lista de viagens ── */}
                    <div className="xl:col-span-3 space-y-4">

                        {/* Filtros rápidos */}
                        <div className="flex gap-2 flex-wrap">
                            {(["todos", "em_andamento", "atrasadas", "com_alerta"] as Filtro[]).map((f) => {
                                const LABELS: Record<Filtro, string> = {
                                    todos:        "Todos",
                                    em_andamento: "Em Andamento",
                                    atrasadas:    "Atrasadas",
                                    com_alerta:   "Com Alerta",
                                };
                                return (
                                    <button
                                        key={f}
                                        onClick={() => setFiltro(f)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                                            filtro === f
                                                ? "bg-blue-600 text-white shadow-sm"
                                                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                                        }`}
                                    >
                                        {LABELS[f]}
                                        {f !== "todos" && viagens && (
                                            <span className={`ml-1.5 text-xs rounded-full px-1.5 py-0.5 ${filtro === f ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                                                {f === "em_andamento" ? viagens.filter(v => v.status === "EM_ANDAMENTO").length
                                                 : f === "atrasadas" ? viagens.filter(v => v.nivelAlerta !== "PONTUAL" && v.status !== "FINALIZADA" && v.status !== "CANCELADA").length
                                                 : viagens.filter(v => ["ATRASADO", "CRITICO", "SEM_SINAL"].includes(v.nivelAlerta)).length}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                            <span className="ml-auto text-xs text-gray-400 self-center">
                                {viagensFiltradas.length} viagem(ns)
                            </span>
                        </div>

                        {/* Grid de cards de viagem */}
                        {isLoading && !viagens ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-64 rounded-2xl bg-white animate-pulse shadow-sm border border-gray-100" />
                                ))}
                            </div>
                        ) : viagensFiltradas.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {viagensFiltradas.map((v) => (
                                    <CardViagem key={v.id} v={v} isMounted={isMounted} agora={agora} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
                                <p className="text-4xl mb-3">📭</p>
                                <p className="text-lg font-semibold text-gray-600">
                                    {filtro === "todos"
                                        ? "Nenhuma viagem para hoje"
                                        : "Nenhuma viagem nesta categoria"}
                                </p>
                                <p className="mt-1 text-sm text-gray-400">
                                    {filtro === "todos"
                                        ? "Importe a planilha para começar"
                                        : "Tente selecionar outro filtro"}
                                </p>
                                {filtro === "todos" && (
                                    <Link
                                        href="/viagens/upload"
                                        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                                    >
                                        + Importar Planilha
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Coluna lateral: painel de alertas ── */}
                    <div className="xl:col-span-1 space-y-4">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Painel de Alertas</h2>
                        {viagens ? (
                            <PainelAlertas viagens={viagens} />
                        ) : (
                            <div className="h-48 rounded-2xl bg-white animate-pulse border border-gray-100" />
                        )}

                        {/* Legenda dos níveis */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Legenda</p>
                            {(Object.entries(ALERTA_CONFIG) as [NivelAlerta, typeof ALERTA_CONFIG[NivelAlerta]][]).map(([nivel, cfg]) => (
                                <div key={nivel} className="flex items-center gap-2">
                                    <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                    <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                                    <span className="text-xs text-gray-400 ml-auto">
                                        {nivel === "PONTUAL" && "No horário"}
                                        {nivel === "ATENCAO" && "+10 a +29 min"}
                                        {nivel === "ATRASADO" && "+30 a +59 min"}
                                        {nivel === "CRITICO" && "+60 min ou mais"}
                                        {nivel === "SEM_SINAL" && "GPS parado >30min"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
