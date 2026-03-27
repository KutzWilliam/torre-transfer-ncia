import * as xlsx from "xlsx";
import { PrismaClient } from "./generated/prisma/index.js";
import { normalizeString, normalizeCityName } from "./src/server/utils/stringUtils.js";

const prisma = new PrismaClient();

async function main() {
    console.log("A ler o ficheiro XLSX...");
    const workbook = xlsx.readFile("Horário saída de transferências.xlsx");
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return console.error("No sheets found");
    const worksheet = workbook.Sheets[sheetName];
    // Cast to expected format
    const resultados = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    console.log(`XLSX lido com sucesso. Processando ${resultados.length} linhas...`);
    let rotasCriadas = 0;

    for (let i = 0; i < resultados.length; i++) {
        const linhaAtual = resultados[i];
        const linhaSeguinte = resultados[i + 1] || [];

        const indexHorarios = linhaSeguinte.indexOf("Horários");
        
        if (linhaAtual && indexHorarios !== -1 && linhaAtual[indexHorarios]) {
            const nomeRotaText = linhaAtual[indexHorarios];
            if (typeof nomeRotaText !== 'string') continue;
            
            const nomeRota = nomeRotaText.trim();
            const cidadesStr = nomeRota.split(/ X | x |X/i).map((c) => c.trim().split("-")[0]);

            console.log(`\nA processar Rota Matriz: ${nomeRota}`);
            
            const rotaPadrao = await prisma.rotaPadrao.upsert({
                where: { nome: nomeRota },
                update: {},
                create: { nome: nomeRota },
            });

            await prisma.paradaPadrao.deleteMany({ where: { rotaId: rotaPadrao.id } });

            for (let index = 0; index < cidadesStr.length; index++) {
                const cidadeRaw = cidadesStr[index] || "Desconhecida";
                const cidadeNorm = normalizeCityName(cidadeRaw);
                
                const base = await prisma.base.upsert({
                    where: { nome: cidadeNorm },
                    update: {},
                    create: { nome: cidadeNorm, cidade: cidadeRaw, raioMetros: 500 },
                });

                let horaChegada = null;
                let horaSaida = null;

                const parseExcelTime = (val: string | number | null | undefined): string | null => {
                    if (val == null || val === "-" || val === "") return null;
                    if (typeof val === 'number') {
                        const totalSeconds = Math.round(val * 86400);
                        const h = Math.floor(totalSeconds / 3600);
                        const m = Math.floor((totalSeconds % 3600) / 60);
                        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
                    }
                    if (typeof val === 'string' && val.includes(':')) {
                        const parts = val.split(':');
                        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
                    }
                    return String(val).trim();
                };

                if (index === 0) {
                    horaSaida = parseExcelTime(linhaSeguinte[indexHorarios + 1]);
                } else if (index === cidadesStr.length - 1) {
                    const colChegada = indexHorarios + 3 + (index - 1) * 4;
                    horaChegada = parseExcelTime(linhaSeguinte[colChegada]);
                } else {
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

                console.log(`  -> Parada ${index}: ${cidadeNorm} | Chegada: ${horaChegada || "--"} | Saída: ${horaSaida || "--"}`);
            }
            rotasCriadas++;
        }
    }

    console.log(`\n✅ Importação de ${rotasCriadas} Rotas Matriz concluída com sucesso!`);
    await prisma.$disconnect();
}

main().catch(console.error);