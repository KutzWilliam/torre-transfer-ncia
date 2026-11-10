export const normalizeString = (str: string | null | undefined): string => {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toUpperCase()
        .trim();
};

export const normalizeCityName = (str: string | null | undefined): string => {
    if (!str) return "DESCONHECIDA";
    let norm = normalizeString(str);

    // Correções manuais
    if (norm.includes("P GROSSA") || norm.includes("PONTO GROSSA")) return "PONTA GROSSA";
    if (norm.includes("MANGUERINHA")) return "MANGUEIRINHA";
    if (norm.includes("TERRA RO")) return "TERRA ROXA";

    // Regex
    const regex = /^(?:EPC|BOTICARIO|WURTH.*?(?:-|MATRIZ))?[-\s]*([A-Z\s]+?)(?:-[A-Z]{2}(?:\s*-\s*\d+)?|$)/;
    const match = norm.match(regex);
    
    if (match && match[1]) {
        return match[1].trim();
    }
    
    return norm;
};

/**
 * Quebra o nome de uma rota em cidades normalizadas, independentemente do formato:
 *  - "CURITIBA X PONTA GROSSA"
 *  - "CURITIBA/BLUMENAU"
 *  - "EPC-CURITIBA-PR - 135 .. EPC-PONTA GROSSA-PR - 116"
 *  - "WURTH DO BRASIL - COTIA-SP X CURITIBA-PR"
 */
export const rotaParaCidades = (nome: string | null | undefined): string[] => {
    if (!nome) return [];
    let limpo = nome
        .replace(/\s*\d{1,2}[./]\d{1,2}[./]\d{2,4}.*$/, "") // "22.07.2026 OBRAS NA PISTA"
        .replace(/\s*,.*$/, "") // ", rota alternativa"
        .replace(/\bCURTIBA\b/gi, "CURITIBA")
        .replace(/\s+NOVO FORMATO.*$/i, "")
        .trim();

    // "A X B VIA C" => A X C X B (C vira parada intermediária)
    const via = limpo.match(/^(.*?)\s+VIA\s+(.+)$/i);
    if (via) {
        const partes = via[1]!.split(/\s+X\s+/i);
        if (partes.length >= 2) {
            const destino = partes.pop()!;
            limpo = [...partes, via[2]!.trim(), destino].join(" X ");
        } else {
            limpo = via[1]!;
        }
    }

    return limpo
        .split(/\s+X\s+|\s*\/\s*|\s*\.{2,}\s*|\s*(?:=>|->|>)\s*/i)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => normalizeCityName(p));
};

/** Chave canônica da rota (mantém o sentido). Ex.: "CURITIBA>PONTA GROSSA". */
export const chaveRota = (nome: string | null | undefined): string =>
    rotaParaCidades(nome).join(">");
