/**
 * useHoraReal
 *
 * Sincroniza a hora local com uma API de tempo na internet (timeapi.io).
 * Estratégia: busca a hora real na montagem, calcula o offset em relação ao
 * relógio local (new Date()) e depois incrementa com setInterval usando esse
 * offset. Se a API falhar, cai silenciosamente para o relógio local.
 *
 * Benefício: a TV pode ter o relógio do sistema errado (dias/horas) mas o
 * painel sempre exibirá a hora correta de Brasília (America/Sao_Paulo).
 */

import { useEffect, useRef, useState } from "react";

const TIMEZONE = "America/Sao_Paulo";
// APIs de fallback em ordem de prioridade
const APIS = [
  `https://timeapi.io/api/time/current/zone?timeZone=${encodeURIComponent(TIMEZONE)}`,
  `https://worldtimeapi.org/api/timezone/${TIMEZONE}`,
];

async function buscarHoraReal(): Promise<Date | null> {
  for (const url of APIS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) continue;
      const json = await res.json();

      // timeapi.io → { dateTime: "2026-08-11T13:45:20.123" }
      if (json.dateTime) {
        const d = new Date(json.dateTime);
        if (!isNaN(d.getTime())) return d;
      }

      // worldtimeapi.org → { datetime: "2026-08-11T13:45:20.123456-03:00" }
      if (json.datetime) {
        const d = new Date(json.datetime);
        if (!isNaN(d.getTime())) return d;
      }
    } catch {
      // silently try next API
    }
  }
  return null;
}

/**
 * Retorna { agora, sincronizado }
 * - agora: Date correto (da API ou local como fallback)
 * - sincronizado: true quando a hora veio da API
 */
export function useHoraReal(): { agora: Date; sincronizado: boolean } {
  const [agora, setAgora] = useState(() => new Date());
  const [sincronizado, setSincronizado] = useState(false);
  // Offset em ms: horaReal - horaLocal no momento da sincronização
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    let intervaloId: ReturnType<typeof setInterval>;

    async function sincronizar() {
      const horaReal = await buscarHoraReal();
      if (horaReal) {
        const horaLocal = new Date();
        offsetRef.current = horaReal.getTime() - horaLocal.getTime();
        setSincronizado(true);
      }
      // Inicia relógio com offset (0 se falhou — usa local)
      setAgora(new Date(Date.now() + offsetRef.current));
      intervaloId = setInterval(() => {
        setAgora(new Date(Date.now() + offsetRef.current));
      }, 1000);
    }

    sincronizar();

    // Re-sincroniza com a API a cada 30 minutos para evitar desvio de clock
    const resyncId = setInterval(() => {
      buscarHoraReal().then((horaReal) => {
        if (horaReal) {
          offsetRef.current = horaReal.getTime() - Date.now();
          setSincronizado(true);
        }
      });
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(intervaloId);
      clearInterval(resyncId);
    };
  }, []);

  return { agora, sincronizado };
}
