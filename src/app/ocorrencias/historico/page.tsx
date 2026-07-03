"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { LOGO_BASE64 } from "@/lib/logoBase64";


// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarDataHora(date: Date | string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "America/Sao_Paulo",
    });
}

function formatarDuracao(de: Date | string, ate: Date | string): string {
    const ms = new Date(ate).getTime() - new Date(de).getTime();
    if (ms <= 0) return "—";
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `${h}h ${m}min`;
    return `${m}min`;
}

const STATUS_CONFIG = {
    ABERTA: {
        label: "Aberta",
        bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500",
        border: "border-l-red-500",
    },
    EM_ATENDIMENTO: {
        label: "Em Atendimento",
        bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500",
        border: "border-l-amber-400",
    },
    RESOLVIDA: {
        label: "Resolvida",
        bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500",
        border: "border-l-emerald-500",
    },
} as const;

// ─── Componente: Timeline ─────────────────────────────────────────────────────

function Timeline({ oc }: { oc: any }) {
    const isResolvida = oc.status === "RESOLVIDA";
    const isAtendimento = oc.status === "EM_ATENDIMENTO" || isResolvida;

    // Duração total
    const duracaoTotal = isResolvida && oc.resolvidaEm
        ? formatarDuracao(oc.createdAt, oc.resolvidaEm)
        : null;

    return (
        <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Linha do Tempo
            </p>
            <div className="relative flex flex-col gap-0">

                {/* ── Abertura ── */}
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-0.5 ring-2 ring-red-200" />
                        <div className={`w-0.5 flex-1 my-1 ${isAtendimento ? "bg-red-200" : "bg-slate-100"}`} style={{ minHeight: "24px" }} />
                    </div>
                    <div className="pb-3 min-w-0">
                        <p className="text-xs font-bold text-red-600">🔴 Ocorrência Aberta</p>
                        <p className="text-xs text-slate-500">{formatarDataHora(oc.createdAt)}</p>
                        <p className="text-[11px] text-slate-400">por {oc.abertaPor?.name ?? "Sistema"}</p>
                    </div>
                </div>

                {/* ── Em Atendimento ── */}
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ring-2 ${isAtendimento ? "bg-amber-500 ring-amber-200" : "bg-slate-200 ring-slate-100"}`} />
                        <div className={`w-0.5 flex-1 my-1 ${isResolvida ? "bg-amber-200" : "bg-slate-100"}`} style={{ minHeight: "24px" }} />
                    </div>
                    <div className="pb-3 min-w-0">
                        {isAtendimento ? (
                            <>
                                <p className="text-xs font-bold text-amber-600">🟡 Em Atendimento</p>
                                <p className="text-[11px] text-slate-400">status atualizado para atendimento</p>
                            </>
                        ) : (
                            <p className="text-xs text-slate-300 italic">Aguardando atendimento...</p>
                        )}
                    </div>
                </div>

                {/* ── Resolvida ── */}
                <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ring-2 ${isResolvida ? "bg-emerald-500 ring-emerald-200" : "bg-slate-200 ring-slate-100"}`} />
                    </div>
                    <div className="min-w-0">
                        {isResolvida ? (
                            <>
                                <p className="text-xs font-bold text-emerald-600">✅ Resolvida</p>
                                <p className="text-xs text-slate-500">{formatarDataHora(oc.resolvidaEm)}</p>
                                <p className="text-[11px] text-slate-400">por {oc.resolvidaPor?.name ?? "—"}</p>
                            </>
                        ) : (
                            <p className="text-xs text-slate-300 italic">Pendente de resolução...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Duração total */}
            {duracaoTotal && (
                <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                    <span className="text-emerald-600 text-sm">⏱</span>
                    <span className="text-xs font-bold text-emerald-700">Tempo total: {duracaoTotal}</span>
                </div>
            )}
        </div>
    );
}

// ─── Componente: Card de Ocorrência ───────────────────────────────────────────

