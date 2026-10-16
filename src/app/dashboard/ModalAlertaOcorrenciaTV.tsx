"use client";

import { useEffect, useState, useRef } from "react";

export type TipoEventoAlerta = "NOVA" | "ATENDIMENTO" | "RESOLVIDA";

export interface ItemAlertaTV {
    id: string;
    ocorrenciaId: string;
    tipoEvento: TipoEventoAlerta;
    momento: Date;
    tipoOcorrencia: string;
    descricao: string;
    origem: string;
    createdAt: Date;
    // Atendimento
    acionadoEm?: Date | null;
    acionadoPorNome?: string | null;
    notaTorre?: string | null;
    unidadeResponsavelNome?: string | null;
    unidadeResponsavelCidade?: string | null;
    // Resolução
    resolvidaEm?: Date | null;
    resolvidaPorNome?: string | null;
    resolucao?: string | null;
    // Viagem
    viagemId: string;
    placa: string;
    motorista: string;
    origemCidade: string;
    destinoCidade: string;
    rotaDescricao: string;
}

interface ModalAlertaOcorrenciaTVProps {
    alertas: ItemAlertaTV[];
    indiceAtual: number;
    onFecharAtual: () => void;
    onNavegar: (novoIndice: number) => void;
    onRepetirSom: () => void;
}

const TEMPO_AUTO_FECHAR_MS = 20_000;

