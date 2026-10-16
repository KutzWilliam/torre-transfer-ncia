// Backup em JSON das tabelas de negócio (exceto Telemetria). Somente leitura.
process.env.TZ = 'UTC';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  const dir = path.join(__dirname, '..', 'backups', 'pre-limpeza-' + new Date().toISOString().slice(0, 10));
  fs.mkdirSync(dir, { recursive: true });
  const { rows: tabs } = await c.query(`select tablename from pg_tables where schemaname='public' and tablename not in ('Telemetria','_prisma_migrations') order by 1`);
  for (const { tablename } of tabs) {
    const { rows } = await c.query(`select * from "${tablename}"`);
    fs.writeFileSync(path.join(dir, tablename + '.json'), JSON.stringify(rows));
    console.log(tablename.padEnd(26), rows.length, 'linhas');
  }
  console.log('Backup em', dir);
  await c.end();
})();
