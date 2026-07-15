"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface VeiculoRegional {
    id: string;
    placa: string;
    unidade: string | null;
    proprietario: string | null;
    responsavel: string | null;
    gerente: string | null;
}

interface Regional {
    id: string;
    nome: string;
    veiculos: VeiculoRegional[];
    _count: { veiculos: number };
}

// ─── Modal de Veículo ─────────────────────────────────────────────────────────

function ModalVeiculo({
    regional,
    veiculo,
    todasRegionais,
    onClose,
}: {
    regional: Regional;
    veiculo: VeiculoRegional | null;
    todasRegionais: Regional[];
    onClose: () => void;
}) {
    const utils = api.useUtils();
    const [placa, setPlaca] = useState(veiculo?.placa ?? "");
    const [unidade, setUnidade] = useState(veiculo?.unidade ?? "");
    const [responsavel, setResponsavel] = useState(veiculo?.responsavel ?? "");
    const [proprietario, setProprietario] = useState(veiculo?.proprietario ?? "");
    const [gerente, setGerente] = useState(veiculo?.gerente ?? "");
    const [regionalId, setRegionalId] = useState(regional.id);

    const adicionar = api.regional.adicionarVeiculo.useMutation({
        onSuccess: () => { void utils.regional.listar.invalidate(); onClose(); },
    });
    const editar = api.regional.editarVeiculo.useMutation({
        onSuccess: () => { void utils.regional.listar.invalidate(); onClose(); },
    });

    const isPending = adicionar.isPending || editar.isPending;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!placa.trim()) return;
        if (veiculo) {
            editar.mutate({ id: veiculo.id, placa, unidade, responsavel, proprietario, gerente, regionalId });
        } else {
            adicionar.mutate({ regionalId, placa, unidade, responsavel, proprietario, gerente });
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                <div className="border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-900">
                        {veiculo ? "Editar Veículo" : "Adicionar Veículo"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Regional: {regional.nome}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase">Placa *</label>
                            <input
                                value={placa}
                                onChange={e => setPlaca(e.target.value.toUpperCase())}
                                placeholder="Ex: ABC-1234 ou ABC1D23"
                                required
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase">Unidade</label>
                            <input
                                value={unidade}
                                onChange={e => setUnidade(e.target.value)}
                                placeholder="Ex: PRI PONTA GROSSA GARAGEM"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase">Responsável</label>
                            <input
                                value={responsavel}
                                onChange={e => setResponsavel(e.target.value)}
                                placeholder="Nome do responsável direto"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase">Gerente</label>
                            <input
                                value={gerente}
                                onChange={e => setGerente(e.target.value)}
                                placeholder="Nome do Gerente"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-600 uppercase">Proprietário</label>
                            <input
                                value={proprietario}
                                onChange={e => setProprietario(e.target.value)}
                                placeholder="Nome do proprietário / empresa"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>
                        {veiculo && (
                            <div className="col-span-2 space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Mover para Regional</label>
                                <select
                                    value={regionalId}
                                    onChange={e => setRegionalId(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    {todasRegionais.map(r => (
                                        <option key={r.id} value={r.id}>{r.nome}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {(adicionar.error ?? editar.error) && (
                        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            {(adicionar.error ?? editar.error)?.message}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-lg transition-colors"
                        >
                            {isPending ? "Salvando..." : veiculo ? "Salvar Alterações" : "Adicionar Veículo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function AdminRegionaisPage() {
    const { data: regionais, isLoading } = api.regional.listar.useQuery(undefined, {
        refetchOnWindowFocus: false,
    });
    const utils = api.useUtils();

    // Estado dos modais
    const [modalVeiculo, setModalVeiculo] = useState<{
        regional: Regional;
        veiculo: VeiculoRegional | null;
    } | null>(null);

    // Estado de nova regional
    const [novaRegional, setNovaRegional] = useState("");
    const [editandoRegional, setEditandoRegional] = useState<{ id: string; nome: string } | null>(null);
    const [expandida, setExpandida] = useState<string | null>(null);

    const criarRegional = api.regional.criar.useMutation({
        onSuccess: () => { void utils.regional.listar.invalidate(); setNovaRegional(""); },
    });
    const editarRegional = api.regional.editar.useMutation({
        onSuccess: () => { void utils.regional.listar.invalidate(); setEditandoRegional(null); },
    });
    const excluirRegional = api.regional.excluir.useMutation({
        onSuccess: () => { void utils.regional.listar.invalidate(); },
    });
    const removerVeiculo = api.regional.removerVeiculo.useMutation({
        onSuccess: () => void utils.regional.listar.invalidate(),
    });

    function confirmarExcluirRegional(r: Regional) {
        if (confirm(`Excluir a regional "${r.nome}" e todos os seus ${r._count.veiculos} veículos?`)) {
            excluirRegional.mutate({ id: r.id });
        }
    }

    function confirmarRemoverVeiculo(v: VeiculoRegional) {
        if (confirm(`Remover o veículo ${v.placa} desta regional?`)) {
            removerVeiculo.mutate({ id: v.id });
        }
    }

    const totalVeiculos = regionais?.reduce((a, r) => a + r._count.veiculos, 0) ?? 0;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Cabeçalho */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            🗺 Regionais — Relatório Semanal
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Gerencie as regionais e os veículos de cada uma. Relatório enviado toda <strong>sexta-feira às 8h</strong>.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/usuarios"
                            className="text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                        >
                            👤 Destinatários
                        </Link>
                        <Link
                            href="/admin"
                            className="text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                        >
                            ← Admin
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-6 space-y-6">

                {/* KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { icon: "🗺", label: "Regionais", value: regionais?.length ?? 0, color: "border-l-blue-500" },
                        { icon: "🚚", label: "Veículos Cadastrados", value: totalVeiculos, color: "border-l-emerald-500" },
                        { icon: "📅", label: "Próximo Relatório", value: "Sex 08:00", color: "border-l-amber-400" },
                    ].map(k => (
                        <div key={k.label} className={`bg-white rounded-2xl border shadow-sm p-4 border-l-4 ${k.color}`}>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{k.icon} {k.label}</p>
                            <p className="text-3xl font-extrabold text-slate-900 mt-1">{k.value}</p>
                        </div>
                    ))}
                </div>

                {/* Nova Regional */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">➕ Nova Regional</h2>
                    <form
                        onSubmit={e => { e.preventDefault(); if (novaRegional.trim()) criarRegional.mutate({ nome: novaRegional }); }}
                        className="flex gap-3"
                    >
                        <input
                            value={novaRegional}
                            onChange={e => setNovaRegional(e.target.value)}
                            placeholder="Nome da regional (ex: EPC LONDRINA)"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <button
                            type="submit"
                            disabled={criarRegional.isPending || !novaRegional.trim()}
                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
                        >
                            {criarRegional.isPending ? "Criando..." : "Criar Regional"}
                        </button>
                    </form>
                </div>

                {/* Lista de Regionais */}
                {isLoading ? (
                    <div className="text-center py-16 text-slate-400">Carregando regionais...</div>
                ) : (
                    <div className="space-y-4">
                        {(regionais ?? []).map(r => (
                            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Cabeçalho da regional */}
                                <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setExpandida(expandida === r.id ? null : r.id)}
                                            className="text-slate-400 hover:text-slate-600 text-lg"
                                        >
                                            {expandida === r.id ? "▼" : "▶"}
                                        </button>
                                        {editandoRegional?.id === r.id ? (
                                            <form
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    if (editandoRegional.nome.trim())
                                                        editarRegional.mutate({ id: r.id, nome: editandoRegional.nome });
                                                }}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    value={editandoRegional.nome}
                                                    onChange={e => setEditandoRegional({ ...editandoRegional, nome: e.target.value })}
                                                    className="border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                                    autoFocus
                                                />
                                                <button type="submit" className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold">
                                                    Salvar
                                                </button>
                                                <button type="button" onClick={() => setEditandoRegional(null)} className="text-xs px-3 py-1 border border-slate-200 rounded-lg">
                                                    Cancelar
                                                </button>
                                            </form>
                                        ) : (
                                            <div>
                                                <span className="font-bold text-slate-900">{r.nome}</span>
                                                <span className="ml-2 text-xs text-slate-400">{r._count.veiculos} veículo(s)</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setModalVeiculo({ regional: r, veiculo: null })}
                                            className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 font-bold transition-colors"
                                            title="Adicionar veículo"
                                        >
                                            + Veículo
                                        </button>
                                        <button
                                            onClick={() => setEditandoRegional({ id: r.id, nome: r.nome })}
                                            className="text-xs px-3 py-1.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                        >
                                            ✏️ Renomear
                                        </button>
                                        <button
                                            onClick={() => confirmarExcluirRegional(r)}
                                            className="text-xs px-3 py-1.5 text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            🗑 Excluir
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de veículos (colapsável) */}
                                {expandida === r.id && (
                                    <div className="divide-y divide-slate-50">
                                        {r.veiculos.length === 0 ? (
                                            <p className="text-sm text-slate-400 text-center py-8">
                                                Nenhum veículo cadastrado. Clique em "+ Veículo" para adicionar.
                                            </p>
                                        ) : (
                                            <>
                                                <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                                    <span className="col-span-2">Placa</span>
                                                    <span className="col-span-3">Unidade</span>
                                                    <span className="col-span-2">Proprietário</span>
                                                    <span className="col-span-2">Responsável</span>
                                                    <span className="col-span-2">Gerente</span>
                                                    <span className="col-span-1"></span>
                                                </div>
                                                {r.veiculos.map(v => (
                                                    <div key={v.id} className="grid grid-cols-12 gap-2 px-5 py-2.5 hover:bg-slate-50 items-center">
                                                        <span className="col-span-2 font-mono font-bold text-slate-800 text-xs tracking-wider bg-slate-100 px-1.5 py-0.5 rounded text-center">
                                                            {v.placa}
                                                        </span>
                                                        <span className="col-span-3 text-xs text-slate-600 truncate">{v.unidade ?? "—"}</span>
                                                        <span className="col-span-2 text-xs text-slate-700 truncate">{v.proprietario ?? "—"}</span>
                                                        <span className="col-span-2 text-xs text-slate-500 truncate">{v.responsavel ?? "—"}</span>
                                                        <span className="col-span-2 text-xs text-slate-500 truncate">{v.gerente ?? "—"}</span>
                                                        <div className="col-span-1 flex gap-1 justify-end">
                                                            <button
                                                                onClick={() => setModalVeiculo({ regional: r, veiculo: v })}
                                                                className="text-xs p-1 text-slate-500 hover:text-blue-600 transition-colors"
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                onClick={() => confirmarRemoverVeiculo(v)}
                                                                className="text-xs p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                                title="Remover"
                                                            >
                                                                🗑
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal de Veículo */}
            {modalVeiculo && (
                <ModalVeiculo
                    regional={modalVeiculo.regional}
                    veiculo={modalVeiculo.veiculo}
                    todasRegionais={regionais ?? []}
                    onClose={() => setModalVeiculo(null)}
                />
            )}
        </div>
    );
}
