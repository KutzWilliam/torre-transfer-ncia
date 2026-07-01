import { ImapFlow } from 'imapflow';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Carrega o .env atualizado
dotenv.config({ path: join(process.cwd(), '.env') });

const HOST = process.env.EMAIL_IMAP_HOST;
const PORT = Number(process.env.EMAIL_IMAP_PORT || 993);
const USER = process.env.EMAIL_IMAP_USER;
const PASS = process.env.EMAIL_IMAP_PASS;

console.log(`\n🧪 Testando conexão IMAP com as credenciais do .env`);
console.log(`Host: ${HOST}`);
console.log(`Porta: ${PORT}`);
console.log(`Usuário: ${USER}`);
console.log(`Senha: ${PASS ? '********' + PASS.slice(-4) : 'NÃO DEFINIDA'}\n`);

const client = new ImapFlow({
  host: HOST,
  port: PORT,
  secure: PORT === 993,
  auth: { user: USER, pass: PASS },
  logger: false,
  tls: { rejectUnauthorized: false }
});

try {
  console.log('Conectando ao servidor...');
  await client.connect();
  console.log('✅ CONECTADO COM SUCESSO!');

  const status = await client.status('INBOX', { messages: true, unseen: true });
  console.log(`📬 Caixa de Entrada -> Total de mensagens: ${status.messages} | Não lidas: ${status.unseen}`);

  await client.logout();
  console.log('👋 Desconectado com segurança.\n');
} catch (err) {
  console.error(`❌ Falha na conexão: ${err.message}`);
  if (err.responseText) console.error(`   Resposta do servidor: ${err.responseText}`);
}
