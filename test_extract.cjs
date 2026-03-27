const normalizeCityName = (str) => {
    if (!str) return "DESCONHECIDA";
    let norm = str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toUpperCase()
        .trim();

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

const tests = [
  "EPC-APUCARANA-PR - 164",
  "EPC-BLUMENAU-SC - 172",
  "EPC-CASCAVEL-PR - 120",
  "BOTICARIO-CAMPINA GRANDE DO SUL-PR",
  "EPC-CHAPECO-SC - 137",
  "EPC-CURITIBA-PR - 135",
  "EPC-FOZ DO IGUACU-PR - 121",
  "WURTH DO BRASIL - MATRIZ - COTIA-SP",
  "P GROSSA",
  "TERRA RO ",
  "MANGUERINHA",
  "CASCAVEL",
  "SAO PAULO"
];

tests.forEach(t => console.log(`"${t}" => "${normalizeCityName(t)}"`));
