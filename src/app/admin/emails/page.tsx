"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; classe: string; dot: string }> = {
    ABERTA:         { label: "Aberta",         classe: "bg-red-50 text-red-700 border-red-200",     dot: "bg-red-500" },
    EM_ATENDIMENTO: { label: "Em Atendimento", classe: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    RESOLVIDA:      { label: "Resolvida",      classe: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

export default function AuditoriaEmailsPage() {
    const [limite, setLimite] = useState(50);

    const { data: ocorrencias, isLoading, refetch } = api.ocorrencia.listarDoEmail.useQuery({ limite });

    const formatarData = (d: Date | string) =>
        new Date(d).toLocaleString("pt-BR", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f1623 0%, #131d2e 50%, #0a1525 100%)" }}>
            {/* Header */}
            <header style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-sm font-medium transition-colors"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            ← Admin
                        </Link>
                        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
                                <span className="text-lg">📧</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Auditoria de E-mails</h1>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                    Ocorrências recebidas via AngelLira
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Indicador de status */}
                        <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400">Polling ativo (60s)</span>
                        </div>
                        <button
                            onClick={() => void refetch()}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-all"
                            style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
                        >
                            🔄 Atualizar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Cards de resumo */}
                {ocorrencias && (
                    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                label: "Total Recebido",
                                valor: ocorrencias.length,
                                icone: "📨",
                                cor: "#3b82f6",
                            },
                            {
                                label: "Abertas",
                                valor: ocorrencias.filter(o => o.status === "ABERTA").length,
                                icone: "🔴",
                                cor: "#ef4444",
                            },
                            {
                                label: "Em Atendimento",
                                valor: ocorrencias.filter(o => o.status === "EM_ATENDIMENTO").length,
                                icone: "🟡",
                                cor: "#f59e0b",
                            },
                            {
                                label: "Resolvidas",
                                valor: ocorrencias.filter(o => o.status === "RESOLVIDA").length,
                                icone: "✅",
                                cor: "#10b981",
                            },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="rounded-xl p-4"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <p className="text-2xl mb-1">{card.icone}</p>
                                <p className="text-2xl font-bold text-white">{card.valor}</p>
                                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                                    {card.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabela */}
                <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Cabeçalho da tabela */}
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <h2 className="font-semibold text-white">
                            Histórico de Alarmes Recebidos
                        </h2>
                        <div className="flex items-center gap-3">
                            <label className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                Exibir:
                            </label>
                            <select
                                value={limite}
                                onChange={(e) => setLimite(Number(e.target.value))}
                                className="rounded-lg px-3 py-1.5 text-sm text-white"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                            >
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={200}>200</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Carregando...</p>
                            </div>
                        </div>
                    ) : !ocorrencias || ocorrencias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <span className="text-4xl">📭</span>
                            <p className="text-white font-medium">Nenhum e-mail processado ainda</p>
                            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                                As ocorrências aparecerão aqui conforme os e-mails da AngelLira forem processados.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        {["Recebido", "Tipo de Alarme", "Viagem", "Rota", "Status", "Ações"].map((col) => (
                                            <th
                                                key={col}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                                                style={{ color: "rgba(255,255,255,0.3)" }}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {ocorrencias.map((oc, idx) => {
                                        const statusCfg = STATUS_CONFIG[oc.status] ?? STATUS_CONFIG.ABERTA!;
                                        return (
                                            <tr
                                                key={oc.id}
                                                className="transition-colors hover:bg-white/5"
                                                style={{
                                                    borderBottom: idx < ocorrencias.length - 1
                                                        ? "1px solid rgba(255,255,255,0.04)"
                                                        : "none",
                                                }}
                                            >
                                                {/* Data */}
                                                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(255,255,255,0.5)" }}>
                                                    {formatarData(oc.createdAt)}
                                                </td>

                                                {/* Tipo */}
                                                <td className="px-4 py-3">
                                                    <span className="font-semibold text-white">
                                                        {oc.tipoOcorrencia}
                                                    </span>
                                                    {oc.linkMapa && (
                                                        <a
                                                            href={oc.linkMapa}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-2 text-xs hover:text-blue-300 transition-colors"
                                                            style={{ color: "rgba(96,165,250,0.7)" }}
                                                            title="Ver no mapa"
                                                        >
                                                            🗺️ Mapa
                                                        </a>
                                                    )}
                                                </td>

                                                {/* Viagem */}
                                                <td className="px-4 py-3">
                                                    {oc.viagem ? (
                                                        <Link
                                                            href={`/viagens/${oc.viagem.id}`}
                                                            className="font-mono text-blue-400 hover:text-blue-300 transition-colors text-xs"
                                                        >
                                                            #{oc.viagem.id}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>—</span>
                                                    )}
                                                    {oc.viagem?.motorista && (
                                                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                                                            {oc.viagem.motorista}
                                                        </p>
                                                    )}
                                                    {oc.viagem?.veiculo?.placa && (
                                                        <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                                                            {oc.viagem.veiculo.placa}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Rota */}
                                                <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                                                    {oc.viagem ? (
                                                        <>
                                                            <span>{oc.viagem.baseOrigem?.nome ?? "?"}</span>
                                                            <span className="mx-1" style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
                                                            <span>{oc.viagem.baseDestino?.nome ?? "?"}</span>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: "rgba(255,255,255,0.2)" }}>Sem rota</span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusCfg.classe}`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                                                        {statusCfg.label}
                                                    </span>
                                                </td>

                                                {/* Ações */}
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href="/ocorrencias"
                                                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-all"
                                                        style={{
                                                            background: "rgba(255,255,255,0.06)",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                        }}
                                                    >
                                                        Ver
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Info técnica */}
                <div className="mt-6 rounded-xl p-4" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)" }}>
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">ℹ️ Como funciona a integração</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <div>
                            <p className="font-medium text-white mb-1">📬 Fonte</p>
                            <p>E-mails recebidos de <code className="text-blue-300">naoresponda@angellira.com.br</code> na caixa <code className="text-blue-300">torre.notificacoes@</code></p>
                        </div>
                        <div>
                            <p className="font-medium text-white mb-1">⏱️ Frequência</p>
                            <p>O sistema verifica novos alarmes a cada <strong className="text-white">60 segundos</strong> via polling IMAP automático (PM2 cron).</p>
                        </div>
                        <div>
                            <p className="font-medium text-white mb-1">🔗 Vinculação</p>
                            <p>Cada alarme é automaticamente vinculado à viagem pelo <strong className="text-white">Código da Viagem</strong> ou, como fallback, pela placa do veículo em andamento.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
