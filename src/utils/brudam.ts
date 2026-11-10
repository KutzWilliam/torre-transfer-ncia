/**
 * Utilitários e geradores de URL para integração com o ERP Brudam (RodoWeb).
 */

/**
 * Retorna a URL de consulta de detalhes de um manifesto no sistema Brudam.
 * Exemplo: https://princesadoscampos.brudam.com.br/operacional/consulta_manifestoTransf.php?id_manifesto=182689
 */
export function getBrudamManifestoUrl(idManifesto: string | number): string {
    const cleanId = String(idManifesto).replace(/^[#\s]+/, "").trim();
    return `https://princesadoscampos.brudam.com.br/operacional/consulta_manifestoTransf.php?id_manifesto=${cleanId}`;
}

/**
 * Retorna a URL de consulta de detalhes de uma minuta (chave/número da minuta) no sistema Brudam.
 * Exemplo: https://princesadoscampos.brudam.com.br/operacional/consulta_minuta.php?chave=1957698
 */
export function getBrudamMinutaUrl(chaveMinuta: string | number): string {
    const cleanChave = String(chaveMinuta).replace(/^[#\s]+/, "").trim();
    return `https://princesadoscampos.brudam.com.br/operacional/consulta_minuta.php?chave=${cleanChave}`;
}
