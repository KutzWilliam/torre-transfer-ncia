/**
 * emailProcessorService.ts
 *
 * Serviço responsável por:
 * 1. Conectar na caixa IMAP torre.notificacoes@princesadoscampos.com.br
 * 2. Buscar e-mails não lidos de naoresponda@angellira.com.br
 * 3. Fazer parse do corpo para extrair dados da ocorrência
 * 4. Vincular à viagem pelo Código da Viagem (ou fallback pela placa)
 * 5. Criar Ocorrencia no banco de dados
 * 6. Marcar o e-mail como lido
 */

import { ImapFlow } from "imapflow";
import { simpleParser, type ParsedMail } from "mailparser";
import { db } from "@/server/db";

// ─── Configuração IMAP ─────────────────────────────────────────────────────────

const imapPort = Number(process.env.EMAIL_IMAP_PORT ?? 993);

const IMAP_CONFIG = {
  host: process.env.EMAIL_IMAP_HOST ?? "mail.princesadoscampos.com.br",
  port: imapPort,
  secure: imapPort === 993, // Só usa TLS implícito se a porta for 993 (143 é plain/STARTTLS)
  auth: {
    user: process.env.EMAIL_IMAP_USER ?? "",
    pass: process.env.EMAIL_IMAP_PASS ?? "",
  },
  logger: false as const,
  // Aceita certificados auto-assinados e evita erro de servername com IP
  tls: {
    rejectUnauthorized: false,
  },
};


const REMETENTE_ANGELLIRA = "naoresponda@angellira.com.br";
const BOT_USER_ID =
  process.env.ANGELLIRA_BOT_USER_ID ?? "bot0angellira00000000000001";

// ─── Mapeamento de Assunto → Tipo de Ocorrência ────────────────────────────────

/**
 * Mapeia palavras-chave do assunto do e-mail para o tipo padronizado no BD.
 * Ordem importa: mais específico primeiro.
 */
const MAPA_TIPOS: Array<{ palavrasChave: string[]; tipo: string }> = [
  { palavrasChave: ["VIOLACAO DE BAU", "VIOLAÇÃO DE BAÚ", "VIOLAÇÃO BAÚ", "BAU"], tipo: "Violação de Baú" },
  { palavrasChave: ["PARADA NAO PROGRAMADA", "PARADA NÃO PROGRAMADA", "PARADA N\u00C3O PROGRAMADA"], tipo: "Parada Não Programada" },
  { palavrasChave: ["DESVIO DE ROTA", "DESVIO ROTA"], tipo: "Desvio de Rota" },
  { palavrasChave: ["PERDA DE SINAL", "PERDA SINAL", "PERDA DE COMUNICACAO", "PERDA DE COMUNICAÇÃO"], tipo: "Perda de Sinal GPS" },
  { palavrasChave: ["REINICIO NAO INFORMADO", "REINÍCIO NÃO INFORMADO", "REINICIO N\u00C3O INFORMADO", "REINICIO"], tipo: "Reinício Não Informado" },
  { palavrasChave: ["EXCESSO DE VELOCIDADE", "VELOCIDADE"], tipo: "Excesso de Velocidade" },
  { palavrasChave: ["CERCA ELETRONICA", "CERCA ELETRÔNICA", "GEOCERCA"], tipo: "Violação de Geocerca" },
  { palavrasChave: ["JORNADA", "FADIGA"], tipo: "Alerta de Jornada/Fadiga" },
  { palavrasChave: ["PONTO DE PARADA", "PONTO PARADA"], tipo: "Ponto de Parada" },
  { palavrasChave: ["BLOQUEIO", "TRAVA"], tipo: "Bloqueio de Veículo" },
];

function mapearTipoOcorrencia(assunto: string): string {
  const assuntoUpper = assunto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  for (const mapeamento of MAPA_TIPOS) {
    for (const palavra of mapeamento.palavrasChave) {
      const palavraNorm = palavra.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (assuntoUpper.includes(palavraNorm)) {
        return mapeamento.tipo;
      }
    }
  }
  return "Monitoramento AngelLira";
}

