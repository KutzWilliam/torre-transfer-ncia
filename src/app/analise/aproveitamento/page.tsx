"use client";

import { useState, useMemo, useEffect } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { keepPreviousData } from "@tanstack/react-query";
import { TruckLoader } from "@/components/TruckLoader";

type PeriodoFiltro = "HOJE" | "SEMANA" | "MES" | "DIA_CUSTOM" | "MES_CUSTOM";
type NivelOcupacaoFiltro = "TODAS" | "CRITICA" | "ATENCAO" | "IDEAL";
type MargemFiltro = "TODAS" | "LUCRO" | "PREJUIZO";

function fmtMoeda(val: number): string {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtNum(val: number): string {
    return val.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

function renderBadgeStatusManifesto(status: string) {
    const s = (status || "").toUpperCase();
    if (s.includes("ENCERRADO") || s.includes("FINALIZADO")) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Encerrado
            </span>
        );
    }
    if (s.includes("ROTA") || s.includes("SAIDA EFETIVA")) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                Em Rota
            </span>
        );
    }
    if (s.includes("ABERTO") || s.includes("AGUARDANDO SAIDA") || s.includes("AGUARDANDO")) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Aguardando Saída
            </span>
        );
    }
    if (s.includes("PENDENCIA") || s.includes("PENDÊNCIA")) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                Com Pendência
            </span>
        );
    }
    if (s.includes("CANCELADO")) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Cancelado
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status || "Indefinido"}
        </span>
    );
}

