"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/trpc/react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapaOcorrencias = dynamic(() => import("./_components/MapaOcorrencias"), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-sm">
            Carregando mapa...
        </div>
    ),
});

const TIPOS_OCORRENCIA = [
    "Pneu Furado",
    "Avaria Mecânica",
    "Acidente",
    "Atraso de Tráfego",
    "Problema com Carga",
    "Combustível",
    "Interdição de Via",
    "Problema com Documentação",
    "Outro",
];

// ─── Helper ──────────────────────────────────────────────────────────────────

function formatarHora(date: Date | string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function formatarDataHora(date: Date | string | null | undefined) {
    if (!date) return "—";
    return new Date(date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
function tempoAgo(date: Date | string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
    if (diff < 1) return "agora";
    if (diff < 60) return `${diff}min atrás`;
    return `${Math.floor(diff / 60)}h${diff % 60 > 0 ? diff % 60 + "min" : ""} atrás`;
}

const STATUS_CONFIG = {
    ABERTA:         { label: "Aberta",         bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    },
    EM_ATENDIMENTO: { label: "Em Atendimento", bg: "bg-amber-100",  text: "text-amber-700",  dot: "bg-amber-500"  },
    RESOLVIDA:      { label: "Resolvida",      bg: "bg-emerald-100",text: "text-emerald-700",dot: "bg-emerald-500" },
};

// ─── Componente: Modal de Atendimento (Torre) ────────────────────────────────

function ModalAtendimento({ ocorrenciaId, onClose, onIniciado }: {
    ocorrenciaId: string;
    onClose: () => void;
    onIniciado: () => void;
}) {
    const [notaTorre, setNotaTorre] = useState("");
    const [unidadeResponsavelId, setUnidadeResponsavelId] = useState("");

    const { data: bases, isLoading: isLoadingBases } = api.ocorrencia.listarBases.useQuery();
    const iniciar = api.ocorrencia.iniciarAtendimento.useMutation({
        onSuccess: () => { onIniciado(); onClose(); }
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Iniciar Atendimento</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
                </div>
                <p className="text-sm text-slate-500">Descreva o que foi conversado com o motorista e selecione a unidade que tratará a ocorrência.</p>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Nota de Atendimento
                    </label>
                    <textarea
                        value={notaTorre}
                        onChange={e => setNotaTorre(e.target.value)}
                        rows={3}
                        placeholder="Ex: Motorista informou que o pneu furou e precisa de guincho..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Unidade Responsável
                    </label>
                    {isLoadingBases ? (
                        <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                    ) : (
                        <select
                            value={unidadeResponsavelId}
                            onChange={e => setUnidadeResponsavelId(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        >
                            <option value="">Selecione a unidade...</option>
                            {bases?.map(base => (
                                <option key={base.id} value={base.id}>
                                    {base.nome} {base.cidade ? `(${base.cidade})` : ""}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex gap-2 justify-end pt-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => iniciar.mutate({ id: ocorrenciaId, notaTorre, unidadeResponsavelId })}
                        disabled={notaTorre.trim().length < 10 || !unidadeResponsavelId || iniciar.isPending}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {iniciar.isPending ? "Iniciando..." : "Iniciar Atendimento"}
                    </button>
                </div>
                {iniciar.error && (
                    <p className="text-xs text-red-600">{iniciar.error.message}</p>
                )}
            </div>
        </div>
    );
}

// ─── Componente: Modal de Resolução ──────────────────────────────────────────

function ModalResolucao({ ocorrenciaId, onClose, onResolvido }: {
    ocorrenciaId: string;
    onClose: () => void;
    onResolvido: () => void;
}) {
    const [resolucao, setResolucao] = useState("");
    const resolver = api.ocorrencia.resolver.useMutation({
        onSuccess: () => { onResolvido(); onClose(); }
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Resolver Ocorrência</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
                </div>
                <p className="text-sm text-slate-500">Descreva como a ocorrência foi resolvida ou encerrada.</p>
                <textarea
                    value={resolucao}
                    onChange={e => setResolucao(e.target.value)}
                    rows={4}
                    placeholder="Ex: Motorista trocou o pneu com auxílio do guincho. Viagem retomada às 14h30."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
                <div className="flex gap-2 justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => resolver.mutate({ id: ocorrenciaId, resolucao })}
                        disabled={resolucao.trim().length < 5 || resolver.isPending}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {resolver.isPending ? "Resolvendo..." : "✓ Confirmar Resolução"}
                    </button>
                </div>
                {resolver.error && (
                    <p className="text-xs text-red-600">{resolver.error.message}</p>
                )}
            </div>
        </div>
    );
}

// ─── Componente: Modal de Notificação por E-mail ─────────────────────────────

function ModalNotificacao({ ocorrenciaId, onClose }: {
    ocorrenciaId: string;
    onClose: () => void;
}) {
    const [usuarioId, setUsuarioId] = useState("");
    const [enviado, setEnviado] = useState<string | null>(null);

    const { data: usuarios, isLoading: loadingUsuarios } = api.ocorrencia.listarUsuariosParaNotificacao.useQuery();

    const notificar = api.ocorrencia.notificar.useMutation({
        onSuccess: (res) => {
            setEnviado(res.destinatario ?? res.email ?? "Responsável");
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-lg">📧</span>
                        <h3 className="text-base font-bold text-blue-900">Notificar Responsável</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors">✕</button>
                </div>

                <div className="p-6 space-y-5">
                    {enviado ? (
                        /* Estado: sucesso */
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
                        /* Estado: seleção */
                        <>
                            <p className="text-sm text-slate-500">
                                Selecione o usuário para quem deseja enviar o e-mail de notificação desta ocorrência.
                                O status da ocorrência <strong>não será alterado</strong>.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Responsável a notificar
                                </label>
                                {loadingUsuarios ? (
                                    <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                                ) : (
                                    <select
                                        id="select-usuario-notificacao"
                                        value={usuarioId}
                                        onChange={e => setUsuarioId(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                                    >
                                        <option value="">Selecione o usuário...</option>
                                        {usuarios?.map(u => (
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
                                    id="btn-enviar-notificacao"
                                    onClick={() => notificar.mutate({ ocorrenciaId, usuarioDestinatarioId: usuarioId })}
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

// ─── Componente: Card de Ocorrência ──────────────────────────────────────────

function CardOcorrencia({ oc, onRefresh }: { oc: any; onRefresh: () => void }) {
    const [mostrarResolucao, setMostrarResolucao] = useState(false);
    const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
    const [mostrarAtendimento, setMostrarAtendimento] = useState(false);
    const statusCfg = STATUS_CONFIG[oc.status as keyof typeof STATUS_CONFIG];

    // Contatos das bases da rota (sem a origem)
    const basesComContato = useMemo(() => {
        const paradas = oc.viagem.paradasViagem ?? [];
        return paradas
            .filter((p: any) => p.base.responsavelNome || p.base.responsavelContato)
            .map((p: any) => p.base);
    }, [oc.viagem.paradasViagem]);

    return (
        <>
            {mostrarResolucao && (
                <ModalResolucao
                    ocorrenciaId={oc.id}
                    onClose={() => setMostrarResolucao(false)}
                    onResolvido={onRefresh}
                />
            )}
            {mostrarAtendimento && (
                <ModalAtendimento
                    ocorrenciaId={oc.id}
                    onClose={() => setMostrarAtendimento(false)}
                    onIniciado={onRefresh}
                />
            )}
            {mostrarNotificacao && (
                <ModalNotificacao
                    ocorrenciaId={oc.id}
                    onClose={() => setMostrarNotificacao(false)}
                />
            )}

            <div className={`bg-white rounded-2xl border-l-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                oc.status === "EM_ATENDIMENTO" ? "border-l-amber-400" : "border-l-red-500"
            }`}>
                {/* Header */}
                <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot} ${oc.status === "ABERTA" ? "animate-pulse" : ""}`} />
                                {statusCfg.label}
                            </span>
                            <span className="text-xs text-slate-400">{tempoAgo(oc.createdAt)}</span>
                        </div>
                        <p className="mt-1 font-bold text-slate-800">
                            ⚠️ {oc.tipoOcorrencia}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-blue-600">{oc.viagem.veiculo.placa}</p>
                        <p className="text-xs text-slate-400">#{oc.viagem.id}</p>
                    </div>
                </div>

                {/* Rota */}
                <div className="flex items-center gap-2 px-5 py-2 bg-slate-50 border-y border-slate-100 text-sm">
                    <span className="font-semibold text-blue-700 truncate">{oc.viagem.baseOrigem.cidade}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-semibold text-emerald-700 truncate">{oc.viagem.baseDestino.cidade}</span>
                    <span className="ml-auto text-xs text-slate-400 flex-shrink-0">{oc.viagem.motorista}</span>
                </div>

                {/* Descrição */}
                <div className="px-5 py-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{oc.descricao}</p>
                    
                    {oc.status === "EM_ATENDIMENTO" && oc.notaTorre && (
                        <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                                Atendimento em andamento
                            </p>
                            <p className="text-sm text-amber-800 leading-relaxed mb-2">
                                <strong>Torre ({oc.acionadoPor?.name}):</strong> {oc.notaTorre}
                            </p>
                            <p className="text-xs text-amber-700">
                                <strong>Unidade Responsável:</strong> {oc.unidadeResponsavel?.nome}
                            </p>
                        </div>
                    )}
                </div>

                {/* Contatos das bases */}
                {basesComContato.length > 0 && (
                    <div className="px-5 pb-3 space-y-1.5">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Contatos para Avisar</p>
                        {basesComContato.map((base: any) => (
                            <div key={base.id} className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                                <span className="text-amber-600">📞</span>
                                <div className="min-w-0">
                                    <span className="font-semibold text-slate-700">{base.nome}</span>
                                    {base.responsavelNome && <span className="text-slate-500"> — {base.responsavelNome}</span>}
                                </div>
                                {base.responsavelContato && (
                                    <a href={`tel:${base.responsavelContato}`} className="ml-auto font-bold text-blue-600 flex-shrink-0 hover:text-blue-800">
                                        {base.responsavelContato}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Rodapé com ações */}
                <div className="px-5 pb-4 flex items-center gap-2 flex-wrap border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400">
                        Aberto por {oc.abertaPor?.name ?? "Sistema"} às {formatarHora(oc.createdAt)}
                    </span>
                    <div className="ml-auto flex gap-2">
                        {/* Botão: Notificar Responsável */}
                        <button
                            id={`btn-notificar-${oc.id}`}
                            onClick={() => setMostrarNotificacao(true)}
                            title="Enviar e-mail de notificação"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1"
                        >
                            📧 Notificar
                        </button>
                        <Link
                            href={`/viagens/${oc.viagemId}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                            Ver Viagem →
                        </Link>
                        {oc.status === "ABERTA" && (
                            <button
                                onClick={() => setMostrarAtendimento(true)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                            >
                                Iniciar Atendimento
                            </button>
                        )}
                        <button
                            onClick={() => setMostrarResolucao(true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                            ✓ Resolver
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Componente: Formulário de Nova Ocorrência ─────────────────────────────────

function FormNovaOcorrencia({ onCriada }: { onCriada: () => void }) {
    const [placa, setPlaca] = useState("");
    const [placaBusca, setPlacaBusca] = useState("");
    const [tipo, setTipo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const { data: viagem, isLoading, error: erroViagem, refetch } = api.ocorrencia.buscarViagemPorPlaca.useQuery(
        { placa: placaBusca },
        { enabled: placaBusca.length >= 3, retry: false }
    );

    const abrir = api.ocorrencia.abrir.useMutation({
        onSuccess: () => {
            setSucesso(true);
            setDescricao("");
            setTipo("");
            setTimeout(() => {
                setSucesso(false);
                setPlacaBusca("");
                setPlaca("");
                onCriada();
            }, 2500);
        }
    });

    function buscarPlaca() {
        if (placa.trim().length >= 3) {
            setPlacaBusca(placa.trim().toUpperCase());
        }
    }

    const basesComContato = useMemo(() => {
        if (!viagem) return [];
        const paradas = viagem.paradasViagem ?? [];
        return paradas
            .filter((p: any) => p.base.responsavelNome || p.base.responsavelContato)
            .map((p: any) => p.base);
    }, [viagem]);

    return (
        <div className="space-y-4">
            {/* Busca por Placa */}
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Placa do Veículo
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={placa}
                        onChange={e => setPlaca(e.target.value.toUpperCase())}
                        onKeyDown={e => e.key === "Enter" && buscarPlaca()}
                        placeholder="Ex: ABC1234"
                        maxLength={8}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-red-400 uppercase"
                    />
                    <button
                        onClick={buscarPlaca}
                        disabled={placa.trim().length < 3 || isLoading}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 transition-colors flex-shrink-0"
                    >
                        {isLoading ? "..." : "🔍 Buscar"}
                    </button>
                </div>
                {erroViagem && (
                    <p className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                        ⚠️ {erroViagem.message}
                    </p>
                )}
            </div>

            {/* Dados da Viagem Encontrada */}
            {viagem && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">✅ Viagem Encontrada</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-xs text-slate-500">Nº Viagem</p>
                            <p className="font-bold text-slate-800">#{viagem.id}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Placa</p>
                            <p className="font-bold text-blue-700">{viagem.veiculo.placa}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-slate-500">Motorista</p>
                            <p className="font-semibold text-slate-800">{viagem.motorista}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Origem</p>
                            <p className="font-semibold text-slate-700">{viagem.baseOrigem.cidade}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Destino</p>
                            <p className="font-semibold text-slate-700">{viagem.baseDestino.cidade}</p>
                        </div>
                        {viagem.ultimaTelemetria && (
                            <div className="col-span-2">
                                <p className="text-xs text-slate-500">Último Sinal GPS</p>
                                <p className="font-semibold text-slate-700 text-xs">
                                    {formatarDataHora(viagem.ultimaTelemetria.dataHoraLocal)} —{" "}
                                    {viagem.ultimaTelemetria.velocidade ?? 0} km/h
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Ocorrências abertas já existentes nesta viagem */}
                    {viagem.ocorrencias && viagem.ocorrencias.length > 0 && (
                        <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs">
                            <p className="font-bold text-amber-700">⚠️ {viagem.ocorrencias.length} ocorrência(s) em aberto nesta viagem.</p>
                        </div>
                    )}

                    {/* Contatos das bases para avisar */}
                    {basesComContato.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bases para Notificar</p>
                            {basesComContato.map((base: any) => (
                                <div key={base.id} className="flex items-center gap-2 text-xs bg-white rounded-lg border border-slate-100 px-3 py-2">
                                    <span>📞</span>
                                    <div className="min-w-0">
                                        <span className="font-semibold text-slate-700">{base.nome}</span>
                                        {base.responsavelNome && <span className="text-slate-500"> — {base.responsavelNome}</span>}
                                    </div>
                                    {base.responsavelContato && (
                                        <a href={`tel:${base.responsavelContato}`} className="ml-auto font-bold text-blue-600 flex-shrink-0">
                                            {base.responsavelContato}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Formulário de Ocorrência */}
            {viagem && (
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Tipo de Ocorrência
                        </label>
                        <select
                            value={tipo}
                            onChange={e => setTipo(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                        >
                            <option value="">Selecione o tipo...</option>
                            {TIPOS_OCORRENCIA.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Descrição da Ocorrência
                        </label>
                        <textarea
                            value={descricao}
                            onChange={e => setDescricao(e.target.value)}
                            rows={4}
                            placeholder="Descreva o que aconteceu, localização aproximada, condições da via..."
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                        />
                    </div>

                    {sucesso ? (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 text-center">
                            ✅ Ocorrência aberta com sucesso!
                        </div>
                    ) : (
                        <button
                            onClick={() => abrir.mutate({
                                viagemId: viagem.id,
                                tipoOcorrencia: tipo,
                                descricao,
                                latOcorrencia: viagem.ultimaTelemetria?.latitude ?? null,
                                lngOcorrencia: viagem.ultimaTelemetria?.longitude ?? null,
                            })}
                            disabled={!tipo || descricao.trim().length < 10 || abrir.isPending}
                            className="w-full py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                        >
                            {abrir.isPending ? "Abrindo..." : "🚨 Abrir Ocorrência"}
                        </button>
                    )}
                    {abrir.error && (
                        <p className="text-xs text-red-600">{abrir.error.message}</p>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function OcorrenciasPage() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const [filtroPlaca, setFiltroPlaca] = useState("");

    const { data: ocorrencias, isLoading, refetch } = api.ocorrencia.listarAbertas.useQuery(undefined, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });

    // Filtra por placa (client-side)
    const ocorrenciasFiltradas = useMemo(() => {
        if (!ocorrencias) return [];
        const termo = filtroPlaca.trim().toUpperCase();
        if (!termo) return ocorrencias;
        return ocorrencias.filter(oc =>
            oc.viagem.veiculo.placa.toUpperCase().includes(termo)
        );
    }, [ocorrencias, filtroPlaca]);

    // Filtra só as que têm localização para o mapa
    const ocorrenciasComPosicao = useMemo(() => {
        if (!ocorrencias) return [];
        return ocorrencias.filter(oc =>
            oc.ultimaTelemetria?.latitude || oc.latOcorrencia
        );
    }, [ocorrencias]);

    const kpis = useMemo(() => {
        if (!ocorrencias) return { total: 0, abertas: 0, emAtendimento: 0 };
        return {
            total: ocorrencias.length,
            abertas: ocorrencias.filter(o => o.status === "ABERTA").length,
            emAtendimento: ocorrencias.filter(o => o.status === "EM_ATENDIMENTO").length,
        };
    }, [ocorrencias]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-[1600px] flex items-center justify-between px-6 py-3">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            🚨 Central de Ocorrências
                        </h1>
                        <p className="text-xs text-slate-500">Torre de Controle — Gestão de Incidentes em Viagens</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700 transition-colors">
                            🚛 Dashboard
                        </Link>
                        <Link href="/viagens" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                            📋 Viagens
                        </Link>
                        <Link href="/ocorrencias/historico" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                            📂 Histórico
                        </Link>
                        <button onClick={() => refetch()} className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors">
                            ↻ Atualizar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6">
                {/* KPIs */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="rounded-2xl border bg-white p-5 shadow-sm border-l-4 border-l-slate-300">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total em Aberto</p>
                        <p className="mt-2 text-4xl font-extrabold text-slate-800">{kpis.total}</p>
                        <p className="mt-1 text-xs text-slate-400">ocorrências ativas</p>
                    </div>
                    <div className={`rounded-2xl border bg-white p-5 shadow-sm border-l-4 ${kpis.abertas > 0 ? "border-l-red-500" : "border-l-slate-300"}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Abertas</p>
                        <p className={`mt-2 text-4xl font-extrabold ${kpis.abertas > 0 ? "text-red-600" : "text-slate-800"}`}>{kpis.abertas}</p>
                        <p className="mt-1 text-xs text-slate-400">aguardando atendimento</p>
                    </div>
                    <div className={`rounded-2xl border bg-white p-5 shadow-sm border-l-4 ${kpis.emAtendimento > 0 ? "border-l-amber-500" : "border-l-slate-300"}`}>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Em Atendimento</p>
                        <p className={`mt-2 text-4xl font-extrabold ${kpis.emAtendimento > 0 ? "text-amber-600" : "text-slate-800"}`}>{kpis.emAtendimento}</p>
                        <p className="mt-1 text-xs text-slate-400">em tratativa</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Coluna Esquerda: Formulário */}
                    <div className="xl:col-span-2 space-y-4">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-red-50">
                                <span className="text-red-500 text-lg">🚨</span>
                                <h2 className="font-bold text-red-800">Abrir Nova Ocorrência</h2>
                            </div>
                            <div className="p-5">
                                <FormNovaOcorrencia onCriada={refetch} />
                            </div>
                        </div>

                        {/* Mapa das Ocorrências */}
                        {isMounted && ocorrenciasComPosicao.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                                    <span>🗺️</span>
                                    <h2 className="font-bold text-slate-700">Localização das Ocorrências</h2>
                                    <span className="ml-auto text-xs text-slate-400">{ocorrenciasComPosicao.length} no mapa</span>
                                </div>
                                <div className="h-80">
                                    <MapaOcorrencias ocorrencias={ocorrenciasComPosicao} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna Direita: Lista de Ocorrências */}
                    <div className="xl:col-span-3 space-y-4">
                        {/* Cabeçalho + Barra de Busca */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-slate-700 uppercase tracking-wider text-sm">
                                    Ocorrências em Aberto
                                </h2>
                                <span className="text-xs text-slate-400">
                                    {ocorrenciasFiltradas.length !== ocorrencias?.length
                                        ? `${ocorrenciasFiltradas.length} de ${ocorrencias?.length ?? 0} ocorrência(s)`
                                        : `${ocorrencias?.length ?? 0} ocorrência(s)`
                                    }
                                </span>
                            </div>

                            {/* Barra de busca por placa */}
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                                    🔍
                                </span>
                                <input
                                    id="filtro-placa"
                                    type="text"
                                    value={filtroPlaca}
                                    onChange={e => setFiltroPlaca(e.target.value.toUpperCase())}
                                    placeholder="Filtrar por placa do veículo..."
                                    maxLength={8}
                                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono font-bold tracking-widest text-slate-800 placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm"
                                />
                                {filtroPlaca && (
                                    <button
                                        onClick={() => setFiltroPlaca("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none transition-colors"
                                        title="Limpar filtro"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {isLoading && !ocorrencias && (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-48 rounded-2xl bg-white animate-pulse border border-slate-100 shadow-sm" />
                                ))}
                            </div>
                        )}

                        {!isLoading && ocorrencias?.length === 0 && (
                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-16 text-center">
                                <p className="text-4xl mb-3">✅</p>
                                <p className="text-lg font-semibold text-slate-600">Nenhuma ocorrência em aberto</p>
                                <p className="mt-1 text-sm text-slate-400">Todas as viagens estão operando normalmente.</p>
                            </div>
                        )}

                        {/* Sem resultados para o filtro */}
                        {!isLoading && ocorrencias && ocorrencias.length > 0 && ocorrenciasFiltradas.length === 0 && (
                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
                                <p className="text-3xl mb-3">🔍</p>
                                <p className="text-base font-semibold text-slate-600">Nenhuma ocorrência encontrada</p>
                                <p className="mt-1 text-sm text-slate-400">Nenhum veículo com a placa <strong className="text-slate-700">{filtroPlaca}</strong> possui ocorrências abertas.</p>
                                <button
                                    onClick={() => setFiltroPlaca("")}
                                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-colors"
                                >
                                    Limpar filtro
                                </button>
                            </div>
                        )}

                        {ocorrenciasFiltradas.length > 0 && (
                            <div className="space-y-4">
                                {ocorrenciasFiltradas.map(oc => (
                                    <CardOcorrencia key={oc.id} oc={oc} onRefresh={refetch} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
