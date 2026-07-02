import { ImapFlow } from "imapflow";
import dns from "dns/promises";
import net from "net";
import tls from "tls";
import os from "os";

const HOST = "imap.gmail.com";
const PORT = 993;
const USER = "torre.notificacoes@gmail.com";
const PASS = "vrtidoryosqxyfpt";

// ─── Helpers ────────────────────────────────────────────────────────────────
const ok  = (msg) => console.log(`   ✅ ${msg}`);
const err = (msg) => console.log(`   ❌ ${msg}`);
const inf = (msg) => console.log(`   ℹ️  ${msg}`);
const sep = ()    => console.log("─".repeat(60));

// ─── 0. Ambiente ─────────────────────────────────────────────────────────────
sep();
console.log("🖥️  DIAGNÓSTICO DE CONEXÃO GMAIL — Torre Transferência");
sep();
inf(`Hostname da máquina : ${os.hostname()}`);
inf(`Plataforma          : ${os.platform()} ${os.release()}`);
inf(`Data/Hora local     : ${new Date().toISOString()}`);
inf(`Node.js             : ${process.version}`);

// ─── 1. Resolução DNS ────────────────────────────────────────────────────────
sep();
console.log("📡 PASSO 1 — Resolução DNS de imap.gmail.com");
let resolvedIPs = [];
try {
    resolvedIPs = await dns.resolve4(HOST);
    ok(`DNS resolvido → IPs: ${resolvedIPs.join(", ")}`);
} catch (e) {
    err(`Falha no DNS: ${e.message}`);
    console.log("\n🚨 DIAGNÓSTICO: Problema de DNS — verifique /etc/resolv.conf ou DNS do servidor.");
    process.exit(1);
}

// ─── 2. Teste TCP puro ───────────────────────────────────────────────────────
sep();
console.log(`🔌 PASSO 2 — Conexão TCP pura para ${HOST}:${PORT}`);
await new Promise((resolve) => {
    const sock = new net.Socket();
    const timeout = setTimeout(() => {
        sock.destroy();
        err(`TCP TIMEOUT após 10s — firewall ou roteamento bloqueando porta ${PORT}`);
        console.log("🚨 DIAGNÓSTICO: A porta 993 ainda está bloqueada (OUTBOUND) nesta máquina.");
        process.exit(1);
    }, 10_000);

    sock.connect(PORT, HOST, () => {
        clearTimeout(timeout);
        ok(`TCP conectado com sucesso (${sock.localAddress}:${sock.localPort} → ${sock.remoteAddress}:${sock.remotePort})`);
        sock.destroy();
        resolve();
    });

    sock.on("error", (e) => {
        clearTimeout(timeout);
        err(`TCP erro: [${e.code}] ${e.message}`);
        if (e.code === "ECONNREFUSED") inf("Porta rejeitada pelo servidor remoto.");
        if (e.code === "ETIMEDOUT")    inf("Timeout — firewall descartando pacotes silenciosamente.");
        if (e.code === "ENETUNREACH")  inf("Rota de rede indisponível.");
        process.exit(1);
    });
});

