/**
 * SEED — Atualização de Rotas Padrão
 *
 * Lê o arquivo "Horário saída de transferências (version 1).xlsx" da raiz do projeto
 * e sincroniza as RotaPadrao e ParadaPadrao no banco de dados:
 *
 *  - Rotas EXISTENTES → atualiza os horários das paradas (prevChegada / prevSaida)
 *  - Rotas NOVAS      → cria a RotaPadrao + todas as ParadaPadrao do zero
 *
 * Execute com:
 *   npx tsx prisma/seed-rotas.ts
 *
 * Este script é seguro para re-execução (idempotente via upsert).
 */

import path from "path";
import { fileURLToPath } from "url";
import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";
import { normalizeString, normalizeCityName } from "../src/server/utils/stringUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARQUIVO_XLSX = path.resolve(
    __dirname,
    "../Horário saída de transferências (version 1).xlsx"
);

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Converte um valor de célula Excel (número serial ou string "HH:MM") para "HH:MM:SS" */
function parseExcelTime(val: string | number | null | undefined): string | null {
    if (val == null || val === "-" || val === "") return null;
    if (typeof val === "number") {
        const totalSeconds = Math.round(val * 86400);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    }
    if (typeof val === "string" && val.includes(":")) {
        const parts = val.split(":");
        return `${parts[0]!.padStart(2, "0")}:${parts[1]!.padStart(2, "0")}:00`;
    }
    return String(val).trim() || null;
}

// ---------------------------------------------------------------------------
// Estrutura extraída do XLSX para uma rota
// ---------------------------------------------------------------------------
interface ParadaExtraida {
    cidadeRaw: string;
    cidadeNorm: string;
    horaChegada: string | null;
    horaSaida: string | null;
    ordem: number;
}

interface RotaExtraida {
    nomeRota: string;
    paradas: ParadaExtraida[];
}

// ---------------------------------------------------------------------------
// Extrai todas as rotas do XLSX
// ---------------------------------------------------------------------------
function extrairRotasDoXlsx(): RotaExtraida[] {
    console.log(`\n📂 Lendo arquivo: ${ARQUIVO_XLSX}`);
    const workbook = xlsx.readFile(ARQUIVO_XLSX);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("❌ Nenhuma aba encontrada no arquivo XLSX.");

    const worksheet = workbook.Sheets[sheetName];
    const linhas = xlsx.utils.sheet_to_json(worksheet!, { header: 1 }) as (string | number)[][];

    console.log(`✅ XLSX lido. Processando ${linhas.length} linhas...\n`);

    const rotas: RotaExtraida[] = [];

    for (let i = 0; i < linhas.length; i++) {
        const linhaAtual = linhas[i]!;
        const linhaSeguinte = linhas[i + 1] ?? [];

        const indexHorarios = linhaSeguinte.indexOf("Horários");

        if (linhaAtual && indexHorarios !== -1 && linhaAtual[indexHorarios]) {
            const nomeRotaText = linhaAtual[indexHorarios];
            if (typeof nomeRotaText !== "string") continue;

            const nomeRota = nomeRotaText.trim();
            const cidadesStr = nomeRota
                .split(/ X | x |X/i)
                .map((c) => c.trim().split("-")[0]!.trim());

            const paradas: ParadaExtraida[] = [];

            for (let index = 0; index < cidadesStr.length; index++) {
                const cidadeRaw = cidadesStr[index] ?? "Desconhecida";
                const cidadeNorm = normalizeCityName(cidadeRaw);

                let horaChegada: string | null = null;
                let horaSaida: string | null = null;

                if (index === 0) {
                    // Origem: só tem horário de saída
                    horaSaida = parseExcelTime(linhaSeguinte[indexHorarios + 1]);
                } else if (index === cidadesStr.length - 1) {
                    // Destino final: só tem horário de chegada
                    const colChegada = indexHorarios + 3 + (index - 1) * 4;
                    horaChegada = parseExcelTime(linhaSeguinte[colChegada]);
                } else {
                    // Parada intermediária: chegada e saída
                    const colChegada = indexHorarios + 3 + (index - 1) * 4;
                    const colSaida = colChegada + 2;
                    horaChegada = parseExcelTime(linhaSeguinte[colChegada]);
                    horaSaida = parseExcelTime(linhaSeguinte[colSaida]);
                }

                paradas.push({ cidadeRaw, cidadeNorm, horaChegada, horaSaida, ordem: index });
            }

            rotas.push({ nomeRota, paradas });
        }
    }

    return rotas;
}

