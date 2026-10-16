const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const vhdxPath = path.join(process.env.LOCALAPPDATA, 'Docker', 'wsl', 'disk', 'docker_data.vhdx');
if (fs.existsSync(vhdxPath)) {
  const stat = fs.statSync(vhdxPath);
  console.log(`Tamanho de docker_data.vhdx: ${(stat.size / (1024*1024*1024)).toFixed(2)} GB`);
}

const out = execSync('powershell "Get-PSDrive C | Select-Object -ExpandProperty Free"', { encoding: 'utf-8' });
const freeMB = (Number(out.trim()) / (1024 * 1024)).toFixed(0);
console.log(`Espaço livre no disco C: ${freeMB} MB (${(freeMB/1024).toFixed(2)} GB)`);
