const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db' });
  await c.connect();
  console.log('Consultando dados dos últimos 15 dias...');
  const cutoff = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
  console.log('Data de corte (15 dias atrás):', cutoff.toISOString());

  // Como não há índice em dataHoraLocal agora, uma varredura sequencial em 600M linhas pode demorar se não filtrarmos com cuidado.
  // Mas espera: podemos usar um sample ou verificar com ctid ou dataHoraUtc.
  // Vamos ver o min e max dos últimos 15 dias:
  const r = await c.query(`
    SELECT count(*) as total_ultimos_15d 
    FROM "Telemetria" 
    WHERE "dataHoraLocal" >= NOW() - INTERVAL '15 days'
  `);
  console.table(r.rows);
  await c.end();
})();
