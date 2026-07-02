const fs = require('fs');

const b64 = fs.readFileSync('public/cropped-icon.png').toString('base64');
const dataUri = 'data:image/png;base64,' + b64;

const filePath = 'src/server/services/emailNotificacaoService.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The line we want to replace is:
// src="${(process.env.APP_URL ?? "http://localhost:3001").replace(/\/$/, "")}/cropped-icon.png"

content = content.replace(
  /src="\$\{\(process\.env\.APP_URL \?\? "http:\/\/localhost:3001"\)\.replace\(\/\\\/\\$\/, ""\)\}\/cropped-icon\.png"/g,
  `src="${dataUri}"`
);

fs.writeFileSync(filePath, content);
console.log('Logo injetada com sucesso no código!');
