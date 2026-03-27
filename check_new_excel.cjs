const xlsx = require('xlsx');

function main() {
    const workbook = xlsx.readFile('informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Ler os dados brutos da primeira aba (primeiras 10 linhas)
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log("== Headers ==");
    console.log(rawData[0]);
    
    console.log("\n== Amostra de Dados ==");
    for (let i = 1; i < Math.min(6, rawData.length); i++) {
        console.log(rawData[i]);
    }
}
main();
