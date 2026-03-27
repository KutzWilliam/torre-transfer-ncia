const xlsx = require('xlsx');
const path = require('path');

const file = path.join(__dirname, 'informação de viagens iniciada do dia 18 a 20.xlsx');
const wb = xlsx.readFile(file);

// Print all sheet names
console.log("Planilhas:", wb.SheetNames);

const ws = wb.Sheets[wb.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: null });

// Print first 5 rows to understand the structure
console.log("\nPrimeiras 5 linhas:");
for (let i = 0; i < Math.min(5, rows.length); i++) {
    console.log(`Row ${i}:`, JSON.stringify(rows[i]));
}

// Find viagem 37669539
console.log("\nBuscando viagem 37669539:");
for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row && row.some(c => String(c) === '37669539')) {
        console.log(`Encontrado na linha ${i}:`, JSON.stringify(row));
        // Print surrounding context (row before too for header context)
        if (i > 0) console.log(`Header row ${i-1}:`, JSON.stringify(rows[i-1]));
        if (i > 1) console.log(`Header row ${i-2}:`, JSON.stringify(rows[i-2]));
    }
}
