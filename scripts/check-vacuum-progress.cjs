const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db'
  });

  await client.connect();
  const res = await client.query(`
    SELECT 
      pid,
      command,
      phase,
      cluster_index_relid::regclass as index_name,
      heap_tuples_scanned,
      heap_tuples_written,
      heap_blks_total,
      heap_blks_scanned,
      index_rebuild_count
    FROM pg_stat_progress_cluster;
  `);

  console.log('VACUUM FULL Progress:', res.rows);
  await client.end();
}

run().catch(console.error);
