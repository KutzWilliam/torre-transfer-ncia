const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== VERIFICANDO LIMPEZA EMERGENCIAL DE DISCO HOST ===');

// 1. Limpar .next/cache (recriado automaticamente no próximo build)
const nextCache = path.join(__dirname, '..', '.next', 'cache');
if (fs.existsSync(nextCache)) {
  try {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log('Cache do Next.js (.next/cache) limpo!');
  } catch (e) {
    console.log('Erro ao limpar .next/cache:', e.message);
  }
}

// 2. Limpar Lixeira do Windows
try {
  execSync('powershell "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"', { timeout: 30000 });
  console.log('Lixeira do Windows esvaziada!');
} catch (e) {
  console.log('Aviso ao limpar lixeira:', e.message);
}

// 3. Medir espaço livre agora
try {
  const out = execSync('powershell "Get-PSDrive C | Select-Object -ExpandProperty Free"', { encoding: 'utf-8' });
  const freeMB = (Number(out.trim()) / (1024 * 1024)).toFixed(0);
  console.log(`\nEspaço livre atual no disco C: ${freeMB} MB`);
} catch (e) {}
