"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

type StatusFiltro = "TODOS" | "PROGRAMADA" | "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA";

export default function ListaViagensPage() {
    const { data: viagens, isLoading } = api.viagem.listar.useQuery(undefined, {
        refetchInterval: 30000,
        refetchOnWindowFocus: true,
    });

    const [busca, setBusca] = useState("");
    const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("TODOS");
    const [dataFiltro, setDataFiltro] = useState<string>("");

    useEffect(() => {
        const syncSascar = async () => {
            try { await fetch('/api/sync'); } catch (err) { console.error("Falha no sync em background", err); }
        };
        syncSascar();
        const interval = setInterval(syncSascar, 60000);
        return () => clearInterval(interval);
    }, []);

    const viagensFiltradas = useMemo(() => {
        if (!viagens) return [];
        const termo = busca.toLowerCase().trim();

        return viagens.filter((v) => {
            const passaStatus = statusFiltro === "TODOS" || v.status === statusFiltro;
            if (!passaStatus) return false;

            if (dataFiltro) {
                // Formata Date para YYYY-MM-DD considerando o fuso horário local
                const offset = v.prevInicioReal.getTimezoneOffset() * 60000;
                const localISO = new Date(v.prevInicioReal.getTime() - offset).toISOString().split('T')[0];
                if (localISO !== dataFiltro) return false;
            }

            if (!termo) return true;

            return (
                v.id.toLowerCase().includes(termo) ||
                v.motorista.toLowerCase().includes(termo) ||
                v.veiculo.placa.toLowerCase().includes(termo) ||
                v.baseOrigem.cidade.toLowerCase().includes(termo) ||
                v.baseDestino.cidade.toLowerCase().includes(termo) ||
                v.rotaDescricao.toLowerCase().includes(termo)
            );
        });
    }, [viagens, busca, statusFiltro, dataFiltro]);

    const contagens = useMemo(() => {
        if (!viagens) return { TODOS: 0, PROGRAMADA: 0, EM_ANDAMENTO: 0, FINALIZADA: 0, CANCELADA: 0 };
        
        // Aplica apenas o filtro de data (se existir) para contar corretamente o dia
        const viagensNoDia = dataFiltro ? viagens.filter(v => {
            const offset = v.prevInicioReal.getTimezoneOffset() * 60000;
            const localISO = new Date(v.prevInicioReal.getTime() - offset).toISOString().split('T')[0];
            return localISO === dataFiltro;
        }) : viagens;

        return {
            TODOS: viagensNoDia.length,
            PROGRAMADA: viagensNoDia.filter(v => v.status === "PROGRAMADA").length,
            EM_ANDAMENTO: viagensNoDia.filter(v => v.status === "EM_ANDAMENTO").length,
            FINALIZADA: viagensNoDia.filter(v => v.status === "FINALIZADA").length,
            CANCELADA: viagensNoDia.filter(v => v.status === "CANCELADA").length,
        };
    }, [viagens, dataFiltro]);

    const STATUS_TABS: { key: StatusFiltro; label: string; color: string }[] = [
        { key: "TODOS", label: "Todas", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        { key: "EM_ANDAMENTO", label: "Em Andamento", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
        { key: "PROGRAMADA", label: "Programadas", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
        { key: "FINALIZADA", label: "Finalizadas", color: "bg-green-100 text-green-700 hover:bg-green-200" },
        { key: "CANCELADA", label: "Canceladas", color: "bg-red-100 text-red-700 hover:bg-red-200" },
    ];

    if (isLoading && !viagens) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-xl font-semibold text-gray-500 animate-pulse">Carregando viagens...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">
                {/* Cabeçalho */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-princesa-dark">Painel de Transferências</h1>
                        <p className="mt-0.5 text-sm text-gray-500">Monitoramento em tempo real das viagens.</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href="/dashboard"
                            className="rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-700 flex items-center gap-1.5"
                        >
                            🚛 Dashboard
                        </Link>
                        <Link
                            href="/viagens/upload"
                            className="rounded-lg bg-princesa-green px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-green-400 flex items-center gap-1.5"
                        >
                            + Importar Planilha
                        </Link>
                    </div>
                </div>

                {/* Filtros */}
                <div className="mb-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col lg:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1">
                        {/* Filtro de Dia */}
                        <div className="flex-shrink-0">
                            <input
                                type="date"
                                value={dataFiltro}
                                onChange={e => setDataFiltro(e.target.value)}
                                className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-princesa-green focus:border-transparent text-gray-600"
                            />
                        </div>

                        {/* Campo de busca */}
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por viagem, motorista, placa, cidade..."
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-princesa-green focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Tabs de status */}
                    <div className="flex flex-wrap gap-1.5">
                        {STATUS_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setStatusFiltro(tab.key)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                    statusFiltro === tab.key
                                        ? "ring-2 ring-offset-1 ring-gray-400 " + tab.color
                                        : tab.color
                                }`}
                            >
                                {tab.label}
                                <span className="ml-1.5 opacity-60">{contagens[tab.key]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nº Viagem</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Veículo / Motorista</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rota</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Previsão</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Real</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {viagensFiltradas.map((viagem) => (
                                <tr key={viagem.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900">
                                        #{viagem.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="font-semibold text-gray-900">{viagem.veiculo.placa}</div>
                                        <div className="text-xs">{viagem.motorista}</div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">
                                        <div className="font-medium text-blue-700">{viagem.baseOrigem.cidade}</div>
                                        <div className="text-[10px] text-gray-400">↓</div>
                                        <div className="font-medium text-green-700">{viagem.baseDestino.cidade}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div><span className="font-medium text-gray-700">S:</span> {viagem.prevInicioReal.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} {viagem.prevInicioReal.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</div>
                                        <div><span className="font-medium text-gray-700">C:</span> {viagem.prevFimReal.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} {viagem.prevFimReal.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div>
                                            <span className="font-medium text-gray-700">S:</span> {viagem.dataInicioEfetivo
                                                ? `${viagem.dataInicioEfetivo.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} ${viagem.dataInicioEfetivo.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}`
                                                : <span className="text-gray-300">—</span>}
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">C:</span> {viagem.dataFimEfetivo
                                                ? `${viagem.dataFimEfetivo.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit' })} ${viagem.dataFimEfetivo.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}`
                                                : <span className="text-gray-300">—</span>}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            viagem.status === "EM_ANDAMENTO" ? "bg-blue-100 text-blue-800" :
                                            viagem.status === "FINALIZADA" ? "bg-green-100 text-green-800" :
                                            viagem.status === "CANCELADA" ? "bg-red-100 text-red-800" :
                                            "bg-gray-100 text-gray-700"
                                        }`}>
                                            {viagem.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
                                        <Link
                                            href={`/viagens/${viagem.id}`}
                                            className="text-princesa-dark font-semibold hover:text-princesa-green transition-colors"
                                        >
                                            Detalhes →
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {viagensFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                                        {busca || statusFiltro !== "TODOS"
                                            ? "Nenhuma viagem encontrada com os filtros aplicados."
                                            : "Nenhuma viagem encontrada. Importe a planilha para começar."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Rodapé da tabela */}
                    {viagensFiltradas.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                            Exibindo {viagensFiltradas.length} de {viagens?.length ?? 0} viagens
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}