// ─── Parser do Corpo do E-mail ─────────────────────────────────────────────────

interface DadosEmail {
  codigoViagem: string | null;
  placaCavalo: string | null;
  placaCarreta: string | null;
  motorista: string | null;
  proprietario: string | null;
  origem: string | null;
  destino: string | null;
  localOcorrencia: string | null;
  linkMapa: string | null;
  textoCompleto: string;
}

/**
 * Extrai um campo de um texto com base em um array de labels possíveis.
 * Ex: extrairCampo(texto, ["Código da Viagem:", "codigo da viagem:"])
 */
function extrairCampo(texto: string, labels: string[]): string | null {
  for (const label of labels) {
    const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*(.+)", "i");
    const match = regex.exec(texto);
    if (match?.[1]) {
      return match[1].trim().replace(/\r?\n.*/s, "").trim(); // Pega apenas a primeira linha
    }
  }
  return null;
}

function parsearCorpoEmail(texto: string): DadosEmail {
  // Normaliza quebras de linha
  const linhas = texto.replace(/\r\n/g, "\n");

  const codigoViagem = extrairCampo(linhas, [
    "Código da Viagem:",
    "Codigo da Viagem:",
    "codigo da viagem:",
    "Código da viagem:",
    "CÓDIGO DA VIAGEM:",
  ]);

  const placaCavalo = extrairCampo(linhas, [
    "Placa do Cavalo:",
    "placa do cavalo:",
    "PLACA DO CAVALO:",
  ]);

  const placaCarreta = extrairCampo(linhas, [
    "Placa da Carreta:",
    "placa da carreta:",
    "PLACA DA CARRETA:",
  ]);

  const motorista = extrairCampo(linhas, [
    "Motorista:",
    "MOTORISTA:",
  ]);

  const proprietario = extrairCampo(linhas, [
    "Proprietario:",
    "Proprietário:",
    "Proprietario veiculo:",
    "PROPRIETARIO:",
    "PROPRIETÁRIO:",
  ]);

  const origem = extrairCampo(linhas, [
    "Origem da Viagem:",
    "origem da viagem:",
    "ORIGEM DA VIAGEM:",
  ]);

  const destino = extrairCampo(linhas, [
    "Destino da Viagem:",
    "destino da viagem:",
    "DESTINO DA VIAGEM:",
  ]);

  const localOcorrencia = extrairCampo(linhas, [
    "Local da identificaçao do alerta:",
    "Local da identificação do alerta:",
    "Local da ocorrência:",
    "proximidades de",
  ]);

  // Extrai o link do mapa
  const linkMapaMatch = /https:\/\/maps\.angellira\.com\.br\/t\/[a-zA-Z0-9\/]+\//.exec(linhas);
  const linkMapa = linkMapaMatch?.[0] ?? null;

  return {
    codigoViagem: codigoViagem ? codigoViagem.replace(/\D/g, "") : null,
    placaCavalo: placaCavalo ? placaCavalo.replace(/\s/g, "").toUpperCase() : null,
    placaCarreta: placaCarreta ? placaCarreta.replace(/\s/g, "").toUpperCase() || null : null,
    motorista,
    proprietario,
    origem,
    destino,
    localOcorrencia,
    linkMapa,
    textoCompleto: texto,
  };
}

// ─── Busca de Viagem ───────────────────────────────────────────────────────────

