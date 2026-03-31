/**
 * scripts/prisma-generate.cjs
 * 
 * Executa `prisma generate` com re-tentativas automáticas.
 * Necessário porque o Windows Defender bloqueia brevemente o arquivo
 * query_engine-windows.dll.node durante o scan antivírus.
 * Retentativas resolvem o problema sem precisar de privilégios de administrador.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const MAX_ATTEMPTS = 8;
const DELAY_MS = 3000;
const GENERATED_PATH = path.join(__dirname, "..", "generated", "prisma");

function sleep(ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) { /* busy wait */ }
}

function cleanGenerated() {
    try {
        if (fs.existsSync(GENERATED_PATH)) {
            fs.rmSync(GENERATED_PATH, { recursive: true, force: true });
        }
    } catch (_) {
        // Ignora erros de limpeza — o antivírus pode estar segurando
    }
}

console.log("🔄 Gerando Prisma Client...");
cleanGenerated();

let lastError = null;
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
        execSync("npx prisma generate", {
            stdio: "inherit",
            env: { ...process.env },
        });
        console.log("✅ Prisma Client gerado com sucesso!");
        process.exit(0);
    } catch (err) {
        lastError = err;
        const isEperm =
            (err.stderr ?? "").includes("EPERM") ||
            (err.stdout ?? "").includes("EPERM") ||
            String(err).includes("EPERM");

        if (isEperm && attempt < MAX_ATTEMPTS) {
            console.log(
                `⚠️  Bloqueio do antivírus detectado (tentativa ${attempt}/${MAX_ATTEMPTS}). ` +
                `Aguardando ${DELAY_MS / 1000}s...`
            );
            // Limpa os arquivos temporários antes de tentar novamente
            cleanGenerated();
            sleep(DELAY_MS);
        } else {
            break;
        }
    }
}

console.error("❌ Falha ao gerar Prisma Client após", MAX_ATTEMPTS, "tentativas.");
console.error(lastError?.message ?? lastError);
process.exit(1);
