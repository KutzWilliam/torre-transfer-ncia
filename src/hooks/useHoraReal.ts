/**
 * useHoraReal
 *
 * Sincroniza a hora local com o SERVIDOR da aplicação via /api/hora.
 * Isso resolve o problema de TVs/computadores com relógio do sistema incorreto:
 * o servidor sempre tem a hora certa (independente do OS do cliente).
 *
 * Estratégia:
 * 1. Busca GET /api/hora (rota interna Next.js — sem CORS, sem firewall externo)
 * 2. Calcula o offset: horaServidor - horaLocal
 * 3. Aplica offset a cada tick de 1s: new Date(Date.now() + offset)
 * 4. Re-sincroniza a cada 15 minutos para evitar desvio gradual
 * 5. Fallback silencioso para relógio local se a requisição falhar
 */

import { useEffect, useRef, useState } from "react";

async function buscarHoraServidor(): Promise<number | null> {
    try {
        const antes = Date.now();
        const res = await fetch("/api/hora", { cache: "no-store" });
        const depois = Date.now();
        if (!res.ok) return null;

        const json = (await res.json()) as { ts: number };
        if (typeof json.ts !== "number") return null;

        // Compensa metade do RTT para estimar a hora no momento da resposta
        const latencia = Math.round((depois - antes) / 2);
        return json.ts + latencia;
    } catch {
        return null;
    }
}

export function useHoraReal(): { agora: Date; sincronizado: boolean } {
    const [agora, setAgora] = useState(() => new Date());
    const [sincronizado, setSincronizado] = useState(false);
    const offsetMs = useRef<number>(0); // horaServidor - horaLocal

    useEffect(() => {
        let tickId: ReturnType<typeof setInterval>;

        async function sincronizar() {
            const tsServidor = await buscarHoraServidor();
            if (tsServidor !== null) {
                offsetMs.current = tsServidor - Date.now();
                setSincronizado(true);
            }
            // Inicia tick independente do resultado (offset = 0 se falhou)
            setAgora(new Date(Date.now() + offsetMs.current));
            tickId = setInterval(() => {
                setAgora(new Date(Date.now() + offsetMs.current));
            }, 1000);
        }

        void sincronizar();

        // Re-sincroniza a cada 15 minutos
        const resyncId = setInterval(async () => {
            const tsServidor = await buscarHoraServidor();
            if (tsServidor !== null) {
                offsetMs.current = tsServidor - Date.now();
                setSincronizado(true);
            }
        }, 15 * 60 * 1000);

        return () => {
            clearInterval(tickId);
            clearInterval(resyncId);
        };
    }, []);

    return { agora, sincronizado };
}
