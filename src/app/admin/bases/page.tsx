"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

const EMPTY_BASE = { nome: "", cidade: "", latitude: "", longitude: "", raioMetros: "500" };

export default function AdminBasesPage() {
    const utils = api.useUtils();
    const { data: bases, isLoading } = api.admin.bases.listar.useQuery();

    const [showModal, setShowModal] = useState<"criar" | "editar" | null>(null);
    const [form, setForm] = useState(EMPTY_BASE);
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const invalidate = () => void utils.admin.bases.listar.invalidate();

    const criarMutation = api.admin.bases.criar.useMutation({
        onSuccess: () => { invalidate(); setShowModal(null); setForm(EMPTY_BASE); setError(""); },
        onError: (e) => setError(e.message),
    });
    const editarMutation = api.admin.bases.editar.useMutation({
        onSuccess: () => { invalidate(); setShowModal(null); setError(""); },
        onError: (e) => setError(e.message),
    });
    const excluirMutation = api.admin.bases.excluir.useMutation({
        onSuccess: () => { invalidate(); setConfirmDeleteId(null); },
        onError: (e) => { setError(e.message); },
    });

    const abrirEditar = (b: NonNullable<typeof bases>[0]) => {
        setEditId(b.id);
        setForm({
            nome: b.nome,
            cidade: b.cidade,
            latitude: b.latitude?.toString() ?? "",
            longitude: b.longitude?.toString() ?? "",
            raioMetros: b.raioMetros.toString(),
        });
        setError("");
        setShowModal("editar");
    };

    const parseNum = (v: string) => v.trim() ? parseFloat(v) : null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const data = {
            nome: form.nome,
            cidade: form.cidade,
            latitude: parseNum(form.latitude),
            longitude: parseNum(form.longitude),
            raioMetros: parseInt(form.raioMetros) || 500,
        };
        if (showModal === "criar") {
            criarMutation.mutate(data);
        } else if (showModal === "editar" && editId) {
            editarMutation.mutate({ id: editId, ...data });
        }
    };

    const isPending = criarMutation.isPending || editarMutation.isPending;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <div>
                        <Link href="/admin" className="text-xs text-gray-400 hover:text-princesa-green mb-1 flex items-center gap-1">← Painel de Administração</Link>
                        <h1 className="text-2xl font-bold text-princesa-dark">Gerenciamento de Bases</h1>
                    </div>
                    <button
                        onClick={() => { setForm(EMPTY_BASE); setError(""); setShowModal("criar"); }}
                        className="bg-princesa-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex-shrink-0"
                    >
                        + Nova Base
                    </button>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-400 animate-pulse">Carregando...</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome / Cidade</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Coordenadas GPS</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Raio Geocerca</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Viagens</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bases?.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{b.nome}</div>
                                            <div className="text-xs text-gray-500">{b.cidade}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                            {b.latitude && b.longitude
                                                ? `${b.latitude.toFixed(5)}, ${b.longitude.toFixed(5)}`
                                                : <span className="text-gray-400 italic text-xs not-italic font-sans">Não configurado</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm bg-gray-100 px-2.5 py-1 rounded-full text-gray-700 font-medium">
                                                {b.raioMetros}m
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {b._count.viagensOrigem + b._count.viagensDestino} viagem(ns)
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => abrirEditar(b)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition">Editar</button>
                                                <button onClick={() => { setError(""); setConfirmDeleteId(b.id); }} className="text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition">Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal Criar / Editar */}
                {(showModal === "criar" || showModal === "editar") && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-princesa-dark">
                                    {showModal === "criar" ? "Nova Base" : "Editar Base"}
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da Base</label>
                                        <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" placeholder="Ex: CURITIBA" required />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
                                        <input value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" placeholder="Ex: Curitiba" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
                                        <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({ ...f, latitude: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" placeholder="-25.4284" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
                                        <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({ ...f, longitude: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" placeholder="-49.2733" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Raio da Geocerca (metros)</label>
                                        <input type="number" min="50" value={form.raioMetros} onChange={e => setForm(f => ({ ...f, raioMetros: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" />
                                        <p className="text-xs text-gray-400 mt-1">Distância mínima do GPS para considerar chegada na base. Padrão: 500m.</p>
                                    </div>
                                </div>
                                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                    <button type="submit" disabled={isPending} className="flex-1 bg-princesa-dark text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                                        {isPending ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal Confirmar Exclusão */}
                {confirmDeleteId && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                            <p className="text-4xl mb-4">🗑️</p>
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Confirmar Exclusão</h2>
                            <p className="text-sm text-gray-500 mb-6">Esta base será removida permanentemente do sistema.</p>
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
                            <div className="flex gap-3">
                                <button onClick={() => { setConfirmDeleteId(null); setError(""); }} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                <button onClick={() => excluirMutation.mutate({ id: confirmDeleteId })} disabled={excluirMutation.isPending} className="flex-1 bg-red-600 text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                                    {excluirMutation.isPending ? "Excluindo..." : "Excluir"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