async function buscarViagemId(dados: DadosEmail): Promise<string | null> {
  // Prioridade 1: Código da viagem explícito no e-mail
  if (dados.codigoViagem && dados.codigoViagem.length > 5) {
    const viagem = await db.viagem.findUnique({
      where: { id: dados.codigoViagem },
      select: { id: true },
    });
    if (viagem) {
      console.log(`  → Viagem encontrada pelo código: ${dados.codigoViagem}`);
      return viagem.id;
    }
    console.log(`  ⚠ Código de viagem ${dados.codigoViagem} não encontrado no banco.`);
  }

  // Prioridade 2 (Opção B): Buscar pela placa do cavalo
  if (dados.placaCavalo) {
    const veiculo = await db.veiculo.findUnique({
      where: { placa: dados.placaCavalo },
      select: { id: true },
    });

    if (veiculo) {
      // Busca viagem EM_ANDAMENTO mais recente
      const viagem = await db.viagem.findFirst({
        where: {
          veiculoId: veiculo.id,
          status: { in: ["EM_ANDAMENTO", "PROGRAMADA"] },
        },
        orderBy: { prevInicioReal: "desc" },
        select: { id: true, status: true },
      });
      if (viagem) {
        console.log(`  → Viagem encontrada pela placa ${dados.placaCavalo}: ${viagem.id} (${viagem.status})`);
        return viagem.id;
      }
    }
    console.log(`  ⚠ Nenhuma viagem ativa encontrada para a placa ${dados.placaCavalo}.`);
  }

  return null;
}

// ─── Montagem da Descrição da Ocorrência ──────────────────────────────────────

function montarDescricao(
  assunto: string,
  dados: DadosEmail,
  textoEmail: string
): string {
  const linhas: string[] = [];

  linhas.push(`📧 Alarme recebido via e-mail AngelLira: ${assunto}`);
  linhas.push("");

  if (dados.motorista) linhas.push(`🧑 Motorista: ${dados.motorista}`);
  if (dados.placaCavalo) linhas.push(`🚛 Placa Cavalo: ${dados.placaCavalo}`);
  if (dados.placaCarreta) linhas.push(`🔗 Placa Carreta: ${dados.placaCarreta}`);
  if (dados.proprietario) linhas.push(`🏢 Proprietário: ${dados.proprietario}`);
  if (dados.origem) linhas.push(`📍 Origem: ${dados.origem}`);
  if (dados.destino) linhas.push(`🏁 Destino: ${dados.destino}`);
  if (dados.localOcorrencia) linhas.push(`📌 Local: ${dados.localOcorrencia}`);

  // Extrair o parágrafo principal do e-mail (ignora cabeçalho "Dados da Viagem:")
  const textoResumido = textoEmail
    .split(/Dados da [Vv]iagem:/)[0]
    ?.split(/Prezado/i)[1]
    ?.trim()
    .replace(/\n{3,}/g, "\n\n")
    .substring(0, 500);

  if (textoResumido) {
    linhas.push("");
    linhas.push("📝 Mensagem original:");
    linhas.push(textoResumido);
  }

  return linhas.join("\n");
}

// ─── Resultado do Processamento ───────────────────────────────────────────────

export interface ResultadoProcessamento {
  processados: number;
  criados: number;
  ignorados: number;
  erros: number;
  detalhes: Array<{
    messageId: string;
    assunto: string;
    status: "CRIADA" | "DUPLICADA" | "SEM_VIAGEM" | "ERRO";
    tipoOcorrencia?: string;
    viagemId?: string;
    erro?: string;
  }>;
}

// ─── Função Principal ─────────────────────────────────────────────────────────

