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
