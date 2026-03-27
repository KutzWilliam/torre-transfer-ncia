require('dotenv').config();
const xlsx = require('xlsx');

async function main() {
    // Para ts-node require hook no commonjs
    require('ts-node').register({ transpileOnly: true });
    const { getPlacaAtivaSascar } = require('./src/server/utils/sascarUtils.ts');

    const workbook = xlsx.readFile('informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    console.log(`Lendo ${rawData.length} viagens do arquivo novo...\n`);

    let encontrados = 0;
    let perdidos = 0;

    for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row["Nº Viagem"]) continue;

        const placa = String(row["Placa Programação"] || row["Placa/MOBILE"] || "");
        const reboque = String(row["Reboque 1"] || "");

        const placaReal = await getPlacaAtivaSascar(placa, reboque);

        const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (placaReal !== placaLimpa && placaReal !== "SEMPLACA") {
            console.log(`🔄 Viagem ${row["Nº Viagem"]}: Usou o REBOQUE [${placaReal}] ao invés da placa base [${placaLimpa}]`);
            encontrados++;
        } else if (placaReal === placaLimpa && placaReal !== "SEMPLACA") {
            // Verificar se de fato O CAVALO existia
            // (Na Utils ele sempre retorna p1 se não achou nada, mas nós vemos se é a real depois).
            // A utils retorna p1 se não achar e se achar tbm.
            // P/ log nós queremos saber se ele "salvou" o dia.
        }
    }

    console.log(`\nFim da simulação.`);
    process.exit(0);
}
main().catch(console.error);
