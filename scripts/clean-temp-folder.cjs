const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

console.log('=== LIMPANDO ARQUIVOS TEMPORÁRIOS DO USUÁRIO ===');
const tempDir = os.tmpdir();
let freedBytes = 0;
try {
  const files = fs.readdirSync(tempDir);
  for (const f of files) {
    try {
      const p = path.join(tempDir, f);
      const st = fs.statSync(p);
      if (st.isFile()) {
        fs.unlinkSync(p);
        freedBytes += st.size;
      }
    } catch (e) {
      // ignora arquivos em uso
    }
  }
} catch (e) {}

console.log(`Liberados em %TEMP%: ${(freedBytes / (1024*1024)).toFixed(0)} MB`);

try {
  const out = execSync('powershell "Get-PSDrive C | Select-Object -ExpandProperty Free"', { encoding: 'utf-8' });
  const freeMB = (Number(out.trim()) / (1024 * 1024)).toFixed(0);
  console.log(`Espaço livre atual no disco C: ${freeMB} MB`);
} catch (e) {}
