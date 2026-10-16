const { Client } = require('pg');

async function run() {
  console.log('--- Iniciando VACUUM FULL "Telemetria" ---');
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db'
  });

  await client.connect();
  console.log('Conectado ao PostgreSQL. Executando VACUUM FULL ANALYZE "Telemetria"...');
  const t0 = Date.now();

  try {
    await client.query('VACUUM FULL ANALYZE "Telemetria";');
    const durMin = ((Date.now() - t0) / 60000).toFixed(1);
    console.log(`VACUUM FULL concluído com sucesso em ${durMin} minutos!`);
  } catch (err) {
    console.error('Erro durante o VACUUM FULL:', err);
  } finally {
    await client.end();
  }
}

run();
