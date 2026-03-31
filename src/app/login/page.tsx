"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
    const searchParams = useSearchParams();

    // Sanitiza o callbackUrl: extrai APENAS o pathname, nunca um host externo/localhost
    const rawCallback = searchParams.get("callbackUrl") ?? "/dashboard";
    const safeCallback = rawCallback.startsWith("/") ? rawCallback : "/dashboard";

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password: senha,
                redirect: false,
            });

            if (result?.error) {
                setErro("E-mail ou senha inválidos. Verifique suas credenciais.");
            } else if (result?.ok) {
                // Usa window.location para garantir o host correto do browser (nunca localhost)
                window.location.href = safeCallback;
            } else {
                setErro("Erro desconhecido ao tentar acessar o sistema.");
            }
        } catch (error) {
            console.error("Erro no signIn:", error);
            setErro("Falha de conexão com o servidor. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
            {/* Logo */}
            <div className="mb-6 flex flex-col items-center">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-5 shadow-2xl">
                    <img src="/logo1.jpg" alt="Princesa dos Campos" className="h-16 w-auto object-contain" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Torre de Controle</h1>
                <p className="text-green-400 text-sm mt-1 font-medium">Acesso Restrito ao Sistema</p>
            </div>

            {/* Card do Formulário */}
            <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* E-mail */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            E-mail Corporativo
                        </label>
                        <input
                            type="email"
                            placeholder="nome@princesa.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                        />
                    </div>

                    {/* Senha */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                            Senha
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
                        />
                    </div>

                    {/* Erro */}
                    {erro && (
                        <p className="text-red-400 text-xs bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
                            {erro}
                        </p>
                    )}

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-gray-950 font-bold uppercase tracking-widest text-sm py-3 rounded-lg transition-colors shadow-lg shadow-green-900/30"
                    >
                        {loading ? "Verificando..." : "Acessar Sistema"}
                    </button>
                </form>

                {/* Aviso de acesso */}
                <div className="mt-6 p-4 bg-amber-950/40 border border-amber-700/40 rounded-xl text-center">
                    <p className="text-amber-400 text-xs font-semibold mb-1">Não possui acesso?</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                        Entre em contato com a{" "}
                        <span className="text-green-400 font-semibold">Administração do Sistema</span>{" "}
                        para solicitar a criação da sua conta.
                    </p>
                </div>
            </div>

            {/* Rodapé */}
            <p className="text-gray-700 text-xs mt-8">© {new Date().getFullYear()} Princesa dos Campos — Uso Restrito</p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