// ---------------------------------------------------------------------------
// Garante que a Base existe no banco (upsert sem alterar dados existentes)
// ---------------------------------------------------------------------------
async function garantirBase(cidadeNorm: string, cidadeRaw: string) {
    return prisma.base.upsert({
        where: { nome: cidadeNorm },
        update: {}, // não sobrescreve coordenadas ou raio já cadastrados
        create: { nome: cidadeNorm, cidade: cidadeRaw, raioMetros: 500 },
    });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
    const rotas = extrairRotasDoXlsx();
    console.log(`🔍 Total de rotas encontradas no XLSX: ${rotas.length}\n`);

    let rotasAtualizadas = 0;
    let rotasCriadas = 0;

    for (const { nomeRota, paradas } of rotas) {
        // Verifica se a rota já existe no banco
        const rotaExistente = await prisma.rotaPadrao.findUnique({
            where: { nome: nomeRota },
            include: { paradas: { orderBy: { ordem: "asc" } } },
        });

        if (rotaExistente) {
            // ── ROTA EXISTENTE: atualiza apenas os horários ──────────────────
            console.log(`🔄 Atualizando rota existente: "${nomeRota}"`);

            for (const parada of paradas) {
                const base = await garantirBase(parada.cidadeNorm, parada.cidadeRaw);

                // Encontra a parada correspondente pela ordem
                const paradaBanco = rotaExistente.paradas.find(
                    (p) => p.ordem === parada.ordem
                );

                if (paradaBanco) {
                    // Atualiza horários da parada existente
                    await prisma.paradaPadrao.update({
                        where: { id: paradaBanco.id },
                        data: {
                            prevChegada: parada.horaChegada,
                            prevSaida: parada.horaSaida,
                            baseId: base.id, // garante que a base está correta
                        },
                    });
                    console.log(
                        `   ✏️  Parada ${parada.ordem}: ${parada.cidadeNorm}` +
                        ` | Chegada: ${parada.horaChegada ?? "--"}` +
                        ` | Saída: ${parada.horaSaida ?? "--"}`
                    );
                } else {
                    // Nova parada adicionada à rota existente
                    await prisma.paradaPadrao.create({
                        data: {
                            rotaId: rotaExistente.id,
                            baseId: base.id,
                            ordem: parada.ordem,
                            prevChegada: parada.horaChegada,
                            prevSaida: parada.horaSaida,
                        },
                    });
                    console.log(
                        `   ➕ Nova parada ${parada.ordem}: ${parada.cidadeNorm}` +
                        ` | Chegada: ${parada.horaChegada ?? "--"}` +
                        ` | Saída: ${parada.horaSaida ?? "--"}`
                    );
                }
            }

            rotasAtualizadas++;
        } else {
            // ── ROTA NOVA: cria tudo do zero ─────────────────────────────────
            console.log(`✨ Criando nova rota: "${nomeRota}"`);

            const novaRota = await prisma.rotaPadrao.create({
                data: { nome: nomeRota },
            });

            for (const parada of paradas) {
                const base = await garantirBase(parada.cidadeNorm, parada.cidadeRaw);

                await prisma.paradaPadrao.create({
                    data: {
                        rotaId: novaRota.id,
                        baseId: base.id,
                        ordem: parada.ordem,
                        prevChegada: parada.horaChegada,
                        prevSaida: parada.horaSaida,
                    },
                });

                console.log(
                    `   ➕ Parada ${parada.ordem}: ${parada.cidadeNorm}` +
                    ` | Chegada: ${parada.horaChegada ?? "--"}` +
                    ` | Saída: ${parada.horaSaida ?? "--"}`
                );
            }

            rotasCriadas++;
        }

        console.log(); // linha em branco entre rotas
    }

    console.log("──────────────────────────────────────────────────────");
    console.log(`🎉 Concluído!`);
    console.log(`   ✏️  Rotas atualizadas: ${rotasAtualizadas}`);
    console.log(`   ✨ Rotas criadas:      ${rotasCriadas}`);
    console.log(`   📊 Total processadas:  ${rotasAtualizadas + rotasCriadas}`);
}

main()
    .catch(async (e) => {
        console.error("❌ Erro durante o seed de rotas:", e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
