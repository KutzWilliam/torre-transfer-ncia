/**
 * Serviço de envio de e-mail via SMTP (Office 365).
 * Usado para notificar usuários sobre ocorrências de viagem.
 */
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

// ─── Transportador SMTP ────────────────────────────────────────────────────────

function criarTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST ?? "smtp.office365.com",
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true", // false para STARTTLS (587)
        auth: {
            user: process.env.SMTP_USER ?? "",
            pass: process.env.SMTP_PASS ?? "",
        },
        tls: {
            rejectUnauthorized: false, // Aceita certs auto-assinados corporativos
        },
    });
}

// ─── Template HTML do E-mail de Notificação ────────────────────────────────────

function gerarHtmlNotificacao(params: {
    nomeResponsavel: string;
    tipoOcorrencia: string;
    placa: string;
    motorista: string;
    origem: string;
    destino: string;
    descricao: string;
    notaTorre?: string | null;
    dataAbertura: string;
    abertaPor: string;
    urlSistema: string;
}) {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Notificação de Ocorrência — Torre de Controle</title>
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 20px; text-align: center; border-bottom: 2px solid #22c55e; }
    .header-logo { width: 100px; height: auto; display: block; margin: 0 auto 12px auto; }
    .header-text h1 { margin: 0 0 6px 0; color: #fff; font-size: 18px; font-weight: 700; line-height: 1.2; letter-spacing: 0.5px; }
    .header-text p  { margin: 0; color: #22c55e; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .alert-badge { display: inline-block; background: #ef4444; color: #fff; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 24px 32px 0; }
    .body { padding: 20px 32px 28px; }
    .greeting { font-size: 15px; color: #334155; margin-bottom: 16px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .card h2 { margin: 0 0 14px; font-size: 16px; color: #0f172a; }
    .row { display: flex; margin-bottom: 8px; font-size: 13px; }
    .label { color: #64748b; min-width: 120px; font-weight: 600; }
    .value { color: #1e293b; flex: 1; }
    .descricao-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px; font-size: 13px; color: #7c2d12; line-height: 1.6; margin-bottom: 20px; }
    .cta { text-align: center; margin: 24px 0 8px; }
    .cta a { background: #16a34a; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block; }
    .footer { border-top: 1px solid #e2e8f0; padding: 18px 32px; background: #f8fafc; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <img
        src="cid:company-logo"
        alt="Princesa dos Campos"
        class="header-logo"
        width="100"
      />
      <div class="header-text">
        <h1>Torre de Controle</h1>
        <p>Princesa dos Campos Transportes</p>
      </div>
    </div>

    <span class="alert-badge">⚠️ ${params.tipoOcorrencia}</span>

    <div class="body">
      <p class="greeting">Olá, <strong>${params.nomeResponsavel}</strong>.<br/>
      Você foi notificado(a) sobre a seguinte ocorrência em andamento:</p>

      <div class="card">
        <h2>📋 Dados da Viagem</h2>
        <div class="row"><span class="label">Placa:</span><span class="value"><strong>${params.placa}</strong></span></div>
        <div class="row"><span class="label">Motorista:</span><span class="value">${params.motorista}</span></div>
        <div class="row"><span class="label">Origem:</span><span class="value">${params.origem}</span></div>
        <div class="row"><span class="label">Destino:</span><span class="value">${params.destino}</span></div>
        <div class="row"><span class="label">Data/Hora:</span><span class="value">${params.dataAbertura}</span></div>
        <div class="row"><span class="label">Aberta por:</span><span class="value">${params.abertaPor}</span></div>
      </div>

      <p style="font-size:13px;color:#64748b;margin:0 0 8px;font-weight:600;">📝 Descrição da Ocorrência:</p>
      <div class="descricao-box">${params.descricao.replace(/\n/g, "<br/>")}</div>

      ${params.notaTorre ? `
      <p style="font-size:13px;color:#64748b;margin:0 0 8px;font-weight:600;">⚠️ Nota da Torre (Atendimento):</p>
      <div class="descricao-box" style="background:#fef3c7; border-color:#fde68a; color:#92400e;">
        ${params.notaTorre.replace(/\n/g, "<br/>")}
      </div>
      ` : ""}

      <div class="cta">
        <a href="${params.urlSistema}">🔍 Ver Ocorrência no Sistema</a>
      </div>
    </div>

    <div class="footer">
      Torre de Controle — Princesa dos Campos Transportes<br/>
      Este e-mail foi enviado automaticamente. Não responda esta mensagem.
    </div>
  </div>
</body>
</html>`;
}

// ─── Função Pública ────────────────────────────────────────────────────────────

export interface DadosNotificacaoOcorrencia {
    destinatarioEmail: string;
    destinatarioNome: string;
    tipoOcorrencia: string;
    placa: string;
    motorista: string;
    origem: string;
    destino: string;
    descricao: string;
    notaTorre?: string | null;
    dataAbertura: Date;
    abertaPor: string;
    ocorrenciaId: string;
}

export async function enviarNotificacaoOcorrencia(
    dados: DadosNotificacaoOcorrencia
): Promise<void> {
    const transporter = criarTransporter();

    const urlSistema =
        (process.env.APP_URL ?? "http://localhost:3001") + "/ocorrencias";

    const dataFormatada = new Date(dados.dataAbertura).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "America/Sao_Paulo",
    });

    const logoPath = path.join(process.cwd(), "public", "cropped-icon.png");
    const attachments: any[] = [];
    if (fs.existsSync(logoPath)) {
        attachments.push({
            filename: "cropped-icon.png",
            path: logoPath,
            cid: "company-logo",
        });
    }

    await transporter.sendMail({
        from: `"Torre de Controle" <${process.env.SMTP_USER ?? "torre.notificacoes@princesadoscampos.com.br"}>`,
        to: dados.destinatarioEmail,
        subject: `🚨 Ocorrência: ${dados.tipoOcorrencia} — ${dados.placa}`,
        html: gerarHtmlNotificacao({
            nomeResponsavel: dados.destinatarioNome,
            tipoOcorrencia: dados.tipoOcorrencia,
            placa: dados.placa,
            motorista: dados.motorista,
            origem: dados.origem,
            destino: dados.destino,
            descricao: dados.descricao,
            notaTorre: dados.notaTorre,
            dataAbertura: dataFormatada,
            abertaPor: dados.abertaPor,
            urlSistema,
        }),
        attachments,
    });

    console.log(`📧 Notificação enviada para ${dados.destinatarioEmail} — ocorrência ${dados.ocorrenciaId}`);
}
