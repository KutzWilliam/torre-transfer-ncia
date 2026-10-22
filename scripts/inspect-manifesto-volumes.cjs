// Inspeciona tabelas relacionadas a manifesto/volumes/picking (somente leitura)
const { Pool } = require("pg");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

async function main() {
    const tabelas = ["manifesto", "manifesto_list", "manifesto_status", "minuta", "picking", "historico_volume", "volumes", "unidades"];
    for (const t of tabelas) {
        const c = await pool.query(
            `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name=$1 ORDER BY ordinal_position`, [t]);
        console.log(`\n=== ${t} ===`);
        console.log(c.rows.map(r => `${r.column_name} (${r.data_type})`).join(", ") || "(não existe)");
        try {
            const n = await pool.query(`SELECT COUNT(*)::text AS n FROM ${t}`);
            console.log("linhas:", n.rows[0].n);
        } catch (e) { console.log("erro count:", e.message); }
    }
    const idx = await pool.query(`SELECT tablename, indexname FROM pg_indexes WHERE tablename IN ('picking','historico_volume','volumes','manifesto_list','minuta')`);
    console.log("\n=== índices ===\n" + idx.rows.map(r => `${r.tablename}: ${r.indexname}`).join("\n"));
    await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
