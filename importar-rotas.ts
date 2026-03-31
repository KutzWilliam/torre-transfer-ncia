/**
 * IMPORTADOR DE ROTAS PADRÃO
 *
 * Lê o arquivo "Horário saída de transferências.xlsx" da raiz do projeto
 * e importa todas as rotas/paradas para o banco de dados como RotaPadrao e ParadaPadrao.
 *
 * Execute com:
 *   npx tsx importar-rotas.ts
 *
 * Este script usa upsert — pode ser re-executado com segurança.
 * Ao re-executar, as paradas existentes de cada rota são recriadas do zero.
 */

import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";

import { normalizeString, normalizeCityName } from "./src/server/utils/stringUtils.js";

const prisma = new PrismaClient();

async function main() {
    console.log("📂 A ler o ficheiro XLSX...");
    const workbook = xlsx.readFile("Horário saída de transferências.xlsx");
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return console.error("❌ Nenhuma aba encontrada no arquivo.");
    const worksheet = workbook.Sheets[sheetName];
    const resultados = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    console.log(`✅ XLSX lido. Processando ${resultados.length} linhas...\n`);
    let rotasCriadas = 0;

    for (let i = 0; i < resultados.length; i++) {
        const linhaAtual = resultados[i];
        const linhaSeguinte = resultados[i + 1] ?? [];

        const indexHorarios = linhaSeguinte.indexOf("Horários");

        if (linhaAtual && indexHorarios !== -1 && linhaAtual[indexHorarios]) {
            const nomeRotaText = linhaAtual[indexHorarios];
            if (typeof nomeRotaText !== "string") continue;

            const nomeRota = nomeRotaText.trim();
            const cidadesStr = nomeRota.split(/ X | x |X/i).map((c) => c.trim().split("-")[0]!.trim());

            console.log(`🔄 Processando rota: ${nomeRota}`);

            // Upsert da RotaPadrao
            const rotaPadrao = await prisma.rotaPadrao.upsert({
                where: { nome: nomeRota },
                update: {},
                create: { nome: nomeRota },
            });

            // Remove paradas antigas para recriar corretamente
            await prisma.paradaPadrao.deleteMany({ where: { rotaId: rotaPadrao.id } });

            // Parser de horário vindo do Excel
            const parseExcelTime = (val: string | number | null | undefined): string | null => {
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
                return String(val).trim();
            };

            // Cria cada parada da rota
            for (let index = 0; index < cidadesStr.length; index++) {
                const cidadeRaw = cidadesStr[index] ?? "Desconhecida";
                const cidadeNorm = normalizeCityName(cidadeRaw);

                // Upsert da Base correspondente
                const base = await prisma.base.upsert({
                    where: { nome: cidadeNorm },
                    update: {},
                    create: { nome: cidadeNorm, cidade: cidadeRaw, raioMetros: 500 },
                });

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

                await prisma.paradaPadrao.create({
                    data: {
                        rotaId: rotaPadrao.id,
                        baseId: base.id,
                        ordem: index,
                        prevChegada: horaChegada,
                        prevSaida: horaSaida,
                    },
                });

                console.log(
                    `   → Parada ${index}: ${cidadeNorm} | Chegada: ${horaChegada ?? "--"} | Saída: ${horaSaida ?? "--"}`
                );
            }

            rotasCriadas++;
        }
    }

    console.log(`\n🎉 Importação de ${rotasCriadas} Rotas Padrão concluída com sucesso!`);
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
