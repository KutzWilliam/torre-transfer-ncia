"use client";

import { useState, useMemo, useEffect } from "react";
import { api } from "@/trpc/react";
import { TruckLoader } from "@/components/TruckLoader";
import { formatarMinutosHoras } from "@/utils/formatters";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

type ModalFiltroState = {
  tipo: "ROTA" | "MATRIZ";
  titulo: string;
  subtitulo: string;
  rota?: string;
  diaSemana?: number;
  horaInicio?: number;
  horaFim?: number;
} | null;

export default function AnaliseOrigemPage() {
  const [dias, setDias] = useState<number>(30);
  const [tipoEvento, setTipoEvento] = useState<"TODOS" | "SAIDA" | "CHEGADA">("TODOS");
  const [baseOrigem, setBaseOrigem] = useState<string>("TODAS");

  // Estado para o Modal de detalhamento
  const [modalFiltro, setModalFiltro] = useState<ModalFiltroState>(null);
  const [buscaModal, setBuscaModal] = useState<string>("");

  const queryParams = {
    dias,
    tipoEvento,
    baseOrigemNome: baseOrigem !== "TODAS" ? baseOrigem : undefined,
  };

  const { data: analitico, isLoading: loadAnalitico } = api.viagem.getAnaliticoAtrasos.useQuery(queryParams);

  const { data: tendencia, isLoading: loadTendencia } = api.viagem.getHistoricoTendencia.useQuery(queryParams);

  const { data: horarios, isLoading: loadHorarios } = api.viagem.getAnaliseHorarios.useQuery(queryParams);

  // Query sob demanda para o Modal
  const { data: viagensModal, isLoading: loadModal } = api.viagem.getViagensModalAnalise.useQuery(
    {
      dias,
      tipoEvento,
      baseOrigemNome: baseOrigem !== "TODAS" ? baseOrigem : undefined,
      rota: modalFiltro?.rota,
      diaSemana: modalFiltro?.diaSemana,
      horaInicio: modalFiltro?.horaInicio,
      horaFim: modalFiltro?.horaFim,
    },
    {
      enabled: !!modalFiltro,
    }
  );

  const isLoading = loadAnalitico || loadTendencia || loadHorarios;

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModalFiltro(null);
        setBuscaModal("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtragem de busca interna do modal
  const viagensModalFiltradas = useMemo(() => {
    if (!viagensModal) return [];
    if (!buscaModal.trim()) return viagensModal;
    const q = buscaModal.toLowerCase().trim();
    return viagensModal.filter(
      (v) =>
        v.id.toLowerCase().includes(q) ||
        v.motorista.toLowerCase().includes(q) ||
        v.placa.toLowerCase().includes(q) ||
        v.rotaDescricao.toLowerCase().includes(q)
    );
  }, [viagensModal, buscaModal]);

  // Geração de Insights e Recomendações Automáticas
  const insights = useMemo(() => {
    if (!analitico || analitico.totalViagens === 0) return null;

    const list: Array<{ tipo: "critico" | "alerta" | "positivo" | "acao"; titulo: string; desc: string; icone: string }> = [];

    // 1. Pior Rota
    if (analitico.pioresRotas.length > 0) {
      const pior = analitico.pioresRotas[0]!;
      list.push({
        tipo: pior.atrasoMedio > 15 ? "critico" : "alerta",
        icone: "🚨",
        titulo: `Corredor Crítico: ${pior.rota}`,
        desc: `Esta linha registra atraso médio de ${formatarMinutosHoras(pior.atrasoMedio)} e ${pior.taxaPontualidade}% de pontualidade (${pior.atrasadas} de ${pior.total} viagens com atraso).`,
      });
    }

    // 2. Análise de Saídas vs Chegadas
    const saidas = analitico.porTipoEvento?.saidas;
    const chegadas = analitico.porTipoEvento?.chegadas;
    if (saidas && chegadas && saidas.total > 0 && chegadas.total > 0) {
      if (saidas.taxaPontualidade < chegadas.taxaPontualidade && saidas.atrasoMedio > 5) {
        list.push({
          tipo: "alerta",
          icone: "🏢",
          titulo: "Gargalo na Liberação / Garagens (Saídas)",
          desc: `As partidas registram menor pontualidade (${saidas.taxaPontualidade}%) que as chegadas finais (${chegadas.taxaPontualidade}%). O atraso médio na largada é de ${formatarMinutosHoras(saidas.atrasoMedio)}. Recomenda-se auditar o check-list e preparação de veículos na origem.`,
        });
      } else if (chegadas.atrasoMedio > saidas.atrasoMedio + 5) {
        list.push({
          tipo: "alerta",
          icone: "🛣️",
          titulo: "Atraso Acumulado em Percurso",
          desc: `As viagens perdem em média ${formatarMinutosHoras(chegadas.atrasoMedio - saidas.atrasoMedio, { showSign: true })} durante o trajeto entre unidades e paradas intermediárias. Pode indicar tempos de percurso subdimensionados para as condições de rodovia.`,
        });
      }
    }

    // 3. Pico de Horário
    if (horarios?.porHora && horarios.porHora.length > 0) {
      const pioresHoras = [...horarios.porHora]
        .filter((h) => h.total >= 3)
        .sort((a, b) => b.atrasoMedio - a.atrasoMedio);

      if (pioresHoras.length > 0 && pioresHoras[0]!.atrasoMedio > 10) {
        const piorH = pioresHoras[0]!;
        list.push({
          tipo: "alerta",
          icone: "⏰",
          titulo: `Janela Horária Mais Afetada: ${piorH.label}`,
          desc: `Viagens programadas para as ${piorH.label} apresentam a menor taxa de pontualidade (${piorH.taxaPontualidade}%) e atraso médio de ${formatarMinutosHoras(piorH.atrasoMedio)}.`,
        });
      }
    }

    // 4. Recomendação Executiva
    if (analitico.taxaPontualidade >= 85) {
      list.push({
        tipo: "positivo",
        icone: "✅",
        titulo: "Operação Dentro da Meta de Pontualidade",
        desc: `A taxa de pontualidade geral está em ${analitico.taxaPontualidade}%, acima do benchmark de 85%. Manter monitoramento contínuo nas linhas de maior frequência.`,
      });
    } else {
      list.push({
        tipo: "acao",
        icone: "💡",
        titulo: "Plano de Ação Sugerido",
        desc: `Priorizar intervenção preventiva nos 3 principais corredores com maior volume de minutos perdidos (${analitico.pioresRotas.slice(0, 3).map((r) => r.rota).join(", ")}).`,
      });
    }

    return list;
  }, [analitico, horarios]);

  const semDados = !analitico || analitico.totalViagens === 0;

  const fmtDataHora = (d: Date | string | null | undefined) => {
    if (!d) return "—";
    return format(new Date(d), "dd/MM HH:mm", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1700px] mx-auto flex flex-col gap-6">

        {/* ─── CABEÇALHO ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/analise"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold shadow-sm transition-all"
                title="Voltar para a Central de Análises"
              >
                ← Módulos
              </Link>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 m-0">
                📊 Diagnóstico Analítico de Atrasos
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[11px] text-blue-700 font-bold tracking-wide">
                DATA ANALYST VIEW
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 mb-0">
              Análise aprofundada de gargalos operacionais: <strong>O Quê</strong>, <strong>Onde</strong>, <strong>Quando</strong> e <strong>Como Solucionar</strong>
            </p>
          </div>
        </div>

        {/* ─── BARRA DE FILTROS (LARGURA MÁXIMA DA TELA) ───────────────────────── */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          {/* Filtro de Base de Origem */}
          <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-md">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-shrink-0">
              Origem:
            </span>
            <select
              value={baseOrigem}
              onChange={(e) => setBaseOrigem(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer shadow-inner transition-all"
            >
              <option value="TODAS">Todas as Bases de Origem</option>
              {analitico?.basesDisponiveis?.map((b) => (
                <option key={b.nome} value={b.nome}>
                  {b.cidade ? `${b.cidade} (${b.nome})` : b.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Evento (Segmented Controls) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              Evento:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              <button
                onClick={() => setTipoEvento("TODOS")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  tipoEvento === "TODOS"
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos os Eventos
              </button>
              <button
                onClick={() => setTipoEvento("SAIDA")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  tipoEvento === "SAIDA"
                    ? "bg-white text-purple-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🛫 Saídas / Garagem
              </button>
              <button
                onClick={() => setTipoEvento("CHEGADA")}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  tipoEvento === "CHEGADA"
                    ? "bg-white text-emerald-700 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🏁 Chegadas / Destino
              </button>
            </div>
          </div>

          {/* Período */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">
              Período:
            </span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
              {[
                { val: 7, label: "7D" },
                { val: 15, label: "15D" },
                { val: 30, label: "30D" },
                { val: 60, label: "60D" },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setDias(p.val)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                    dias === p.val
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── CONTEÚDO PRINCIPAL ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-16 text-center">
            <TruckLoader mensagem="Processando dados históricos e calculando métricas analíticas..." tamanho="md" />
          </div>
        ) : semDados ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="text-5xl mb-3">📊</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Nenhum registro de atraso acumulado ainda no período ({dias} dias)
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto mb-6">
              Os dados consolidados de pontualidade, rotas críticas e padrões horários serão exibidos assim que viagens com horários efetivos forem registradas no sistema.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-6 rounded-xl font-semibold text-xs transition-colors shadow-sm"
            >
              Ir para o Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SEÇÃO 1: O QUÊ? (DIAGNÓSTICO EXECUTIVO GLOBAL)                */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  1. O Quê? — Panorama Geral de Pontualidade
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Taxa de Pontualidade */}
                <div
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 border-t-4 transition-transform hover:-translate-y-0.5"
                  style={{
                    borderTopColor:
                      analitico.taxaPontualidade >= 85
                        ? "#10b981"
                        : analitico.taxaPontualidade >= 70
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">TAXA DE PONTUALIDADE</div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        analitico.taxaPontualidade >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {analitico.taxaPontualidade >= 85 ? "🟢 Dentro da Meta" : "🟠 Abaixo da Meta"}
                    </span>
                  </div>
                  <div
                    className="text-4xl font-extrabold mt-2 tabular-nums"
                    style={{
                      color:
                        analitico.taxaPontualidade >= 85
                          ? "#059669"
                          : analitico.taxaPontualidade >= 70
                          ? "#d97706"
                          : "#dc2626",
                    }}
                  >
                    {analitico.taxaPontualidade}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {analitico.totalPontuais} de {analitico.totalViagens} viagens no prazo (≤5min)
                  </div>
                </div>

                {/* Card 2: Atraso Médio Geral */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 border-t-4 border-t-amber-500 transition-transform hover:-translate-y-0.5">
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">ATRASO MÉDIO GERAL</div>
                  <div className="text-4xl font-extrabold text-amber-600 mt-2 tabular-nums">
                    {formatarMinutosHoras(analitico.atrasoMedioGeral)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Média de todas as {analitico.totalViagens} viagens registradas
                  </div>
                </div>

                {/* Card 3: Severidade do Atraso */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 border-t-4 border-t-red-500 transition-transform hover:-translate-y-0.5">
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">SEVERIDADE DO ATRASO</div>
                  <div className="text-4xl font-extrabold text-red-600 mt-2 tabular-nums">
                    {formatarMinutosHoras(analitico.atrasoMedioAtrasados)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Média restrita às {analitico.totalAtrasadas} viagens com atraso (&gt;5min)
                  </div>
                </div>

                {/* Card 4: Pior Caso */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 border-t-4 border-t-purple-500 transition-transform hover:-translate-y-0.5">
                  <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">MAIOR ATRASO REGISTRADO</div>
                  <div className="text-4xl font-extrabold text-purple-600 mt-2 tabular-nums">
                    {formatarMinutosHoras(analitico.maiorAtraso)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Pico máximo de desvio no período
                  </div>
                </div>
              </div>

              {/* Distribuição por Faixa de Atraso */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                <div className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                  Distribuição das Viagens por Nível de Severidade
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {analitico.distribuicao.map((f) => (
                    <div
                      key={f.faixa}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/70 border-l-4"
                      style={{ borderLeftColor: f.cor }}
                    >
                      <div className="text-xs text-slate-600 font-bold">{f.label}</div>
                      <div className="flex justify-between items-baseline mt-1.5">
                        <span className="text-2xl font-extrabold" style={{ color: f.cor }}>
                          {f.count}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">{f.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SEÇÃO 2: ONDE? (GARGALOS POR CORREDOR E ROTA)                 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  2. Onde? — Análise de Gargalos por Linha e Rota
                </span>
                <span className="text-[11px] text-slate-400">
                  💡 Dica: clique em uma rota da tabela para ver as viagens
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
                {/* Gráfico de Piores Rotas */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-sm font-bold text-slate-900">
                      Top 10 Linhas com Maior Atraso Médio
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Classificado por severidade</span>
                  </div>
                  <div className="h-[340px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analitico.pioresRotas.slice(0, 10)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis
                          dataKey="rota"
                          type="category"
                          width={140}
                          tick={{ fill: "#334155", fontSize: 11, fontWeight: 500 }}
                          tickFormatter={(v) => (v.length > 20 ? `${v.substring(0, 20)}...` : v)}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.03)" }}
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                            fontSize: "12px",
                            color: "#1e293b",
                          }}
                          formatter={(val: any, name: any) => [
                            formatarMinutosHoras(Number(val)),
                            name === "atrasoMedio" ? "Atraso Médio" : "Pior Atraso",
                          ]}
                        />
                        <Bar
                          dataKey="atrasoMedio"
                          fill="#ef4444"
                          radius={[0, 4, 4, 0]}
                          className="cursor-pointer"
                          onClick={(entry: any) => {
                            if (!entry?.rota) return;
                            setModalFiltro({
                              tipo: "ROTA",
                              titulo: `Rota: ${entry.rota}`,
                              subtitulo: `Detalhamento das viagens registradas no período selecionado`,
                              rota: entry.rota,
                            });
                          }}
                        >
                          {analitico.pioresRotas.slice(0, 10).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.atrasoMedio > 20 ? "#ef4444" : entry.atrasoMedio > 10 ? "#f59e0b" : "#3b82f6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tabela de Detalhamento das Piores Rotas */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col">
                  <div className="flex justify-between items-center mb-3.5">
                    <h3 className="m-0 text-sm font-bold text-slate-900">
                      Tabela Detalhada de Desempenho por Rota
                    </h3>
                    <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-100">
                      Clique para abrir viagens
                    </span>
                  </div>
                  <div className="overflow-y-auto max-h-[330px] rounded-lg border border-slate-100">
                    <table className="min-w-full divide-y divide-slate-100 text-xs">
                      <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3.5 py-2.5 text-left font-bold text-slate-600 uppercase tracking-wider">ROTA</th>
                          <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">VIAGENS</th>
                          <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">PONTUALIDADE</th>
                          <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">MÉDIA</th>
                          <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">PIOR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {analitico.pioresRotas.map((r) => (
                          <tr
                            key={r.rota}
                            onClick={() =>
                              setModalFiltro({
                                tipo: "ROTA",
                                titulo: `Rota: ${r.rota}`,
                                subtitulo: `${r.total} viagem${r.total !== 1 ? "s" : ""} • Pontualidade: ${r.taxaPontualidade}% • Atraso Médio: ${formatarMinutosHoras(r.atrasoMedio)}`,
                                rota: r.rota,
                              })
                            }
                            className="hover:bg-blue-50/70 cursor-pointer transition-colors group"
                            title="Clique para ver a lista de viagens desta rota"
                          >
                            <td className="px-3.5 py-2.5 font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                              <div className="flex items-center gap-1.5">
                                <span className="underline decoration-slate-300 group-hover:decoration-blue-500">{r.rota}</span>
                                <span className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">🔍</span>
                              </div>
                            </td>
                            <td className="px-3.5 py-2.5 text-center text-slate-500 font-medium">{r.total}</td>
                            <td className="px-3.5 py-2.5 text-center">
                              <span
                                className={`font-bold ${
                                  r.taxaPontualidade >= 85
                                    ? "text-emerald-600"
                                    : r.taxaPontualidade >= 70
                                    ? "text-amber-600"
                                    : "text-red-600"
                                }`}
                              >
                                {r.taxaPontualidade}%
                              </span>
                            </td>
                            <td className={`px-3.5 py-2.5 text-center font-bold ${r.atrasoMedio > 15 ? "text-red-600" : "text-amber-600"}`}>
                              {formatarMinutosHoras(r.atrasoMedio, { showSign: true })}
                            </td>
                            <td className="px-3.5 py-2.5 text-center text-red-500 font-bold">
                              {formatarMinutosHoras(r.piorAtraso, { showSign: true })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SEÇÃO 3: QUANDO? (PADRÕES TEMPORAIS E HORÁRIOS)               */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  3. Quando? — Tendência Histórica e Padrões Horários
                </span>
                <span className="text-[11px] text-slate-400">
                  💡 Dica: clique em uma célula da matriz para ver as viagens do turno
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Gráfico 1: Evolução Diária da Pontualidade e Atraso */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-sm font-bold text-slate-900">
                      Evolução Diária da Pontualidade (%) e Atraso Médio
                    </h3>
                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tendencia || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} domain={[0, 100]} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                            fontSize: "12px",
                            color: "#1e293b",
                          }}
                          formatter={(val: any, name: any) => [
                            name?.toString().includes("Atraso") ? formatarMinutosHoras(Number(val)) : `${val}%`,
                            name,
                          ]}
                        />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="taxaPontualidade"
                          name="Pontualidade (%)"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ fill: "#10b981", r: 3 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="atrasoMedio"
                          name="Atraso Médio"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          dot={{ fill: "#f59e0b", r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gráfico 2: Padrão por Hora do Dia */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="m-0 text-sm font-bold text-slate-900">
                      Atraso Médio por Faixa de Horário (00h - 23h)
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Identificação de picos de tráfego</span>
                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={horarios?.porHora || []} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} interval={2} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                            fontSize: "12px",
                            color: "#1e293b",
                          }}
                          formatter={(val: any) => [formatarMinutosHoras(Number(val)), "Atraso Médio"]}
                        />
                        <Bar dataKey="atrasoMedio" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                          {horarios?.porHora?.map((entry, index) => (
                            <Cell
                              key={`hora-cell-${index}`}
                              fill={entry.atrasoMedio > 15 ? "#ef4444" : entry.atrasoMedio > 8 ? "#f59e0b" : "#3b82f6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Matriz de Calor: Turno x Dia da Semana */}
              {horarios?.matrizCalor && horarios.matrizCalor.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Matriz de Concentração de Atrasos: Dia da Semana x Turno
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-100">
                      Clique em um bloco para abrir viagens
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_repeat(7,1fr)] gap-2 overflow-x-auto min-w-[650px]">
                    {/* Cabeçalho dias da semana */}
                    <div className="font-bold text-slate-500 text-xs p-2">TURNO</div>
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
                      <div key={d} className="font-bold text-slate-600 text-xs text-center p-2 bg-slate-50 rounded-lg">
                        {d}
                      </div>
                    ))}

                    {/* Linhas por turno */}
                    {horarios.matrizCalor.map((linha: any) => (
                      <div key={`linha-${linha.faixa}`} className="contents">
                        <div className="font-bold text-slate-700 text-xs flex items-center p-2">
                          {linha.faixa}
                        </div>
                        {linha.dias.map((cel: any, idx: number) => {
                          const bg =
                            cel.total === 0
                              ? "bg-slate-50 border-slate-200/60 text-slate-400 cursor-default opacity-60"
                              : cel.atrasoMedio > 20
                              ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:ring-2 hover:ring-red-400"
                              : cel.atrasoMedio > 10
                              ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:ring-2 hover:ring-amber-400"
                              : cel.atrasoMedio > 5
                              ? "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 hover:ring-2 hover:ring-blue-400"
                              : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:ring-2 hover:ring-emerald-400";

                          return (
                            <div
                              key={`cel-${linha.faixa}-${idx}`}
                              onClick={() => {
                                if (cel.total === 0) return;
                                setModalFiltro({
                                  tipo: "MATRIZ",
                                  titulo: `Viagens: ${cel.diaNome} (${linha.faixa})`,
                                  subtitulo: `${cel.total} viagem${cel.total !== 1 ? "s" : ""} • Atraso Médio: ${formatarMinutosHoras(cel.atrasoMedio)} • Pontualidade: ${cel.taxaPontualidade}%`,
                                  diaSemana: cel.diaSemana,
                                  horaInicio: linha.start,
                                  horaFim: linha.end,
                                });
                              }}
                              className={`border rounded-xl p-2.5 text-center transition-all ${bg} ${
                                cel.total > 0 ? "cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" : ""
                              }`}
                              title={
                                cel.total > 0
                                  ? `${cel.diaNome} (${linha.faixa}): ${cel.total} viagens, ${formatarMinutosHoras(cel.atrasoMedio)} atraso médio. Clique para detalhar.`
                                  : `${cel.diaNome} (${linha.faixa}): Nenhuma viagem registrada`
                              }
                            >
                              <div className="text-xs font-extrabold flex items-center justify-center gap-1">
                                <span>{cel.total > 0 ? formatarMinutosHoras(cel.atrasoMedio) : "—"}</span>
                              </div>
                              <div className="text-[10px] opacity-75 font-medium mt-0.5">
                                {cel.total > 0 ? `${cel.total} viag` : ""}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* SEÇÃO 4: COMO RESOLVER? (INSIGHTS & RECOMENDAÇÕES)            */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {insights && insights.length > 0 && (
              <div className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    4. Como Resolver? — Diagnósticos Inteligentes e Plano de Ação
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {insights.map((ins, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 border-l-4 transition-transform hover:-translate-y-0.5"
                      style={{
                        borderLeftColor:
                          ins.tipo === "critico"
                            ? "#ef4444"
                            : ins.tipo === "alerta"
                            ? "#f59e0b"
                            : ins.tipo === "positivo"
                            ? "#10b981"
                            : "#8b5cf6",
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="text-2xl">{ins.icone}</span>
                        <h4 className="m-0 text-xs font-bold text-slate-900 leading-tight">
                          {ins.titulo}
                        </h4>
                      </div>
                      <p className="m-0 text-xs text-slate-600 leading-relaxed">
                        {ins.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL DE DETALHAMENTO DE VIAGENS (POR ROTA OU POR MATRIZ)            */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {modalFiltro && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do Modal */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {modalFiltro.tipo === "ROTA" ? "📍" : "📅"}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                    {modalFiltro.titulo}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {modalFiltro.subtitulo}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Campo de Busca Rápida dentro do Modal */}
                <div className="relative hidden sm:block">
                  <input
                    type="text"
                    value={buscaModal}
                    onChange={(e) => setBuscaModal(e.target.value)}
                    placeholder="Filtrar motorista, placa, ID..."
                    className="text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 w-52 sm:w-64"
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    🔍
                  </span>
                </div>

                <button
                  onClick={() => {
                    setModalFiltro(null);
                    setBuscaModal("");
                  }}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  title="Fechar (Esc)"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Busca em tela mobile */}
            <div className="px-4 py-2 border-b border-slate-200 bg-white sm:hidden">
              <input
                type="text"
                value={buscaModal}
                onChange={(e) => setBuscaModal(e.target.value)}
                placeholder="Filtrar motorista, placa, ID..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Conteúdo / Tabela do Modal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {loadModal ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <TruckLoader mensagem="Carregando viagens..." tamanho="md" />
                </div>
              ) : viagensModalFiltradas.length === 0 ? (
                <div className="py-16 text-center text-slate-500">
                  <div className="text-4xl mb-2">🚛</div>
                  <p className="text-sm font-semibold text-slate-700">Nenhuma viagem encontrada.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {buscaModal ? "Tente remover os termos de busca." : "Não há registros para o período e critérios selecionados."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-3.5 py-2.5 text-left font-bold text-slate-600 uppercase tracking-wider">Viagem / Rota</th>
                        <th className="px-3.5 py-2.5 text-left font-bold text-slate-600 uppercase tracking-wider">Motorista / Placa</th>
                        <th className="px-3.5 py-2.5 text-left font-bold text-slate-600 uppercase tracking-wider">Saída (Prev. / Real)</th>
                        <th className="px-3.5 py-2.5 text-left font-bold text-slate-600 uppercase tracking-wider">Chegada (Prev. / Real)</th>
                        <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">Atraso</th>
                        <th className="px-3.5 py-2.5 text-center font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-3.5 py-2.5 text-right font-bold text-slate-600 uppercase tracking-wider">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {viagensModalFiltradas.map((v) => {
                        const pontual = v.delta <= 5;
                        const grave = v.delta > 30;
                        const leve = v.delta > 5 && v.delta <= 30;

                        return (
                          <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Viagem / Rota */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="font-extrabold text-slate-900">#{v.id}</div>
                              <div className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]" title={v.rotaDescricao}>
                                {v.rotaDescricao}
                              </div>
                            </td>

                            {/* Motorista / Placa */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="font-semibold text-slate-800">{v.motorista || "Não informado"}</div>
                              <div className="text-[11px] text-slate-500 font-mono font-medium">{v.placa}</div>
                            </td>

                            {/* Saída Prevista vs Real */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="text-slate-600">
                                <span className="font-medium text-slate-400">Prev:</span> {fmtDataHora(v.prevInicioReal)}
                              </div>
                              <div className="text-slate-900 font-semibold mt-0.5">
                                <span className="font-medium text-slate-400">Real:</span> {fmtDataHora(v.dataInicioEfetivo)}
                              </div>
                              {v.deltaSaida !== null && (
                                <div className={`text-[10px] font-bold mt-0.5 ${v.deltaSaida > 5 ? "text-red-600" : "text-emerald-600"}`}>
                                  {v.deltaSaida > 0 ? `+${formatarMinutosHoras(v.deltaSaida)}` : formatarMinutosHoras(v.deltaSaida)}
                                </div>
                              )}
                            </td>

                            {/* Chegada Prevista vs Real */}
                            <td className="px-3.5 py-3 whitespace-nowrap">
                              <div className="text-slate-600">
                                <span className="font-medium text-slate-400">Prev:</span> {fmtDataHora(v.prevFimReal)}
                              </div>
                              <div className="text-slate-900 font-semibold mt-0.5">
                                <span className="font-medium text-slate-400">Real:</span> {fmtDataHora(v.dataFimEfetivo)}
                              </div>
                              {v.deltaChegada !== null && (
                                <div className={`text-[10px] font-bold mt-0.5 ${v.deltaChegada > 5 ? "text-red-600" : "text-emerald-600"}`}>
                                  {v.deltaChegada > 0 ? `+${formatarMinutosHoras(v.deltaChegada)}` : formatarMinutosHoras(v.deltaChegada)}
                                </div>
                              )}
                            </td>

                            {/* Atraso Geral */}
                            <td className="px-3.5 py-3 whitespace-nowrap text-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  pontual
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : grave
                                    ? "bg-red-50 text-red-700 border border-red-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {v.delta <= 0
                                  ? "Pontual (Adiantado)"
                                  : v.delta <= 5
                                  ? "Pontual (≤5min)"
                                  : `+ ${formatarMinutosHoras(v.delta)}`}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-3.5 py-3 whitespace-nowrap text-center">
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                {v.status}
                              </span>
                            </td>

                            {/* Ação */}
                            <td className="px-3.5 py-3 whitespace-nowrap text-right">
                              <Link
                                href={`/viagens`}
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Visualizar →
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

            {/* Rodapé do Modal */}
            <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Exibindo <strong>{viagensModalFiltradas.length}</strong> de <strong>{viagensModal?.length ?? 0}</strong> viagens
              </span>
              <button
                onClick={() => {
                  setModalFiltro(null);
                  setBuscaModal("");
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
