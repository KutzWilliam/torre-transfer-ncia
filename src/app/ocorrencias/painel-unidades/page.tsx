"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

// ─── Helpers de Formatação ───────────────────────────────────────────────────

function formatarDataHora(date: Date | string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function tempoDecorridoMinutos(date: Date | string) {
    return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

function tempoAgo(date: Date | string) {
    const diff = tempoDecorridoMinutos(date);
    if (diff < 1) return "agora mesmo";
    if (diff < 60) return `${diff} min atrás`;
    const horas = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${horas}h ${mins > 0 ? `${mins}m` : ""} atrás`;
}

// ─── Componente: Modal de Resolução ──────────────────────────────────────────

function ModalResolucao({
    ocorrenciaId,
    placa,
    unidadeNome,
    onClose,
    onResolvido,
}: {
    ocorrenciaId: string;
    placa: string;
    unidadeNome: string;
    onClose: () => void;
    onResolvido: () => void;
}) {
    const [resolucao, setResolucao] = useState("");
    const resolver = api.ocorrencia.resolver.useMutation({
        onSuccess: () => {
            onResolvido();
            onClose();
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">✅</span>
                        <h3 className="text-lg font-bold text-slate-900">Resolver Ocorrência</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1">
                        Veículo: <strong className="text-slate-800 font-mono">{placa}</strong> | Unidade:{" "}
                        <strong className="text-slate-800">{unidadeNome}</strong>
                    </p>
                    <p className="text-sm text-slate-600">
                        Descreva o desfecho e as providências tomadas pela unidade para encerrar a ocorrência.
                    </p>
                </div>
                <textarea
                    value={resolucao}
                    onChange={(e) => setResolucao(e.target.value)}
                    rows={4}
                    placeholder="Ex: Borracharia móvel trocou o pneu no km 120. Veículo liberado para seguir viagem com segurança..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none shadow-inner"
                />
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => resolver.mutate({ id: ocorrenciaId, resolucao })}
                        disabled={resolucao.trim().length < 5 || resolver.isPending}
                        className="px-5 py-2 rounded-xl text-sm font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-emerald-600/20"
                    >
                        {resolver.isPending ? "Concluindo..." : "✓ Confirmar Resolução"}
                    </button>
                </div>
                {resolver.error && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                        {resolver.error.message}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Componente: Modal de Notificação ────────────────────────────────────────

function ModalNotificacao({
    ocorrenciaId,
    unidadeUsuarios,
    onClose,
}: {
    ocorrenciaId: string;
    unidadeUsuarios?: Array<{ id: string; name: string | null; email: string }>;
    onClose: () => void;
}) {
    const [usuarioId, setUsuarioId] = useState("");
    const [enviado, setEnviado] = useState<string | null>(null);

    const { data: todosUsuarios, isLoading: loadingUsuarios } =
        api.ocorrencia.listarUsuariosParaNotificacao.useQuery();

    const notificar = api.ocorrencia.notificar.useMutation({
        onSuccess: (res) => {
            setEnviado(res.destinatario ?? res.email ?? "Responsável");
        },
    });

    const usuariosParaExibir = useMemo(() => {
        if (!todosUsuarios) return [];
        return todosUsuarios;
    }, [todosUsuarios]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-lg">📧</span>
                        <h3 className="text-base font-bold text-blue-900">Notificar Responsável</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {enviado ? (
                        <div className="text-center py-4 space-y-3">
                            <div className="text-5xl">✅</div>
                            <p className="text-base font-bold text-emerald-700">E-mail enviado com sucesso!</p>
                            <p className="text-sm text-slate-500">
                                Notificação enviada para <strong>{enviado}</strong>.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-slate-500">
                                Selecione o operador/responsável que deve receber o alerta da ocorrência por e-mail:
                            </p>

                            {unidadeUsuarios && unidadeUsuarios.length > 0 && (
                                <div>
                                    <label className="block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                                        ⚡ Usuários da Unidade Responsável
                                    </label>
                                    <div className="space-y-1.5 mb-3">
                                        {unidadeUsuarios.map((u) => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => setUsuarioId(u.id)}
                                                className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                                                    usuarioId === u.id
                                                        ? "border-blue-500 bg-blue-50/80 text-blue-900 font-bold"
                                                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                                                }`}
                                            >
                                                <span>👤 {u.name}</span>
                                                <span className="text-[11px] text-slate-500">{u.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Ou selecione da lista geral:
                                </label>
                                {loadingUsuarios ? (
                                    <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                                ) : (
                                    <select
                                        value={usuarioId}
                                        onChange={(e) => setUsuarioId(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                    >
                                        <option value="">Selecione um usuário...</option>
                                        {usuariosParaExibir.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.name} — {u.email}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {notificar.error && (
                                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                                    ⚠️ {notificar.error.message}
                                </p>
                            )}

                            <div className="flex gap-2 justify-end pt-1">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() =>
                                        notificar.mutate({
                                            ocorrenciaId,
                                            usuarioDestinatarioId: usuarioId,
                                        })
                                    }
                                    disabled={!usuarioId || notificar.isPending}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {notificar.isPending ? "Enviando..." : "📧 Enviar Notificação"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Componente: Card da Unidade ─────────────────────────────────────────────

const LIMITE_INICIAL_OCORRENCIAS = 3;

function CardUnidade({
    unidade,
    onAbrirNotificacao,
    onAbrirResolucao,
}: {
    unidade: any;
    onAbrirNotificacao: (id: string, usuarios: any[]) => void;
    onAbrirResolucao: (id: string, placa: string, unidadeNome: string) => void;
}) {
    const [expandido, setExpandido] = useState(false);

    const ocorrenciasExibidas = useMemo(() => {
        if (expandido) return unidade.ocorrencias;
        return unidade.ocorrencias.slice(0, LIMITE_INICIAL_OCORRENCIAS);
    }, [unidade.ocorrencias, expandido]);

    const temMaisOcorrencias = unidade.ocorrencias.length > LIMITE_INICIAL_OCORRENCIAS;
    const qtdOcultas = unidade.ocorrencias.length - LIMITE_INICIAL_OCORRENCIAS;

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            {/* Cabeçalho da Unidade */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg">🏢</span>
                        <h2 className="text-lg font-extrabold tracking-tight text-white truncate">
                            {unidade.nome}
                        </h2>
                        <span className="text-xs bg-slate-700/80 text-slate-200 px-2.5 py-0.5 rounded-full font-medium">
                            {unidade.cidade}
                        </span>
                    </div>

                    {/* Responsável da Unidade e Telefone de Contato */}
                    <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                        {unidade.responsavelNome ? (
                            <span className="flex items-center gap-1">
                                <span className="text-slate-400">Responsável:</span>
                                <strong className="text-slate-100">{unidade.responsavelNome}</strong>
                            </span>
                        ) : (
                            <span className="text-slate-400 italic">Responsável não configurado</span>
                        )}

                        {unidade.responsavelContato && (
                            <a
                                href={`tel:${unidade.responsavelContato}`}
                                className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold hover:bg-amber-500/30 transition-colors"
                            >
                                📞 {unidade.responsavelContato}
                            </a>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-extrabold text-sm shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                        {unidade.totalOcorrencias} ocorrência(s)
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                {/* ─── Seção 1: Usuários do Sistema Vinculados à Unidade ─── */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                👥 Usuários Vinculados à Unidade ({unidade.usuarios.length})
                            </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Notificações e resolução</span>
                    </div>

                    {unidade.usuarios.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {unidade.usuarios.map((u: any) => (
                                <div
                                    key={u.id}
                                    className="bg-white border border-slate-200/70 rounded-xl p-2.5 flex items-center gap-3 shadow-2xs hover:border-blue-300 transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-sm">
                                        {(u.name ?? "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-xs font-bold text-slate-800 truncate">
                                                {u.name ?? "Sem nome"}
                                            </p>
                                            <span
                                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                                    u.role === "ADMIN"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : u.role === "GERENTE"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-blue-100 text-blue-800"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </div>
                                        <a
                                            href={`mailto:${u.email}`}
                                            className="text-[11px] text-slate-500 hover:text-blue-600 truncate block transition-colors"
                                            title={u.email}
                                        >
                                            {u.email}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
                            <span className="text-base flex-shrink-0">⚠️</span>
                            <div>
                                <p className="font-bold">Nenhum usuário cadastrado nesta unidade!</p>
                                <p className="text-rose-600 text-[11px] mt-0.5">
                                    Nenhum colaborador possui acesso para responder ou ser notificado
                                    diretamente por esta unidade.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── Seção 2: Ocorrências da Unidade ─── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                            🚨 Ocorrências sob Responsabilidade ({unidade.ocorrencias.length})
                        </h3>
                        {temMaisOcorrencias && (
                            <span className="text-xs text-slate-400 font-medium">
                                {expandido
                                    ? `Exibindo todas (${unidade.ocorrencias.length})`
                                    : `Exibindo 3 de ${unidade.ocorrencias.length}`}
                            </span>
                        )}
                    </div>

                    <div className="space-y-3.5">
                        {ocorrenciasExibidas.map((oc: any) => {
                            const tempoMin = tempoDecorridoMinutos(oc.createdAt);
                            const isUrgente = tempoMin > 60;

                            return (
                                <div
                                    key={oc.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4.5 space-y-3.5 shadow-2xs hover:border-amber-400 transition-all"
                                >
                                    {/* Header Ocorrência */}
                                    <div className="flex items-start justify-between gap-2 flex-wrap">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                    Em Atendimento
                                                </span>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                                                        isUrgente
                                                            ? "bg-red-50 text-red-700 font-bold"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    ⏱️ {tempoAgo(oc.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-extrabold text-slate-800 mt-1.5 flex items-center gap-1.5">
                                                <span>⚠️</span> {oc.tipoOcorrencia}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-base font-extrabold font-mono text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg inline-block">
                                                {oc.viagem.veiculo.placa}
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                Viagem #{oc.viagem.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rota & Motorista */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                                Rota
                                            </span>
                                            <p className="font-bold text-slate-700 truncate mt-0.5">
                                                {oc.viagem.baseOrigem.cidade} ➔ {oc.viagem.baseDestino.cidade}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-[10px] uppercase font-bold">
                                                Motorista
                                            </span>
                                            <p className="font-semibold text-slate-800 truncate mt-0.5">
                                                {oc.viagem.motorista}
                                            </p>
                                        </div>

                                        {oc.ultimaTelemetria && (
                                            <div className="sm:col-span-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                                                <span>
                                                    📍 Último Sinal:{" "}
                                                    {formatarDataHora(oc.ultimaTelemetria.dataHoraLocal)}
                                                </span>
                                                <span className="font-semibold text-slate-700">
                                                    Velocidade: {oc.ultimaTelemetria.velocidade ?? 0} km/h
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Descrição do Problema */}
                                    <div className="text-xs text-slate-600 bg-white rounded-xl p-3 border border-slate-100">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                                            Descrição Inicial:
                                        </span>
                                        <p className="leading-relaxed whitespace-pre-wrap">{oc.descricao}</p>
                                    </div>

                                    {/* Nota da Torre */}
                                    {oc.notaTorre && (
                                        <div className="text-xs bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-amber-900 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                                    📞 Nota da Torre de Controle:
                                                </span>
                                                <span className="text-[10px] text-amber-600">
                                                    {oc.acionadoPor?.name ? `Por: ${oc.acionadoPor.name}` : ""}
                                                </span>
                                            </div>
                                            <p className="leading-relaxed whitespace-pre-wrap font-medium">
                                                {oc.notaTorre}
                                            </p>
                                        </div>
                                    )}

                                    {/* Rodapé de Ações da Ocorrência */}
                                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100 flex-wrap">
                                        <span className="text-[11px] text-slate-400">
                                            Aberta por {oc.abertaPor?.name ?? "Sistema"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    onAbrirNotificacao(oc.id, unidade.usuarios)
                                                }
                                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-2xs"
                                            >
                                                📧 Notificar
                                            </button>
                                            <Link
                                                href={`/viagens/${oc.viagemId}`}
                                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shadow-2xs"
                                            >
                                                Viagem →
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    onAbrirResolucao(
                                                        oc.id,
                                                        oc.viagem.veiculo.placa,
                                                        unidade.nome
                                                    )
                                                }
                                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                                            >
                                                ✓ Resolver
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botão Ver Mais / Ver Menos */}
                    {temMaisOcorrencias && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={() => setExpandido(!expandido)}
                                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs ${
                                    expandido
                                        ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                                        : "bg-amber-50/80 border-amber-200 text-amber-800 hover:bg-amber-100"
                                }`}
                            >
                                {expandido ? (
                                    <>
                                        <span>▲</span>
                                        <span>Recolher (mostrar apenas as 3 últimas)</span>
                                    </>
                                ) : (
                                    <>
                                        <span>▼</span>
                                        <span>
                                            Ver mais <strong>{qtdOcultas}</strong> ocorrência(s) desta unidade
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Página Principal: Painel de Unidades com Ocorrências ─────────────────────

export default function PainelUnidadesOcorrenciasPage() {
    const [busca, setBusca] = useState("");
    const [selectedOcorrenciaResolucao, setSelectedOcorrenciaResolucao] = useState<{
        id: string;
        placa: string;
        unidadeNome: string;
    } | null>(null);
    const [selectedOcorrenciaNotificacao, setSelectedOcorrenciaNotificacao] = useState<{
        id: string;
        usuarios?: Array<{ id: string; name: string | null; email: string }>;
    } | null>(null);

    const { data, isLoading, refetch, isFetching } = api.ocorrencia.painelUnidades.useQuery(
        undefined,
        {
            refetchInterval: 30000,
            refetchOnWindowFocus: true,
        }
    );

    // Filtra unidades pelo termo de busca (nome da unidade, cidade, placa ou usuário)
    const unidadesFiltradas = useMemo(() => {
        if (!data?.unidades) return [];
        const termo = busca.trim().toLowerCase();
        if (!termo) return data.unidades;

        return data.unidades.filter((u) => {
            const matchUnidade =
                u.nome.toLowerCase().includes(termo) ||
                u.cidade.toLowerCase().includes(termo) ||
                (u.responsavelNome && u.responsavelNome.toLowerCase().includes(termo));

            const matchUsuario = u.usuarios.some(
                (user) =>
                    (user.name && user.name.toLowerCase().includes(termo)) ||
                    user.email.toLowerCase().includes(termo)
            );

            const matchOcorrencia = u.ocorrencias.some(
                (oc) =>
                    oc.viagem.veiculo.placa.toLowerCase().includes(termo) ||
                    oc.viagem.motorista.toLowerCase().includes(termo) ||
                    oc.tipoOcorrencia.toLowerCase().includes(termo) ||
                    oc.descricao.toLowerCase().includes(termo)
            );

            return matchUnidade || matchUsuario || matchOcorrencia;
        });
    }, [data, busca]);

    // Estatísticas e KPIs
    const estatisticas = useMemo(() => {
        if (!data?.unidades) {
            return {
                totalUnidades: 0,
                totalOcorrencias: 0,
                totalUsuarios: 0,
                unidadesSemUsuarios: 0,
                ocorrenciaMaisAntigaHoras: 0,
            };
        }

        const totalUnidades = data.unidades.length;
        const totalOcorrencias = data.totalGeralOcorrencias;
        let totalUsuarios = 0;
        let unidadesSemUsuarios = 0;
        let maxMinutos = 0;

        for (const u of data.unidades) {
            totalUsuarios += u.usuarios.length;
            if (u.usuarios.length === 0) {
                unidadesSemUsuarios++;
            }
            for (const oc of u.ocorrencias) {
                const mins = tempoDecorridoMinutos(oc.createdAt);
                if (mins > maxMinutos) maxMinutos = mins;
            }
        }

        return {
            totalUnidades,
            totalOcorrencias,
            totalUsuarios,
            unidadesSemUsuarios,
            ocorrenciaMaisAntigaHoras: Math.floor(maxMinutos / 60),
        };
    }, [data]);

    return (
        <div className="min-h-screen bg-slate-100/70 pb-16">
            {/* Modal de Resolução */}
            {selectedOcorrenciaResolucao && (
                <ModalResolucao
                    ocorrenciaId={selectedOcorrenciaResolucao.id}
                    placa={selectedOcorrenciaResolucao.placa}
                    unidadeNome={selectedOcorrenciaResolucao.unidadeNome}
                    onClose={() => setSelectedOcorrenciaResolucao(null)}
                    onResolvido={() => refetch()}
                />
            )}

            {/* Modal de Notificação */}
            {selectedOcorrenciaNotificacao && (
                <ModalNotificacao
                    ocorrenciaId={selectedOcorrenciaNotificacao.id}
                    unidadeUsuarios={selectedOcorrenciaNotificacao.usuarios}
                    onClose={() => setSelectedOcorrenciaNotificacao(null)}
                />
            )}

            {/* Header Superior */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="mx-auto max-w-[1700px] flex flex-wrap items-center justify-between gap-4 px-6 py-3.5">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 text-xl font-bold shadow-inner">
                                🏭
                            </span>
                            <div>
                                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                                    Gestão de Ocorrências por Unidade
                                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                                        Torre de Controle
                                    </span>
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Acompanhamento em tempo real das unidades com ocorrências sob responsabilidade
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                            href="/ocorrencias"
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            🚨 Central de Ocorrências
                        </Link>
                        <Link
                            href="/ocorrencias/historico"
                            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            📂 Histórico Completo
                        </Link>
                        <Link
                            href="/dashboard"
                            className="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            🚛 Dashboard
                        </Link>
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                            <span className={isFetching ? "animate-spin" : ""}>↻</span>
                            {isFetching ? "Atualizando..." : "Atualizar"}
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1700px] px-6 pt-6 space-y-6">
                {/* ─── KPIs Cards ───────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1: Unidades Envolvidas */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between border-l-4 border-l-amber-500">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Unidades Responsáveis
                            </p>
                            <p className="text-3xl font-extrabold text-slate-800 mt-1">
                                {estatisticas.totalUnidades}
                            </p>
                            <p className="text-xs text-amber-600 font-medium mt-0.5">
                                com ocorrências ativas
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl border border-amber-100">
                            🏢
                        </div>
                    </div>

                    {/* Card 2: Total de Ocorrências em Tratativa */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Ocorrências em Tratativa
                            </p>
                            <p className="text-3xl font-extrabold text-red-600 mt-1">
                                {estatisticas.totalOcorrencias}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                aguardando resolução da unidade
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-2xl border border-red-100">
                            🚨
                        </div>
                    </div>

                    {/* Card 3: Usuários Vinculados */}
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between border-l-4 border-l-blue-500">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Usuários Vinculados
                            </p>
                            <p className="text-3xl font-extrabold text-blue-600 mt-1">
                                {estatisticas.totalUsuarios}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                operadores/gerentes nas unidades ativas
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl border border-blue-100">
                            👥
                        </div>
                    </div>

                    {/* Card 4: Alerta de Unidades sem Usuário ou Ocorrência Mais Antiga */}
                    <div
                        className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between border-l-4 ${
                            estatisticas.unidadesSemUsuarios > 0
                                ? "border-l-rose-500 bg-rose-50/20"
                                : "border-l-emerald-500"
                        }`}
                    >
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Status da Operação
                            </p>
                            {estatisticas.unidadesSemUsuarios > 0 ? (
                                <>
                                    <p className="text-2xl font-black text-rose-600 mt-1">
                                        ⚠️ {estatisticas.unidadesSemUsuarios} sem usuário
                                    </p>
                                    <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                                        unidades sem conta vinculada
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-black text-emerald-600 mt-1">
                                        ✓ 100% Cobertura
                                    </p>
                                    <p className="text-xs text-emerald-600 font-medium mt-0.5">
                                        todas possuem usuários
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">
                            {estatisticas.unidadesSemUsuarios > 0 ? "⚠️" : "🛡️"}
                        </div>
                    </div>
                </div>

                {/* ─── Barra de Filtros e Busca ──────────────────────────────── */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-md">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por unidade, cidade, placa, motorista ou usuário..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        />
                        {busca && (
                            <button
                                onClick={() => setBusca("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 w-full md:w-auto justify-between md:justify-end">
                        <span className="flex items-center gap-1.5 font-medium">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Auto-refresh a cada 30s
                        </span>
                        <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                            {unidadesFiltradas.length} unidade(s) encontrada(s)
                        </span>
                    </div>
                </div>

                {/* ─── Loading State ─────────────────────────────────────────── */}
                {isLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-96 rounded-3xl bg-white animate-pulse border border-slate-200 shadow-sm p-6 space-y-4"
                            >
                                <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
                                <div className="h-20 bg-slate-100 rounded-2xl w-full" />
                                <div className="h-40 bg-slate-100 rounded-2xl w-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* ─── Empty State ───────────────────────────────────────────── */}
                {!isLoading && unidadesFiltradas.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4 my-8">
                        <div className="text-6xl">🎉</div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Nenhuma ocorrência pendente em unidades!
                        </h2>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {busca
                                ? "Nenhum resultado corresponde aos filtros pesquisados."
                                : "No momento não há ocorrências em atendimento aguardando tratativa por unidades locais."}
                        </p>
                        {busca && (
                            <button
                                onClick={() => setBusca("")}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                            >
                                Limpar Busca
                            </button>
                        )}
                    </div>
                )}

                {/* ─── Lista / Cards de Unidades com Ocorrências ─────────────── */}
                {!isLoading && unidadesFiltradas.length > 0 && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        {unidadesFiltradas.map((unidade) => (
                            <CardUnidade
                                key={unidade.id}
                                unidade={unidade}
                                onAbrirNotificacao={(id, usuarios) =>
                                    setSelectedOcorrenciaNotificacao({ id, usuarios })
                                }
                                onAbrirResolucao={(id, placa, unidadeNome) =>
                                    setSelectedOcorrenciaResolucao({ id, placa, unidadeNome })
                                }
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
