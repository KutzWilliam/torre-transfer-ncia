// Restaura todas as tabelas de negócio a partir do backup JSON gerado
process.env.TZ = 'UTC';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups', 'pre-limpeza-2026-10-14');

// Ordem estrita respeitando chaves estrangeiras
const ORDEM_TABELAS = [
  'Base',
  'User',
  'Veiculo',
  'Regional',
  'RotaPadrao',
  'ParadaPadrao',
  'VeiculoRegional',
  'Viagem',
  'ParadaViagem',
  'Ocorrencia',
  'JustificativaAtraso',
  'CadastroAngelMotorista',
  'CadastroAngelVeiculo'
];

async function run() {
  console.log('=== RESTAURAÇÃO DAS TABELAS DE NEGÓCIO ===');
  console.log('Diretório de backup:', BACKUP_DIR);
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();

  for (const table of ORDEM_TABELAS) {
    const file = path.join(BACKUP_DIR, `${table}.json`);
    if (!fs.existsSync(file)) {
      console.log(`Pulando ${table} (arquivo não encontrado)`);
      continue;
    }
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (rows.length === 0) {
      console.log(`${table.padEnd(24)}: 0 registros (vazio)`);
      continue;
    }

    // Identifica colunas
    const cols = Object.keys(rows[0]);
    const colList = cols.map(c => `"${c}"`).join(', ');

    console.log(`Restaurando ${table.padEnd(22)} (${rows.length} registros)...`);
    const t0 = Date.now();

    // Insere em lotes de 500
    const batchSize = 500;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const values = [];
      const params = [];
      let paramIdx = 1;

      for (const row of batch) {
        const rowParams = [];
        for (const col of cols) {
          params.push(row[col]);
          rowParams.push(`$${paramIdx++}`);
        }
        values.push(`(${rowParams.join(', ')})`);
      }

      const q = `INSERT INTO "${table}" (${colList}) VALUES ${values.join(', ')} ON CONFLICT DO NOTHING;`;
      await c.query(q, params);
    }
    const sec = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`✓ ${table.padEnd(22)}: ${rows.length} registros em ${sec}s`);
  }

  console.log('\n=== RESTAURAÇÃO CONCLUÍDA COM SUCESSO! ===');
  await c.end();
}

run().catch(err => {
  console.error('Erro na restauração:', err);
  process.exit(1);
});
