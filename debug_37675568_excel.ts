import 'dotenv/config';
import xlsx from 'xlsx';
import { Client } from 'pg';

async function main() {
    const workbook = xlsx.readFile('c:\\Users\\william.kutz\\Documents\\Sistema Princesa\\torre-transferencia\\informação de viagens.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

    const row = rawData.find((r) => String(r["Nº Viagem"]) === '37675568');
    
    if (!row) {
        console.log("Viagem 37675568 não encontrada na planilha!");
        process.exit(0);
    }

    const placaProg = String(row["Placa Programação"] || "");
    const placaMob = String(row["Placa/MOBILE"] || "");
    const reboque = String(row["Reboque 1"] || "");
    
    const placaBase = placaProg || placaMob;

    console.log(`Dados na Planilha para 37675568:`);
    console.log(`- Placa Base: [${placaBase}]`);
    console.log(`- Reboque: [${reboque}]`);

    const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
    await client.connect();

    const p1 = placaBase.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const p2 = reboque.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const q1 = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${p1}%`]);
    console.log(`\nQuery Reais no Sascar:`);
    console.log(`Cavalo (LIKE '%${p1}%'): encontradas ${q1.rows.length} placas`);
    if(q1.rows.length > 0) console.table(q1.rows);

    if (p2) {
        const q2 = await client.query(`SELECT "idVeiculo", placa FROM veiculos_sascar WHERE placa LIKE $1`, [`%${p2}%`]);
        console.log(`Reboque (LIKE '%${p2}%'): encontradas ${q2.rows.length} placas`);
        if(q2.rows.length > 0) console.table(q2.rows);
    } else {
        console.log("Nenhum reboque informado na planilha para pesquisar.");
    }

    await client.end();
    process.exit(0);
}
main().catch(console.error);