export function ModalAlertaOcorrenciaTV({
    alertas,
    indiceAtual,
    onFecharAtual,
    onNavegar,
    onRepetirSom,
}: ModalAlertaOcorrenciaTVProps) {
    const alerta = alertas[indiceAtual];
    const [progresso, setProgresso] = useState(100);
    const [segundosRestantes, setSegundosRestantes] = useState(Math.ceil(TEMPO_AUTO_FECHAR_MS / 1000));

    // Guarda a função de fechamento em ref para evitar que re-renders do componente pai cancelem o timer
    const onFecharRef = useRef(onFecharAtual);
    useEffect(() => {
        onFecharRef.current = onFecharAtual;
    }, [onFecharAtual]);

    // Contagem regressiva contínua para fechar automaticamente (independente de mouse)
    useEffect(() => {
        if (!alerta) return;
        setProgresso(100);
        setSegundosRestantes(Math.ceil(TEMPO_AUTO_FECHAR_MS / 1000));

        const inicio = Date.now();
        const intervalo = setInterval(() => {
            const decorrido = Date.now() - inicio;
            const restantePct = Math.max(0, 100 - (decorrido / TEMPO_AUTO_FECHAR_MS) * 100);
            const segs = Math.max(0, Math.ceil((TEMPO_AUTO_FECHAR_MS - decorrido) / 1000));

            setProgresso(restantePct);
            setSegundosRestantes(segs);

            if (decorrido >= TEMPO_AUTO_FECHAR_MS) {
                clearInterval(intervalo);
                onFecharRef.current();
            }
        }, 100);

        return () => clearInterval(intervalo);
    }, [alerta?.id]);

    if (!alerta) return null;

    // Configuração temática por tipo de evento
    const CONFIG = {
        NOVA: {
            titulo: "NOVA OCORRÊNCIA REGISTRADA",
            subtitulo: "Alerta em tempo real recebido pela Torre de Controle",
            badgeTexto: "NOVA OCORRÊNCIA",
            badgeCor: "bg-red-500 text-white",
            bordaContainer: "border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.45)]",
            cabecalhoGrad: "from-red-950 via-slate-900 to-slate-950",
            barraProgresso: "bg-red-500",
            icone: "🚨",
            pulseCor: "bg-red-500",
        },
        ATENDIMENTO: {
            titulo: "OCORRÊNCIA EM ATENDIMENTO",
            subtitulo: "Torre de Controle assumiu o incidente e acionou a filial",
            badgeTexto: "EM ATENDIMENTO",
            badgeCor: "bg-amber-500 text-black",
            bordaContainer: "border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.40)]",
            cabecalhoGrad: "from-amber-950 via-slate-900 to-slate-950",
            barraProgresso: "bg-amber-500",
            icone: "⚠️",
            pulseCor: "bg-amber-500",
        },
        RESOLVIDA: {
            titulo: "OCORRÊNCIA RESOLVIDA",
            subtitulo: "Unidade responsável registrou a resolução e liberação do caso",
            badgeTexto: "RESOLVIDA",
            badgeCor: "bg-emerald-500 text-white",
            bordaContainer: "border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.40)]",
            cabecalhoGrad: "from-emerald-950 via-slate-900 to-slate-950",
            barraProgresso: "bg-emerald-500",
            icone: "✅",
            pulseCor: "bg-emerald-500",
        },
    }[alerta.tipoEvento];

    const fmtHora = (d: Date | string | null | undefined) => {
        if (!d) return "—";
        return new Date(d).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    const fmtDataHora = (d: Date | string | null | undefined) => {
        if (!d) return "—";
        const dateObj = new Date(d);
        return `${dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
            <div
                className={`w-full max-w-4xl bg-slate-900 rounded-2xl border-2 overflow-hidden flex flex-col max-h-[92vh] ${CONFIG.bordaContainer}`}
            >
                {/* ── Barra Superior com Temporizador e Fila ── */}
                <div className="h-1.5 w-full bg-slate-800 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-100 ease-linear ${CONFIG.barraProgresso}`}
                        style={{ width: `${progresso}%` }}
                    />
                </div>

                {/* ── Header do Alerta ── */}
                <div className={`px-6 py-4 bg-gradient-to-r ${CONFIG.cabecalhoGrad} border-b border-slate-800 flex items-center justify-between`}>
                    <div className="flex items-center gap-3.5">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 text-2xl">
                            <span>{CONFIG.icone}</span>
                            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${CONFIG.pulseCor}`} />
                            <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${CONFIG.pulseCor}`} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${CONFIG.badgeCor}`}>
                                    {CONFIG.badgeTexto}
                                </span>
                                <span className="text-xs font-mono font-semibold text-slate-400">
                                    {fmtDataHora(alerta.momento)}
                                </span>
                            </div>
                            <h2 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
                                {CONFIG.titulo}
                            </h2>
                            <p className="text-xs text-slate-300">
                                {CONFIG.subtitulo}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Controles de Fila de Alertas */}
                        {alertas.length > 1 && (
                            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                                <button
                                    onClick={() => onNavegar(Math.max(0, indiceAtual - 1))}
                                    disabled={indiceAtual === 0}
                                    className="text-slate-400 hover:text-white disabled:opacity-30 text-xs px-1 font-bold"
                                    title="Alerta anterior"
                                >
                                    ◀
                                </button>
                                <span className="text-[11px] font-mono text-slate-300 font-bold px-1">
                                    {indiceAtual + 1} de {alertas.length}
                                </span>
                                <button
                                    onClick={() => onNavegar(Math.min(alertas.length - 1, indiceAtual + 1))}
                                    disabled={indiceAtual === alertas.length - 1}
                                    className="text-slate-400 hover:text-white disabled:opacity-30 text-xs px-1 font-bold"
                                    title="Próximo alerta"
                                >
                                    ▶
                                </button>
                            </div>
                        )}

                        {/* Botão de Repetir Som */}
                        <button
                            onClick={onRepetirSom}
                            title="Tocar som de alerta novamente"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-sm transition"
                        >
                            🔊
                        </button>

                        {/* Botão Fechar */}
                        <button
                            onClick={onFecharAtual}
                            title="Fechar este alerta (ou ESC)"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white border border-slate-700 text-base leading-none transition"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* ── Conteúdo Central ── */}
                <div className="p-6 overflow-y-auto space-y-4">
                    {/* Bloco 1: Veículo e Rota (Destaque Principal) */}
                    <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                Veículo / Placa
                            </span>
                            <span className="text-2xl font-mono font-black text-cyan-300 tracking-wider">
                                {alerta.placa}
                            </span>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                Viagem
                            </span>
                            <span className="text-lg font-mono font-bold text-white">
                                #{alerta.viagemId}
                            </span>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                Motorista
                            </span>
                            <span className="text-sm font-semibold text-slate-200 truncate block" title={alerta.motorista}>
                                {alerta.motorista || "Não informado"}
                            </span>
                        </div>

                        <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                Trajeto Operacional
                            </span>
                            <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                                <span className="text-cyan-400">{alerta.origemCidade}</span>
                                <span className="text-slate-500">→</span>
                                <span className="text-emerald-400">{alerta.destinoCidade}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 2: Tipo de Ocorrência e Descrição Inicial */}
                    <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Motivo da Ocorrência:
                                </span>
                                <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-700 text-amber-300">
                                    {alerta.tipoOcorrencia}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400">
                                Origem: <span className="font-semibold text-slate-200">{alerta.origem === "EMAIL_ANGELLIRA" ? "📡 Alarme AngelLira" : "👤 Registro Manual"}</span>
                                {" · "}
                                Aberta às <span className="font-mono text-slate-200 font-bold">{fmtHora(alerta.createdAt)}</span>
                            </div>
                        </div>

                        <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800/80">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Detalhes do Relato:
                            </p>
                            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                                {alerta.descricao}
                            </p>
                        </div>
                    </div>

                    {/* Bloco 3: Informações de Atendimento pela Torre (se houver) */}
                    {(alerta.tipoEvento === "ATENDIMENTO" || alerta.tipoEvento === "RESOLVIDA" || alerta.acionadoEm) && (
                        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                                        Atendimento da Torre:
                                    </span>
                                    {alerta.unidadeResponsavelNome && (
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
                                            🏢 Unidade Responsável: {alerta.unidadeResponsavelNome}
                                        </span>
                                    )}
                                </div>
                                {alerta.acionadoEm && (
                                    <span className="text-xs text-amber-300/80">
                                        Assumido às <span className="font-mono font-bold text-amber-200">{fmtHora(alerta.acionadoEm)}</span>
                                        {alerta.acionadoPorNome && ` por ${alerta.acionadoPorNome}`}
                                    </span>
                                )}
                            </div>

                            {alerta.notaTorre ? (
                                <div className="bg-slate-950/90 rounded-lg p-3 border border-amber-900/40">
                                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                                        Alinhamento com o Motorista:
                                    </p>
                                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {alerta.notaTorre}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-amber-300/60 italic">
                                    Em contato com motorista e filial para tratativa.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Bloco 4: Informações de Resolução (se for RESOLVIDA) */}
                    {(alerta.tipoEvento === "RESOLVIDA" || alerta.resolvidaEm) && (
                        <div className="bg-emerald-950/25 border border-emerald-500/40 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                    Resolução Concluída:
                                </span>
                                {alerta.resolvidaEm && (
                                    <span className="text-xs text-emerald-300">
                                        Resolvida às <span className="font-mono font-bold text-emerald-200">{fmtHora(alerta.resolvidaEm)}</span>
                                        {alerta.resolvidaPorNome && ` por ${alerta.resolvidaPorNome}`}
                                    </span>
                                )}
                            </div>

                            {alerta.resolucao && (
                                <div className="bg-slate-950/90 rounded-lg p-3 border border-emerald-900/40">
                                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                                        Solução Aplicada:
                                    </p>
                                    <p className="text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                                        {alerta.resolucao}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Rodapé com Ações ── */}
                <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <span>
                            ⏳ Fechando em <strong className="text-white font-bold">{segundosRestantes}s</strong>...
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {alertas.length > 1 && indiceAtual < alertas.length - 1 && (
                            <button
                                onClick={() => onNavegar(indiceAtual + 1)}
                                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                            >
                                Próximo Alerta ({alertas.length - 1 - indiceAtual} restante) →
                            </button>
                        )}

                        <button
                            onClick={onFecharAtual}
                            className={`px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                                alerta.tipoEvento === "NOVA"
                                    ? "bg-red-600 hover:bg-red-500 text-white"
                                    : alerta.tipoEvento === "ATENDIMENTO"
                                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                            }`}
                        >
                            Dispensar Alerta (ESC)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
