// Script 4 - testa conexão direta ao banco torre_controle e verifica registros recentes
// e qual estrutura tem a tabela manifesto
import pg from "pg";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const pool = new pg.Pool({ connectionString: process.env.TELEMETRIA_DB_URL });

async function main() {
    const client = await pool.connect();
    try {
        console.log("=== 1. Estrutura da tabela manifesto (colunas) ===");
        const r1 = await client.query(`
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'manifesto'
            ORDER BY ordinal_position
        `);
        console.log(r1.rows.map(r => `${r.column_name} (${r.data_type})`).join('\n'));

        console.log("\n=== 2. Amostra de manifesto com id_manifesto mais alto ===");
        const r2 = await client.query(`
            SELECT id_manifesto::text, prev_saida_data::text, veiculo::text
            FROM manifesto
            ORDER BY id_manifesto::bigint DESC
            LIMIT 5
        `);
        console.log(JSON.stringify(r2.rows, null, 2));

        console.log("\n=== 3. Manifesto nos últimos 30 dias de dados disponíveis ===");
        const r3 = await client.query(`
            SELECT
                LEFT(prev_saida_data::text, 10) AS data,
                COUNT(*) as qtd,
                MAX(id_manifesto::bigint) as max_id
            FROM manifesto
            WHERE prev_saida_data::text NOT LIKE '0000%'
            GROUP BY 1
            ORDER BY 1 DESC
            LIMIT 15
        `);
        console.log(JSON.stringify(r3.rows, null, 2));

        console.log("\n=== 4. Verificando se existe tabela MDFe com dados mais recentes ===");
        const r4 = await client.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'MDFe' LIMIT 10
        `);
        console.log("Colunas MDFe:", r4.rows.map(r => r.column_name));

        const r4b = await client.query(`
            SELECT COUNT(*) as total FROM "MDFe"
        `);
        console.log("Total MDFe:", r4b.rows[0].total);

    } catch (err) {
        console.error("ERRO:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

main();