function CardOcorrenciaHistorico({ oc }: { oc: any }) {
    const [expandido, setExpandido] = useState(false);
    const statusCfg = STATUS_CONFIG[oc.status as keyof typeof STATUS_CONFIG];

    return (
        <div className={`bg-white rounded-2xl border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-all ${statusCfg.border}`}>
            {/* Header do card */}
            <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                            {statusCfg.label}
                        </span>
                        <span className="text-xs text-slate-400">{formatarDataHora(oc.createdAt)}</span>
                        <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 font-mono">
                            {oc.origem === "EMAIL_ANGELLIRA" ? "📧 AngelLira" : "👤 Manual"}
                        </span>
                    </div>
                    <p className="mt-1 font-bold text-slate-800">⚠️ {oc.tipoOcorrencia}</p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-base font-bold text-blue-600">{oc.viagem.veiculo.placa}</p>
                    <p className="text-xs text-slate-400">#{oc.viagem.id.slice(0, 8)}</p>
                </div>
            </div>

            {/* Rota */}
            <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 border-y border-slate-100 text-sm">
                <span className="font-semibold text-blue-700 truncate">{oc.viagem.baseOrigem.cidade}</span>
                <span className="text-slate-300">→</span>
                <span className="font-semibold text-emerald-700 truncate">{oc.viagem.baseDestino.cidade}</span>
                <span className="ml-auto text-xs text-slate-400 flex-shrink-0">{oc.viagem.motorista}</span>
            </div>

            {/* Corpo */}
            <div className="px-5 py-3">
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{oc.descricao}</p>

                {/* Pessoas envolvidas */}
                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 text-blue-700">
                        👤 <strong>Aberta:</strong>&nbsp;{oc.abertaPor?.name ?? "Sistema"}
                    </span>
                    {oc.resolvidaPor && (
                        <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 text-emerald-700">
                            ✅ <strong>Resolvida:</strong>&nbsp;{oc.resolvidaPor.name}
                        </span>
                    )}
                </div>

                {/* Timeline (expansível) */}
                {expandido && <Timeline oc={oc} />}

                {/* Nota de resolução (se expandido e existir) */}
                {expandido && oc.resolucao && (
                    <div className="mt-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Nota de Resolução</p>
                        <p className="text-sm text-emerald-800 leading-relaxed">{oc.resolucao}</p>
                    </div>
                )}
            </div>

            {/* Rodapé */}
            <div className="px-5 pb-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                <button
                    onClick={() => setExpandido(e => !e)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1"
                >
                    {expandido ? "▲ Recolher" : "▼ Ver linha do tempo"}
                </button>
                <div className="ml-auto flex gap-2">
                    <Link
                        href={`/viagens/${oc.viagemId}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        Ver Viagem →
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function HistoricoOcorrenciasPage() {
    const utils = api.useUtils();
    const [pagina, setPagina] = useState(1);
    const [filtroStatus, setFiltroStatus] = useState<"TODAS" | "ABERTA" | "EM_ATENDIMENTO" | "RESOLVIDA">("TODAS");
    const [filtroPlaca, setFiltroPlaca] = useState("");
    const [placaBusca, setPlacaBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipoRelatorio, setTipoRelatorio] = useState<"DIA" | "SEMANA" | "MES" | "TODAS">("DIA");
    const [isGerando, setIsGerando] = useState(false);

    const { data, isLoading, refetch } = api.ocorrencia.listarHistorico.useQuery({
        pagina,
        porPagina: 20,
        status: filtroStatus,
        placa: placaBusca || undefined,
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
    }, {
        keepPreviousData: true,
    } as any);

    function aplicarFiltros() {
        setPlacaBusca(filtroPlaca.trim().toUpperCase());
        setPagina(1);
        refetch();
    }

    function limparFiltros() {
        setFiltroStatus("TODAS");
        setFiltroPlaca("");
        setPlacaBusca("");
        setDataInicio("");
        setDataFim("");
        setPagina(1);
    }

    const temFiltrosAtivos = filtroStatus !== "TODAS" || placaBusca || dataInicio || dataFim;

    async function gerarRelatorio() {
        setIsGerando(true);
        try {
            const hoje = new Date();
            let inicio = new Date();
            let fim = new Date();
            let tituloPeriodo = "";

            if (tipoRelatorio === "DIA") {
                inicio.setHours(0, 0, 0, 0);
                tituloPeriodo = `Data: ${hoje.toLocaleDateString("pt-BR")}`;
            } else if (tipoRelatorio === "SEMANA") {
                inicio.setDate(hoje.getDate() - hoje.getDay()); // Domingo
                inicio.setHours(0, 0, 0, 0);
                tituloPeriodo = `Período: ${inicio.toLocaleDateString("pt-BR")} a ${fim.toLocaleDateString("pt-BR")}`;
            } else if (tipoRelatorio === "MES") {
                inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                tituloPeriodo = `Mês: ${hoje.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`;
            } else {
                inicio = new Date(2000, 0, 1);
                tituloPeriodo = "Período: Histórico Completo";
            }

            const dados = await utils.ocorrencia.listarParaRelatorio.fetch({
                dataInicio: inicio.toISOString(),
                dataFim: fim.toISOString(),
            });

            const doc = new jsPDF("landscape");
            const pageWidth = doc.internal.pageSize.getWidth();

            // ─── Header ──────────────────────────────────────────────────
            doc.addImage(LOGO_BASE64, "PNG", 14, 10, 24, 24);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(34, 197, 94); // Verde Princesa
            doc.text("Torre de Controle - Relatório de Ocorrências", 42, 20);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Princesa dos Campos Transportes", 42, 26);
            doc.text(tituloPeriodo, 42, 32);

            // ─── KPIs (Resumo) ───────────────────────────────────────────
            const total = dados.length;
            const abertas = dados.filter(o => o.status === "ABERTA").length;
            const emAtendimento = dados.filter(o => o.status === "EM_ATENDIMENTO").length;
            const resolvidas = dados.filter(o => o.status === "RESOLVIDA").length;
            
            let tempoTotal = 0;
            let qtdResolvidasTempo = 0;
            dados.forEach(o => {
                if (o.status === "RESOLVIDA" && o.resolvidaEm) {
                    tempoTotal += new Date(o.resolvidaEm).getTime() - new Date(o.createdAt).getTime();
                    qtdResolvidasTempo++;
                }
            });
            let tempoMedioStr = "—";
            if (qtdResolvidasTempo > 0) {
                const ms = tempoTotal / qtdResolvidasTempo;
                const h = Math.floor(ms / 3600000);
                const m = Math.floor((ms % 3600000) / 60000);
                tempoMedioStr = `${h}h ${m}min`;
            }

            doc.setDrawColor(220, 220, 220);
            doc.setFillColor(250, 250, 250);
            doc.roundedRect(14, 40, pageWidth - 28, 20, 3, 3, "FD");

            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(50, 50, 50);
            doc.text(`Total: ${total}`, 20, 51);
            doc.setTextColor(220, 38, 38);
            doc.text(`Abertas: ${abertas}`, 60, 51);
            doc.setTextColor(217, 119, 6);
            doc.text(`Em Atend.: ${emAtendimento}`, 100, 51);
            doc.setTextColor(5, 150, 105);
            doc.text(`Resolvidas: ${resolvidas}`, 140, 51);
            
            doc.setTextColor(50, 50, 50);
            doc.text(`Tempo Médio (Resolução): ${tempoMedioStr}`, 190, 51);

            // ─── Tabela ──────────────────────────────────────────────────
            const rows = dados.map(oc => {
                let statusLabel: string = oc.status;
                if (statusLabel === "EM_ATENDIMENTO") statusLabel = "EM ATEND.";
                
                const tempoRes = oc.resolvidaEm ? formatarDuracao(oc.createdAt, oc.resolvidaEm) : "—";
                
                return [
                    new Date(oc.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
                    oc.viagem.veiculo.placa,
                    oc.tipoOcorrencia,
                    `${oc.viagem.baseOrigem.cidade} > ${oc.viagem.baseDestino.cidade}`,
                    statusLabel,
                    tempoRes,
                    oc.abertaPor?.name ?? "Sistema",
                    oc.resolvidaPor?.name ?? "—",
                ];
            });

            autoTable(doc, {
                startY: 65,
                head: [["Abertura", "Placa", "Tipo", "Rota", "Status", "Tempo", "Aberta Por", "Resolvida Por"]],
                body: rows,
                theme: "grid",
                styles: { fontSize: 8, cellPadding: 3 },
                headStyles: { fillColor: [30, 41, 59], textColor: 255 }, // slate-800
                alternateRowStyles: { fillColor: [248, 250, 252] },
                didParseCell: (data) => {
                    if (data.section === 'body' && data.column.index === 4) { // Status column
                        const status = data.cell.raw;
                        if (status === "ABERTA") data.cell.styles.textColor = [220, 38, 38];
                        else if (status === "EM ATEND.") data.cell.styles.textColor = [217, 119, 6];
                        else if (status === "RESOLVIDA") data.cell.styles.textColor = [5, 150, 105];
                    }
                }
            });

            doc.save(`Relatorio_Ocorrencias_${hoje.toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Não foi possível gerar o relatório. Tente novamente.");
        } finally {
            setIsGerando(false);
            setIsModalOpen(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6 py-3">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            📂 Histórico de Ocorrências
                        </h1>
                        <p className="text-xs text-slate-500">
                            Torre de Controle — Todas as ocorrências registradas
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                        >
                            📄 Gerar Relatório
                        </button>
                        <Link
                            href="/ocorrencias"
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
                        >
                            🚨 Ocorrências Ativas
                        </Link>
                        <Link
                            href="/dashboard"
                            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors"
                        >
                            🚛 Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">

                {/* Painel de Filtros */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-slate-500">🔍</span>
                        <h2 className="font-bold text-slate-700 text-sm">Filtros</h2>
                        {temFiltrosAtivos && (
                            <button
                                onClick={limparFiltros}
                                className="ml-auto text-xs text-slate-400 hover:text-red-500 transition-colors font-semibold"
                            >
                                ✕ Limpar filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Status */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Status
                            </label>
                            <select
                                value={filtroStatus}
                                onChange={e => { setFiltroStatus(e.target.value as any); setPagina(1); }}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                            >
                                <option value="TODAS">Todas</option>
                                <option value="ABERTA">Abertas</option>
                                <option value="EM_ATENDIMENTO">Em Atendimento</option>
                                <option value="RESOLVIDA">Resolvidas</option>
                            </select>
                        </div>

                        {/* Placa */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Placa do Veículo
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={filtroPlaca}
                                    onChange={e => setFiltroPlaca(e.target.value.toUpperCase())}
                                    onKeyDown={e => e.key === "Enter" && aplicarFiltros()}
                                    placeholder="Ex: ABC1234"
                                    maxLength={8}
                                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Data Início */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Data Início
                            </label>
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={e => setDataInicio(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        {/* Data Fim */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Data Fim
                            </label>
                            <input
                                type="date"
                                value={dataFim}
                                onChange={e => setDataFim(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={aplicarFiltros}
                            className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                        >
                            🔍 Buscar
                        </button>
                    </div>
                </div>

                {/* Resumo */}
                {data && (
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>
                            <strong className="text-slate-800">{data.total}</strong> ocorrência(s) encontrada(s)
                            {data.paginas > 1 && ` — página ${data.paginaAtual} de ${data.paginas}`}
                        </span>
                        {temFiltrosAtivos && (
                            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-3 py-1 font-semibold">
                                Filtros ativos
                            </span>
                        )}
                    </div>
                )}

                {/* Lista */}
                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 rounded-2xl bg-white animate-pulse border border-slate-100 shadow-sm" />
                        ))}
                    </div>
                )}

                {!isLoading && data?.ocorrencias.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
                        <p className="text-4xl mb-3">📂</p>
                        <p className="text-lg font-semibold text-slate-600">Nenhuma ocorrência encontrada</p>
                        <p className="mt-1 text-sm text-slate-400">
                            {temFiltrosAtivos
                                ? "Tente ajustar os filtros de busca."
                                : "Nenhuma ocorrência foi registrada ainda."
                            }
                        </p>
                    </div>
                )}

                {data && data.ocorrencias.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {data.ocorrencias.map(oc => (
                            <CardOcorrenciaHistorico key={oc.id} oc={oc} />
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {data && data.paginas > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                            onClick={() => setPagina(p => Math.max(1, p - 1))}
                            disabled={pagina === 1}
                            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(data.paginas, 7) }, (_, i) => {
                                let pg: number;
                                if (data.paginas <= 7) {
                                    pg = i + 1;
                                } else if (pagina <= 4) {
                                    pg = i + 1;
                                } else if (pagina >= data.paginas - 3) {
                                    pg = data.paginas - 6 + i;
                                } else {
                                    pg = pagina - 3 + i;
                                }
                                return (
                                    <button
                                        key={pg}
                                        onClick={() => setPagina(pg)}
                                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                                            pg === pagina
                                                ? "bg-slate-800 text-white"
                                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {pg}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setPagina(p => Math.min(data.paginas, p + 1))}
                            disabled={pagina === data.paginas}
                            className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Próxima →
                        </button>
                    </div>
                )}
            </main>

            {/* Modal de Relatório */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 text-lg">Gerar Relatório PDF</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-600">
                                Selecione o período para gerar o relatório com KPIs e detalhamento de ocorrências:
                            </p>
                            
                            <div className="space-y-2">
                                {[
                                    { id: "DIA", label: "Do Dia (Hoje)" },
                                    { id: "SEMANA", label: "Da Semana (Desde Domingo)" },
                                    { id: "MES", label: "Do Mês Atual" },
                                    { id: "TODAS", label: "Histórico Completo" },
                                ].map(opt => (
                                    <label
                                        key={opt.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                                            tipoRelatorio === opt.id 
                                                ? "border-blue-500 bg-blue-50" 
                                                : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tipoRelatorio"
                                            value={opt.id}
                                            checked={tipoRelatorio === opt.id}
                                            onChange={() => setTipoRelatorio(opt.id as any)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={gerarRelatorio}
                                disabled={isGerando}
                                className="px-6 py-2 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            >
                                {isGerando ? "Gerando..." : "Baixar PDF"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
