/**
 * Backfill dataInicioEfetivo / dataFimEfetivo from o Excel de viagens
 * usando as colunas "Data Início" e "Data Fim" que contêm os horários reais.
 */
require('dotenv').config();
const xlsx = require('xlsx');
const path = require('path');
const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

const parseDate = (str) => {
    if (!str) return null;
    const s = String(str).trim();
    if (!s || !s.includes('/')) return null;
    try {
        const [datePart, timePart] = s.split(' ');
        const [day, month, year] = (datePart || '').split('/');
        const [h, m, sec] = (timePart || '00:00:00').split(':');
        const d = new Date(Number(year), Number(month) - 1, Number(day), Number(h), Number(m), Number(sec));
        return isNaN(d.getTime()) ? null : d;
    } catch { return null; }
};

async function main() {
    // Read all xlsx files in the project root
    const files = [
        'informação de viagens iniciada do dia 18 a 20.xlsx',
    ];

    let updated = 0;

    for (const fname of files) {
        const file = path.join(__dirname, fname);
        let wb;
        try { wb = xlsx.readFile(file); } catch { console.log(`Arquivo não encontrado: ${fname}`); continue; }
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = xlsx.utils.sheet_to_json(ws, { defval: null });

        for (const row of rows) {
            const id = String(row['Nº Viagem'] || '').trim();
            if (!id) continue;

            const dataInicio = parseDate(row['Data Início']);
            const dataFim = parseDate(row['Data Fim']);

            if (!dataInicio && !dataFim) continue;

            const viagem = await prisma.viagem.findUnique({ where: { id } });
            if (!viagem) continue;

            await prisma.viagem.update({
                where: { id },
                data: {
                    dataInicioEfetivo: dataInicio ?? undefined,
                    dataFimEfetivo: dataFim ?? undefined,
                }
            });
            updated++;
        }
    }

    console.log(`✅ Backfilled ${updated} viagens com datas reais do Excel.`);

    // Verify 37669539
    const v = await prisma.viagem.findUnique({ where: { id: '37669539' } });
    console.log('\nViagem 37669539:');
    console.log('  dataInicioEfetivo:', v?.dataInicioEfetivo?.toLocaleString('pt-BR'));
    console.log('  dataFimEfetivo:   ', v?.dataFimEfetivo?.toLocaleString('pt-BR'));

    await prisma.$disconnect();
}
main().catch(console.error);
