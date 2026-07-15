/**
 * Seed completo das regionais (agrupadas por GERENTE) a partir do CSV.
 * Contém todos os 167 veículos com: placa, unidade, proprietario, responsavel, gerente.
 * Execute: npx tsx prisma/seed-regionais.ts
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

// Lê o JSON exportado do CSV (gerado automaticamente)
interface VeiculoCSV {
    placa: string;
    unidade: string;
    proprietario: string;
    responsavel: string;
    gerente: string;
}

function lerVeiculos(): VeiculoCSV[] {
    const jsonPath = join(process.cwd(), "prisma", "seed-data-regionais.json");
    const raw = readFileSync(jsonPath, "utf-8");
    return JSON.parse(raw) as VeiculoCSV[];
}

async function main() {
    console.log("🌱 Seed de gerentes/regionais iniciado...\n");

    const veiculos = lerVeiculos();

    // Coleta gerentes únicos
    const gerentes = [...new Set(veiculos.map(v => v.gerente))].filter(Boolean).sort();
    console.log(`📋 Gerentes encontrados: ${gerentes.length}`);
    for (const g of gerentes) {
        const qtd = veiculos.filter(v => v.gerente === g).length;
        console.log(`   • ${g}: ${qtd} veículos`);
    }
    console.log();

    // Remove dados antigos (regionais com nomes de unidades, não de gerentes)
    console.log("🗑  Limpando dados anteriores...");
    await prisma.veiculoRegional.deleteMany();
    await prisma.regional.deleteMany();
    console.log("   ✅ Dados anteriores removidos.\n");

    // Recria agrupado por gerente
    let totalCriados = 0;
    for (const gerente of gerentes) {
        const regional = await prisma.regional.create({ data: { nome: gerente } });
        console.log(`✅ Gerente: ${gerente}`);

        const veicsDoGerente = veiculos.filter(v => v.gerente === gerente);
        for (const v of veicsDoGerente) {
            try {
                await prisma.veiculoRegional.create({
                    data: {
                        placa:       v.placa,
                        unidade:     v.unidade    || null,
                        proprietario: v.proprietario || null,
                        responsavel: v.responsavel || null,
                        gerente:     v.gerente     || null,
                        regionalId:  regional.id,
                    },
                });
                totalCriados++;
            } catch (e) {
                console.warn(`   ⚠️  Placa duplicada ignorada: ${v.placa}`);
            }
        }
        console.log(`   → ${veicsDoGerente.length} veículos criados`);
    }

    console.log(`\n🎉 Seed concluído!`);
    console.log(`   Gerentes: ${gerentes.length}`);
    console.log(`   Veículos: ${totalCriados} criados`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
