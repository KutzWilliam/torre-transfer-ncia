require('dotenv').config();
const xlsx = require('xlsx');

async function main() {
    process.env.TS_NODE_TRANSPILE_ONLY = "true";
    require('ts-node').register();
    const { getPlacaAtivaSascar } = require('./src/server/utils/sascarUtils.ts');

    const workbook = xlsx.readFile('informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const row = rawData.find((r) => String(r["Nº Viagem"]) === '37675568');
    
    if (!row) {
        console.log("Viagem 37675568 não encontrada na planilha!");
        return;
    }

    const placaProg = String(row["Placa Programação"] || "");
    const placaMob = String(row["Placa/MOBILE"] || "");
    const reboque = String(row["Reboque 1"] || "");
    
    // Na nossa página de upload, nós passamos placa = (Placa Programação || Placa/MOBILE || "")
    const placaBase = placaProg || placaMob;

    console.log(`Dados na Planilha para 37675568:`);
    console.log(`- Placa Base: [${placaBase}]`);
    console.log(`- Reboque: [${reboque}]`);

    const resultado = await getPlacaAtivaSascar(placaBase, reboque);
    console.log(`\nResultado do Algoritmo getPlacaAtivaSascar: ${resultado}`);

    // Extra manual check with pg
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const p1 = placaBase.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const p2 = reboque.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const q1 = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${p1}%`]);
    const q2 = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${p2}%`]);

    console.log(`\nQuery Reais no Sascar:`);
    console.log(`Cavalo (LIKE '%${p1}%'): encontradas ${q1.rows.length} placas`);
    if(q1.rows.length > 0) console.table(q1.rows);

    if (p2) {
        console.log(`Reboque (LIKE '%${p2}%'): encontradas ${q2.rows.length} placas`);
        if(q2.rows.length > 0) console.table(q2.rows);
    }

    await client.end();
}
main().catch(console.error);
