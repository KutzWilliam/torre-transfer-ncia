"use client";

import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import {
    format,
    parseISO,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

type FiltroTipo = "TODOS" | "DIA" | "SEMANA" | "MES";

const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function AnaliseOrigemPage() {
    const { data: viagensComAtraso, isLoading } = api.viagem.listarAtrasosOrigem.useQuery(undefined, {
        refetchInterval: 60000,
    });

    const [tipoFiltro, setTipoFiltro] = useState<FiltroTipo>("TODOS");

    const dataHoje = new Date();
    const hojeStr = format(dataHoje, "yyyy-MM-dd");
    const [filtroData, setFiltroData] = useState<string>(hojeStr);

    const mesAtualStr = format(new Date(), "yyyy-MM");
    const [filtroMes, setFiltroMes] = useState<string>(mesAtualStr);

    const dadosFiltrados = useMemo(() => {
        if (!viagensComAtraso) return [];

        return viagensComAtraso.filter((v) => {
            const dataOrigem = new Date(v.dataRef);

            if (tipoFiltro === "TODOS") return true;

            if (tipoFiltro === "DIA") {
                const dOnlyStr = format(dataOrigem, "yyyy-MM-dd");
                return dOnlyStr === filtroData;
            }

            if (tipoFiltro === "MES") {
                const vMes = format(dataOrigem, "yyyy-MM");
                return vMes === filtroMes;
            }

            if (tipoFiltro === "SEMANA") {
                const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 }); // segunda como início
                const fimSemana = endOfWeek(new Date(), { weekStartsOn: 1 });
                return isWithinInterval(dataOrigem, { start: inicioSemana, end: fimSemana });
            }

            return true;
        });
    }, [viagensComAtraso, tipoFiltro, filtroData, filtroMes]);

    // Agrupar por dia da semana (usado no modo SEMANA)
    const dadosAgrupadosPorDia = useMemo(() => {
        if (tipoFiltro !== "SEMANA") return null;
        const grupos: Record<number, typeof dadosFiltrados> = {};
        for (const v of dadosFiltrados) {
            const dia = getDay(new Date(v.dataRef));
            if (!grupos[dia]) grupos[dia] = [];
            grupos[dia]!.push(v);
        }
        // Ordena pelas chaves (0=Dom .. 6=Sáb), mas começando em 1 (segunda) para ficar mais natural
        const ordem = [1, 2, 3, 4, 5, 6, 0];
        return ordem.filter(d => grupos[d] && grupos[d]!.length > 0).map(d => ({
            diaSemana: DIAS_SEMANA[d]!,
            viagens: grupos[d]!,
        }));
    }, [dadosFiltrados, tipoFiltro]);

    const totalAtrasos = dadosFiltrados.length;
    const mediaAtraso = totalAtrasos > 0
        ? Math.round(dadosFiltrados.reduce((acc, curr) => acc + curr.atrasoMinutos, 0) / totalAtrasos)
        : 0;
    const somaAtrasosH = totalAtrasos > 0
        ? Math.floor(dadosFiltrados.reduce((acc, curr) => acc + curr.atrasoMinutos, 0) / 60)
        : 0;

    const formatarHorasMinutos = (min: number) => {
        const h = Math.floor(min / 60);
        const m = min % 60;
        if (h === 0) return `${m}m`;
        return `${h}h ${m}m`;
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-xl font-semibold text-gray-500 animate-pulse">Carregando análise...</div>
            </div>
        );
    }

    const TabelaViagens = ({ lista }: { lista: typeof dadosFiltrados }) => (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Viagem / Rota</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Motorista / Placa</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chegada Destino (Previsão)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chegada Destino (Real)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">T. Atraso</th>
                    <th className="relative px-6 py-4"><span className="sr-only">Ação</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {lista.map((viagem) => (
                    <tr key={viagem.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-gray-900">#{viagem.id}</div>
                            <div className="text-xs text-gray-500 mt-1">{viagem.origem} &rarr; {viagem.destino}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{viagem.motorista}</div>
                            <div className="text-xs text-gray-500">{viagem.veiculo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{format(new Date(viagem.prevChegadaOrigem), "dd/MM/yyyy", { locale: ptBR })}</div>
                            <div className="text-xs text-gray-500 font-medium">{format(new Date(viagem.prevChegadaOrigem), "HH:mm")}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-bold">{format(new Date(viagem.chegadaRealOrigem), "dd/MM/yyyy", { locale: ptBR })}</div>
                            <div className="text-xs text-blue-700 font-bold">{format(new Date(viagem.chegadaRealOrigem), "HH:mm")}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="inline-flex items-center px-2.5 py-1.5 rounded-md bg-red-50 border border-red-100 text-red-700 text-sm font-bold">
                                + {formatarHorasMinutos(viagem.atrasoMinutos)}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <Link href={`/viagens/${viagem.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                                Visualizar
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-princesa-dark">Análise de Atrasos no Destino</h1>
                        <p className="max-w-xl mt-1 text-sm text-gray-500">
                            Monitoramento focado em viagens que chegaram atrasadas no destino final,
                            ultrapassando o horário previsto de chegada.
                        </p>
                    </div>
                    <Link href="/analise" className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 flex flex-shrink-0 items-center gap-2">
                        &larr; Voltar às Análises
                    </Link>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Viagens Atrasadas</p>
                        <p className="text-3xl font-bold text-red-600">{totalAtrasos}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Média de Atraso</p>
                        <p className="text-3xl font-bold text-amber-600">{formatarHorasMinutos(mediaAtraso)}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <p className="text-sm font-medium text-gray-500 mb-1">Acumulado Perdido</p>
                        <p className="text-3xl font-bold text-gray-900">{somaAtrasosH} horas</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
                        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Painel de Filtros</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(["TODOS", "DIA", "SEMANA", "MES"] as FiltroTipo[]).map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => setTipoFiltro(tipo)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                        tipoFiltro === tipo
                                            ? "bg-princesa-dark text-white ring-2 ring-princesa-green ring-offset-2"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                                    }`}
                                >
                                    {tipo === "TODOS" && "Todo o Período"}
                                    {tipo === "DIA" && "Por Dia"}
                                    {tipo === "SEMANA" && "Semana Atual"}
                                    {tipo === "MES" && "Por Mês"}
                                </button>
                            ))}
                        </div>

                        <div className="bg-gray-50/80 p-5 rounded-lg border border-gray-100 min-h-[3.5rem] flex items-center">
                            {tipoFiltro === "TODOS" && (
                                <p className="text-gray-500 text-sm">Mostrando todas as viagens atrasadas já registradas no sistema.</p>
                            )}
                            {tipoFiltro === "DIA" && (
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700">Selecione o Dia:</label>
                                    <input
                                        type="date"
                                        value={filtroData}
                                        onChange={(e) => setFiltroData(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-princesa-green focus:border-transparent outline-none"
                                    />
                                </div>
                            )}
                            {tipoFiltro === "MES" && (
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-700">Selecione o Mês:</label>
                                    <input
                                        type="month"
                                        value={filtroMes}
                                        onChange={(e) => setFiltroMes(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-princesa-green focus:border-transparent outline-none"
                                    />
                                </div>
                            )}
                            {tipoFiltro === "SEMANA" && (
                                <p className="text-gray-500 text-sm">
                                    Exibindo viagens da semana atual, agrupadas por dia.
                                    Semana de <strong>{format(startOfWeek(new Date(), { weekStartsOn: 1 }), "dd/MM", { locale: ptBR })}</strong> a <strong>{format(endOfWeek(new Date(), { weekStartsOn: 1 }), "dd/MM", { locale: ptBR })}</strong>.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resultados */}
                {tipoFiltro === "SEMANA" && dadosAgrupadosPorDia ? (
                    // Modo SEMANA: grupos por dia
                    dadosAgrupadosPorDia.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 py-12 text-center text-gray-500 text-sm">
                            Nenhum atraso registrado nesta semana 🎉
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {dadosAgrupadosPorDia.map(({ diaSemana, viagens }) => (
                                <div key={diaSemana} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-3 bg-princesa-dark flex items-center justify-between">
                                        <span className="text-sm font-bold text-white">{diaSemana}</span>
                                        <span className="text-xs text-green-300 font-medium">{viagens.length} viagem{viagens.length !== 1 ? "s" : ""} atrasada{viagens.length !== 1 ? "s" : ""}</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <TabelaViagens lista={viagens} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // Modo padrão: tabela flat
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <TabelaViagens lista={dadosFiltrados} />
                            {dadosFiltrados.length === 0 && (
                                <div className="py-12 text-center text-gray-500 text-sm">
                                    Nenhum atraso encontrado para os filtros selecionados 🎉
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-400">
                            Exibindo {dadosFiltrados.length} registros
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