export default function AproveitamentoFrotaPage() {
    const hoje = new Date();
    const [periodo, setPeriodo] = useState<PeriodoFiltro>("SEMANA");
    const [diaCustom, setDiaCustom] = useState(format(hoje, "yyyy-MM-dd"));
    const [mesCustom, setMesCustom] = useState(format(hoje, "yyyy-MM"));

    const [parceiroFiltro, setParceiroFiltro] = useState<string>("");
    const [tipoVeiculoFiltro, setTipoVeiculoFiltro] = useState<string>("");
    const [statusManifestoFiltro, setStatusManifestoFiltro] = useState<string>("");
    const [tipoManifestoFiltro, setTipoManifestoFiltro] = useState<string>("");
    const [ocupacaoFiltro, setOcupacaoFiltro] = useState<NivelOcupacaoFiltro>("TODAS");
    const [margemFiltro, setMargemFiltro] = useState<MargemFiltro>("TODAS");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Debounce na busca para evitar refetch a cada caractere digitado
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 350);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Modal de detalhes
    const [manifestoModalId, setManifestoModalId] = useState<string | null>(null);
    const [manifestoSelecionado, setManifestoSelecionado] = useState<any>(null);

    // Ordenação da tabela
    const [ordenacao, setOrdenacao] = useState<"data" | "menorOcupacao" | "maiorPrejuizo" | "maiorCarga">("data");

    // Intervalo de datas
    const { dataInicio, dataFim } = useMemo(() => {
        switch (periodo) {
            case "HOJE":
                return { dataInicio: format(hoje, "yyyy-MM-dd"), dataFim: format(hoje, "yyyy-MM-dd") };
            case "SEMANA": {
                const s = startOfWeek(hoje, { weekStartsOn: 1 });
                const e = endOfWeek(hoje, { weekStartsOn: 1 });
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
            case "MES": {
                const s = startOfMonth(hoje);
                const e = endOfMonth(hoje);
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
            case "DIA_CUSTOM":
                return { dataInicio: diaCustom, dataFim: diaCustom };
            case "MES_CUSTOM": {
                const base = new Date(mesCustom + "-01T12:00:00");
                const s = startOfMonth(base);
                const e = endOfMonth(base);
                return { dataInicio: format(s, "yyyy-MM-dd"), dataFim: format(e, "yyyy-MM-dd") };
            }
        }
    }, [periodo, diaCustom, mesCustom]);

    const { data, isLoading, isFetching } = api.aproveitamento.obterAnaliseAproveitamento.useQuery(
        {
            dataInicio,
            dataFim,
            parceiro: parceiroFiltro || undefined,
            tipoVeiculo: tipoVeiculoFiltro || undefined,
            statusManifesto: statusManifestoFiltro || undefined,
            tipoManifesto: tipoManifestoFiltro || undefined,
            statusOcupacao: ocupacaoFiltro,
            statusMargem: margemFiltro,
            search: searchQuery || undefined,
        },
        {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            placeholderData: keepPreviousData,
        }
    );

    // Consulta de minutas para o modal
    const { data: minutasManifesto, isLoading: isLoadingMinutas } = api.aproveitamento.obterMinutasManifesto.useQuery(
        { idManifesto: manifestoModalId ?? "" },
        { enabled: !!manifestoModalId }
    );

    // Viagens ordenadas
    const viagensOrdenadas = useMemo(() => {
        if (!data?.viagens) return [];
        return [...data.viagens].sort((a, b) => {
            if (ordenacao === "menorOcupacao") return a.ocupacaoGeralPct - b.ocupacaoGeralPct;
            if (ordenacao === "maiorPrejuizo") return a.margemFinanceira - b.margemFinanceira;
            if (ordenacao === "maiorCarga") return b.pesoCarregadoKg - a.pesoCarregadoKg;
            return new Date(b.data).getTime() - new Date(a.data).getTime();
        });
    }, [data?.viagens, ordenacao]);

    const handleExportExcel = () => {
        if (!viagensOrdenadas.length) return;
        import("xlsx").then((XLSX) => {
            const exportData = viagensOrdenadas.map((v) => ({
                "Cód. Manifesto": v.idManifesto,
                "Tipo de Manifesto": v.tipoManifestoDescricao,
                "Data": v.data,
                "Status do Manifesto": v.statusDescricao,
                "Parceiro": v.parceiro,
                "Transportadora": v.fornecedorRazao,
                "Rota": v.rotaDescricao,
                "Placa": v.placa,
                "Tipo Veículo": v.tipoVeiculo,
                "Peso Carregado (kg)": v.pesoCarregadoKg,
                "Capacidade Peso (kg)": v.capacidadeKg,
                "Ocupação Peso (%)": `${v.ocupacaoPesoPct}%`,
                "Volume Carregado (m³)": v.cuboCarregadoM3,
                "Capacidade Volume (m³)": v.capacidadeM3,
                "Ocupação Volume (%)": `${v.ocupacaoCuboPct}%`,
                "Ocupação Geral (%)": `${v.ocupacaoGeralPct}%`,
                "Gargalo": v.gargalo,
                "Nível Ocupação": v.nivelOcupacao,
                "Custo Pago Parceiro (R$)": v.custoViagem,
                "Receita Bruta Rateada (R$)": v.receitaRateada,
                "Custos Pontas Coleta/Entrega/Seg/Imp (R$)": v.custoPontasRateado,
                "Receita Líquida Real (R$)": v.receitaLiquidaRateada,
                "Lucro Líquido Real (R$)": v.margemFinanceira,
                "Margem Líquida (%)": `${v.margemPercentual}%`,
                "Resultado": v.resultadoFinanceiro,
                "Total Minutas": v.totalMinutas,
                "Total Volumes": v.totalVolumes,
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Aproveitamento_Frota");
            XLSX.writeFile(workbook, `Aproveitamento_Frota_${format(new Date(), "dd_MM_yyyy_HHmm")}.xlsx`);
        });
    };

    const labelPeriodo = {
        HOJE: "Hoje",
        SEMANA: "Esta Semana",
        MES: "Este Mês",
        DIA_CUSTOM: format(new Date(diaCustom + "T12:00:00"), "dd/MM/yyyy"),
        MES_CUSTOM: format(new Date(mesCustom + "-01"), "MMMM yyyy", { locale: ptBR }),
    }[periodo];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ── Topo ── */}
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm relative">
                {/* Barra de progresso animada ao carregar/filtrar */}
                {isFetching && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden bg-orange-100 z-10">
                        <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 w-full animate-pulse" />
                    </div>
                )}
                <div className="mx-auto max-w-[1600px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🚛</span>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Aproveitamento & Rentabilidade da Frota</h1>
                            <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 tracking-wider">
                                Gerencial
                            </span>
                            {isFetching && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 animate-pulse">
                                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                                    Atualizando...
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Análise de ocupação de capacidade (peso e cubagem), receita rateada e custos de parceiros • {labelPeriodo}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {isFetching && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-sm">
                                <svg className="animate-spin h-3.5 w-3.5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Recalculando indicadores...</span>
                            </div>
                        )}
                        <Link href="/analise/operacional" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                            Analytics Operacional →
                        </Link>
                        <Link href="/analise" className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                            ← Central de Análises
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
                {/* ── Painel de Filtros ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-4 items-end">
                    {/* Período */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Período</p>
                        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
                            {(["HOJE", "SEMANA", "MES", "DIA_CUSTOM", "MES_CUSTOM"] as PeriodoFiltro[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriodo(p)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                                        periodo === p ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    }`}
                                >
                                    {{ HOJE: "Hoje", SEMANA: "Semana", MES: "Mês", DIA_CUSTOM: "Dia", MES_CUSTOM: "Mês Esp." }[p]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {periodo === "DIA_CUSTOM" && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dia</p>
                            <input
                                type="date"
                                value={diaCustom}
                                onChange={(e) => setDiaCustom(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                    )}

                    {periodo === "MES_CUSTOM" && (
                        <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mês</p>
                            <input
                                type="month"
                                value={mesCustom}
                                onChange={(e) => setMesCustom(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                        </div>
                    )}

                    {/* Filtro Parceiro */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parceiro</p>
                        <select
                            value={parceiroFiltro}
                            onChange={(e) => setParceiroFiltro(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[160px]"
                        >
                            <option value="">Todos os Parceiros</option>
                            {data?.parceirosDisponiveis.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Tipo Veículo */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Veículo</p>
                        <select
                            value={tipoVeiculoFiltro}
                            onChange={(e) => setTipoVeiculoFiltro(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[140px]"
                        >
                            <option value="">Todos</option>
                            <option value="TRUCK">Truck (12t a 16t / 50m³)</option>
                            <option value="CAVALO MECANICO">Cavalo (24t a 30t / 100m³)</option>
                            <option value="VUC / 3/4">VUC / 3/4 (4t / 25m³)</option>
                        </select>
                    </div>

                    {/* Filtro Status Manifesto */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Manifesto</p>
                        <select
                            value={statusManifestoFiltro}
                            onChange={(e) => setStatusManifestoFiltro(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[160px]"
                        >
                            <option value="">Todos os Status</option>
                            {data?.statusDisponiveis.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Tipo de Manifesto (manifesto_tipo) */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo Manifesto</p>
                        <select
                            value={tipoManifestoFiltro}
                            onChange={(e) => setTipoManifestoFiltro(e.target.value)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 min-w-[150px]"
                        >
                            <option value="">Todos os Tipos</option>
                            {data?.tiposManifestoDisponiveis?.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro Ocupação */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ocupação</p>
                        <select
                            value={ocupacaoFiltro}
                            onChange={(e) => setOcupacaoFiltro(e.target.value as NivelOcupacaoFiltro)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="TODAS">Todas as Faixas</option>
                            <option value="CRITICA">🔴 Crítica (&lt; 50%)</option>
                            <option value="ATENCAO">🟡 Atenção (50% a 75%)</option>
                            <option value="IDEAL">🟢 Ideal (&gt; 75%)</option>
                        </select>
                    </div>

                    {/* Filtro Margem */}
                    <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Margem</p>
                        <select
                            value={margemFiltro}
                            onChange={(e) => setMargemFiltro(e.target.value as MargemFiltro)}
                            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                            <option value="TODAS">Todas</option>
                            <option value="LUCRO">🟢 No Lucro (Receita &gt; Custo)</option>
                            <option value="PREJUIZO">🔴 No Prejuízo (Custo &gt; Receita)</option>
                        </select>
                    </div>

                    {/* Busca */}
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Busca</p>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Manifesto, placa, rota, parceiro..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full text-sm px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 pr-8"
                            />
                            {searchInput !== searchQuery && (
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-500 text-xs animate-spin font-bold">
                                    ↻
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Indicador de carregamento no painel de filtros */}
                    {isFetching && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold animate-pulse">
                            <span className="animate-spin inline-block text-sm">↻</span>
                            <span>Filtrando...</span>
                        </div>
                    )}

                    {/* Exportar */}
                    <button
                        onClick={handleExportExcel}
                        disabled={!viagensOrdenadas.length || isFetching}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                        📥 Exportar Excel
                    </button>
                </div>

                {/* Floating pill no topo ao filtrar dados */}
                {isFetching && !isLoading && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                        <div className="bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-full px-5 py-2 flex items-center gap-2.5 text-xs font-semibold animate-pulse">
                            <span className="h-2 w-2 rounded-full bg-orange-400 animate-ping" />
                            <span>Aplicando filtros e recalculando indicadores...</span>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <TruckLoader tamanho="lg" mensagem="Calculando aproveitamento e rentabilidade da frota..." />
                    </div>
                ) : data ? (
                    <div className={`space-y-6 transition-opacity duration-200 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                        {/* ── Guia Metodológico de Pesos & Volumes ── */}
                        <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-slate-50 border border-blue-200/80 rounded-2xl p-4 text-xs text-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl mt-0.5">ℹ️</span>
                                <div className="space-y-1">
                                    <p className="font-extrabold text-slate-900 text-sm">
                                        Entenda os Indicadores de Capacidade & Volume da Frota
                                    </p>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-600">
                                        <span>
                                            <strong className="text-blue-800">⚖️ Peso Real (Balança):</strong> Peso físico em kg das cargas, comparado ao limite mecânico (Truck: 12t / Cavalo: 24t).
                                        </span>
                                        <span>
                                            <strong className="text-purple-800">📦 Espaço no Baú (m³):</strong> Metragem cúbica real ocupada no baú (Truck: 50 m³ / Cavalo: 100 m³).
                                        </span>
                                        <span>
                                            <strong className="text-amber-800">🏷️ Pacotes / Caixas:</strong> Total físico de unidades/volumes transportados na viagem.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0 text-[11px] bg-white/80 border border-blue-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
                                <span>Fator Brudam: <strong>250 kg/m³</strong></span>
                            </div>
                        </div>

                        {/* ── Cards de KPIs ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Ocupação Geral */}
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 border-l-orange-500">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Ocupação Média</span>
                                    <span className="text-xl">📊</span>
                                </div>
                                <p className="text-3xl font-extrabold text-gray-900 tabular-nums">
                                    {data.kpis.taxaMediaGeral}%
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>Peso: <strong>{data.kpis.taxaMediaOcupacaoPeso}%</strong></span>
                                    <span>•</span>
                                    <span>Cubo: <strong>{data.kpis.taxaMediaOcupacaoCubo}%</strong></span>
                                </div>
                            </div>

                            {/* Receita Líquida Real */}
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 border-l-emerald-500">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Receita Líquida</span>
                                    <span className="text-xl">💰</span>
                                </div>
                                <p className="text-3xl font-extrabold text-emerald-700 tabular-nums">
                                    {fmtMoeda(data.kpis.receitaLiquidaTotalRateada)}
                                </p>
                                <p className="text-xs text-gray-400 truncate" title={`Bruto: ${fmtMoeda(data.kpis.receitaTotalRateada)} | Pontas: -${fmtMoeda(data.kpis.custoPontasTotal)}`}>
                                    Bruto: {fmtMoeda(data.kpis.receitaTotalRateada)} • Pontas: -{fmtMoeda(data.kpis.custoPontasTotal)}
                                </p>
                            </div>

                            {/* Custo Parceiros */}
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 border-l-blue-500">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Custo Parceiros</span>
                                    <span className="text-xl">🧾</span>
                                </div>
                                <p className="text-3xl font-extrabold text-slate-800 tabular-nums">
                                    {fmtMoeda(data.kpis.custoTotalParceiros)}
                                </p>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-500">Lucro Real:</span>
                                    <span className={`font-bold ${data.kpis.margemTotal >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                        {fmtMoeda(data.kpis.margemTotal)} ({data.kpis.margemTotalPct}%)
                                    </span>
                                </div>
                            </div>

                            {/* Capacidade Ociosa */}
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 border-l-amber-500">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Capacidade Ociosa</span>
                                    <span className="text-xl">💨</span>
                                </div>
                                <p className="text-3xl font-extrabold text-amber-700 tabular-nums">
                                    {fmtNum(data.kpis.capacidadeOciosaKg / 1000)} ton
                                </p>
                                <p className="text-xs text-gray-500">
                                    {fmtNum(data.kpis.capacidadeOciosaM3)} m³ vazios transportados
                                </p>
                            </div>

                            {/* Viagens Subutilizadas / Prejuízo */}
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-2 border-l-4 border-l-red-500">
                                <div className="flex items-center justify-between text-gray-500">
                                    <span className="text-xs font-bold uppercase tracking-wider">Atenção Crítica</span>
                                    <span className="text-xl">🚨</span>
                                </div>
                                <p className="text-3xl font-extrabold text-red-600 tabular-nums">
                                    {data.kpis.qtdSubutilizadas} <span className="text-xs text-gray-400 font-normal">viagens</span>
                                </p>
                                <p className="text-xs text-red-500 font-semibold">
                                    {data.kpis.qtdPrejuizo} viagens com receita &lt; custo
                                </p>
                            </div>
                        </div>

                        {/* ── Painel de Gráficos e Rankings ── */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Aproveitamento por Parceiro */}
                            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🏢 Ranking de Aproveitamento por Parceiro</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Ocupação média da capacidade e margem líquida gerada por cada fornecedor</p>
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">{data.rankingParceiros.length} parceiros</span>
                                </div>

                                {data.rankingParceiros.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-8">Nenhum dado encontrado para o período selecionado.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {data.rankingParceiros.map((p) => {
                                            const corBarra = p.ocupacaoGeral >= 75 ? "bg-emerald-500" : (p.ocupacaoGeral >= 50 ? "bg-amber-500" : "bg-red-500");
                                            return (
                                                <div key={p.parceiro} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <span className="font-bold text-sm text-slate-800 truncate">{p.parceiro}</span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                                                                {p.viagens} viagens
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                                                            <div>
                                                                <span className="text-gray-400">Receita: </span>
                                                                <span className="font-semibold text-slate-700">{fmtMoeda(p.receitaTotal)}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Custo: </span>
                                                                <span className="font-semibold text-slate-700">{fmtMoeda(p.custoTotal)}</span>
                                                            </div>
                                                            <div className={`font-bold px-2 py-0.5 rounded-md ${p.margemTotal >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                                                                {fmtMoeda(p.margemTotal)} ({p.margemPct}%)
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Barra de Progresso */}
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                                                            <span>Ocupação da Capacidade: <strong>{p.ocupacaoGeral}%</strong> (Peso: {p.ocupacaoMediaPeso}% | Cubo: {p.ocupacaoMediaCubo}%)</span>
                                                        </div>
                                                        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                                            <div className={`h-2.5 rounded-full transition-all duration-500 ${corBarra}`} style={{ width: `${Math.min(100, p.ocupacaoGeral)}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Distribuição de Faixas e Gargalo */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🎯 Diagnóstico Operacional</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Faixas de ocupação e gargalo predominante da carga</p>
                                </div>

                                {/* Faixas */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Faixas de Ocupação</p>
                                    {[
                                        { label: "Ideal (> 75%)", qtd: data.distribuicaoOcupacao.IDEAL, cor: "bg-emerald-500", textCor: "text-emerald-700", bgCor: "bg-emerald-50" },
                                        { label: "Atenção (50% a 75%)", qtd: data.distribuicaoOcupacao.ATENCAO, cor: "bg-amber-500", textCor: "text-amber-700", bgCor: "bg-amber-50" },
                                        { label: "Crítica (< 50%)", qtd: data.distribuicaoOcupacao.CRITICA, cor: "bg-red-500", textCor: "text-red-700", bgCor: "bg-red-50" },
                                    ].map(f => {
                                        const pct = data.kpis.totalViagens > 0 ? Math.round((f.qtd / data.kpis.totalViagens) * 100) : 0;
                                        return (
                                            <div key={f.label} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className={`font-semibold ${f.textCor}`}>{f.label}</span>
                                                    <span className="font-bold text-slate-700">{f.qtd} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <div className={`h-2 rounded-full ${f.cor}`} style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Fator Limitante / Gargalo */}
                                <div className="border-t border-slate-100 pt-4 space-y-2">
                                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fator Limitante (Gargalo)</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                                            <p className="text-xs text-blue-600 font-semibold">Gargalo por Peso</p>
                                            <p className="text-2xl font-black text-blue-900 mt-1">{data.distribuicaoGargalo.PESO}</p>
                                            <p className="text-[10px] text-blue-400 mt-0.5">veículos cheios por peso</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-center">
                                            <p className="text-xs text-purple-600 font-semibold">Gargalo por Volume</p>
                                            <p className="text-2xl font-black text-purple-900 mt-1">{data.distribuicaoGargalo.VOLUME}</p>
                                            <p className="text-[10px] text-purple-400 mt-0.5">baú lotado por cubagem</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-tight">
                                        💡 Cargas volumosas esgotam os 50m³/100m³ antes de atingir a capacidade em toneladas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Rotas Subutilizadas e com Maior Movimento ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Rotas com Pior Ocupação */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div>
                                    <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider">⚠️ Rotas com Menor Ocupação Média (Oportunidade)</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Rotas com caminhões rodando vazios — candidatas a redução de porte ou consolidação</p>
                                </div>
                                <div className="space-y-2.5">
                                    {data.rotasPiorOcupacao.length === 0 ? (
                                        <p className="text-xs text-slate-400 text-center py-4">Sem dados suficientes de rotas recorrentes.</p>
                                    ) : (
                                        data.rotasPiorOcupacao.map((r) => (
                                            <div key={r.rota} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                                <div className="min-w-0 flex-1 pr-3">
                                                    <p className="text-xs font-bold text-slate-800 truncate" title={r.rota}>{r.rota}</p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">{r.viagens} viagens • {fmtMoeda(r.receitaTotal)} receita</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black bg-red-100 text-red-800">
                                                            {r.ocupacaoMedia}% ocup.
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Top Rotas por Faturamento */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">🌟 Rotas com Maior Movimentação Financeira</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Rotas com maior volume de frete rateado no período</p>
                                </div>
                                <div className="space-y-2.5">
                                    {data.rotasMaiorMovimento.map((r) => (
                                        <div key={r.rota} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <div className="min-w-0 flex-1 pr-3">
                                                <p className="text-xs font-bold text-slate-800 truncate" title={r.rota}>{r.rota}</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">{r.viagens} viagens • {r.ocupacaoMedia}% ocupação média</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 text-right">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{fmtMoeda(r.receitaTotal)}</p>
                                                    <p className={`text-[10px] font-semibold ${r.margemTotal >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                                                        {r.margemTotal >= 0 ? "+" : ""}{fmtMoeda(r.margemTotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Tabela Analítica de Viagens ── */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 gap-4">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">📋 Detalhamento dos Manifestos & Viagens</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-slate-400">{viagensOrdenadas.length} viagem(ns) no filtro atual</p>
                                        {isFetching && (
                                            <span className="text-xs text-orange-600 font-semibold flex items-center gap-1 animate-pulse">
                                                • <span className="animate-spin inline-block">↻</span> Atualizando lista...
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Ordenar:</span>
                                    <select
                                        value={ordenacao}
                                        onChange={(e) => setOrdenacao(e.target.value as typeof ordenacao)}
                                        className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                                    >
                                        <option value="data">Data Recente</option>
                                        <option value="menorOcupacao">Menor Ocupação Primeiro</option>
                                        <option value="maiorPrejuizo">Maior Prejuízo Primeiro</option>
                                        <option value="maiorCarga">Maior Carga Primeiro</option>
                                    </select>
                                </div>
                            </div>

                            {viagensOrdenadas.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-4xl mb-3">📭</p>
                                    <p className="text-lg font-semibold text-gray-500">Nenhum manifesto encontrado para os filtros selecionados</p>
                                    <p className="text-sm text-gray-400 mt-1">Experimente alterar o parceiro ou ampliar as datas</p>
                                </div>
                            ) : (
                                <div className="overflow-auto max-h-[70vh] relative border-t border-slate-200">
                                    <table className="min-w-full divide-y divide-gray-100 border-separate border-spacing-0">
                                        <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
                                            <tr>
                                                {["Manifesto / Data", "Status", "Parceiro / Placa", "Trecho / Rota", "Tipo", "Peso Real (Balança)", "Volume Baú (m³)", "Pacotes (Caixas)", "Ocupação", "Gargalo", "Custo Parceiro", "Receita Líquida", "Lucro Real Líquido", "Ação"].map((h, idx) => (
                                                    <th
                                                        key={h}
                                                        className={`px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 border-b border-slate-200 ${
                                                            idx === 0 ? "sticky left-0 z-30 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]" : ""
                                                        }`}
                                                    >
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-xs">
                                            {viagensOrdenadas.map((v) => {
                                                const corOcup = v.nivelOcupacao === "IDEAL" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    (v.nivelOcupacao === "ATENCAO" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200");

                                                const corMargem = v.resultadoFinanceiro === "LUCRO" ? "text-emerald-700 font-bold" : "text-red-600 font-bold";

                                                return (
                                                    <tr key={v.idManifesto} className="group hover:bg-slate-50/80 transition-colors">
                                                        {/* Manifesto */}
                                                        <td className="px-4 py-3 whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-extrabold text-blue-600">#{v.idManifesto}</span>
                                                                {v.tipoManifestoDescricao && (
                                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                                                        {v.tipoManifestoDescricao}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 mt-0.5">{v.data}</p>
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {renderBadgeStatusManifesto(v.statusDescricao)}
                                                        </td>

                                                        {/* Parceiro / Placa */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="font-bold text-slate-800">{v.parceiro}</p>
                                                            <p className="text-[10px] text-gray-500 font-mono">{v.placa}</p>
                                                        </td>

                                                        {/* Trecho */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="font-semibold text-slate-800">{v.origem} ➔ {v.destino}</p>
                                                            <p className="text-[10px] text-gray-400 truncate max-w-[150px]" title={v.fornecedorRazao}>{v.fornecedorRazao}</p>
                                                        </td>

                                                        {/* Tipo */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${v.tipoVeiculo === "CAVALO MECANICO" ? "bg-purple-50 text-purple-700" : (v.tipoVeiculo === "VUC / 3/4" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700")}`}>
                                                                {v.tipoVeiculo === "CAVALO MECANICO" ? "Cavalo" : (v.tipoVeiculo === "VUC / 3/4" ? "VUC / 3/4" : "Truck")}
                                                            </span>
                                                        </td>

                                                        {/* Peso Real */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="font-bold text-slate-800">{fmtNum(v.pesoCarregadoKg)} kg</p>
                                                            <p className="text-[10px] text-gray-400">Cap: {fmtNum(v.capacidadeKg)} kg ({v.ocupacaoPesoPct}%)</p>
                                                        </td>

                                                        {/* Volume Real (m3) */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="font-bold text-slate-800">{fmtNum(v.cuboCarregadoM3)} m³</p>
                                                            <p className="text-[10px] text-gray-400">Cap: {v.capacidadeM3} m³ ({v.ocupacaoCuboPct}%)</p>
                                                        </td>

                                                        {/* Pacotes / Caixas */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className="font-bold text-slate-700">{v.totalVolumes}</span>
                                                            <span className="text-[10px] text-gray-400 block">{v.totalMinutas} minuta(s)</span>
                                                        </td>

                                                        {/* Ocupação */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="space-y-1">
                                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black border ${corOcup}`}>
                                                                    {v.ocupacaoGeralPct}% geral
                                                                </span>
                                                                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div className={`h-1.5 rounded-full ${v.ocupacaoGeralPct >= 75 ? "bg-emerald-500" : v.ocupacaoGeralPct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(100, v.ocupacaoGeralPct)}%` }} />
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Gargalo */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${v.gargalo === "PESO" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                                                                {v.gargalo === "PESO" ? "⚖️ Peso" : "📦 Volume"}
                                                            </span>
                                                        </td>

                                                        {/* Custo */}
                                                        <td className="px-4 py-3 whitespace-nowrap text-slate-700 font-medium">
                                                            {fmtMoeda(v.custoViagem)}
                                                        </td>

                                                        {/* Receita Líquida */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className="font-bold text-emerald-700">{fmtMoeda(v.receitaLiquidaRateada)}</p>
                                                            <p className="text-[10px] text-gray-400">Bruto: {fmtMoeda(v.receitaRateada)}</p>
                                                        </td>

                                                        {/* Lucro Real Líquido */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <p className={corMargem}>{v.margemFinanceira >= 0 ? "+" : ""}{fmtMoeda(v.margemFinanceira)}</p>
                                                            <p className="text-[10px] text-gray-400">{v.margemPercentual}% margem</p>
                                                        </td>

                                                        {/* Ação */}
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <button
                                                                onClick={() => {
                                                                    setManifestoModalId(v.idManifesto);
                                                                    setManifestoSelecionado(v);
                                                                }}
                                                                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all active:scale-95"
                                                            >
                                                                🔍 Minutas ({v.totalMinutas})
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </main>

            {/* ── Modal de Detalhes das Minutas (Resultado da Operação Brudam) ── */}
            {manifestoModalId && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-6xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        📊 Resultado da Operação & Minutas — Manifesto #{manifestoModalId}
                                    </h3>
                                    {manifestoSelecionado && renderBadgeStatusManifesto(manifestoSelecionado.statusDescricao)}
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        Padrão Brudam
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {manifestoSelecionado ? `${manifestoSelecionado.parceiro} • ${manifestoSelecionado.placa} • ${manifestoSelecionado.origem} ➔ ${manifestoSelecionado.destino} • ` : ""}DRE detalhado das cargas: Frete Total, Coleta, Entrega, Transferência rateada, Seguro e Lucro Líquido
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setManifestoModalId(null);
                                    setManifestoSelecionado(null);
                                }}
                                className="h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Conteúdo Modal */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {isLoadingMinutas ? (
                                <div className="py-12 flex justify-center">
                                    <TruckLoader tamanho="md" mensagem="Carregando minutas e calculando DRE operacional..." />
                                </div>
                            ) : minutasManifesto && minutasManifesto.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Resumo Gerencial do Manifesto */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Receita Líquida (Viagem)</p>
                                            <p className="text-base font-black text-blue-900 mt-0.5">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + (m.receitaLiquida || 0), 0))}</p>
                                            <p className="text-[10px] text-blue-600 mt-0.5">
                                                Bruto: {fmtMoeda(minutasManifesto.reduce((acc, m) => acc + (m.freteRateado || 0), 0))}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Custo Desta Viagem</p>
                                            <p className="text-base font-black text-slate-800 mt-0.5">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + (m.custoTransf || 0), 0))}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">Motorista / parceiro rateado</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Lucro Líquido Desta Viagem</p>
                                            <p className={`text-base font-black mt-0.5 ${minutasManifesto.reduce((acc, m) => acc + (m.resultadoLucro || 0), 0) >= 0 ? "text-emerald-800" : "text-rose-700"}`}>
                                                {fmtMoeda(minutasManifesto.reduce((acc, m) => acc + (m.resultadoLucro || 0), 0))}
                                            </p>
                                            <p className="text-[10px] text-emerald-600 mt-0.5">Resultado isolado desta perna</p>
                                        </div>
                                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Lucro Global Minutas (Brudam)</p>
                                            <p className="text-base font-black text-amber-900 mt-0.5">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + (m.lucroGlobalMinuta || 0), 0))}</p>
                                            <p className="text-[10px] text-amber-700 mt-0.5">Resultado completo das cargas</p>
                                        </div>
                                    </div>

                                    <div className="overflow-auto max-h-[52vh] border border-slate-200 rounded-xl">
                                        <table className="min-w-full divide-y divide-slate-100 text-xs border-separate border-spacing-0">
                                            <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase sticky top-0 z-20 shadow-sm">
                                                <tr>
                                                    <th className="px-2.5 py-2.5 text-left bg-slate-50 border-b border-slate-200 sticky left-0 z-30 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Minuta / CTE</th>
                                                    <th className="px-2.5 py-2.5 text-left bg-slate-50 border-b border-slate-200">Origem ➔ Destino</th>
                                                    <th className="px-2 py-2.5 text-right bg-slate-50 border-b border-slate-200">Pacotes</th>
                                                    <th className="px-2 py-2.5 text-right bg-slate-50 border-b border-slate-200">Peso Taxado</th>
                                                    <th className="px-2.5 py-2.5 text-right font-semibold text-slate-600 bg-slate-50 border-b border-slate-200">Frete Total (CTE)</th>
                                                    <th className="px-2.5 py-2.5 text-right font-bold text-blue-700 bg-blue-50/70 border-b border-slate-200">Receita Rateada (Viagem)</th>
                                                    <th className="px-2 py-2.5 text-right text-slate-700 font-semibold bg-slate-50 border-b border-slate-200">Transf. (Viagem)</th>
                                                    <th className="px-2 py-2.5 text-right text-slate-500 bg-slate-50 border-b border-slate-200">Pontas & Seguro</th>
                                                    <th className="px-2 py-2.5 text-right text-slate-500 bg-slate-50 border-b border-slate-200">Imposto</th>
                                                    <th className="px-2.5 py-2.5 text-right font-black text-slate-900 bg-slate-50 border-b border-slate-200">Resultado da Viagem</th>
                                                    <th className="px-2.5 py-2.5 text-right font-bold text-amber-800 bg-amber-50/50 border-b border-slate-200">Lucro Global (Brudam)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {minutasManifesto.map((m) => {
                                                    const corRes = m.resultadoLucro >= 0 ? "text-emerald-700 font-bold" : "text-red-600 font-bold";

                                                    return (
                                                        <tr key={m.idMinuta} className="group hover:bg-slate-50/80 transition-colors">
                                                            <td className="px-2.5 py-2 whitespace-nowrap font-bold text-blue-600 sticky left-0 z-10 bg-white group-hover:bg-slate-50 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] transition-colors">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span>#{m.idMinuta}</span>
                                                                    {m.totalManifestos > 1 && (
                                                                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded-full" title={`Carga multitrecho: transportada em ${m.totalManifestos} manifestos`}>
                                                                            {m.totalManifestos} trechos
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {m.cteNumero && <span className="block text-[10px] text-gray-400 font-normal">CTE: {m.cteNumero}</span>}
                                                            </td>
                                                            <td className="px-2.5 py-2 whitespace-nowrap text-slate-700">{m.origem} ➔ {m.destino}</td>
                                                            <td className="px-2 py-2 whitespace-nowrap text-right text-slate-800">{m.volumes}</td>
                                                            <td className="px-2 py-2 whitespace-nowrap text-right text-slate-700 font-medium">{fmtNum(m.pesoTaxadoKg)} kg</td>
                                                            <td className="px-2.5 py-2 whitespace-nowrap text-right font-semibold text-slate-700">
                                                                {fmtMoeda(m.freteTotal)}
                                                            </td>
                                                            <td className="px-2.5 py-2 whitespace-nowrap text-right font-bold text-blue-700 bg-blue-50/30">
                                                                {fmtMoeda(m.freteRateado)}
                                                                {m.totalManifestos > 1 && (
                                                                    <span className="block text-[9px] text-blue-500 font-normal">
                                                                        {((m.freteRateado / Math.max(m.freteTotal, 1)) * 100).toFixed(1)}% do total
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-2 py-2 whitespace-nowrap text-right text-slate-700 font-medium">{fmtMoeda(m.custoTransf)}</td>
                                                            <td className="px-2 py-2 whitespace-nowrap text-right text-slate-500">{fmtMoeda(m.seguro + m.coletaCusto + m.entregaCusto)}</td>
                                                            <td className="px-2 py-2 whitespace-nowrap text-right text-slate-500">{fmtMoeda(m.imposto)}</td>
                                                            <td className={`px-2.5 py-2 whitespace-nowrap text-right ${corRes}`}>
                                                                {m.resultadoLucro >= 0 ? "+" : ""}{fmtMoeda(m.resultadoLucro)}
                                                            </td>
                                                            <td className="px-2.5 py-2 whitespace-nowrap text-right bg-amber-50/20">
                                                                <span className={`font-bold ${m.lucroGlobalMinuta >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                                                                    {fmtMoeda(m.lucroGlobalMinuta)}
                                                                </span>
                                                                <span className="block text-[9px] text-slate-400 font-normal">
                                                                    {m.margemGlobalMinutaPct.toFixed(1)}% margem
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot className="bg-slate-50 font-bold text-slate-800 sticky bottom-0 z-20 shadow-[0_-2px_6px_rgba(0,0,0,0.05)]">
                                                <tr>
                                                    <td colSpan={2} className="px-2.5 py-2.5 text-left bg-slate-50 border-t border-r border-slate-200 sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">Total Manifesto ({minutasManifesto.length} minutas)</td>
                                                    <td className="px-2 py-2.5 text-right bg-slate-50 border-t border-slate-200">{minutasManifesto.reduce((acc, m) => acc + m.volumes, 0)}</td>
                                                    <td className="px-2 py-2.5 text-right bg-slate-50 border-t border-slate-200">{fmtNum(minutasManifesto.reduce((acc, m) => acc + m.pesoTaxadoKg, 0))} kg</td>
                                                    <td className="px-2.5 py-2.5 text-right text-slate-700 bg-slate-50 border-t border-slate-200">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.freteTotal, 0))}</td>
                                                    <td className="px-2.5 py-2.5 text-right text-blue-700 bg-blue-50/70 border-t border-slate-200">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.freteRateado, 0))}</td>
                                                    <td className="px-2 py-2.5 text-right text-slate-800 bg-slate-50 border-t border-slate-200">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.custoTransf, 0))}</td>
                                                    <td className="px-2 py-2.5 text-right text-slate-500 bg-slate-50 border-t border-slate-200">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.seguro + m.coletaCusto + m.entregaCusto, 0))}</td>
                                                    <td className="px-2 py-2.5 text-right text-slate-500 bg-slate-50 border-t border-slate-200">{fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.imposto, 0))}</td>
                                                    <td className="px-2.5 py-2.5 text-right text-emerald-700 text-sm bg-slate-50 border-t border-slate-200">
                                                        {fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.resultadoLucro, 0))}
                                                    </td>
                                                    <td className="px-2.5 py-2.5 text-right text-amber-800 text-sm bg-amber-50/50 border-t border-slate-200">
                                                        {fmtMoeda(minutasManifesto.reduce((acc, m) => acc + m.lucroGlobalMinuta, 0))}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-slate-400 py-8">Nenhuma minuta encontrada para este manifesto.</p>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">
                                ℹ️ Cargas multitrecho têm receita e impostos rateados proporcionalmente entre suas transferências, garantindo que o lucro somado das viagens coincida exatamente com o Lucro da Operação do ERP Brudam.
                            </span>
                            <button
                                onClick={() => setManifestoModalId(null)}
                                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Indicador de refetch */}
            {isFetching && !isLoading && (
                <div className="fixed bottom-4 right-4 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-xs text-slate-600 z-50">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                    Atualizando dados...
                </div>
            )}
        </div>
    );
}