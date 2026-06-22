"use client";

/**
 * TruckLoader — Loader animado de caminhão para o Sistema Torre de Transferência.
 * Ícone estilo outline com baú verde Princesa dos Campos.
 */

import { type CSSProperties } from "react";

interface TruckLoaderProps {
  /** Texto exibido abaixo do caminhão */
  mensagem?: string;
  /** Tamanho do componente: 'sm' = inline/card, 'md' = padrão, 'lg' = tela cheia */
  tamanho?: "sm" | "md" | "lg";
  /** Cor do baú (hex) — padrão verde Princesa */
  cor?: string;
}

// Estilos CSS-in-JS para as animações (não dependem de Tailwind dinâmico)
const styles: Record<string, CSSProperties> = {
  wheel: {
    animation: "truckWheelSpin 0.7s linear infinite",
    transformOrigin: "center",
  },
  smoke1: {
    animation: "truckSmoke 1.2s ease-out infinite",
    opacity: 0,
  },
  smoke2: {
    animation: "truckSmoke 1.2s ease-out infinite 0.4s",
    opacity: 0,
  },
  smoke3: {
    animation: "truckSmoke 1.2s ease-out infinite 0.8s",
    opacity: 0,
  },
  road: {
    animation: "truckRoad 0.5s linear infinite",
  },
  bounce: {
    animation: "truckBounce 0.35s ease-in-out infinite alternate",
  },
};

const keyframes = `
  @keyframes truckWheelSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes truckSmoke {
    0%   { opacity: 0.7; transform: translate(0, 0) scale(0.5); }
    100% { opacity: 0;   transform: translate(-18px, -22px) scale(1.4); }
  }
  @keyframes truckRoad {
    from { stroke-dashoffset: 0; }
    to   { stroke-dashoffset: -40; }
  }
  @keyframes truckBounce {
    from { transform: translateY(0px); }
    to   { transform: translateY(-2.5px); }
  }
  @keyframes truckFade {
    0%   { opacity: 0.4; }
    50%  { opacity: 1;   }
    100% { opacity: 0.4; }
  }
`;

