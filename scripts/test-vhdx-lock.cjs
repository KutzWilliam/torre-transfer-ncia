const fs = require('fs');
const path = require('path');

const vhdxPath = path.join(process.env.LOCALAPPDATA, 'Docker', 'wsl', 'disk', 'docker_data.vhdx');
console.log('Testando acesso ao arquivo VHDX:', vhdxPath);

try {
  const fd = fs.openSync(vhdxPath, 'r+');
  fs.closeSync(fd);
  console.log('SUCESSO: VHDX não está bloqueado por nenhum processo!');
} catch (e) {
  console.log('VHDX ainda em uso:', e.message);
}
