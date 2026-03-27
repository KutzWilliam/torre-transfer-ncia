import 'dotenv/config';
import xlsx from 'xlsx';
import { getPlacaAtivaSascar } from './src/server/utils/sascarUtils';

async function main() {
    const workbook = xlsx.readFile('informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

    console.log(`Lendo ${rawData.length} viagens do arquivo novo...\n`);

    let resolvidosProg = 0;
    let resolvidosMob = 0;
    let resolvidosReboque = 0;
    let perdidos = 0;

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row["Nº Viagem"]) continue;

        const motorista = row["Motorista/Usuário MOBILE"];
        const placaProg = String(row["Placa Programação"] || "");
        const placaMob = String(row["Placa/MOBILE"] || "");
        const reboque = String(row["Reboque 1"] || "");
        
        const p1 = placaProg.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
        const p2 = placaMob.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
        const p3 = reboque.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);

        const placaReal = await getPlacaAtivaSascar(placaProg, placaMob, reboque);

        if (placaReal === p1 && p1 !== "") {
            resolvidosProg++;
        } else if (placaReal === p2 && p2 !== "") {
            console.log(`✅ [RECUPERADA: MOB] Viagem ${row["Nº Viagem"]} (${motorista}): Usou Placa Mobile [${placaReal}]!`);
            resolvidosMob++;
        } else if (placaReal === p3 && p3 !== "") {
            console.log(`✅ [RECUPERADA: REBOQUE] Viagem ${row["Nº Viagem"]} (${motorista}): Usou Reboque [${placaReal}]!`);
            resolvidosReboque++;
        } else {
            console.log(`❌ [FALHA] Viagem ${row["Nº Viagem"]} (${motorista}): Nem Prog [${p1}], Mob [${p2}] ou Reboque [${p3}] existem.`);
            perdidos++;
        }
    }

    console.log(`\n=== RESUMO CASCATA (PROG -> MOB -> REBOQUE) ===`);
    console.log(`Via Placa Programação: ${resolvidosProg}`);
    console.log(`Via Placa Mobile: ${resolvidosMob}`);
    console.log(`Via Reboque: ${resolvidosReboque}`);
    console.log(`Incomunicáveis totais: ${perdidos}`);
    
    process.exit(0);
}
main().catch(console.error);
