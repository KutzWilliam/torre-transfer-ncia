const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL, connectionTimeoutMillis: 15000 });

async function findValue() {
  const tables = ['rotas', 'unidades', 'filiais_protheus', 'estrutura_regioes', 'aero', 'roteiros'];
  for (const t of tables) {
    try {
      const cols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
      `, [t]);
      
      const charCols = cols.rows.filter(c => ['text', 'character varying', 'bigint', 'integer'].includes(c.data_type)).map(c => c.column_name);
      
      for (const col of charCols) {
        const q = await pool.query(`SELECT "${col}" FROM "${t}" WHERE "${col}"::text = '100375' LIMIT 1;`);
        if (q.rows.length > 0) {
          console.log(`ACHOU em ${t}.${col} = 100375!`);
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Vamos também ver o manifesto 182495 que tinha 100375
  console.log("\n=== Manifesto 182495 completo ===");
  const m182 = await pool.query("SELECT * FROM manifesto WHERE id_manifesto = 182495;");
  console.log(m182.rows[0]);
}

findValue().catch(console.error).finally(() => pool.end());
