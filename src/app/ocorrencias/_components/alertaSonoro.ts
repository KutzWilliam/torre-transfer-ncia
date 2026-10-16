"use client";

// Utilitário para sintetizar alerta sonoro usando Web Audio API
// Garante funcionamento sem dependência de arquivos externos ou latência de rede.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }

    if (audioCtx && audioCtx.state === "suspended") {
        void audioCtx.resume();
    }

    return audioCtx;
}

/**
 * Toca um alerta sonoro de emergência/atenção em dois tons repetidos.
 * Padrão sonoro: Tom A (880Hz) -> Tom B (1175Hz), repetido 2 vezes com envelope suave.
 */
export function tocarAlertaSonoroOcorrencia(): boolean {
    return tocarAlertaNovaOcorrencia();
}

/**
 * Alerta urgente para NOVA ocorrência:
 * Sequência de 4 beeps agudos e penetrantes (880Hz -> 1175Hz repetido).
 */
export function tocarAlertaNovaOcorrencia(): boolean {
    try {
        const ctx = getAudioContext();
        if (!ctx) return false;

        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.40, now);
        masterGain.connect(ctx.destination);

        const beeps = [
            { freq: 880, start: 0.00, dur: 0.12 },
            { freq: 1175, start: 0.14, dur: 0.16 },
            { freq: 880, start: 0.38, dur: 0.12 },
            { freq: 1175, start: 0.52, dur: 0.20 },
        ];

        beeps.forEach(({ freq, start, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + start);

            gain.gain.setValueAtTime(0.001, now + start);
            gain.gain.exponentialRampToValueAtTime(0.85, now + start + 0.015);
            gain.gain.setValueAtTime(0.85, now + start + dur - 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now + start);
            osc.stop(now + start + dur);
        });

        return true;
    } catch (err) {
        console.warn("Não foi possível reproduzir alerta sonoro de nova ocorrência:", err);
        return false;
    }
}

/**
 * Alerta sonoro de ATENDIMENTO iniciado:
 * Três tons ascendentes de atenção suave (Dó5 -> Mi5 -> Sol5).
 */
export function tocarAlertaAtendimento(): boolean {
    try {
        const ctx = getAudioContext();
        if (!ctx) return false;

        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.35, now);
        masterGain.connect(ctx.destination);

        const beeps = [
            { freq: 523.25, start: 0.00, dur: 0.14 }, // C5
            { freq: 659.25, start: 0.15, dur: 0.16 }, // E5
            { freq: 783.99, start: 0.32, dur: 0.28 }, // G5
        ];

        beeps.forEach(({ freq, start, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, now + start);

            gain.gain.setValueAtTime(0.001, now + start);
            gain.gain.exponentialRampToValueAtTime(0.75, now + start + 0.02);
            gain.gain.setValueAtTime(0.75, now + start + dur - 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now + start);
            osc.stop(now + start + dur);
        });

        return true;
    } catch (err) {
        console.warn("Não foi possível reproduzir alerta sonoro de atendimento:", err);
        return false;
    }
}

/**
 * Alerta sonoro de RESOLUÇÃO concluída:
 * Quatro notas em arpejo harmônico maior positivo de sucesso.
 */
export function tocarAlertaResolvida(): boolean {
    try {
        const ctx = getAudioContext();
        if (!ctx) return false;

        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.32, now);
        masterGain.connect(ctx.destination);

        const beeps = [
            { freq: 587.33, start: 0.00, dur: 0.12 }, // D5
            { freq: 739.99, start: 0.13, dur: 0.14 }, // F#5
            { freq: 880.00, start: 0.28, dur: 0.16 }, // A5
            { freq: 1174.66, start: 0.45, dur: 0.35 }, // D6
        ];

        beeps.forEach(({ freq, start, dur }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + start);

            gain.gain.setValueAtTime(0.001, now + start);
            gain.gain.exponentialRampToValueAtTime(0.7, now + start + 0.02);
            gain.gain.setValueAtTime(0.7, now + start + dur - 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(now + start);
            osc.stop(now + start + dur);
        });

        return true;
    } catch (err) {
        console.warn("Não foi possível reproduzir alerta sonoro de resolução:", err);
        return false;
    }
}

/**
 * Desbloqueia o AudioContext com uma interação do usuário
 */
export function desbloquearAudio(): boolean {
    try {
        const ctx = getAudioContext();
        if (ctx && ctx.state === "suspended") {
            void ctx.resume();
        }
        return true;
    } catch {
        return false;
    }
}
