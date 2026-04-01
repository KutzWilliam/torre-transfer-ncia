"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Rota = {
    id: string;
    nome: string;
    _count: { paradas: number; viagens: number };
};

type Parada = {
    id: string;
    ordem: number;
    prevChegada: string | null;
    prevSaida: string | null;
    base: { id: string; nome: string; cidade: string };
};

type RotaComParadas = {
    id: string;
    nome: string;
    paradas: Parada[];
};

// ─── Helper: formata "HH:MM:SS" → "HH:MM" para inputs ───────────────────────
function toHHMM(val: string | null): string {
    if (!val) return "";
    return val.slice(0, 5); // "HH:MM"
}

// ─── Helper: converte "HH:MM" → "HH:MM:00" ───────────────────────────────────
function toStorage(val: string): string | null {
    if (!val) return null;
    const [h, m] = val.split(":");
    return `${h!.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}:00`;
}

// ─── Componente: Badge de ordem ──────────────────────────────────────────────
function OrdemBadge({ ordre, total }: { ordre: number; total: number }) {
    if (ordre === 0) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
            🚀 Origem
        </span>
    );
    if (ordre === total - 1) return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
            🏁 Destino
        </span>
    );
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
            🔀 Parada {ordre}
        </span>
    );
}

// ─── Modal de edição de horários de uma parada ───────────────────────────────
function ModalEditarParada({
    parada,
    rotaId,
    onClose,
    onSaved,
}: {
    parada: Parada;
    rotaId: string;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [chegada, setChegada] = useState(toHHMM(parada.prevChegada));
    const [saida, setSaida] = useState(toHHMM(parada.prevSaida));
    const [erro, setErro] = useState("");

    const mutacao = api.admin.rotas.atualizarParada.useMutation({
        onSuccess: () => { onSaved(); onClose(); },
        onError: (e) => setErro(e.message),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900 mb-1">Editar Horários</h3>
                <p className="text-xs text-gray-500 mb-4">{parada.base.nome}</p>

                <div className="space-y-3">
                    {parada.ordem > 0 && (
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Previsão de Chegada</label>
                            <input
                                type="time"
                                value={chegada}
                                onChange={(e) => setChegada(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                onClick={() => setChegada("")}
                                className="text-[10px] text-gray-400 hover:text-red-500 mt-0.5"
                            >
                                Limpar
                            </button>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                            {parada.ordem === 0 ? "Horário de Saída" : "Previsão de Saída (intermediária)"}
                        </label>
                        <input
                            type="time"
                            value={saida}
                            onChange={(e) => setSaida(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={() => setSaida("")}
                            className="text-[10px] text-gray-400 hover:text-red-500 mt-0.5"
                        >
                            Limpar
                        </button>
                    </div>
                </div>

                {erro && <p className="text-xs text-red-600 mt-3">{erro}</p>}

                <div className="flex gap-2 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => mutacao.mutate({
                            paradaId: parada.id,
                            prevChegada: toStorage(chegada),
                            prevSaida: toStorage(saida),
                        })}
                        disabled={mutacao.isPending}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {mutacao.isPending ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Modal de adicionar parada intermediária ─────────────────────────────────
function ModalAdicionarParada({
    rota,
    onClose,
    onSaved,
}: {
    rota: RotaComParadas;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [baseNome, setBaseNome] = useState("");
    const [ordemStr, setOrdemStr] = useState("");
    const [chegada, setChegada] = useState("");
    const [saida, setSaida] = useState("");
    const [erro, setErro] = useState("");

    // Busca bases disponíveis para autocomplete
    const { data: bases } = api.admin.bases.listar.useQuery();
    const basesFiltradas = bases?.filter(b =>
        baseNome.length >= 2 && b.nome.toLowerCase().includes(baseNome.toLowerCase())
    ).slice(0, 6) ?? [];

    const mutacao = api.admin.rotas.adicionarParada.useMutation({
        onSuccess: () => { onSaved(); onClose(); },
        onError: (e) => setErro(e.message),
    });

    const totalParadas = rota.paradas.length;
    const ordemNum = parseInt(ordemStr);
    const ordemValida = !isNaN(ordemNum) && ordemNum >= 1 && ordemNum <= totalParadas - 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900 mb-1">Adicionar Parada Intermediária</h3>
                <p className="text-xs text-gray-500 mb-4 truncate">Rota: {rota.nome}</p>

                <div className="space-y-3">
                    {/* Base */}
                    <div className="relative">
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Base / Cidade *</label>
                        <input
                            type="text"
                            value={baseNome}
                            onChange={(e) => setBaseNome(e.target.value.toUpperCase())}
                            placeholder="Digite o nome da base..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        {basesFiltradas.length > 0 && (
                            <div className="absolute z-10 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                                {basesFiltradas.map(b => (
                                    <button
                                        key={b.id}
                                        onClick={() => setBaseNome(b.nome)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
                                    >
                                        <span className="font-medium text-gray-800">{b.nome}</span>
                                        <span className="text-gray-400 text-xs ml-2">{b.cidade}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Posição */}
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">
                            Posição na rota * <span className="font-normal text-gray-400">(entre 1 e {totalParadas - 1})</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={totalParadas - 1}
                            value={ordemStr}
                            onChange={(e) => setOrdemStr(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <div className="text-[10px] text-gray-400 mt-0.5">
                            Ordem atual: {rota.paradas.map((p, i) => (
                                <span key={p.id} className={i === ordemNum ? "text-blue-600 font-bold" : ""}>
                                    {i === 0 ? "0-" : ""}{p.base.nome}{i < rota.paradas.length - 1 ? " → " : ""}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Horários */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Prev. Chegada</label>
                            <input type="time" value={chegada} onChange={(e) => setChegada(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Prev. Saída</label>
                            <input type="time" value={saida} onChange={(e) => setSaida(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                    </div>
                </div>

                {erro && <p className="text-xs text-red-600 mt-3">{erro}</p>}

                <div className="flex gap-2 mt-5">
                    <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (!baseNome.trim()) return setErro("Informe o nome da base.");
                            if (!ordemValida) return setErro(`Posição deve ser entre 1 e ${totalParadas - 1}.`);
                            mutacao.mutate({
                                rotaId: rota.id,
                                baseNome: baseNome.trim(),
                                ordem: ordemNum,
                                prevChegada: toStorage(chegada),
                                prevSaida: toStorage(saida),
                            });
                        }}
                        disabled={mutacao.isPending}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        {mutacao.isPending ? "Adicionando..." : "Adicionar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Modal de Criar Nova Rota ──────────────────────────────────────────────────
function ModalNovaRota({
    onClose,
    onSaved,
}: {
    onClose: () => void;
    onSaved: (id: string) => void;
}) {
    const [nome, setNome] = useState("");
    const [origem, setOrigem] = useState("");
    const [destino, setDestino] = useState("");
    const [erro, setErro] = useState("");

    const mutacao = api.admin.rotas.criar.useMutation({
        onSuccess: (data) => { onSaved(data.id); onClose(); },
        onError: (e) => setErro(e.message),
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-bold text-gray-900 mb-4">Cadastrar Nova Rota</h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Nome da Rota Exato *</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value.toUpperCase())}
                            placeholder="Ex: CASCAVEL X CURITIBA"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Base de Origem *</label>
                        <input
                            type="text"
                            value={origem}
                            onChange={(e) => setOrigem(e.target.value.toUpperCase())}
                            placeholder="Ex: CASCAVEL"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Base de Destino *</label>
                        <input
                            type="text"
                            value={destino}
                            onChange={(e) => setDestino(e.target.value.toUpperCase())}
                            placeholder="Ex: CURITIBA"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            A origem e o destino serão criados automaticamente nas pontas da rota. Você poderá adicionar paradas intermediárias depois.
                        </p>
                    </div>
                </div>

                {erro && <p className="text-xs text-red-600 mt-3">{erro}</p>}

                <div className="flex gap-2 mt-6">
                    <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (!nome.trim() || !origem.trim() || !destino.trim()) return setErro("Preencha todos os campos.");
                            mutacao.mutate({
                                nome: nome.trim(),
                                origem: origem.trim(),
                                destino: destino.trim(),
                            });
                        }}
                        disabled={mutacao.isPending}
                        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                        {mutacao.isPending ? "Criando..." : "Criar Rota"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Painel lateral de edição de rota ────────────────────────────────────────
function PainelRota({ rotaId, onClose }: { rotaId: string; onClose: () => void }) {
    const [paradaEditando, setParadaEditando] = useState<Parada | null>(null);
    const [adicionando, setAdicionando] = useState(false);
    const [confirmRemover, setConfirmRemover] = useState<string | null>(null);
    const [erroRemover, setErroRemover] = useState("");
    const [confirmExcluirRota, setConfirmExcluirRota] = useState(false);
    const [erroExcluirRota, setErroExcluirRota] = useState("");

    const utils = api.useUtils();
    const { data: rota, isLoading, refetch } = api.admin.rotas.obterComParadas.useQuery({ id: rotaId });

    const mutExcluirRota = api.admin.rotas.excluir.useMutation({
        onSuccess: () => {
            void utils.admin.rotas.listar.invalidate();
            onClose();
        },
        onError: (e) => setErroExcluirRota(e.message),
    });

    const mutRemover = api.admin.rotas.removerParada.useMutation({
        onSuccess: () => { void refetch(); setConfirmRemover(null); setErroRemover(""); },
        onError: (e) => setErroRemover(e.message),
    });

    if (isLoading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-3xl">⏳</div>
        </div>
    );

    if (!rota) return null;

    const total = rota.paradas.length;

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate">{rota.nome}</h2>
                    <p className="text-xs text-gray-400">{total} parada(s) na rota</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => setConfirmExcluirRota(true)}
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 transition-colors"
                    >
                        Excluir
                    </button>
                    <button
                        onClick={() => setAdicionando(true)}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                        + Parada
                    </button>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                </div>
            </div>

            {confirmExcluirRota && (
                <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-800 font-medium mb-1">
                        Deseja realmente excluir a rota <strong>{rota.nome}</strong>?
                    </p>
                    <p className="text-xs text-red-600 mb-3 block">
                        Esta ação é irreversível.
                    </p>
                    {erroExcluirRota && <p className="text-xs text-red-700 mb-2 font-semibold">Erro: {erroExcluirRota}</p>}
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setConfirmExcluirRota(false); setErroExcluirRota(""); }}
                            className="flex-1 text-xs border border-gray-300 rounded-md px-3 py-1.5 hover:bg-white transition-colors text-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => mutExcluirRota.mutate({ id: rotaId })}
                            disabled={mutExcluirRota.isPending}
                            className="flex-1 text-xs bg-red-600 text-white font-bold rounded-md px-3 py-1.5 hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            {mutExcluirRota.isPending ? "Excluindo..." : "Excluir Rota"}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-2 overflow-y-auto flex-1">
                {rota.paradas.map((p: any) => (
                    <div
                        key={p.id}
                        className="rounded-xl border border-gray-100 bg-white p-3 hover:border-blue-200 transition-colors group"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                    <OrdemBadge ordre={p.ordem} total={total} />
                                </div>
                                <p className="font-semibold text-sm text-gray-900">{p.base.nome}</p>
                                <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                                    {p.prevChegada && (
                                        <span>🔵 Chegada: <strong>{toHHMM(p.prevChegada)}</strong></span>
                                    )}
                                    {p.prevSaida && (
                                        <span>🟢 Saída: <strong>{toHHMM(p.prevSaida)}</strong></span>
                                    )}
                                    {!p.prevChegada && !p.prevSaida && (
                                        <span className="italic text-gray-400">Sem horários definidos</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setParadaEditando(p)}
                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
                                >
                                    Editar
                                </button>
                                {p.ordem !== 0 && p.ordem !== total - 1 && (
                                    <button
                                        onClick={() => { setConfirmRemover(p.id); setErroRemover(""); }}
                                        className="text-[11px] font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md transition-colors"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Confirmação de remoção inline */}
                        {confirmRemover === p.id && (
                            <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-xs text-red-700 font-medium mb-2">
                                    Remover <strong>{p.base.nome}</strong> da rota?
                                </p>
                                {erroRemover && <p className="text-xs text-red-600 mb-1">{erroRemover}</p>}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setConfirmRemover(null); setErroRemover(""); }}
                                        className="flex-1 text-xs border border-gray-300 rounded-md px-2 py-1 hover:bg-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => mutRemover.mutate({ paradaId: p.id })}
                                        disabled={mutRemover.isPending}
                                        className="flex-1 text-xs bg-red-600 text-white rounded-md px-2 py-1 hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {mutRemover.isPending ? "..." : "Confirmar"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {paradaEditando && (
                <ModalEditarParada
                    parada={paradaEditando}
                    rotaId={rotaId}
                    onClose={() => setParadaEditando(null)}
                    onSaved={() => { void refetch(); }}
                />
            )}

            {adicionando && (
                <ModalAdicionarParada
                    rota={rota}
                    onClose={() => setAdicionando(false)}
                    onSaved={() => { void refetch(); }}
                />
            )}
        </>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function AdminRotasPage() {
    const [busca, setBusca] = useState("");
    const [rotaSelecionadaId, setRotaSelecionadaId] = useState<string | null>(null);
    const [criandoRota, setCriandoRota] = useState(false);

    const { data: rotas, isLoading, refetch } = api.admin.rotas.listar.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });

    const rotasFiltradas = (rotas ?? []).filter((r: Rota) =>
        r.nome.toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* ── Cabeçalho ── */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm flex-shrink-0">
                <div className="mx-auto max-w-[1400px] px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900">🗺️ Gerenciar Rotas Padrão</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Edite horários e paradas das rotas da Matriz</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCriandoRota(true)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors"
                        >
                            + Nova Rota
                        </button>
                        <Link
                            href="/admin"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            ← Painel
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[1400px] px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* ── Lista de Rotas ── */}
                <div className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 ${rotaSelecionadaId ? "w-full lg:w-96 flex-shrink-0" : "flex-1"}`}>
                    {/* Busca */}
                    <div className="p-4 border-b border-slate-100">
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="🔍 Buscar rota..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-slate-50"
                        />
                        <p className="text-xs text-slate-400 mt-2">{rotasFiltradas.length} rota(s)</p>
                    </div>

                    {/* Lista */}
                    <div className="overflow-y-auto flex-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-pulse text-slate-400 text-sm">Carregando rotas...</div>
                            </div>
                        ) : rotasFiltradas.length === 0 ? (
                            <div className="text-center py-16 text-slate-400 text-sm">
                                Nenhuma rota encontrada
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {rotasFiltradas.map((rota: Rota) => (
                                    <button
                                        key={rota.id}
                                        onClick={() => setRotaSelecionadaId(prev => prev === rota.id ? null : rota.id)}
                                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between gap-3 ${
                                            rotaSelecionadaId === rota.id ? "bg-blue-50 border-r-2 border-blue-600" : ""
                                        }`}
                                    >
                                        <div className="min-w-0 pr-2">
                                            <p className="text-sm font-semibold text-gray-900 break-words whitespace-normal leading-tight">{rota.nome}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {rota._count.paradas} parada(s) · {rota._count.viagens} viagem(ns)
                                            </p>
                                        </div>
                                        <span className="text-slate-300 flex-shrink-0 text-sm">
                                            {rotaSelecionadaId === rota.id ? "◀" : "▶"}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Painel de Edição ── */}
                {rotaSelecionadaId && (
                    <div className="flex-1 min-w-0 lg:min-w-[400px] bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 overflow-hidden flex flex-col h-[600px] lg:h-auto">
                        <PainelRota
                            key={rotaSelecionadaId}
                            rotaId={rotaSelecionadaId}
                            onClose={() => setRotaSelecionadaId(null)}
                        />
                    </div>
                )}

                {/* ── Placeholder quando nada selecionado ── */}
                {!rotaSelecionadaId && (
                    <div className="hidden lg:flex flex-1 rounded-2xl border-2 border-dashed border-slate-200 flex-col items-center justify-center text-slate-400 gap-3">
                        <span className="text-5xl">🗺️</span>
                        <p className="font-semibold px-4 text-center">Selecione uma rota para editar</p>
                        <p className="text-xs px-4 text-center">Clique em qualquer rota da lista para visualizar e editar suas paradas e horários</p>
                    </div>
                )}

                {criandoRota && (
                    <ModalNovaRota
                        onClose={() => setCriandoRota(false)}
                        onSaved={(novaRotaId) => {
                            void refetch();
                            setRotaSelecionadaId(novaRotaId);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
