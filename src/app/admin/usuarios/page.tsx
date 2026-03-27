"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

type Role = "ADMIN" | "GERENTE" | "OPERADOR";

const ROLE_LABELS: Record<Role, string> = {
    ADMIN: "Administrador",
    GERENTE: "Gerente",
    OPERADOR: "Operador",
};

const ROLE_COLORS: Record<Role, string> = {
    ADMIN: "bg-red-100 text-red-700",
    GERENTE: "bg-amber-100 text-amber-700",
    OPERADOR: "bg-blue-100 text-blue-700",
};

const EMPTY_USER = { name: "", email: "", senha: "", role: "OPERADOR" as Role, baseId: "" };
const EMPTY_SENHA = { id: "", novaSenha: "" };

export default function AdminUsuariosPage() {
    const utils = api.useUtils();
    const { data: usuarios, isLoading } = api.admin.usuarios.listar.useQuery();
    const { data: bases } = api.admin.bases.listar.useQuery();

    const [showModal, setShowModal] = useState<"criar" | "editar" | "senha" | null>(null);
    const [form, setForm] = useState(EMPTY_USER);
    const [editId, setEditId] = useState<string | null>(null);
    const [senhaForm, setSenhaForm] = useState(EMPTY_SENHA);
    const [error, setError] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const invalidate = () => void utils.admin.usuarios.listar.invalidate();

    const criarMutation = api.admin.usuarios.criar.useMutation({
        onSuccess: () => { invalidate(); setShowModal(null); setForm(EMPTY_USER); setError(""); },
        onError: (e) => setError(e.message),
    });
    const editarMutation = api.admin.usuarios.editar.useMutation({
        onSuccess: () => { invalidate(); setShowModal(null); setError(""); },
        onError: (e) => setError(e.message),
    });
    const senhaMutation = api.admin.usuarios.alterarSenha.useMutation({
        onSuccess: () => { setShowModal(null); setSenhaForm(EMPTY_SENHA); setError(""); },
        onError: (e) => setError(e.message),
    });
    const excluirMutation = api.admin.usuarios.excluir.useMutation({
        onSuccess: () => { invalidate(); setConfirmDeleteId(null); },
        onError: (e) => setError(e.message),
    });

    const abrirEditar = (u: NonNullable<typeof usuarios>[0]) => {
        setEditId(u.id);
        setForm({ name: u.name ?? "", email: u.email, senha: "", role: u.role as Role, baseId: u.baseId ?? "" });
        setError("");
        setShowModal("editar");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (showModal === "criar") {
            criarMutation.mutate({ ...form, baseId: form.baseId || null });
        } else if (showModal === "editar" && editId) {
            editarMutation.mutate({ id: editId, name: form.name, role: form.role, baseId: form.baseId || null });
        }
    };

    const isPending = criarMutation.isPending || editarMutation.isPending || senhaMutation.isPending;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <div>
                        <Link href="/admin" className="text-xs text-gray-400 hover:text-princesa-green mb-1 flex items-center gap-1">← Painel de Administração</Link>
                        <h1 className="text-2xl font-bold text-princesa-dark">Gerenciamento de Usuários</h1>
                    </div>
                    <button
                        onClick={() => { setForm(EMPTY_USER); setError(""); setShowModal("criar"); }}
                        className="bg-princesa-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex-shrink-0"
                    >
                        + Novo Usuário
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nome / Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Papel</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Base Vinculada</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usuarios?.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{u.name}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[u.role as Role]}`}>
                                                {ROLE_LABELS[u.role as Role]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{u.base?.nome ?? <span className="text-gray-400 italic">Nenhuma</span>}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => abrirEditar(u)} className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 transition">Editar</button>
                                                <button onClick={() => { setSenhaForm({ id: u.id, novaSenha: "" }); setError(""); setShowModal("senha"); }} className="text-xs font-semibold text-amber-600 hover:text-amber-800 px-3 py-1.5 rounded-md hover:bg-amber-50 transition">Senha</button>
                                                <button onClick={() => setConfirmDeleteId(u.id)} className="text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded-md hover:bg-red-50 transition">Excluir</button>
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
                                    {showModal === "criar" ? "Novo Usuário" : "Editar Usuário"}
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
                                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" required />
                                </div>
                                {showModal === "criar" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Senha Temporária</label>
                                            <input type="password" value={form.senha} onChange={e => setForm(f => ({ ...f, senha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" required minLength={6} />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Papel</label>
                                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green">
                                        <option value="OPERADOR">Operador</option>
                                        <option value="GERENTE">Gerente</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Base Vinculada</label>
                                    <select value={form.baseId} onChange={e => setForm(f => ({ ...f, baseId: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green">
                                        <option value="">— Nenhuma —</option>
                                        {bases?.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                                    </select>
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

                {/* Modal Alterar Senha */}
                {showModal === "senha" && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-amber-700">Redefinir Senha</h2>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); senhaMutation.mutate(senhaForm); }} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Nova Senha</label>
                                    <input type="password" value={senhaForm.novaSenha} onChange={e => setSenhaForm(f => ({ ...f, novaSenha: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-princesa-green" required minLength={6} />
                                </div>
                                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                                    <button type="submit" disabled={senhaMutation.isPending} className="flex-1 bg-amber-600 text-white rounded-lg py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                                        {senhaMutation.isPending ? "Salvando..." : "Redefinir"}
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
                            <p className="text-sm text-gray-500 mb-6">Esta ação não pode ser desfeita. O usuário perderá acesso ao sistema.</p>
                            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}
                            <div className="flex gap-3">
                                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
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
