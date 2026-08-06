"use client";

import { useEffect, useState } from "react";
import { type RouterOutputs } from "@/trpc/react";

type DadosDashboard = RouterOutputs["viagem"]["obterDashboard"][number];
type NivelAlerta = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO" | "SEM_SINAL";

const LINHAS_POR_PAGINA = 14;
const INTERVALO_PAGINA_MS = 60_000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(date: Date | string | null | undefined): string {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function fmtMin(min: number | null): string {
    if (min === null) return "—";
    const abs = Math.abs(min);
    const sinal = min > 0 ? "+" : "-";
    if (abs < 60) return `${sinal}${abs}min`;
    if (abs < 60) return `${sinal}${abs}min`;
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `${sinal}${h}h${m > 0 ? m + "m" : ""}`;
}

function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// ─── Mapeamento visual por nível de alerta ────────────────────────────────────

const NIVEL_TV: Record<NivelAlerta, { label: string; rowBg: string; badgeBg: string; badgeText: string }> = {
    PONTUAL:   { label: "PONTUAL",   rowBg: "bg-transparent",     badgeBg: "bg-emerald-600", badgeText: "text-white"       },
    ATENCAO:   { label: "ATENÇÃO",   rowBg: "bg-amber-950/30",    badgeBg: "bg-amber-500",   badgeText: "text-black"       },
    ATRASADO:  { label: "ATRASADO",  rowBg: "bg-orange-950/40",   badgeBg: "bg-orange-600",  badgeText: "text-white"       },
    CRITICO:   { label: "CRÍTICO",   rowBg: "bg-red-950/50",      badgeBg: "bg-red-600",     badgeText: "text-white"       },
    SEM_SINAL: { label: "SEM SINAL", rowBg: "bg-slate-800/40",    badgeBg: "bg-slate-600",   badgeText: "text-slate-200"   },
};

const STATUS_TV: Record<string, { label: string; color: string }> = {
    PROGRAMADA:   { label: "PROGRAMADA", color: "text-slate-400"   },
    EM_ANDAMENTO: { label: "EM ROTA",    color: "text-blue-400"    },
    FINALIZADA:   { label: "CHEGOU",     color: "text-emerald-400" },
    CANCELADA:    { label: "CANCELADA",  color: "text-red-400"     },
};

// ─── Linha da Tabela ──────────────────────────────────────────────────────────

function LinhaViagem({ v, idx }: { v: DadosDashboard; idx: number }) {
    const nivel = v.nivelAlerta as NivelAlerta;
    const cfg = NIVEL_TV[nivel];
    const statusCfg = STATUS_TV[v.status] ?? STATUS_TV["PROGRAMADA"]!;

    const prevSaidaRef = (v as any).prevSaidaRef ? new Date((v as any).prevSaidaRef) : new Date(v.prevInicioReal);
    const prevChegadaRef = (v as any).prevChegadaRef ? new Date((v as any).prevChegadaRef) : new Date(v.prevFimReal);
    const temOcorrencia = !!((v as any).ocorrencias?.[0]);

    let progresso = 0;
    if (v.status === "FINALIZADA") {
        progresso = 100;
    } else if (v.status === "EM_ANDAMENTO" && v.ultimaTelemetria) {
        if (
            v.baseOrigem.latitude != null && v.baseOrigem.longitude != null &&
            v.baseDestino.latitude != null && v.baseDestino.longitude != null &&
            v.ultimaTelemetria.latitude != null && v.ultimaTelemetria.longitude != null
        ) {
            const totalKm = calcularDistancia(v.baseOrigem.latitude, v.baseOrigem.longitude, v.baseDestino.latitude, v.baseDestino.longitude);
            const atualKm = calcularDistancia(v.baseOrigem.latitude, v.baseOrigem.longitude, v.ultimaTelemetria.latitude, v.ultimaTelemetria.longitude);
            if (totalKm > 0) {
                progresso = Math.min(100, Math.max(0, (atualKm / totalKm) * 100));
            }
        }
    }

    return (
        <tr
            className={`border-b border-slate-700/50 ${cfg.rowBg} ${idx % 2 === 0 ? "" : "bg-white/[0.03]"}`}
            style={{ animationDelay: `${idx * 40}ms` }}
        >
            {/* # Viagem + Placa */}
            <td className="px-3 py-2.5 whitespace-nowrap">
                <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-sm font-bold text-white tracking-tight">
                        #{v.id}
                        {temOcorrencia && <span className="ml-1.5 text-amber-400 text-xs">⚠</span>}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{v.veiculo.placa}</span>
                </div>
            </td>

            {/* Rota */}
            <td className="px-3 py-2.5">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-cyan-300 uppercase truncate max-w-[220px]">
                        {v.baseOrigem.cidade}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-slate-500 text-xs">→</span>
                        <span className="text-sm font-semibold text-slate-300 truncate max-w-[200px]">
                            {v.baseDestino.cidade}
                        </span>
                    </div>
                </div>
            </td>

            {/* Motorista */}
            <td className="px-3 py-2.5 hidden lg:table-cell">
                <span className="text-sm text-slate-300 truncate block max-w-[160px]">
                    {v.motorista.split(" ").slice(0, 2).join(" ")}
                </span>
            </td>

            {/* Saída Prevista */}
            <td className="px-3 py-2.5 text-center">
                <span className="font-mono text-base font-bold text-white">{fmt(prevSaidaRef)}</span>
            </td>

            {/* Saída Real */}
            <td className="px-3 py-2.5 text-center">
                <span className={`font-mono text-base font-bold ${v.dataInicioEfetivo ? "text-blue-300" : "text-slate-600"}`}>
                    {v.dataInicioEfetivo ? fmt(v.dataInicioEfetivo) : "—"}
                </span>
            </td>

            {/* Chegada Prevista */}
            <td className="px-3 py-2.5 text-center">
                <span className="font-mono text-base font-bold text-white">{fmt(prevChegadaRef)}</span>
            </td>

            {/* Próxima Parada */}
            <td className="px-3 py-2.5 text-left">
                <span className="text-sm font-bold text-cyan-200 truncate block max-w-[140px]" title={v.proximaParadaNome}>
                    {v.status === "FINALIZADA" ? "—" : v.proximaParadaNome}
                </span>
            </td>

            {/* Chegada Real / ETA */}
            <td className="px-3 py-2.5 text-center">
                {v.dataFimEfetivo ? (
                    <span className="font-mono text-base font-bold text-emerald-400">{fmt(v.dataFimEfetivo)}</span>
                ) : v.previsaoChegadaCalculada ? (
                    <span className="font-mono text-sm font-bold text-amber-300">~{fmt(v.previsaoChegadaCalculada)}</span>
                ) : (
                    <span className="text-slate-600 text-sm">—</span>
                )}
            </td>

            {/* Δ Saída */}
            <td className="px-3 py-2.5 text-center">
                <span className={`font-mono text-sm font-bold ${
                    v.atrasoSaidaMinutos && v.atrasoSaidaMinutos > 0 ? "text-red-400" :
                    v.atrasoSaidaMinutos && v.atrasoSaidaMinutos < 0 ? "text-emerald-400" : "text-slate-500"
                }`}>
                    {v.atrasoSaidaMinutos !== null && v.atrasoSaidaMinutos !== 0 ? fmtMin(v.atrasoSaidaMinutos) : "—"}
                </span>
            </td>

            {/* Status / Alerta */}
            <td className="px-3 py-2.5 text-center">
                <div className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${statusCfg.color}`}>
                        {statusCfg.label}
                    </span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText}`}>
                        {cfg.label}
                    </span>
                </div>
            </td>

            {/* Progresso */}
            <td className="px-3 py-2.5 text-center hidden xl:table-cell">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[11px] font-bold text-white">{Math.round(progresso)}%</span>
                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progresso}%` }} />
                    </div>
                </div>
            </td>
        </tr>
    );
}

// ─── KPI Pill ─────────────────────────────────────────────────────────────────

function KpiPill({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={`flex flex-col items-center border rounded-lg px-3 py-1 ${color}`}>
            <span className="text-xl font-extrabold leading-none">{value}</span>
            <span className="text-[9px] uppercase tracking-widest opacity-80">{label}</span>
        </div>
    );
}

// ─── Barra de Contagem Regressiva ─────────────────────────────────────────────

function BarraContagem({ totalMs }: { totalMs: number }) {
    const [progresso, setProgresso] = useState(100);

    useEffect(() => {
        const inicio = Date.now();
        let id: number;
        const frame = () => {
            const elapsed = Date.now() - inicio;
            const pct = Math.max(0, 100 - (elapsed / totalMs) * 100);
            setProgresso(pct);
            if (pct > 0) id = requestAnimationFrame(frame);
        };
        id = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(id);
    }, [totalMs]);

    return (
        <div className="h-full bg-blue-500 rounded-full transition-none" style={{ width: `${progresso}%` }} />
    );
}

// ─── Componente Principal: PainelTV ──────────────────────────────────────────

interface PainelTVProps {
    viagens: DadosDashboard[];
    onFechar: () => void;
    agora: Date;
}

export function PainelTV({ viagens, onFechar, agora }: PainelTVProps) {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [animando, setAnimando] = useState(false);
    
    // Filtros de exibição
    const [filtros, setFiltros] = useState<Set<string>>(new Set(["EM_ANDAMENTO", "FINALIZADA", "PROGRAMADA_6H"]));

    const toggleFiltro = (f: string) => {
        setFiltros(prev => {
            const next = new Set(prev);
            if (next.has(f)) next.delete(f);
            else next.add(f);
            return next;
        });
    };

    const viagensFiltradas = viagens.filter(v => {
        if (filtros.has("EM_ANDAMENTO") && v.status === "EM_ANDAMENTO") return true;
        if (filtros.has("FINALIZADA") && v.status === "FINALIZADA") return true;
        if (filtros.has("PROGRAMADA_6H") && v.status === "PROGRAMADA") {
            const prevSaidaRef = (v as any).prevSaidaRef ? new Date((v as any).prevSaidaRef) : new Date(v.prevInicioReal);
            const diffHrs = (prevSaidaRef.getTime() - agora.getTime()) / (1000 * 60 * 60);
            if (diffHrs <= 6) return true;
        }
        return false;
    });

    const totalPaginas = Math.ceil(viagensFiltradas.length / LINHAS_POR_PAGINA);
    const viagensPagina = viagensFiltradas.slice(
        paginaAtual * LINHAS_POR_PAGINA,
        (paginaAtual + 1) * LINHAS_POR_PAGINA
    );

    // Ajusta página atual se os filtros reduzirem o total de páginas
    useEffect(() => {
        if (paginaAtual >= totalPaginas && totalPaginas > 0) {
            setPaginaAtual(totalPaginas - 1);
        } else if (totalPaginas === 0) {
            setPaginaAtual(0);
        }
    }, [totalPaginas, paginaAtual]);

    const irParaPagina = (idx: number) => {
        setAnimando(true);
        setTimeout(() => { setPaginaAtual(idx); setAnimando(false); }, 300);
    };

    // Paginação automática
    useEffect(() => {
        if (totalPaginas <= 1) return;
        const timer = setInterval(() => {
            irParaPagina((paginaAtual + 1) % totalPaginas);
        }, INTERVALO_PAGINA_MS);
        return () => clearInterval(timer);
    }, [totalPaginas, paginaAtual]);

    // Fecha com ESC
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onFechar]);

    // Entra em fullscreen
    useEffect(() => {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
        return () => {
            if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
        };
    }, []);

    const emAndamento = viagens.filter(v => v.status === "EM_ANDAMENTO").length;
    const atrasadas   = viagens.filter(v => ["ATRASADO", "CRITICO"].includes(v.nivelAlerta)).length;
    const criticas    = viagens.filter(v => v.nivelAlerta === "CRITICO").length;
    const finalizadas = viagens.filter(v => v.status === "FINALIZADA").length;

    return (
        <div
            id="painel-tv"
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col overflow-hidden select-none"
        >
            {/* ── Cabeçalho ── */}
            <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b-2 border-blue-500 flex-shrink-0">
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-1 rounded-full bg-blue-500" />
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Torre de Controle</p>
                            <p className="text-lg font-extrabold text-white tracking-tight leading-none">
                                🚛 Painel de Transferências
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 ml-4">
                        <KpiPill label="Em Rota" value={emAndamento} color="text-blue-400 border-blue-500/50" />
                        <KpiPill label="Atrasadas" value={atrasadas} color={atrasadas > 0 ? "text-orange-400 border-orange-500/50" : "text-emerald-400 border-emerald-500/50"} />
                        <KpiPill label="Críticas"  value={criticas}  color={criticas  > 0 ? "text-red-400 border-red-500/50 animate-pulse" : "text-slate-400 border-slate-600/50"} />
                        <KpiPill label="Concluídas" value={finalizadas} color="text-emerald-400 border-emerald-600/50" />
                    </div>

                    <div className="hidden md:flex items-center gap-2 ml-6 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button 
                            onClick={() => toggleFiltro("EM_ANDAMENTO")}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${filtros.has("EM_ANDAMENTO") ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Em Rota
                        </button>
                        <button 
                            onClick={() => toggleFiltro("FINALIZADA")}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${filtros.has("FINALIZADA") ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Concluídas
                        </button>
                        <button 
                            onClick={() => toggleFiltro("PROGRAMADA_6H")}
                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${filtros.has("PROGRAMADA_6H") ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            Próx 6h
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    {totalPaginas > 1 && (
                        <div className="text-right">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Página</p>
                            <p className="text-2xl font-mono font-extrabold text-slate-200 leading-none">
                                {String(paginaAtual + 1).padStart(2, "0")}
                                <span className="text-slate-600 text-sm">/{String(totalPaginas).padStart(2, "0")}</span>
                            </p>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-3xl font-mono font-extrabold text-white tabular-nums leading-none">
                            {agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            <span className="text-blue-400 text-xl">
                                :{String(agora.getSeconds()).padStart(2, "0")}
                            </span>
                        </p>
                        <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                            {agora.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
                        </p>
                    </div>
                    <button
                        onClick={onFechar}
                        title="Fechar painel (ESC)"
                        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>
            </header>

            {/* ── Tabela ── */}
            <div className={`flex-1 overflow-hidden transition-opacity duration-300 ${animando ? "opacity-0" : "opacity-100"}`}>
                <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
                    <colgroup>
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "15%" }} />
                        <col className="hidden lg:table-column" style={{ width: "11%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "11%" }} />
                        <col style={{ width: "8%" }} />
                        <col style={{ width: "7%" }} />
                        <col style={{ width: "8%" }} />
                        <col className="hidden xl:table-column" style={{ width: "6%" }} />
                    </colgroup>
                    <thead className="bg-slate-800 border-b-2 border-blue-500/40">
                        <tr>
                            {[
                                "# Viagem", "Rota", "Motorista",
                                "Saída Prev.", "Saída Real", "Chegada Prev.",
                                "Próx. Parada", "ETA",
                                "Δ Saída", "Situação", "Progresso"
                            ].map((h, i) => (
                                <th
                                    key={h}
                                    className={`px-3 py-2.5 text-[11px] font-extrabold uppercase tracking-widest text-blue-400 ${
                                        i >= 3 && i <= 8 && i !== 6 ? "text-center" : "text-left"
                                    } ${i === 2 ? "hidden lg:table-cell" : ""} ${i === 10 ? "hidden xl:table-cell" : ""}`}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {viagensPagina.map((v, idx) => (
                            <LinhaViagem key={v.id} v={v} idx={idx} />
                        ))}
                        {/* Linhas vazias para manter altura consistente */}
                        {Array.from({ length: Math.max(0, LINHAS_POR_PAGINA - viagensPagina.length) }).map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b border-slate-800/20">
                                <td colSpan={10} className="py-3" />
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Rodapé ── */}
            <footer className="flex-shrink-0 bg-slate-900 border-t border-slate-800 px-6 py-2.5">
                <div className="flex items-center gap-4">
                    {totalPaginas > 1 ? (
                        <>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                Próxima página em
                            </span>
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <BarraContagem totalMs={INTERVALO_PAGINA_MS} key={paginaAtual} />
                            </div>
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: totalPaginas }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => irParaPagina(i)}
                                        className={`rounded-full transition-all duration-300 ${
                                            i === paginaAtual
                                                ? "h-2 w-6 bg-blue-500"
                                                : "h-2 w-2 bg-slate-600 hover:bg-slate-400"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1" />
                    )}
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {viagensFiltradas.length} viagem(ns) exibida(s)
                        {totalPaginas > 1 && ` · ${totalPaginas} pág.`}
                        {" · "}atualiza a cada 30s
                    </span>
                </div>
            </footer>
        </div>
    );
}