// ─── 3. Handshake TLS ────────────────────────────────────────────────────────
sep();
console.log(`🔐 PASSO 3 — Handshake TLS com ${HOST}:${PORT}`);
await new Promise((resolve) => {
    const timeout = setTimeout(() => {
        err("TLS TIMEOUT após 10s");
        process.exit(1);
    }, 10_000);

    const socket = tls.connect({ host: HOST, port: PORT, servername: HOST, rejectUnauthorized: false }, () => {
        clearTimeout(timeout);
        if (socket.authorized) {
            ok(`TLS estabelecido — Certificado válido`);
        } else {
            ok(`TLS estabelecido — Certificado auto-assinado/não verificado (${socket.authorizationError})`);
        }
        const cert = socket.getPeerCertificate();
        inf(`Emissor     : ${cert?.issuer?.O ?? "N/A"}`);
        inf(`Válido até  : ${cert?.valid_to ?? "N/A"}`);
        inf(`Protocolo   : ${socket.getProtocol()}`);
        inf(`Cipher      : ${socket.getCipher()?.name}`);
        socket.destroy();
        resolve();
    });

    socket.on("error", (e) => {
        clearTimeout(timeout);
        err(`TLS falhou: [${e.code ?? "sem código"}] ${e.message}`);
        if (e.message.includes("DEPTH_ZERO_SELF_SIGNED"))  inf("Certificado auto-assinado — pode ser proxy corporativo interceptando TLS.");
        if (e.message.includes("unable to verify"))        inf("Cadeia de certificados inválida — possível SSL inspection ativo.");
        process.exit(1);
    });
});

// ─── 4. Autenticação IMAP (ImapFlow) ────────────────────────────────────────
sep();
console.log("📬 PASSO 4 — Autenticação IMAP com ImapFlow");
inf(`Usuário : ${USER}`);
inf(`Senha   : ${"*".repeat(PASS.length)} (${PASS.length} chars)`);

const client = new ImapFlow({
    host: HOST,
    port: PORT,
    secure: true,
    auth: { user: USER, pass: PASS },
    logger: {
        debug: (obj) => console.log(`   [IMAP DBG] ${obj.msg ?? JSON.stringify(obj)}`),
        info:  (obj) => console.log(`   [IMAP INF] ${obj.msg ?? JSON.stringify(obj)}`),
        warn:  (obj) => console.log(`   [IMAP WRN] ${obj.msg ?? JSON.stringify(obj)}`),
        error: (obj) => console.log(`   [IMAP ERR] ${obj.msg ?? JSON.stringify(obj)}`),
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 15_000,
    greetingTimeout:   10_000,
    socketTimeout:     20_000,
});

try {
    await client.connect();
    ok("Autenticado com sucesso!");

    sep();
    console.log("📂 PASSO 5 — Leitura do INBOX");
    const lock = await client.getMailboxLock("INBOX");
    try {
        const status = await client.status("INBOX", { messages: true, unseen: true, recent: true });
        ok(`INBOX acessado:`);
        inf(`  Total    : ${status.messages} e-mail(s)`);
        inf(`  Não lidos: ${status.unseen}`);
        inf(`  Recentes : ${status.recent}`);
    } finally {
        lock.release();
    }

    await client.logout();
    sep();
    console.log("🎉 TODOS OS TESTES PASSARAM — Gmail pronto para uso na produção!");
    sep();
    process.exit(0);

} catch (e) {
    err(`ImapFlow falhou:`);
    inf(`  message   : ${e.message || "(vazio)"}`);
    inf(`  code      : ${e.code || "(sem código)"}`);
    inf(`  responseText: ${e.responseText || "(sem responseText)"}`);
    inf(`  stack     : ${e.stack?.split("\n")[1]?.trim() || "(sem stack)"}`);

    // Diagnósticos contextuais
    if (!e.message || e.message.trim() === "") {
        console.log("\n🚨 DIAGNÓSTICO: Erro silencioso — possível proxy/firewall fazendo SSL inspection");
        console.log("   que encerra a sessão TLS antes do IMAP iniciar.");
    }
    if (e.responseText?.includes("Application-specific password required")) {
        console.log("\n🚨 DIAGNÓSTICO: App Password necessário — ative 2FA e gere uma nova senha de app.");
    }
    if (e.responseText?.includes("Invalid credentials")) {
        console.log("\n🚨 DIAGNÓSTICO: Credenciais inválidas — App Password expirado ou incorreto.");
    }
    if (e.code === "ETIMEDOUT") {
        console.log("\n🚨 DIAGNÓSTICO: Timeout na autenticação IMAP — verifique regras de firewall stateful.");
    }
    process.exit(1);
}
