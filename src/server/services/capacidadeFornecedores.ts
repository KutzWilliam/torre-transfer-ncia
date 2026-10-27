import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";

export interface RotaContratual {
    parceiro: string;
    filial: string;
    linha: string;
    origemAproximada: string;
    destinoAproximado: string;
    nroVeiculos: number;
    tipoVeiculo: "TRUCK" | "CAVALO MECANICO";
    totalKm: number;
    valorKm: number;
    valorTotal: number;
    cubagemM3: number;
    pesoKg: number;
}

export interface FornecedorResumo {
    parceiro: string;
    razoesSociais: string[];
    rotas: RotaContratual[];
    totalVeiculos: number;
    totalKmContratado: number;
    custoTotalContratado: number;
}

// Cache em memória
let rotasContratuaisCache: RotaContratual[] | null = null;
let ultimaLeituraTimestamp = 0;

function normalizarTexto(txt: string): string {
    return txt
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

/**
 * Carrega e interpreta a planilha de capacidade
 */
export function obterRotasContratuais(): RotaContratual[] {
    const agora = Date.now();
    // Cache de 5 minutos
    if (rotasContratuaisCache && agora - ultimaLeituraTimestamp < 5 * 60 * 1000) {
        return rotasContratuaisCache;
    }

    const caminhoArquivo = path.resolve("Capacidade veiculos transferências por fornecedor.xlsx");
    if (!fs.existsSync(caminhoArquivo)) {
        console.warn("[CAPACIDADE] Planilha não encontrada em:", caminhoArquivo);
        return [];
    }

    try {
        const fileBuffer = fs.readFileSync(caminhoArquivo);
        const wb = xlsx.read(fileBuffer, { type: "buffer" });
        const listaRotas: RotaContratual[] = [];

        for (const sheetName of wb.SheetNames) {
            const ws = wb.Sheets[sheetName];
            if (!ws) continue;
            const rows = xlsx.utils.sheet_to_json<unknown[]>(ws, { header: 1 });

            // Procura linha de cabeçalho
            let headerIdx = -1;
            for (let i = 0; i < rows.length; i++) {
                const r = rows[i];
                if (Array.isArray(r) && r.some(c => typeof c === "string" && (c.toLowerCase().includes("linha") || c.toLowerCase().includes("rota")))) {
                    headerIdx = i;
                    break;
                }
            }

            if (headerIdx === -1) continue;

            const dataRows = rows.slice(headerIdx + 1);
            for (const r of dataRows) {
                if (!Array.isArray(r) || !r[2]) continue;

                const linhaStr = String(r[2] || "").trim();
                if (!linhaStr) continue;

                const tipoStr = normalizarTexto(String(r[4] || ""));
                const tipoVeiculo: "TRUCK" | "CAVALO MECANICO" = tipoStr.includes("CAVALO") ? "CAVALO MECANICO" : "TRUCK";

                const cubagemStr = String(r[8] || "");
                const pesoStr = String(r[9] || "");

                const m3Match = cubagemStr.match(/(\d+[\.,]?\d*)/);
                const cubagemM3 = m3Match ? parseFloat(m3Match[1]!.replace(",", ".")) : (tipoVeiculo === "CAVALO MECANICO" ? 100 : 50);

                const pesoMatch = pesoStr.match(/(\d+[\.,]?\d*)/);
                const pesoTon = pesoMatch ? parseFloat(pesoMatch[1]!.replace(",", ".")) : (tipoVeiculo === "CAVALO MECANICO" ? 24 : 12);
                const pesoKg = pesoTon * 1000;

                // Divide cidades da rota (ex: "CURITIBA X GUARAPUAVA X UMUARAMA")
                const trechos = linhaStr.split(/ X | x | - /).map(s => normalizarTexto(s));
                const origemAproximada = trechos[0] || "";
                const destinoAproximado = trechos[trechos.length - 1] || "";

                listaRotas.push({
                    parceiro: sheetName.trim(),
                    filial: String(r[1] || "").trim(),
                    linha: linhaStr,
                    origemAproximada,
                    destinoAproximado,
                    nroVeiculos: Number(r[3]) || 0,
                    tipoVeiculo,
                    totalKm: Number(r[5]) || 0,
                    valorKm: Number(r[6]) || 0,
                    valorTotal: Number(r[7]) || (Number(r[5]) || 0) * (Number(r[6]) || 0),
                    cubagemM3,
                    pesoKg,
                });
            }
        }

        rotasContratuaisCache = listaRotas;
        ultimaLeituraTimestamp = agora;
        return listaRotas;
    } catch (err) {
        console.error("[CAPACIDADE] Erro ao carregar planilha:", err);
        return [];
    }
}

/**
 * Identifica a qual parceiro da planilha uma razão social/fantasia do Brudam pertence
 */
export function identificarParceiroBrudam(nomeFornecedor: string | null | undefined): string | null {
    if (!nomeFornecedor) return null;
    const n = normalizarTexto(nomeFornecedor);

    if (n.includes("EMIKO") || n.includes("TANAKA")) return "Emiko";
    if (n.includes("TRANSVEL") || n.includes("V G DE SOUZA") || n.includes("VG DE SOUZA")) return "Transvel";
    if (n.includes("ABRAHAO") || n.includes("ABRAAO") || n.includes("JOAO RENATO")) return "JR Abraão";
    if (n.includes("DALLA CORTE") || n.includes("DALLACORTE")) return "Dalla Corte";
    if (n.includes("ABC LOGISTICA") || n.includes("ABC TRANSP")) return "ABC";

    return null;
}

/**
 * Tenta encontrar a rota contratual da planilha compatível com a viagem
 */
export function encontrarRotaCompativel(
    parceiro: string,
    origem: string | null | undefined,
    destino: string | null | undefined,
    rotas: RotaContratual[]
): RotaContratual | null {
    if (!origem || !destino) return null;
    const origNorm = normalizarTexto(origem);
    const destNorm = normalizarTexto(destino);

    const rotasParceiro = rotas.filter(r => r.parceiro.toLowerCase() === parceiro.toLowerCase());

    // 1. Busca exata de trecho inicial e final
    const matchExato = rotasParceiro.find(r => 
        (r.origemAproximada.includes(origNorm) || origNorm.includes(r.origemAproximada)) &&
        (r.destinoAproximado.includes(destNorm) || destNorm.includes(r.destinoAproximado))
    );
    if (matchExato) return matchExato;

    // 2. Busca se tanto origem quanto destino estão no texto da linha
    const matchContemAmbos = rotasParceiro.find(r => {
        const linhaNorm = normalizarTexto(r.linha);
        return linhaNorm.includes(origNorm) && linhaNorm.includes(destNorm);
    });
    if (matchContemAmbos) return matchContemAmbos;

    return null;
}
