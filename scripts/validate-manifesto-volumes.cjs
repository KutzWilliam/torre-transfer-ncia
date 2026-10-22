// Valida semântica de picking / historico_volume por manifesto (somente leitura)
const { Pool } = require("pg");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const pool = new Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

async function main() {
    console.log("manifesto_status:", JSON.stringify((await pool.query(`SELECT id_status, descricao FROM manifesto_status ORDER BY 1`)).rows));
    console.log("picking tipo/status:", JSON.stringify((await pool.query(`SELECT tipo, status, COUNT(*)::int n FROM picking GROUP BY 1,2 ORDER BY 1,2`)).rows));

    // manifestos recentes com picking
    const ms = await pool.query(`
        SELECT m.id_manifesto, m.status, m.prev_saida_data, m.chegada_efetiva_data, m.data_finalizado
        FROM manifesto m
        WHERE m.id_manifesto IN (SELECT id_manifesto FROM picking ORDER BY id DESC LIMIT 400)
        ORDER BY m.id_manifesto DESC LIMIT 6`);
    console.log("amostra:", JSON.stringify(ms.rows));

    for (const m of ms.rows) {
        const id = m.id_manifesto;
        const r = await pool.query(`
            SELECT
              (SELECT COUNT(DISTINCT ml.minuta)::int FROM manifesto_list ml WHERE ml.id_manifesto=$1) AS minutas,
              (SELECT COALESCE(SUM(mn.total_volumes),0)::int FROM manifesto_list ml JOIN minuta mn ON mn.id_minuta=ml.minuta WHERE ml.id_manifesto=$1) AS vol_total_minuta,
              (SELECT COUNT(*)::int FROM volumes v WHERE v.id_minuta IN (SELECT minuta FROM manifesto_list WHERE id_manifesto=$1)) AS vol_tabela_volumes,
              (SELECT json_agg(x) FROM (SELECT tipo, COUNT(*)::int linhas, COUNT(DISTINCT id_volume)::int vols, COUNT(DISTINCT unidade)::int unids FROM historico_volume WHERE manifesto=$1 GROUP BY tipo ORDER BY tipo) x) AS hist,
              (SELECT json_agg(p) FROM (SELECT tipo, unidade, status, iniciado, finalizado FROM picking WHERE id_manifesto=$1) p) AS pick
        `, [id]);
        console.log(id, JSON.stringify(r.rows[0]));
    }
    await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
