"use client";

import { useState, useMemo, Fragment } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { keepPreviousData } from "@tanstack/react-query";
import { TruckLoader } from "@/components/TruckLoader";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type NivelAtraso = "PONTUAL" | "ATENCAO" | "ATRASADO" | "CRITICO";

type ViagemDetalhe = {
  id: string;
  motorista: string;
  placa: string;
  rotaDescricao: string;
  baseOrigem: string;
  baseDestino: string;
  dataReferencia: Date | string;
  dataEfetiva: Date | string | null;
  atrasoMin: number | null;
  nivel: NivelAtraso;
  status: string;
};

type Periodo = {
  chave: string;
  label: string;
  dataInicio: Date | string;
  dataFim: Date | string;
  total: number;
  pontual: number;
  atencao: number;
  atrasado: number;
  critico: number;
  viagens: ViagemDetalhe[];
};

// ─── Configurações por nível ───────────────────────────────────────────────────
const NIVEL: Record<NivelAtraso, { label: string; bg: string; text: string; bar: string; border: string; faixa: string }> = {
  PONTUAL:  { label: "Pontual",  bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500", border: "border-emerald-200", faixa: "< 10 min" },
  ATENCAO:  { label: "Atenção",  bg: "bg-amber-50",   text: "text-amber-700",   bar: "bg-amber-400",   border: "border-amber-200",   faixa: "10–29 min" },
  ATRASADO: { label: "Atrasado", bg: "bg-orange-50",  text: "text-orange-700",  bar: "bg-orange-500",  border: "border-orange-200",  faixa: "30–59 min" },
  CRITICO:  { label: "Crítico",  bg: "bg-red-50",     text: "text-red-700",     bar: "bg-red-500",     border: "border-red-200",     faixa: "≥ 60 min" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMin(min: number | null): string {
  if (min === null) return "—";
  if (min <= 0) return "No prazo";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `+${h}h${m > 0 ? m + "min" : ""}` : `+${m}min`;
}

function fmtDH(d: Date | string | null): string {
  if (!d) return "—";
  return format(new Date(d), "dd/MM HH:mm", { locale: ptBR });
}

// ─── Drill-down Modal ─────────────────────────────────────────────────────────
function DrillDown({
  periodo,
  nivel,
  rota,
  tipoAnalise,
  onClose,
}: {
  periodo: Periodo;
  nivel: NivelAtraso;
  rota?: string;
  tipoAnalise: "SAIDA" | "CHEGADA";
  onClose: () => void;
}) {
  const cfg = NIVEL[nivel];
  const viagens = periodo.viagens.filter((v) => v.nivel === nivel && (!rota || v.rotaDescricao === rota));
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState<"atraso" | "rota" | "data">("atraso");

  const filtradas = useMemo(() => {
    const q = busca.toLowerCase();
    return [...viagens]
      .filter(
        (v) =>
          !q ||
          v.motorista.toLowerCase().includes(q) ||
          v.placa.toLowerCase().includes(q) ||
          v.rotaDescricao.toLowerCase().includes(q) ||
          v.id.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (ordem === "atraso") return (b.atrasoMin ?? -Infinity) - (a.atrasoMin ?? -Infinity);
        if (ordem === "rota") return a.rotaDescricao.localeCompare(b.rotaDescricao);
        return new Date(a.dataReferencia).getTime() - new Date(b.dataReferencia).getTime();
      });
  }, [viagens, busca, ordem]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4 ${cfg.bg}`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                {cfg.label} · {cfg.faixa}
              </span>
              <span className="text-slate-500 text-xs">{periodo.label}{rota ? ` · ${rota}` : ""}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {viagens.length} viagem(ns) com atraso na {tipoAnalise === "SAIDA" ? "saída" : "chegada"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Filtros */}
        <div className="px-6 py-3 border-b border-slate-200 flex flex-wrap gap-3 items-center bg-slate-50">
          <input
            type="text"
            placeholder="Buscar motorista, placa, rota ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 min-w-[220px] text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Ordenar:</span>
            {(["atraso", "rota", "data"] as const).map((o) => (
              <button
                key={o}
                onClick={() => setOrdem(o)}
                className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                  ordem === o ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {{ atraso: "Maior Atraso", rota: "Rota A–Z", data: "Data" }[o]}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">{filtradas.length} resultado(s)</span>
        </div>

        {/* Tabela */}
        <div className="overflow-auto flex-1 bg-white">
          {filtradas.length === 0 ? (
            <div className="py-16 text-center text-slate-500">Nenhuma viagem encontrada</div>
          ) : (
             <table className="min-w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                <tr>
                  {["Viagem / Rota", "Motorista / Placa", "Origem → Destino", "Previsto", "Real", "Atraso", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtradas.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link href={`/viagens/${v.id}`} className="font-bold text-violet-600 hover:text-violet-700 hover:underline">
                        #{v.id}
                      </Link>
                      <p className="text-[10px] text-slate-500 mt-0.5 max-w-[160px] truncate" title={v.rotaDescricao}>
                        {v.rotaDescricao}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="font-medium text-slate-800">{v.motorista}</p>
                      <p className="text-xs text-slate-500 font-mono">{v.placa}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-xs">
                      {v.baseOrigem} → {v.baseDestino}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">{fmtDH(v.dataReferencia)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                      {v.dataEfetiva ? (
                        <span className="text-blue-600">{fmtDH(v.dataEfetiva)}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                        {fmtMin(v.atrasoMin)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        v.status === "FINALIZADA" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        v.status === "EM_ANDAMENTO" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                        v.status === "CANCELADA" ? "bg-slate-100 text-slate-600 border border-slate-200" :
                        "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tabela Dinâmica de Períodos ────────────────────────────────────────────────
function TabelaPeriodos({
  periodos,
  onDrillDown,
}: {
  periodos: Periodo[];
  onDrillDown: (periodo: Periodo, nivel: NivelAtraso, rota?: string) => void;
}) {
  const [expandido, setExpandido] = useState<Record<string, boolean>>({});

  const toggle = (chave: string) => {
    setExpandido((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 sticky top-[76px] z-20 shadow-sm">
          <tr>
            <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider w-10"></th>
              <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase text-[10px] tracking-wider">Período</th>
              <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase text-[10px] tracking-wider">Pontualidade</th>
              <th className="px-4 py-3 text-center font-bold text-emerald-600 uppercase text-[10px] tracking-wider">Pontual</th>
              <th className="px-4 py-3 text-center font-bold text-amber-500 uppercase text-[10px] tracking-wider">Atenção</th>
              <th className="px-4 py-3 text-center font-bold text-orange-500 uppercase text-[10px] tracking-wider">Atrasado</th>
              <th className="px-4 py-3 text-center font-bold text-red-600 uppercase text-[10px] tracking-wider">Crítico</th>
              <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase text-[10px] tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {periodos.map((periodo) => {
              const isExpanded = !!expandido[periodo.chave];
              const pctPontual = periodo.total > 0 ? Math.round((periodo.pontual / periodo.total) * 100) : 100;
              
              // Agrupar viagens do período por rota
              const rotasMap = new Map<string, { total: number; pontual: number; atencao: number; atrasado: number; critico: number }>();
              periodo.viagens.forEach(v => {
                const r = rotasMap.get(v.rotaDescricao) ?? { total: 0, pontual: 0, atencao: 0, atrasado: 0, critico: 0 };
                r.total++;
                if (v.nivel === "PONTUAL") r.pontual++;
                else if (v.nivel === "ATENCAO") r.atencao++;
                else if (v.nivel === "ATRASADO") r.atrasado++;
                else if (v.nivel === "CRITICO") r.critico++;
                rotasMap.set(v.rotaDescricao, r);
              });

              const rotasAgrupadas = Array.from(rotasMap.entries())
                .map(([rota, counts]) => ({ rota, ...counts }))
                .sort((a, b) => b.total - a.total); // Ordena por total de viagens

              return (
                <Fragment key={periodo.chave}>
                  <tr 
                    className={`transition-colors hover:bg-slate-50/80 ${isExpanded ? "bg-slate-50" : "bg-white"}`}
                  >
                    <td 
                      className="px-4 py-3 text-center text-slate-400 cursor-pointer hover:text-slate-700 font-mono font-bold text-lg"
                      onClick={() => toggle(periodo.chave)}
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-200">
                        {isExpanded ? "-" : "+"}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => toggle(periodo.chave)}
                    >
                      <p className="font-bold text-slate-900">{periodo.label}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {format(new Date(periodo.dataInicio), "dd/MM/yyyy", { locale: ptBR })} a {format(new Date(periodo.dataFim), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center font-extrabold text-lg">
                      <span className={`${pctPontual >= 80 ? "text-emerald-600" : pctPontual >= 60 ? "text-amber-500" : "text-red-500"}`}>
                        {pctPontual}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => periodo.pontual > 0 && onDrillDown(periodo, "PONTUAL")}
                        disabled={periodo.pontual === 0}
                        className={`w-12 h-8 rounded-lg font-bold text-sm mx-auto flex items-center justify-center transition-all ${periodo.pontual > 0 ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-sm" : "text-slate-300 cursor-not-allowed"}`}
                      >
                        {periodo.pontual}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => periodo.atencao > 0 && onDrillDown(periodo, "ATENCAO")}
                        disabled={periodo.atencao === 0}
                        className={`w-12 h-8 rounded-lg font-bold text-sm mx-auto flex items-center justify-center transition-all ${periodo.atencao > 0 ? "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:shadow-sm" : "text-slate-300 cursor-not-allowed"}`}
                      >
                        {periodo.atencao}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => periodo.atrasado > 0 && onDrillDown(periodo, "ATRASADO")}
                        disabled={periodo.atrasado === 0}
                        className={`w-12 h-8 rounded-lg font-bold text-sm mx-auto flex items-center justify-center transition-all ${periodo.atrasado > 0 ? "bg-orange-50 text-orange-700 hover:bg-orange-100 hover:shadow-sm" : "text-slate-300 cursor-not-allowed"}`}
                      >
                        {periodo.atrasado}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => periodo.critico > 0 && onDrillDown(periodo, "CRITICO")}
                        disabled={periodo.critico === 0}
                        className={`w-12 h-8 rounded-lg font-bold text-sm mx-auto flex items-center justify-center transition-all ${periodo.critico > 0 ? "bg-red-50 text-red-700 hover:bg-red-100 hover:shadow-sm" : "text-slate-300 cursor-not-allowed"}`}
                      >
                        {periodo.critico}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">{periodo.total}</td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} className="p-0 border-b-2 border-slate-200">
                        <div className="bg-slate-50/50 px-6 py-5 shadow-inner">
                          <div className="max-w-4xl">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                              ↳ Detalhamento por Linha
                            </h4>
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                              <table className="min-w-full text-xs">
                                <thead className="bg-slate-100 border-b border-slate-200 sticky top-[116px] z-10 shadow-sm">
                                  <tr>
                                    <th className="px-4 py-2.5 text-left font-bold text-slate-600">Linha / Rota</th>
                                    <th className="px-3 py-2.5 text-center font-bold text-slate-600">Pontual</th>
                                    <th className="px-3 py-2.5 text-center font-bold text-slate-600">Atenção</th>
                                    <th className="px-3 py-2.5 text-center font-bold text-slate-600">Atrasado</th>
                                    <th className="px-3 py-2.5 text-center font-bold text-slate-600">Crítico</th>
                                    <th className="px-3 py-2.5 text-center font-bold text-slate-600">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {rotasAgrupadas.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-6 text-center text-slate-400">Nenhuma viagem nesta semana.</td>
                                    </tr>
                                  ) : rotasAgrupadas.map(r => (
                                    <tr key={r.rota} className="hover:bg-slate-50/80 transition-colors">
                                      <td className="px-4 py-2.5 font-medium text-slate-800">{r.rota}</td>
                                      <td className="px-3 py-2.5 text-center">
                                        <button 
                                          onClick={() => r.pontual > 0 && onDrillDown(periodo, "PONTUAL", r.rota)}
                                          disabled={r.pontual === 0}
                                          className={`w-full font-semibold ${r.pontual > 0 ? "text-emerald-600 hover:text-emerald-800 hover:underline" : "text-slate-300 cursor-not-allowed"}`}
                                        >
                                          {r.pontual > 0 ? r.pontual : "-"}
                                        </button>
                                      </td>
                                      <td className="px-3 py-2.5 text-center">
                                        <button 
                                          onClick={() => r.atencao > 0 && onDrillDown(periodo, "ATENCAO", r.rota)}
                                          disabled={r.atencao === 0}
                                          className={`w-full font-semibold ${r.atencao > 0 ? "text-amber-600 hover:text-amber-800 hover:underline" : "text-slate-300 cursor-not-allowed"}`}
                                        >
                                          {r.atencao > 0 ? r.atencao : "-"}
                                        </button>
                                      </td>
                                      <td className="px-3 py-2.5 text-center">
                                        <button 
                                          onClick={() => r.atrasado > 0 && onDrillDown(periodo, "ATRASADO", r.rota)}
                                          disabled={r.atrasado === 0}
                                          className={`w-full font-semibold ${r.atrasado > 0 ? "text-orange-600 hover:text-orange-800 hover:underline" : "text-slate-300 cursor-not-allowed"}`}
                                        >
                                          {r.atrasado > 0 ? r.atrasado : "-"}
                                        </button>
                                      </td>
                                      <td className="px-3 py-2.5 text-center">
                                        <button 
                                          onClick={() => r.critico > 0 && onDrillDown(periodo, "CRITICO", r.rota)}
                                          disabled={r.critico === 0}
                                          className={`w-full font-semibold ${r.critico > 0 ? "text-red-600 hover:text-red-800 hover:underline" : "text-slate-300 cursor-not-allowed"}`}
                                        >
                                          {r.critico > 0 ? r.critico : "-"}
                                        </button>
                                      </td>
                                      <td className="px-3 py-2.5 text-center font-bold text-slate-600 bg-slate-50/50">{r.total}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function ComparativoPage() {
  const hoje = new Date();

  // Filtros
  const [agrupamento, setAgrupamento] = useState<"SEMANA" | "MES">("SEMANA");
  const [tipoAnalise, setTipoAnalise] = useState<"SAIDA" | "CHEGADA">("SAIDA");
  const [baseOrigemNome, setBaseOrigemNome] = useState("");
  const [dataInicio, setDataInicio] = useState(
    format(subWeeks(startOfWeek(hoje, { weekStartsOn: 1 }), 5), "yyyy-MM-dd")
  );
  const [dataFim, setDataFim] = useState(
    format(endOfWeek(hoje, { weekStartsOn: 1 }), "yyyy-MM-dd")
  );
  const [filtroSemana, setFiltroSemana] = useState<string>("TODAS");

  // Presets de intervalo
  const aplicarPreset = (preset: string) => {
    if (preset === "4sem") {
      setAgrupamento("SEMANA");
      setDataInicio(format(subWeeks(startOfWeek(hoje, { weekStartsOn: 1 }), 3), "yyyy-MM-dd"));
      setDataFim(format(endOfWeek(hoje, { weekStartsOn: 1 }), "yyyy-MM-dd"));
    } else if (preset === "8sem") {
      setAgrupamento("SEMANA");
      setDataInicio(format(subWeeks(startOfWeek(hoje, { weekStartsOn: 1 }), 7), "yyyy-MM-dd"));
      setDataFim(format(endOfWeek(hoje, { weekStartsOn: 1 }), "yyyy-MM-dd"));
    } else if (preset === "3mes") {
      setAgrupamento("MES");
      setDataInicio(format(startOfMonth(subMonths(hoje, 2)), "yyyy-MM-dd"));
      setDataFim(format(endOfMonth(hoje), "yyyy-MM-dd"));
    } else if (preset === "6mes") {
      setAgrupamento("MES");
      setDataInicio(format(startOfMonth(subMonths(hoje, 5)), "yyyy-MM-dd"));
      setDataFim(format(endOfMonth(hoje), "yyyy-MM-dd"));
    }
  };

  // Drill-down state
  const [drillDown, setDrillDown] = useState<{ periodo: Periodo; nivel: NivelAtraso; rota?: string } | null>(null);

  const { data, isLoading } = api.viagem.obterComparativoAtrasos.useQuery(
    { dataInicio, dataFim, agrupamento, tipoAnalise, baseOrigemNome: baseOrigemNome || undefined },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      placeholderData: keepPreviousData,
    }
  );

  const periodosFiltrados = useMemo(() => {
    if (!data?.periodos) return [];
    if (agrupamento !== "SEMANA" || filtroSemana === "TODAS") return data.periodos;
    return data.periodos.filter((p) => p.chave.endsWith(`-W${filtroSemana}`));
  }, [data?.periodos, agrupamento, filtroSemana]);

  // Totais globais
  const totais = useMemo(() => {
    if (!periodosFiltrados.length) return null;
    return periodosFiltrados.reduce(
      (acc, p) => ({
        total: acc.total + p.total,
        pontual: acc.pontual + p.pontual,
        atencao: acc.atencao + p.atencao,
        atrasado: acc.atrasado + p.atrasado,
        critico: acc.critico + p.critico,
      }),
      { total: 0, pontual: 0, atencao: 0, atrasado: 0, critico: 0 }
    );
  }, [periodosFiltrados]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              📅 Comparativo de Atrasos na {tipoAnalise === "SAIDA" ? "Saída" : "Chegada"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Análise por {agrupamento === "SEMANA" ? "semana" : "mês"} · Atrasos no horário de {tipoAnalise === "SAIDA" ? "saída" : "chegada"} das viagens
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Toggle Saída / Chegada */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
              {(["SAIDA", "CHEGADA"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTipoAnalise(t)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    tipoAnalise === t ? "bg-white text-violet-600 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t === "SAIDA" ? "Analisar Saídas" : "Analisar Chegadas"}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <Link
              href="/analise"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors bg-white"
            >
              ← Central de Análises
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-6 space-y-6">
        {/* ── Filtros ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-5 items-end">
          {/* Agrupamento */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agrupamento</p>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-0.5">
              {(["SEMANA", "MES"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAgrupamento(a)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    agrupamento === a ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {a === "SEMANA" ? "Por Semana" : "Por Mês"}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atalhos</p>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: "4 Sem.", value: "4sem" },
                { label: "8 Sem.", value: "8sem" },
                { label: "3 Meses", value: "3mes" },
                { label: "6 Meses", value: "6mes" },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => aplicarPreset(p.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data início */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Início</p>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Data fim */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Fim</p>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Filtro origem */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Origem</p>
            <select
              value={baseOrigemNome}
              onChange={(e) => setBaseOrigemNome(e.target.value)}
              className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 min-w-[180px]"
            >
              <option value="">Todas as Origens</option>
              {data?.basesDisponiveis.map((b) => (
                <option key={b.nome} value={b.nome}>{b.cidade}</option>
              ))}
            </select>
          </div>

          {/* Filtro Semana do Mês */}
          {agrupamento === "SEMANA" && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semana do Mês</p>
              <select
                value={filtroSemana}
                onChange={(e) => setFiltroSemana(e.target.value)}
                className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 min-w-[150px]"
              >
                <option value="TODAS">Todas as Semanas</option>
                <option value="1">1ª Semana</option>
                <option value="2">2ª Semana</option>
                <option value="3">3ª Semana</option>
                <option value="4">4ª Semana</option>
                <option value="5">5ª Semana</option>
                <option value="6">6ª Semana</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <TruckLoader tamanho="lg" mensagem="Calculando comparativo de períodos..." />
          </div>
        ) : !data || data.periodos.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-semibold text-slate-500">Nenhum dado no período selecionado</p>
            <p className="text-sm text-slate-400 mt-2">Ajuste o intervalo de datas ou o filtro de origem</p>
          </div>
        ) : (
          <>
            {/* ── Totais Globais ── */}
            {totais && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Total de Viagens", value: totais.total, color: "text-slate-900", sub: "no período" },
                  { label: "Pontuais", value: totais.pontual, color: "text-emerald-600", sub: `${totais.total > 0 ? Math.round((totais.pontual / totais.total) * 100) : 0}% do total` },
                  { label: "Atenção", value: totais.atencao, color: "text-amber-500", sub: "10–29 min" },
                  { label: "Atrasadas", value: totais.atrasado, color: "text-orange-500", sub: "30–59 min" },
                  { label: "Críticas", value: totais.critico, color: "text-red-600", sub: "≥ 60 min" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{kpi.label}</p>
                    <p className={`text-3xl font-extrabold tabular-nums ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Legenda ── */}
            <div className="flex flex-wrap gap-3 text-xs">
              {(["CRITICO", "ATRASADO", "ATENCAO", "PONTUAL"] as NivelAtraso[]).map((n) => (
                <div key={n} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${NIVEL[n].border} ${NIVEL[n].bg}`}>
                  <span className={`h-2 w-2 rounded-full ${NIVEL[n].bar}`} />
                  <span className={`font-semibold ${NIVEL[n].text}`}>{NIVEL[n].label}</span>
                  <span className="text-slate-500">{NIVEL[n].faixa}</span>
                </div>
              ))}
              <p className="text-slate-400 text-xs self-center ml-1">Clique em qualquer quadro para ver as viagens</p>
            </div>

            {/* ── Tabela de Períodos ── */}
            {periodosFiltrados.length === 0 ? (
              <div className="py-12 text-center border-t border-slate-200 mt-6 pt-12">
                <p className="text-3xl mb-3">📅</p>
                <p className="text-lg font-semibold text-slate-500">Nenhum período encontrado para este filtro.</p>
              </div>
            ) : (
              <TabelaPeriodos
                periodos={periodosFiltrados}
                onDrillDown={(periodo, nivel, rota) => setDrillDown({ periodo, nivel, rota })}
              />
            )}
          </>
        )}
      </main>

      {/* ── Drill-down Modal ── */}
      {drillDown && (
        <DrillDown
          periodo={drillDown.periodo}
          nivel={drillDown.nivel}
          rota={drillDown.rota}
          tipoAnalise={tipoAnalise}
          onClose={() => setDrillDown(null)}
        />
      )}
    </div>
  );
}
