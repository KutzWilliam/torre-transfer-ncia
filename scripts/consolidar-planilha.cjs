const xlsx = require('xlsx');
const path = require('path');

const wb = xlsx.readFile('Capacidade veiculos transferências por fornecedor.xlsx');

const resultado = [];

for (const sheetName of wb.SheetNames) {
  const ws = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(ws, { header: 1 });
  
  // Encontrar linha de cabeçalho
  let headerIdx = -1;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r && r.some(c => typeof c === 'string' && (c.toLowerCase().includes('linha') || c.toLowerCase().includes('rota')))) {
      headerIdx = i;
      break;
    }
  }

  if (headerIdx === -1) {
    console.log(`Não achou cabeçalho na aba ${sheetName}`);
    continue;
  }

  const headers = rows[headerIdx].map(h => (h || '').toString().trim());
  const dataRows = rows.slice(headerIdx + 1);

  for (const r of dataRows) {
    if (!r || r.length === 0 || !r[2]) continue; // sem linha/rota
    
    // Objeto mapeado
    const item = {
      fornecedorAba: sheetName,
      lote: r[0],
      filial: r[1],
      linha: (r[2] || '').toString().trim(),
      nroVeiculos: Number(r[3]) || 0,
      tipoVeiculo: (r[4] || '').toString().trim(),
      totalKm: Number(r[5]) || 0,
      valorKm: Number(r[6]) || 0,
      valorTotal: Number(r[7]) || 0,
      cubagem: (r[8] || '').toString().trim(),
      peso: (r[9] || '').toString().trim()
    };
    
    // Extrai número de cubagem e peso se possível
    const m3Match = item.cubagem.match(/(\d+[\.,]?\d*)/);
    item.cubagemM3 = m3Match ? parseFloat(m3Match[1].replace(',', '.')) : 0;
    
    const pesoMatch = item.peso.match(/(\d+[\.,]?\d*)/);
    item.pesoTon = pesoMatch ? parseFloat(pesoMatch[1].replace(',', '.')) : 0;
    item.pesoKg = item.pesoTon * 1000;

    resultado.push(item);
  }
}

console.log(`Total de rotas contratuais na planilha: ${resultado.length}`);
console.log('Amostra das rotas:');
console.table(resultado.slice(0, 15).map(r => ({
  parceiro: r.fornecedorAba,
  filial: r.filial,
  linha: r.linha.substring(0, 35),
  veiculos: r.nroVeiculos,
  tipo: r.tipoVeiculo,
  km: r.totalKm,
  custoKm: r.valorKm,
  custoViagem: r.valorTotal,
  capacidadeKg: r.pesoKg,
  capacidadeM3: r.cubagemM3
})));

// Totais por parceiro
const resumo = {};
for (const r of resultado) {
  if (!resumo[r.fornecedorAba]) {
    resumo[r.fornecedorAba] = { rotas: 0, veiculos: 0, kmTotal: 0, custoTotal: 0 };
  }
  resumo[r.fornecedorAba].rotas++;
  resumo[r.fornecedorAba].veiculos += r.nroVeiculos;
  resumo[r.fornecedorAba].kmTotal += r.totalKm;
  resumo[r.fornecedorAba].custoTotal += r.valorTotal;
}
console.log('\n=== Resumo por Parceiro na Planilha ===');
console.table(resumo);
