"use client";

/**
 * TruckLoader — Loader animado de caminhão para o Sistema Torre de Transferência.
 * Substitui os skeletons genéricos com uma identidade visual consistente.
 */

import { type CSSProperties } from "react";

interface TruckLoaderProps {
  /** Texto exibido abaixo do caminhão */
  mensagem?: string;
  /** Tamanho do componente: 'sm' = inline/card, 'md' = padrão, 'lg' = tela cheia */
  tamanho?: "sm" | "md" | "lg";
  /** Cor do caminhão (hex) — padrão verde Princesa */
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
    to   { transform: translateY(-2px); }
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
    sm: { wrapper: "py-8",    svgW: 100, svgH: 54,  text: "text-xs", gap: "gap-2" },
    md: { wrapper: "py-14",   svgW: 140, svgH: 76,  text: "text-sm", gap: "gap-3" },
    lg: { wrapper: "py-24",   svgW: 180, svgH: 98,  text: "text-base", gap: "gap-4" },
  }[tamanho];

  // Escala do SVG base (desenhado em 140×76)
  const scale = sizes.svgW / 140;

  return (
    <>
      <style>{keyframes}</style>
      <div
        className={`flex flex-col items-center justify-center ${sizes.wrapper} ${sizes.gap} select-none`}
        role="status"
        aria-label={mensagem}
      >
        {/* ── Caminhão SVG ── */}
        <svg
          width={sizes.svgW}
          height={sizes.svgH}
          viewBox="0 0 140 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          {/* Fumaça do escapamento */}
          <g transform="translate(10, 18)">
            <circle cx="0" cy="0" r="5" fill="#94a3b8" style={styles.smoke1} />
            <circle cx="4" cy="-4" r="4" fill="#cbd5e1" style={styles.smoke2} />
            <circle cx="-2" cy="-8" r="3" fill="#e2e8f0" style={styles.smoke3} />
          </g>

          {/* Grupo principal do caminhão com bounce */}
          <g style={styles.bounce}>
            {/* Carroceria / Baú */}
            <rect x="14" y="14" width="76" height="34" rx="3" fill={cor} />
            {/* Detalhes do baú */}
            <rect x="17" y="17" width="70" height="28" rx="2" fill="white" fillOpacity="0.12" />
            <line x1="52" y1="17" x2="52" y2="45" stroke="white" strokeOpacity="0.2" strokeWidth="1" />

            {/* Cabine */}
            <rect x="90" y="22" width="34" height="26" rx="4" fill={cor} />
            {/* Para-brisa */}
            <rect x="93" y="25" width="18" height="14" rx="2" fill="#bfdbfe" fillOpacity="0.85" />
            {/* Divisor do para-brisa */}
            <line x1="102" y1="25" x2="102" y2="39" stroke={cor} strokeWidth="1.5" />
            {/* Espelho lateral */}
            <rect x="124" y="28" width="6" height="5" rx="1" fill={cor} stroke="white" strokeOpacity="0.3" strokeWidth="0.5" />
            {/* Farol dianteiro */}
            <rect x="120" y="41" width="6" height="4" rx="1" fill="#fef08a" />
            {/* Luz traseira */}
            <rect x="14" y="38" width="5" height="6" rx="1" fill="#fca5a5" />

            {/* Para-choque dianteiro */}
            <rect x="117" y="44" width="12" height="4" rx="1" fill="#475569" />
            {/* Para-choque traseiro */}
            <rect x="11" y="42" width="5" height="5" rx="1" fill="#475569" />

            {/* Roda traseira esquerda */}
            <g style={{ ...styles.wheel, transformOrigin: "28px 52px" }}>
              <circle cx="28" cy="52" r="10" fill="#1e293b" />
              <circle cx="28" cy="52" r="6" fill="#334155" />
              <circle cx="28" cy="52" r="2.5" fill="#64748b" />
              {/* Raios */}
              <line x1="28" y1="43" x2="28" y2="61" stroke="#64748b" strokeWidth="1.2" />
              <line x1="19" y1="52" x2="37" y2="52" stroke="#64748b" strokeWidth="1.2" />
              <line x1="21.4" y1="45.4" x2="34.6" y2="58.6" stroke="#64748b" strokeWidth="1.2" />
              <line x1="21.4" y1="58.6" x2="34.6" y2="45.4" stroke="#64748b" strokeWidth="1.2" />
            </g>

            {/* Roda traseira direita (gêmea) */}
            <g style={{ ...styles.wheel, transformOrigin: "44px 52px" }}>
              <circle cx="44" cy="52" r="10" fill="#1e293b" />
              <circle cx="44" cy="52" r="6" fill="#334155" />
              <circle cx="44" cy="52" r="2.5" fill="#64748b" />
              <line x1="44" y1="43" x2="44" y2="61" stroke="#64748b" strokeWidth="1.2" />
              <line x1="35" y1="52" x2="53" y2="52" stroke="#64748b" strokeWidth="1.2" />
              <line x1="37.4" y1="45.4" x2="50.6" y2="58.6" stroke="#64748b" strokeWidth="1.2" />
              <line x1="37.4" y1="58.6" x2="50.6" y2="45.4" stroke="#64748b" strokeWidth="1.2" />
            </g>

            {/* Roda dianteira */}
            <g style={{ ...styles.wheel, transformOrigin: "108px 52px" }}>
              <circle cx="108" cy="52" r="10" fill="#1e293b" />
              <circle cx="108" cy="52" r="6" fill="#334155" />
              <circle cx="108" cy="52" r="2.5" fill="#64748b" />
              <line x1="108" y1="43" x2="108" y2="61" stroke="#64748b" strokeWidth="1.2" />
              <line x1="99" y1="52" x2="117" y2="52" stroke="#64748b" strokeWidth="1.2" />
              <line x1="101.4" y1="45.4" x2="114.6" y2="58.6" stroke="#64748b" strokeWidth="1.2" />
              <line x1="101.4" y1="58.6" x2="114.6" y2="45.4" stroke="#64748b" strokeWidth="1.2" />
            </g>
          </g>

          {/* Estrada com traços animados */}
          <line
            x1="0"
            y1="64"
            x2="140"
            y2="64"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <line
            x1="0"
            y1="70"
            x2="140"
            y2="70"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeDasharray="20 20"
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
