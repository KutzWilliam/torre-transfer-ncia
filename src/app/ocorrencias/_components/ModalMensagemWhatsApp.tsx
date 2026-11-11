"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/trpc/react";
import { getBrudamManifestoUrl } from "@/utils/brudam";

export function formatarDuracaoAtraso(minutos: number | null | undefined): string {
    if (minutos === null || minutos === undefined || minutos <= 0) return "0 min";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min (${minutos} min)`;
    if (h > 0) return `${h}h (${minutos} min)`;
    return `${m} min`;
}

export function formatarDuracaoCurta(minutos: number | null | undefined): string {
    if (minutos === null || minutos === undefined || minutos <= 0) return "0 min";
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    if (h > 0 && m > 0) return `${h}h ${m}min`;
    if (h > 0) return `${h}h`;
    return `${m} min`;
}

export function formatarDataHoraCurta(date: Date | string | null | undefined): string {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export interface ParametrosMensagemWhatsApp {
    placa: string;
    viagemId: string;
    motorista: string;
    rota: string;
    tipoOcorrencia: string;
    causouParada: boolean;
    tempoAtrasoOcorrenciaMinutos: number;
    prevSaidaOrigem: Date | string | null;
    saidaEfetivaOrigem: Date | string | null;
    atrasoSaidaMinutos: number | null;
    proximaParada: {
        nome: string;
        prevChegada: Date | string | null;
    } | null;
    destinoFinal: {
        nome: string;
        prevChegada: Date | string | null;
    };
    alvoPrevisao: "AMBOS" | "PROXIMA_PARADA" | "DESTINO_FINAL";
    idsManifestos: number[];
    qtdMinutas: number;
    totalVolumes: number;
    notaTorre: string;
    unidadeResponsavelNome?: string;
}

export function montarMensagemWhatsAppOcorrencia(params: ParametrosMensagemWhatsApp): string {
    const atrasoSaidaPositivo = Math.max(0, params.atrasoSaidaMinutos ?? 0);
    const atrasoOcorrenciaPositivo = Math.max(0, params.tempoAtrasoOcorrenciaMinutos || 0);
    const atrasoTotalMinutos = atrasoSaidaPositivo + atrasoOcorrenciaPositivo;

    // Linha de saída da origem
    let textoSaidaOrigem = "Sem registro de saída efetiva";
    if (params.atrasoSaidaMinutos !== null) {
        if (params.atrasoSaidaMinutos > 0) {
            textoSaidaOrigem = `Saiu com atraso de *${formatarDuracaoCurta(params.atrasoSaidaMinutos)}* (Previsto: ${formatarDataHoraCurta(params.prevSaidaOrigem)} | Real: ${formatarDataHoraCurta(params.saidaEfetivaOrigem)})`;
        } else {
            textoSaidaOrigem = `Saiu no horário previsto (Previsto: ${formatarDataHoraCurta(params.prevSaidaOrigem)} | Real: ${formatarDataHoraCurta(params.saidaEfetivaOrigem)})`;
        }
    } else if (params.prevSaidaOrigem) {
        textoSaidaOrigem = `Não identificado (Saída prevista: ${formatarDataHoraCurta(params.prevSaidaOrigem)})`;
    }

    // Cálculo de novos horários de chegada
    const linhasPrevisao: string[] = [];

    const mostrarProxima =
        params.proximaParada?.prevChegada &&
        (params.alvoPrevisao === "AMBOS" || params.alvoPrevisao === "PROXIMA_PARADA");

    const mostrarDestino =
        params.destinoFinal?.prevChegada &&
        (!params.proximaParada || params.alvoPrevisao === "AMBOS" || params.alvoPrevisao === "DESTINO_FINAL");

    if (mostrarProxima && params.proximaParada?.prevChegada) {
        const prevOrig = new Date(params.proximaParada.prevChegada);
        const novaPrev = new Date(prevOrig.getTime() + atrasoTotalMinutos * 60000);
        linhasPrevisao.push(
            `• *Nova previsão — Próxima Parada (${params.proximaParada.nome}):* *${formatarDataHoraCurta(novaPrev)}* _(Prev. original: ${formatarDataHoraCurta(prevOrig)})_`
        );
    }

    if (mostrarDestino && params.destinoFinal?.prevChegada) {
        const prevOrig = new Date(params.destinoFinal.prevChegada);
        const novaPrev = new Date(prevOrig.getTime() + atrasoTotalMinutos * 60000);
        linhasPrevisao.push(
            `• *Nova previsão — Destino Final (${params.destinoFinal.nome}):* *${formatarDataHoraCurta(novaPrev)}* _(Prev. original: ${formatarDataHoraCurta(prevOrig)})_`
        );
    }

    // Carga / Manifesto
    const manifestoStr =
        params.idsManifestos.length > 0
            ? params.idsManifestos.map((id) => `#${id}`).join(", ")
            : "Não localizado";

    const linhas: string[] = [
        `🚨 *INFORMATIVO DE ATRASO EM VIAGEM — TORRE DE CONTROLE* 🚨`,
        ``,
        `🚛 *Veículo (Placa):* ${params.placa} _(Viagem #${params.viagemId})_`,
        `👤 *Motorista:* ${params.motorista || "Não informado"}`,
        `🛣️ *Rota:* ${params.rota}`,
        `⚠️ *Ocorrência:* ${params.tipoOcorrencia}${params.causouParada ? " _(Causou parada do veículo)_" : ""}`,
        ``,
        `📦 *Dados da Carga (Manifesto):*`,
        `• *Manifesto(s):* ${manifestoStr}`,
        `• *Carga transportada:* *${params.qtdMinutas} minuta(s)* | *${params.totalVolumes} volume(s)*`,
        ``,
        `⏱️ *Impacto no Horário da Viagem:*`,
        `• *Saída da origem:* ${textoSaidaOrigem}`,
        `• *Atraso gerado pela ocorrência:* *+${formatarDuracaoAtraso(atrasoOcorrenciaPositivo)}*`,
    ];

    if (atrasoSaidaPositivo > 0 && atrasoOcorrenciaPositivo > 0) {
        linhas.push(`• *Atraso total acumulado:* *${formatarDuracaoCurta(atrasoTotalMinutos)}*`);
    }

    if (linhasPrevisao.length > 0) {
        linhas.push(...linhasPrevisao);
    }

    linhas.push(
        ``,
        `📝 *Nota de Atendimento (Conversado com o motorista):*`,
        `${params.notaTorre.trim() || "—"}`
    );

    if (params.unidadeResponsavelNome) {
        linhas.push(``, `🏢 *Unidade Responsável:* ${params.unidadeResponsavelNome}`);
    }

    return linhas.join("\n");
}

