/**
 * scripts/relatorio-semanal-cron.mjs
 *
 * Script executado pelo PM2 toda sexta-feira às 8h.
 * Chama o endpoint /api/relatorio-semanal para disparar o envio do relatório.
 *
 * Configuração no ecosystem.config.cjs:
 *   { name: "relatorio-semanal", script: "scripts/relatorio-semanal-cron.mjs", cron_restart: "0 8 * * 5", autorestart: false }
 */

const APP_URL     = process.env.APP_URL     ?? "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

async function executar() {
    const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    console.log(`\n📊 [${agora}] Disparando relatório semanal...`);

    if (!CRON_SECRET) {
        console.error("❌ CRON_SECRET não definido. Configure a variável de ambiente.");
        process.exit(1);
    }

    try {
        const res = await fetch(`${APP_URL}/api/relatorio-semanal`, {
            method: "GET",
            headers: { Authorization: `Bearer ${CRON_SECRET}` },
        });

        const json = await res.json();

        if (!res.ok || !json.sucesso) {
            console.error(`❌ Falha: ${JSON.stringify(json)}`);
            process.exit(1);
        }

        console.log(`✅ Relatório enviado com sucesso em ${json.duracao_ms}ms`);
        console.log(`   Enviados: ${json.resultado?.enviados ?? 0} | Erros: ${json.resultado?.erros ?? 0}`);
    } catch (err) {
        console.error("❌ Erro ao chamar endpoint:", err.message ?? err);
        process.exit(1);
    }
}

executar();
