import Link from "next/link";

// ─── Módulos disponíveis ──────────────────────────────────────────────────────
const modulos = [
  {
    href: "/analise/operacional",
    titulo: "Analytics Operacional",
    descricao:
      "KPIs gerenciais das viagens finalizadas: pontualidade, ranking de rotas, distribuição de atrasos e tabela detalhada com exportação Excel.",
    icon: "📊",
    cor: "from-blue-600 to-blue-800",
    borda: "border-blue-500/30",
    badge: "Gerencial",
    badgeCor: "bg-blue-500/20 text-blue-300",
    novidade: false,
  },
  {
    href: "/analise/comparativo",
    titulo: "Comparativo por Período",
    descricao:
      "Compare semanas e meses lado a lado. Veja quantas rotas tiveram atraso na saída categorizadas por nível (Pontual · Atenção · Atrasado · Crítico) com drill-down detalhado por rota.",
    icon: "📅",
    cor: "from-violet-600 to-violet-800",
    borda: "border-violet-500/30",
    badge: "Novo",
    badgeCor: "bg-violet-500/20 text-violet-300",
    novidade: true,
  },
  {
    href: "/analise/origem",
    titulo: "Atrasos por Origem",
    descricao:
      "Ranking das bases de origem com maior volume de atrasos. Identifique padrões geográficos e foque esforços nas unidades mais críticas.",
    icon: "📍",
    cor: "from-emerald-600 to-emerald-800",
    borda: "border-emerald-500/30",
    badge: "Origem",
    badgeCor: "bg-emerald-500/20 text-emerald-300",
    novidade: false,
  },
];

export default function AnalisePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Cabeçalho ── */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/dashboard"
              className="text-slate-500 hover:text-slate-700 transition-colors text-sm"
            >
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            🔍 Central de Análises
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Selecione o módulo de análise que deseja acessar
          </p>
        </div>
      </header>

      {/* ── Cards de Módulos ── */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulos.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`group relative flex flex-col rounded-2xl border ${m.borda} bg-white hover:bg-slate-50 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5`}
            >
              {/* Gradiente topo */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${m.cor}`} />

              <div className="p-6 flex flex-col gap-4 flex-1">
                {/* Ícone + badge */}
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{m.icon}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${m.badgeCor}`}
                  >
                    {m.badge}
                    {m.novidade && (
                      <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse align-middle" />
                    )}
                  </span>
                </div>

                {/* Título + Descrição */}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 mb-2">
                    {m.titulo}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {m.descricao}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                  <span>Acessar módulo</span>
                  <svg
                    className="h-4 w-4 translate-x-0 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