export async function processarEmailsAngellira(): Promise<ResultadoProcessamento> {
  const resultado: ResultadoProcessamento = {
    processados: 0,
    criados: 0,
    ignorados: 0,
    erros: 0,
    detalhes: [],
  };

  const client = new ImapFlow(IMAP_CONFIG);

  try {
    console.log("📬 Conectando ao servidor IMAP...");
    await client.connect();

    const lock = await client.getMailboxLock("INBOX");
    try {
      // Busca e-mails NÃO lidos do remetente AngelLira
      // imapflow usa `not: { seen: true }` para buscar mensagens não lidas
      const mensagens = await client.search({
        seen: false,
        from: REMETENTE_ANGELLIRA,
      });

      if (!mensagens || mensagens.length === 0) {
        console.log("📭 Nenhum e-mail novo da AngelLira.");
        return resultado;
      }

      console.log(`📨 ${mensagens.length} e-mail(s) novo(s) encontrado(s).`);

      for (const uid of mensagens) {
        resultado.processados++;

        let parsed: ParsedMail | null = null;
        let messageId = `uid-${uid}`;

        try {
          // Busca o conteúdo completo do e-mail pelo número de sequência
          const message = await client.fetchOne(String(uid), {
            source: true,
          });

          // fetchOne retorna false se a mensagem não for encontrada
          if (message === false || !message.source) continue;

          parsed = await simpleParser(message.source as Buffer);
          messageId = parsed.messageId ?? messageId;

          const assunto = parsed.subject ?? "(sem assunto)";
          const htmlConteudo = typeof parsed.html === "string" ? parsed.html : "";
          const textoPlano = parsed.text ?? htmlConteudo;

          console.log(`\n📧 Processando: "${assunto}" (${messageId})`);

          // ── Verificar duplicata ──
          const jaExiste = await db.ocorrencia.findUnique({
            where: { emailMessageId: messageId },
            select: { id: true },
          });

          if (jaExiste) {
            console.log(`  ✓ Já processado anteriormente. Ignorando.`);
            resultado.ignorados++;
            resultado.detalhes.push({ messageId, assunto, status: "DUPLICADA" });
            // Mesmo sendo duplicata, marca como lido para limpar a caixa
            await client.messageFlagsAdd([uid], ["\\Seen"]);
            continue;
          }

          // ── Parsear corpo do e-mail ──
          const dados = parsearCorpoEmail(textoPlano);
          const tipoOcorrencia = mapearTipoOcorrencia(assunto);

          // ── Buscar viagem vinculada ──
          const viagemId = await buscarViagemId(dados);

          if (!viagemId) {
            console.log(`  ⚠ Nenhuma viagem encontrada para este e-mail. Registrando sem vínculo.`);
            resultado.ignorados++;
            resultado.detalhes.push({ messageId, assunto, status: "SEM_VIAGEM" });
            // Marca como lido para não processar novamente
            await client.messageFlagsAdd([uid], ["\\Seen"]);
            continue;
          }

          // ── Criar ocorrência no banco ──
          const descricao = montarDescricao(assunto, dados, textoPlano);

          const ocorrencia = await db.ocorrencia.create({
            data: {
              viagemId,
              tipoOcorrencia,
              descricao,
              status: "ABERTA",
              abertaPorId: BOT_USER_ID,
              emailMessageId: messageId,
              origem: "EMAIL_ANGELLIRA",
              linkMapa: dados.linkMapa ?? null,
            },
          });

          resultado.criados++;
          resultado.detalhes.push({
            messageId,
            assunto,
            status: "CRIADA",
            tipoOcorrencia,
            viagemId,
          });

          console.log(`  ✅ Ocorrência criada: ${ocorrencia.id} → Tipo: ${tipoOcorrencia} | Viagem: ${viagemId}`);

          // ── Marcar e-mail como lido ──
          await client.messageFlagsAdd([uid], ["\\Seen"]);

        } catch (erroItem) {
          const msg = erroItem instanceof Error ? erroItem.message : String(erroItem);
          console.error(`  ❌ Erro ao processar e-mail ${messageId}: ${msg}`);
          resultado.erros++;
          resultado.detalhes.push({
            messageId,
            assunto: parsed?.subject ?? "(sem assunto)",
            status: "ERRO",
            erro: msg,
          });
        }
      } // fim do for (uid of mensagens)

    } finally {
      lock.release();
    }
  } catch (erroConexao) {
    const msg = erroConexao instanceof Error ? erroConexao.message : String(erroConexao);
    console.error(`❌ Erro de conexão IMAP: ${msg}`);
    resultado.erros++;
    // Expõe o erro na resposta da API para facilitar diagnóstico sem precisar ver logs do PM2
    resultado.detalhes.push({
      messageId: "IMAP_CONNECTION_ERROR",
      assunto: "Falha na conexão com o servidor de e-mail",
      status: "ERRO",
      erro: msg,
    });
  } finally {
    try { await client.logout(); } catch { /* ignora erros no logout */ }
  }


  return resultado;
}