export function TruckLoader({
  mensagem = "Carregando...",
  tamanho = "md",
  cor = "#16a34a",
}: TruckLoaderProps) {
  const sizes = {
    sm: { wrapper: "py-8",  svgW: 110, svgH: 60,  text: "text-xs",  gap: "gap-2" },
    md: { wrapper: "py-14", svgW: 160, svgH: 88,  text: "text-sm",  gap: "gap-3" },
    lg: { wrapper: "py-24", svgW: 210, svgH: 115, text: "text-base", gap: "gap-4" },
  }[tamanho];

  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`flex flex-col items-center justify-center ${sizes.wrapper} ${sizes.gap} select-none`}
        role="status"
        aria-label={mensagem}
      >
        {/* ── Caminhão SVG — estilo outline com baú verde ── */}
        {/*
          ViewBox baseada no ícone de referência (512×512).
          Usamos apenas a faixa vertical útil do ícone (~80–420px)
          para eliminar o espaço em branco excessivo.
        */}
        <svg
          width={sizes.svgW}
          height={sizes.svgH}
          viewBox="0 80 512 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          {/* Fumaça saindo do escapamento (lado direito/frente) */}
          <g transform="translate(492, 108)">
            <circle cx="0" cy="0" r="9" fill="#94a3b8" style={styles.smoke1} />
            <circle cx="6" cy="-7" r="7" fill="#cbd5e1" style={styles.smoke2} />
            <circle cx="-3" cy="-15" r="5" fill="#e2e8f0" style={styles.smoke3} />
          </g>

          {/* Grupo principal com bounce */}
          <g style={styles.bounce}>

            {/* ═══════════════════════════════════
                BAÚ (cargo box) — verde empresa
            ═══════════════════════════════════ */}
            {/* Corpo do baú */}
            <rect
              x="14" y="95"
              width="326" height="170"
              rx="12" ry="12"
              fill={cor}
              stroke="#0f172a"
              strokeWidth="14"
              strokeLinejoin="round"
            />
            {/* Reflexo interno sutil */}
            <rect
              x="30" y="110"
              width="294" height="140"
              rx="7" ry="7"
              fill="white"
              fillOpacity="0.09"
            />
            {/* Linha decorativa central horizontal */}
            <line
              x1="30" y1="180"
              x2="326" y2="180"
              stroke="white"
              strokeOpacity="0.18"
              strokeWidth="4"
            />
            {/* Traço de separação lateral do baú */}
            <line
              x1="30" y1="240"
              x2="326" y2="240"
              stroke="#0f172a"
              strokeOpacity="0.15"
              strokeWidth="3"
            />

            {/* ═══════════════════════════════════
                CHASSI inferior
            ═══════════════════════════════════ */}
            <rect x="14" y="252" width="420" height="20" rx="5" fill="#1e293b" />

            {/* ═══════════════════════════════════
                CABINE
            ═══════════════════════════════════ */}
            {/* Corpo da cabine */}
            <path
              d="M340 118 L340 265 L472 265 L500 244 L500 178 L472 118 Z"
              fill="#f8fafc"
              stroke="#0f172a"
              strokeWidth="14"
              strokeLinejoin="round"
            />
            {/* Para-brisa */}
            <path
              d="M355 130 L355 240 L448 240 L470 218 L470 152 L448 130 Z"
              fill="#bfdbfe"
              fillOpacity="0.72"
              stroke="#0f172a"
              strokeWidth="9"
              strokeLinejoin="round"
            />
            {/* Divisor vertical do para-brisa */}
            <line
              x1="412" y1="130"
              x2="412" y2="240"
              stroke="#0f172a"
              strokeWidth="7"
            />
            {/* Espelho lateral */}
            <rect
              x="497" y="152"
              width="18" height="28"
              rx="4"
              fill="#e2e8f0"
              stroke="#0f172a"
              strokeWidth="7"
            />
            {/* Farol dianteiro */}
            <rect
              x="480" y="230"
              width="26" height="18"
              rx="5"
              fill="#fef08a"
              stroke="#0f172a"
              strokeWidth="6"
            />

            {/* ═══════════════════════════════════
                RODAS
            ═══════════════════════════════════ */}

            {/* Roda traseira esquerda */}
            <g style={{ ...styles.wheel, transformOrigin: "100px 298px" }}>
              <circle cx="100" cy="298" r="54" fill="#0f172a" stroke="#0f172a" strokeWidth="8" />
              <circle cx="100" cy="298" r="34" fill="#334155" />
              <circle cx="100" cy="298" r="14" fill="#64748b" />
              <line x1="100" y1="246" x2="100" y2="350" stroke="#64748b" strokeWidth="6" />
              <line x1="48"  y1="298" x2="152" y2="298" stroke="#64748b" strokeWidth="6" />
              <line x1="63"  y1="261" x2="137" y2="335" stroke="#64748b" strokeWidth="6" />
              <line x1="63"  y1="335" x2="137" y2="261" stroke="#64748b" strokeWidth="6" />
            </g>

            {/* Roda traseira direita (gêmea) */}
            <g style={{ ...styles.wheel, transformOrigin: "202px 298px" }}>
              <circle cx="202" cy="298" r="54" fill="#0f172a" stroke="#0f172a" strokeWidth="8" />
              <circle cx="202" cy="298" r="34" fill="#334155" />
              <circle cx="202" cy="298" r="14" fill="#64748b" />
              <line x1="202" y1="246" x2="202" y2="350" stroke="#64748b" strokeWidth="6" />
              <line x1="150" y1="298" x2="254" y2="298" stroke="#64748b" strokeWidth="6" />
              <line x1="165" y1="261" x2="239" y2="335" stroke="#64748b" strokeWidth="6" />
              <line x1="165" y1="335" x2="239" y2="261" stroke="#64748b" strokeWidth="6" />
            </g>

            {/* Roda dianteira */}
            <g style={{ ...styles.wheel, transformOrigin: "430px 298px" }}>
              <circle cx="430" cy="298" r="54" fill="#0f172a" stroke="#0f172a" strokeWidth="8" />
              <circle cx="430" cy="298" r="34" fill="#334155" />
              <circle cx="430" cy="298" r="14" fill="#64748b" />
              <line x1="430" y1="246" x2="430" y2="350" stroke="#64748b" strokeWidth="6" />
              <line x1="378" y1="298" x2="482" y2="298" stroke="#64748b" strokeWidth="6" />
              <line x1="393" y1="261" x2="467" y2="335" stroke="#64748b" strokeWidth="6" />
              <line x1="393" y1="335" x2="467" y2="261" stroke="#64748b" strokeWidth="6" />
            </g>

            {/* Para-choque dianteiro */}
            <rect
              x="474" y="255"
              width="36" height="16"
              rx="5"
              fill="#475569"
              stroke="#0f172a"
              strokeWidth="6"
            />

          </g>

          {/* ── Estrada com traços animados ── */}
          <line x1="0" y1="356" x2="512" y2="356" stroke="#cbd5e1" strokeWidth="5" />
          <line
            x1="0" y1="368" x2="512" y2="368"
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeDasharray="44 44"
            style={styles.road}
          />
        </svg>

        {/* ── Texto ── */}
        <p
          className={`font-semibold text-slate-500 ${sizes.text}`}
          style={{ animation: "truckFade 1.8s ease-in-out infinite" }}
        >
          {mensagem}
        </p>
      </div>
    </>
  );
}

/**
 * TruckLoaderFullscreen — versão tela cheia para `isLoading` de página inteira.
 */
export function TruckLoaderFullscreen({ mensagem = "Carregando dados..." }: { mensagem?: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
      <TruckLoader tamanho="lg" mensagem={mensagem} />
      <p className="text-xs text-slate-400">Aguarde enquanto buscamos as informações</p>
    </div>
  );
}

/**
 * TruckLoaderCard — versão compacta para usar dentro de cards/skeletons.
 */
export function TruckLoaderCard({ mensagem = "Carregando..." }: { mensagem?: string }) {
  return <TruckLoader tamanho="sm" mensagem={mensagem} />;
}
