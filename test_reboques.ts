import 'dotenv/config';
import * as xlsx from 'xlsx';
import { getPlacaAtivaSascar } from './src/server/utils/sascarUtils';

async function main() {
    const workbook = xlsx.readFile('informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

    console.log(`Lendo ${rawData.length} viagens do arquivo novo...\n`);

    let resolvidosReboque = 0;
    let okPlacaNormal = 0;
    let perdidos = 0;

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row["Nº Viagem"]) continue;

        const motorista = row["Motorista/Usuário MOBILE"];
        const placa = String(row["Placa Programação"] || row["Placa/MOBILE"] || "");
        const reboque = String(row["Reboque 1"] || "");
        
        const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const reboqueLimpo = reboque.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        const placaReal = await getPlacaAtivaSascar(placa, reboque);

        if (placaReal === reboqueLimpo && reboqueLimpo !== "") {
            console.log(`✅ [RECUPERADA] Viagem ${row["Nº Viagem"]} (${motorista}): O Cavalo [${placaLimpa}] falhou, mas achamos o REBOQUE [${placaReal}] na telemetria!`);
            resolvidosReboque++;
        } else if (placaReal === placaLimpa && placaLimpa !== "") {
            console.log(`✅ [OK] Viagem ${row["Nº Viagem"]} (${motorista}): O Cavalo [${placaReal}] existe normalmente na telemetria.`);
            okPlacaNormal++;
        } else {
            console.log(`❌ [FALHA] Viagem ${row["Nº Viagem"]} (${motorista}): Nem Cavalo [${placaLimpa}] nem Reboque [${reboqueLimpo}] existem na telemetria.`);
            perdidos++;
        }
    }

    console.log(`\n=== RESUMO DA MUDANÇA ===`);
    console.log(`Viagens salvas usando o Reboque: ${resolvidosReboque}`);
    console.log(`Viagens normais (Cavalo OK): ${okPlacaNormal}`);
    console.log(`Incomunicáveis mesmo com Reboque: ${perdidos}`);
    
    process.exit(0);
}
main().catch(console.error);
