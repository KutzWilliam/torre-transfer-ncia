/**
 * SINCRONIZA ROTAS DO ANGELLIRA (SM) COM A MATRIZ DE ROTAS (RotaPadrao)
 *
 * Lê "rotas angellira.csv" e, para cada rota, verifica se ela já existe no sistema
 * comparando a CHAVE CANÔNICA (cidades normalizadas), de modo que
 *   "CURITIBA X PONTA GROSSA"  ==  "EPC-CURITIBA-PR - 135 .. EPC-PONTA GROSSA-PR - 116"
 * são tratadas como a mesma rota. Só cria o que realmente não existe.
 *
 * Uso:
 *   npx tsx importar-rotas-angellira.ts           (simulação - só relatório)
 *   npx tsx importar-rotas-angellira.ts --apply   (grava no banco)
 *
 * Rotas novas são criadas sem horários (prevChegada/prevSaida nulos);
 * complete-os depois pela tela de rotas.
 */

import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { chaveRota, normalizeCityName, normalizeString } from "./src/server/utils/stringUtils.js";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

async function main() {
    // CSV do AngelLira vem em Windows-1252 (latin1)
    const texto = fs.readFileSync("rotas angellira.csv", "latin1");
    const linhas = texto.split(/\r?\n/).filter((l) => l.trim());
    linhas.shift(); // cabeçalho

    const rotasDb = await prisma.rotaPadrao.findMany();
    const chavesDb = new Map(rotasDb.map((r) => [chaveRota(r.nome), r.nome]));

    const jaExistem: string[] = [];
    const novas: string[] = [];
    const vistas = new Set<string>();

    for (const linha of linhas) {
        const cols = linha.split(";");
        const nomeRota = (cols[1] ?? "").trim();
        if (!nomeRota) continue;

        const chave = chaveRota(nomeRota);
        if (vistas.has(chave)) continue; // duplicada dentro do próprio CSV
        vistas.add(chave);

        if (chavesDb.has(chave)) {
            jaExistem.push(`${nomeRota}  ->  ${chavesDb.get(chave)}`);
            continue;
        }
        novas.push(nomeRota);

        if (!APPLY) continue;

        const cidades = chave.split(">");
        const rota = await prisma.rotaPadrao.create({ data: { nome: cidades.join(" X ") } });
        for (let i = 0; i < cidades.length; i++) {
            const cidadeNorm = normalizeCityName(cidades[i]);
            const base = await prisma.base.upsert({
                where: { nome: cidadeNorm },
                update: {},
                create: { nome: cidadeNorm, cidade: cidadeNorm, raioMetros: 500 },
            });
            await prisma.paradaPadrao.create({ data: { rotaId: rota.id, baseId: base.id, ordem: i } });
        }
    }

    console.log(`\n✅ Já existentes no sistema: ${jaExistem.length}`);
    console.log(`🆕 ${APPLY ? "Criadas" : "A criar (simulação)"}: ${novas.length}`);
    novas.forEach((n) => console.log(`   + ${n}`));
    if (!APPLY) console.log("\nℹ️  Rode com --apply para gravar.");

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
