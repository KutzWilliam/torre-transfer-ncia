const { Client } = require('pg');
(async () => {
  console.log('Testando conexão com o PostgreSQL...');
  const c = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db',
    connectionTimeoutMillis: 5000
  });
  try {
    await c.connect();
    console.log('Conexão estabelecida com sucesso!');
    const r = await c.query('SELECT 1 as ok, pg_is_in_recovery() as in_recovery');
    console.table(r.rows);
    await c.end();
  } catch (err) {
    console.error('Falha na conexão:', err.message);
  }
})();
