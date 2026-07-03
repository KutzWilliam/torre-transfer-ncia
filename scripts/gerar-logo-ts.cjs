/**
 * Script para gerar o arquivo de logo base64 para uso no PDF.
 * Execute: node scripts/gerar-logo-ts.cjs
 */
const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, '..', 'public', 'cropped-icon.png')).toString('base64');
const dataUri = 'data:image/png;base64,' + b64;

const content = `// Auto-gerado por scripts/gerar-logo-ts.cjs — não edite manualmente.
export const LOGO_BASE64 = "${dataUri}";
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'lib', 'logoBase64.ts'), content);
console.log('✅ src/lib/logoBase64.ts gerado com sucesso!');