/**
 * Modal avulso para visualizar/copiar/enviar novamente a mensagem de WhatsApp
 * de uma ocorrência que já está em atendimento ou no histórico.
 */
export function ModalMensagemWhatsApp({
    ocorrenciaId,
    onClose,
}: {
    ocorrenciaId: string;
    onClose: () => void;
}) {
    const { data: contexto, isLoading } = api.ocorrencia.obterContextoAtendimento.useQuery(
        { ocorrenciaId },
        { refetchOnWindowFocus: false }
    );

    const [idsSelecionados, setIdsSelecionados] = useState<number[]>([]);
    const [qtdMinutasManual, setQtdMinutasManual] = useState<number>(0);
    const [totalVolumesManual, setTotalVolumesManual] = useState<number>(0);
    const [tempoAtrasoMinutos, setTempoAtrasoMinutos] = useState<number>(0);
    const [alvoPrevisao, setAlvoPrevisao] = useState<"AMBOS" | "PROXIMA_PARADA" | "DESTINO_FINAL">("AMBOS");
    const [mensagemEditada, setMensagemEditada] = useState<string | null>(null);
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        if (!contexto) return;
        setTempoAtrasoMinutos(contexto.ocorrencia.tempoAtrasoMinutos ?? 0);
        const padrao = contexto.manifesto.itens.filter((i) => i.selecionadoPadrao).map((i) => i.idManifesto);
        setIdsSelecionados(padrao);
        setQtdMinutasManual(contexto.manifesto.qtdMinutas);
        setTotalVolumesManual(contexto.manifesto.totalVolumes);
    }, [contexto]);

    function alternarManifesto(idManifesto: number) {
        if (!contexto) return;
        setIdsSelecionados((prev) => {
            const novo = prev.includes(idManifesto)
                ? prev.filter((id) => id !== idManifesto)
                : [...prev, idManifesto];
            const itensSel = contexto.manifesto.itens.filter((i) => novo.includes(i.idManifesto));
            setQtdMinutasManual(itensSel.reduce((acc, i) => acc + i.qtdMinutas, 0));
            setTotalVolumesManual(itensSel.reduce((acc, i) => acc + i.totalVolumes, 0));
            setMensagemEditada(null);
            return novo;
        });
    }

    const mensagemPadrao = useMemo(() => {
        if (!contexto) return "";
        return montarMensagemWhatsAppOcorrencia({
            placa: contexto.viagem.placa,
            viagemId: contexto.viagem.id,
            motorista: contexto.viagem.motorista,
            rota: contexto.viagem.rotaSequencial || contexto.viagem.rotaDescricao,
            tipoOcorrencia: contexto.ocorrencia.tipoOcorrencia,
            causouParada: contexto.ocorrencia.causouParada,
            tempoAtrasoOcorrenciaMinutos: tempoAtrasoMinutos,
            prevSaidaOrigem: contexto.viagem.prevSaidaOrigem,
            saidaEfetivaOrigem: contexto.viagem.saidaEfetivaOrigem,
            atrasoSaidaMinutos: contexto.viagem.atrasoSaidaMinutos,
            proximaParada: contexto.viagem.proximaParada,
            destinoFinal: contexto.viagem.destinoFinal,
            alvoPrevisao,
            idsManifestos: idsSelecionados,
            qtdMinutas: qtdMinutasManual,
            totalVolumes: totalVolumesManual,
            notaTorre: contexto.ocorrencia.notaTorre ?? "",
            unidadeResponsavelNome: contexto.ocorrencia.unidadeResponsavelNome ?? undefined,
        });
    }, [contexto, tempoAtrasoMinutos, alvoPrevisao, idsSelecionados, qtdMinutasManual, totalVolumesManual]);

    const mensagemFinal = mensagemEditada ?? mensagemPadrao;

    async function copiarMensagem() {
        try {
            await navigator.clipboard.writeText(mensagemFinal);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 3000);
        } catch {
            // fallback
        }
    }

    function abrirWhatsApp() {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagemFinal)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        <div>
                            <h3 className="text-base font-bold">Mensagem de Atraso para Grupo do WhatsApp</h3>
                            <p className="text-xs text-emerald-100">
                                Confira os dados da viagem, manifesto e copie para enviar no grupo
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white text-xl leading-none p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {isLoading || !contexto ? (
                        <div className="space-y-3 py-8">
                            <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
                            <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
                            <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
                        </div>
                    ) : (
                        <>
                            {/* Resumo rápido de Manifesto */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        📦 Manifesto(s) da Placa {contexto.viagem.placa}
                                    </span>
                                    <div className="flex items-center gap-3 text-xs">
                                        <label className="flex items-center gap-1 text-slate-600">
                                            Minutas:
                                            <input
                                                type="number"
                                                min={0}
                                                value={qtdMinutasManual}
                                                onChange={(e) => {
                                                    setQtdMinutasManual(Math.max(0, parseInt(e.target.value || "0", 10)));
                                                    setMensagemEditada(null);
                                                }}
                                                className="w-16 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 bg-white"
                                            />
                                        </label>
                                        <label className="flex items-center gap-1 text-slate-600">
                                            Volumes:
                                            <input
                                                type="number"
                                                min={0}
                                                value={totalVolumesManual}
                                                onChange={(e) => {
                                                    setTotalVolumesManual(Math.max(0, parseInt(e.target.value || "0", 10)));
                                                    setMensagemEditada(null);
                                                }}
                                                className="w-20 border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 bg-white"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {contexto.manifesto.itens.length > 0 ? (
                                    <div className="space-y-1 max-h-28 overflow-y-auto">
                                        {contexto.manifesto.itens.map((m) => {
                                            const checked = idsSelecionados.includes(m.idManifesto);
                                            return (
                                                <label
                                                    key={m.idManifesto}
                                                    className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                                        checked
                                                            ? "bg-blue-50 border-blue-200 text-blue-900"
                                                            : "bg-white border-slate-200 text-slate-600"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => alternarManifesto(m.idManifesto)}
                                                            className="rounded border-slate-300"
                                                        />
                                                        <a
                                                            href={getBrudamManifestoUrl(m.idManifesto)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="font-mono font-bold text-blue-600 hover:underline"
                                                        >
                                                            #{m.idManifesto} ↗
                                                        </a>
                                                        <span className="truncate text-slate-500">
                                                            {m.origem ?? "—"} → {m.destino ?? "—"}
                                                        </span>
                                                    </div>
                                                    <span className="font-bold flex-shrink-0">
                                                        {m.qtdMinutas} min. • {m.totalVolumes} vol.
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-700">
                                        Nenhum manifesto encontrado automaticamente para esta placa no período. Você pode informar minutas e volumes manualmente acima.
                                    </p>
                                )}
                            </div>

                            {/* Ajuste rápido de tempo de atraso e parada alvo */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                        Tempo de Atraso da Ocorrência (min)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        step={5}
                                        value={tempoAtrasoMinutos}
                                        onChange={(e) => {
                                            setTempoAtrasoMinutos(Math.max(0, parseInt(e.target.value || "0", 10)));
                                            setMensagemEditada(null);
                                        }}
                                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800"
                                    />
                                </div>
                                {contexto.viagem.proximaParada && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                            Exibir Previsão de Chegada
                                        </label>
                                        <select
                                            value={alvoPrevisao}
                                            onChange={(e) => {
                                                setAlvoPrevisao(e.target.value as "AMBOS" | "PROXIMA_PARADA" | "DESTINO_FINAL");
                                                setMensagemEditada(null);
                                            }}
                                            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                                        >
                                            <option value="AMBOS">Próxima Parada + Destino Final</option>
                                            <option value="PROXIMA_PARADA">Apenas Próxima Parada ({contexto.viagem.proximaParada.nome})</option>
                                            <option value="DESTINO_FINAL">Apenas Destino Final ({contexto.viagem.destinoFinal.nome})</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Textarea da mensagem */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                        Prévia da Mensagem (editável)
                                    </label>
                                    {mensagemEditada !== null && (
                                        <button
                                            type="button"
                                            onClick={() => setMensagemEditada(null)}
                                            className="text-xs text-blue-600 hover:underline font-semibold"
                                        >
                                            ↺ Restaurar texto automático
                                        </button>
                                    )}
                                </div>
                                <textarea
                                    value={mensagemFinal}
                                    onChange={(e) => setMensagemEditada(e.target.value)}
                                    rows={12}
                                    className="w-full border border-emerald-200 bg-emerald-50/30 rounded-xl px-4 py-3 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Fechar
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={copiarMensagem}
                            disabled={isLoading || !contexto}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                copiado
                                    ? "bg-emerald-700 text-white"
                                    : "bg-slate-800 text-white hover:bg-slate-700"
                            }`}
                        >
                            {copiado ? "✅ Mensagem Copiada!" : "📋 Copiar Texto"}
                        </button>
                        <button
                            type="button"
                            onClick={abrirWhatsApp}
                            disabled={isLoading || !contexto}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                            💬 Abrir no WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

