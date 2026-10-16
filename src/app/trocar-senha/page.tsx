"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { api } from "@/trpc/react";

// Encerra a sessão e volta ao login usando o host atual do navegador (nunca localhost via AUTH_URL)
const sairParaLogin = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
};

export default function TrocarSenhaPage() {
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const trocar = api.conta.trocarSenha.useMutation({
        onSuccess: () => {
            setSucesso(true);
            // Encerra a sessão para que o novo login já traga o estado atualizado
            setTimeout(() => void sairParaLogin(), 1800);
        },
        onError: (e) => setErro(e.message),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        if (novaSenha.length < 8) return setErro("A nova senha deve ter ao menos 8 caracteres.");
        if (novaSenha !== confirmar) return setErro("A confirmação não confere com a nova senha.");
        trocar.mutate({ senhaAtual, novaSenha });
    };

    const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-green-500";

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
            <div className="mb-6 flex flex-col items-center">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-5 shadow-2xl">
                    <img src="/logo1.jpg" alt="Princesa dos Campos" className="h-16 w-auto object-contain" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Crie sua nova senha</h1>
                <p className="text-green-400 text-sm mt-1 font-medium text-center">
                    Este é o seu primeiro acesso. Por segurança, substitua a senha inicial.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                {sucesso ? (
                    <p className="text-green-400 text-sm text-center font-semibold">
                        ✅ Senha alterada com sucesso! Redirecionando para o login...
                    </p>
                ) : (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1">Senha atual (inicial)</label>
                            <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} className={inputCls} required autoComplete="current-password" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1">Nova senha</label>
                            <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className={inputCls} required minLength={8} autoComplete="new-password" />
                            <p className="text-xs text-gray-500 mt-1">Mínimo de 8 caracteres.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-1">Confirmar nova senha</label>
                            <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className={inputCls} required minLength={8} autoComplete="new-password" />
                        </div>

                        {erro && <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">{erro}</p>}

                        <button type="submit" disabled={trocar.isPending} className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg py-2.5 text-sm transition disabled:opacity-50">
                            {trocar.isPending ? "Salvando..." : "Salvar nova senha"}
                        </button>
                        <button type="button" onClick={() => void sairParaLogin()} className="w-full text-gray-400 hover:text-white text-xs transition">
                            Sair
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
