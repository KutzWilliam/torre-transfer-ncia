const { Client } = require('pg');
const { execSync } = require('child_process');

function getFreeDiskMB() {
  try {
    const out = execSync('powershell "Get-PSDrive C | Select-Object -ExpandProperty Free"', { encoding: 'utf-8' });
    return (Number(out.trim()) / (1024 * 1024)).toFixed(0);
  } catch (e) {
    return 'N/A';
  }
}

(async () => {
  console.log(`Espaço livre inicial no disco C: ${getFreeDiskMB()} MB`);
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();

  console.log('1. Removendo índice Telemetria_veiculoId_dataHoraLocal_idx (6.4 GB)...');
  const t0 = Date.now();
  await c.query(`DROP INDEX IF EXISTS "Telemetria_veiculoId_dataHoraLocal_idx";`);
  console.log(`Índice removido em ${((Date.now() - t0) / 1000).toFixed(1)}s!`);
  console.log(`Espaço livre após drop do índice: ${getFreeDiskMB()} MB`);

  console.log('2. Removendo chave primária Telemetria_pkey (30 GB)...');
  const t1 = Date.now();
  await c.query(`ALTER TABLE "Telemetria" DROP CONSTRAINT IF EXISTS "Telemetria_pkey";`);
  console.log(`Chave primária removida em ${((Date.now() - t1) / 1000).toFixed(1)}s!`);
  console.log(`Espaço livre após drop da PK: ${getFreeDiskMB()} MB`);

  await c.end();
})();
