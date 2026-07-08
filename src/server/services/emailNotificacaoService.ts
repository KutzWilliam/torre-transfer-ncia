/**
 * Serviço de envio de e-mail via SMTP (Office 365).
 * Gera uma imagem PNG do card de ocorrência e envia inline no e-mail.
 */
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";

// ─── SMTP ────────────────────────────────────────────────────────────────────

function criarTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST ?? "smtp.office365.com",
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER ?? "", pass: process.env.SMTP_PASS ?? "" },
        tls: { rejectUnauthorized: false },
    });
}

// ─── Canvas helpers ──────────────────────────────────────────────────────────

function roundRect(ctx: SKRSContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function wrapText(ctx: SKRSContext2D, text: string, maxW: number): string[] {
    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
        const words = paragraph.split(" ");
        let line = "";
        for (const word of words) {
            const test = line ? `${line} ${word}` : word;
            if (ctx.measureText(test).width > maxW && line) {
                lines.push(line);
                line = word;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
    }
    return lines.length ? lines : [""];
}

function sectionTitle(ctx: SKRSContext2D, label: string, color: string, x: number, y: number, w: number) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + 5, y + 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 10px Arial";
    ctx.fillStyle = "#64748b";
    ctx.fillText(label, x + 16, y + 11);
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y + 18);
    ctx.lineTo(x + w, y + 18);
    ctx.stroke();
}

// ─── Image generator ─────────────────────────────────────────────────────────

async function gerarImagemOcorrencia(params: {
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
}): Promise<Buffer> {
    const W = 620;
    const PAD = 32;
    const INNER = W - PAD * 2;

    // Pre-measure text heights
    const measurer = createCanvas(W, 10).getContext("2d");
    measurer.font = "13px Arial";
    const descLines = wrapText(measurer, params.descricao, INNER - 28);
    const torreLines = params.notaTorre ? wrapText(measurer, params.notaTorre, INNER - 28) : [];

    const HEADER_H    = 205;
    const STRIPE_H    = 4;
    const GREETING_H  = 56;
    const TIPO_H      = 30 + 50;        // title + badge
    const ROTA_H      = 30 + 44;        // title + pill
    const DADOS_H     = 30 + 36 + 156;  // title + card header + 3 rows
    const DESC_H      = 30 + descLines.length * 22 + 36;
    const TORRE_H     = torreLines.length ? 30 + torreLines.length * 22 + 56 : 0;
    const CTA_H       = 88;
    const FOOTER_H    = 64;
    const GAP         = 20;

    const TOTAL_H = HEADER_H + STRIPE_H + GREETING_H + TIPO_H + GAP + ROTA_H + GAP + DADOS_H + GAP + DESC_H + GAP + TORRE_H + (TORRE_H ? GAP : 0) + CTA_H + FOOTER_H;

    const canvas = createCanvas(W, TOTAL_H);
    const ctx = canvas.getContext("2d");

    // ── BG ───────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, TOTAL_H);

    // ── HEADER ───────────────────────────────────────────────────────────────
    let Y = 0;
    const hGrad = ctx.createLinearGradient(0, 0, W, HEADER_H);
    hGrad.addColorStop(0, "#111827");
    hGrad.addColorStop(0.55, "#1a2744");
    hGrad.addColorStop(1, "#0f2027");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, Y, W, HEADER_H);

    // Glow top-right
    const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 240);
    glow.addColorStop(0, "rgba(34,197,94,0.18)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, Y, W, HEADER_H);

    // Logo
    const logoPath = path.join(process.cwd(), "public", "cropped-icon.png");
    if (fs.existsSync(logoPath)) {
        try {
            const logo = await loadImage(logoPath);
            const lH = Math.round((logo.height / logo.width) * 56);
            ctx.fillStyle = "rgba(255,255,255,0.07)";
            roundRect(ctx, PAD, Y + 22, 56 + 20, lH + 16, 12);
            ctx.fill();
            ctx.drawImage(logo, PAD + 10, Y + 30, 56, lH);
        } catch { /* ignore */ }
    }

    // Badge
    const bdGrad = ctx.createLinearGradient(PAD, Y + 118, PAD + 220, Y + 142);
    bdGrad.addColorStop(0, "#dc2626");
    bdGrad.addColorStop(1, "#b91c1c");
    ctx.fillStyle = bdGrad;
    roundRect(ctx, PAD, Y + 118, 220, 26, 13);
    ctx.fill();
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("\u26a0  OCORR\u00caNCIA EM ANDAMENTO", PAD + 12, Y + 135);

    // Title
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#fff";
    const t1 = "Torre de ";
    ctx.fillText(t1, PAD, Y + 170);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("Controle", PAD + ctx.measureText(t1).width, Y + 170);

    // Subtitle
    ctx.font = "11px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Princesa dos Campos Transportes \u2014 Notifica\u00e7\u00e3o Operacional", PAD, Y + 188);

    Y += HEADER_H;

    // ── GRADIENT STRIPE ──────────────────────────────────────────────────────
    const stripe = ctx.createLinearGradient(0, Y, W, Y);
    stripe.addColorStop(0, "#22c55e");
    stripe.addColorStop(0.4, "#16a34a");
    stripe.addColorStop(1, "#0ea5e9");
    ctx.fillStyle = stripe;
    ctx.fillRect(0, Y, W, STRIPE_H);
    Y += STRIPE_H;

    // ── WHITE BODY ───────────────────────────────────────────────────────────
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, Y, W, TOTAL_H - Y - FOOTER_H);
    Y += 24;

    // Greeting
    ctx.font = "14px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText("Olá, ", PAD, Y + 14);
    const olaW = ctx.measureText("Olá, ").width;
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(params.nomeResponsavel, PAD + olaW, Y + 14);
    ctx.font = "13px Arial";
    ctx.fillStyle = "#64748b";
    ctx.fillText("Uma ocorrência foi registrada e requer a atenção da sua equipe.", PAD, Y + 34);
    Y += GREETING_H;

    // ── TIPO ─────────────────────────────────────────────────────────────────
    sectionTitle(ctx, "TIPO DE OCORRÊNCIA", "#ef4444", PAD, Y, INNER);
    Y += 26;
    const tipoGrad = ctx.createLinearGradient(PAD, Y, PAD + INNER, Y + 40);
    tipoGrad.addColorStop(0, "#fef2f2");
    tipoGrad.addColorStop(1, "#fee2e2");
    ctx.fillStyle = tipoGrad;
    roundRect(ctx, PAD, Y, INNER, 40, 10);
    ctx.fill();
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, Y, INNER, 40, 10);
    ctx.stroke();
    ctx.font = "bold 15px Arial";
    ctx.fillStyle = "#991b1b";
    ctx.fillText(`⚠  ${params.tipoOcorrencia}`, PAD + 16, Y + 26);
    Y += 40 + GAP;

    // ── ROTA ─────────────────────────────────────────────────────────────────
    sectionTitle(ctx, "ROTA DA VIAGEM", "#3b82f6", PAD, Y, INNER);
    Y += 26;
    ctx.font = "bold 12px Arial";
    const rotaTxt = `🚚  ${params.origem}  →  ${params.destino}`;
    const pillW = Math.min(ctx.measureText(rotaTxt).width + 32, INNER);
    ctx.fillStyle = "#eff6ff";
    roundRect(ctx, PAD, Y, pillW, 30, 15);
    ctx.fill();
    ctx.strokeStyle = "#bfdbfe";
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, Y, pillW, 30, 15);
    ctx.stroke();
    ctx.fillStyle = "#1d4ed8";
    ctx.fillText(rotaTxt, PAD + 16, Y + 20);
    Y += 30 + GAP;

    // ── DADOS DA OPERAÇÃO ─────────────────────────────────────────────────────
    sectionTitle(ctx, "DADOS DA OPERAÇÃO", "#8b5cf6", PAD, Y, INNER);
    Y += 26;

    const CELL_H = 52;
    const cardH = 36 + CELL_H * 3;
    ctx.fillStyle = "#f8fafc";
    roundRect(ctx, PAD, Y, INNER, cardH, 14);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, Y, INNER, cardH, 14);
    ctx.stroke();

    // Card header row
    ctx.save();
    ctx.beginPath();
    roundRect(ctx, PAD, Y, INNER, 36, 14);
    ctx.clip();
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(PAD, Y, INNER, 36);
    ctx.restore();
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(PAD, Y + 36);
    ctx.lineTo(PAD + INNER, Y + 36);
    ctx.stroke();
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#334155";
    ctx.fillText("🚛  Veículo & Motorista", PAD + 14, Y + 23);

    const c1 = PAD + 14;
    const c2 = PAD + INNER / 2 + 8;

    function drawCell(label: string, value: string, cx: number, cy: number, mono = false) {
        ctx.font = "bold 9px Arial";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(label, cx, cy + 15);
        ctx.font = mono ? `bold 15px "Courier New"` : "bold 13px Arial";
        ctx.fillStyle = mono ? "#1d4ed8" : "#1e293b";
        ctx.fillText(value.slice(0, 30), cx, cy + 38);
    }

    // Row dividers
    for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = "#e2e8f0";
        ctx.beginPath();
        ctx.moveTo(PAD, Y + 36 + CELL_H * i);
        ctx.lineTo(PAD + INNER, Y + 36 + CELL_H * i);
        ctx.stroke();
    }
    // Vertical dividers rows 1 & 3
    for (const rowY of [Y + 36, Y + 36 + CELL_H * 2]) {
        ctx.beginPath();
        ctx.moveTo(PAD + INNER / 2, rowY);
        ctx.lineTo(PAD + INNER / 2, rowY + CELL_H);
        ctx.stroke();
    }

    drawCell("PLACA", params.placa, c1, Y + 36, true);
    drawCell("MOTORISTA", params.motorista, c2, Y + 36);
    // Row 2 full width: rota
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("ROTA COMPLETA", c1, Y + 36 + CELL_H + 15);
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#1e293b";
    ctx.fillText(`${params.origem}  →  ${params.destino}`, c1, Y + 36 + CELL_H + 38);
    // Row 3: data | abertaPor
    drawCell("DATA / HORA", params.dataAbertura, c1, Y + 36 + CELL_H * 2);
    drawCell("ABERTA POR", params.abertaPor, c2, Y + 36 + CELL_H * 2);

    Y += cardH + GAP;

    // ── DESCRIÇÃO ─────────────────────────────────────────────────────────────
    sectionTitle(ctx, "DESCRIÇÃO DA OCORRÊNCIA", "#f97316", PAD, Y, INNER);
    Y += 26;
    const descBoxH = descLines.length * 22 + 28;
    ctx.fillStyle = "#fff7ed";
    roundRect(ctx, PAD, Y, INNER, descBoxH, 12);
    ctx.fill();
    ctx.strokeStyle = "#fed7aa";
    ctx.lineWidth = 1;
    roundRect(ctx, PAD, Y, INNER, descBoxH, 12);
    ctx.stroke();
    ctx.fillStyle = "#f97316";
    roundRect(ctx, PAD, Y, 4, descBoxH, 4);
    ctx.fill();
    ctx.font = "13px Arial";
    ctx.fillStyle = "#7c2d12";
    descLines.forEach((l, i) => ctx.fillText(l, PAD + 20, Y + 22 + i * 22));
    Y += descBoxH + GAP;

    // ── NOTA TORRE ───────────────────────────────────────────────────────────
    if (torreLines.length) {
        sectionTitle(ctx, "NOTA DA TORRE — CONTATO COM MOTORISTA", "#eab308", PAD, Y, INNER);
        Y += 26;
        const tBoxH = torreLines.length * 22 + 48;
        ctx.fillStyle = "#fffbeb";
        roundRect(ctx, PAD, Y, INNER, tBoxH, 12);
        ctx.fill();
        ctx.strokeStyle = "#fde68a";
        ctx.lineWidth = 1;
        roundRect(ctx, PAD, Y, INNER, tBoxH, 12);
        ctx.stroke();
        ctx.fillStyle = "#eab308";
        roundRect(ctx, PAD, Y, 4, tBoxH, 4);
        ctx.fill();
        ctx.font = "bold 9px Arial";
        ctx.fillStyle = "#92400e";
        ctx.fillText("REGISTRADO PELO OPERADOR DA TORRE:", PAD + 20, Y + 17);
        ctx.font = "13px Arial";
        ctx.fillStyle = "#78350f";
        torreLines.forEach((l, i) => ctx.fillText(l, PAD + 20, Y + 36 + i * 22));
        Y += tBoxH + GAP;
    }

    // ── CTA ──────────────────────────────────────────────────────────────────
    Y += 8;
    const btnW = 264;
    const btnX = (W - btnW) / 2;
    const btnGrad = ctx.createLinearGradient(btnX, Y, btnX + btnW, Y + 46);
    btnGrad.addColorStop(0, "#16a34a");
    btnGrad.addColorStop(1, "#15803d");
    ctx.fillStyle = btnGrad;
    roundRect(ctx, btnX, Y, btnW, 46, 12);
    ctx.fill();
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("🔍  Acessar Ocorrência no Sistema", W / 2, Y + 29);
    ctx.font = "11px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Clique para ver todos os detalhes e registrar o atendimento.", W / 2, Y + 64);
    ctx.textAlign = "left";
    Y += CTA_H;

    // ── FOOTER ───────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, Y, W, FOOTER_H);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, Y, W, 1);
    ctx.font = "bold 11px Arial";
    ctx.fillStyle = "#22c55e";
    ctx.textAlign = "center";
    ctx.fillText("Princesa dos Campos Transportes", W / 2, Y + 22);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText("Torre de Controle — Sistema de Gestão de Ocorrências", W / 2, Y + 38);
    ctx.fillStyle = "#334155";
    ctx.fillText("E-mail gerado automaticamente. Não responda.", W / 2, Y + 54);
    ctx.textAlign = "left";

    return canvas.toBuffer("image/png") as unknown as Buffer;
}

// ─── Interface pública ────────────────────────────────────────────────────────

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

export async function enviarNotificacaoOcorrencia(dados: DadosNotificacaoOcorrencia): Promise<void> {
    const transporter = criarTransporter();
    const urlSistema = (process.env.APP_URL ?? "http://localhost:3001") + "/ocorrencias";

    const dataFormatada = new Date(dados.dataAbertura).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
        timeZone: "America/Sao_Paulo",
    });

    // Gera o PNG do card
    const imgBuffer = await gerarImagemOcorrencia({
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
    });

    // E-mail: imagem inline + link de fallback
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 0;">
    <tr><td align="center">
      <img src="cid:occurrence-card" alt="Ocorrência ${dados.tipoOcorrencia} — ${dados.placa}"
           width="620" style="display:block;border-radius:16px;max-width:100%;" />
    </td></tr>
    <tr><td align="center" style="padding-top:20px;">
      <a href="${urlSistema}"
         style="display:inline-block;background:#16a34a;color:#fff;font-family:Arial,sans-serif;
                font-size:13px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;">
        🔍 Acessar Ocorrência no Sistema
      </a>
    </td></tr>
    <tr><td align="center" style="padding:12px;font-family:Arial,sans-serif;font-size:10px;color:#475569;">
      Este e-mail foi gerado automaticamente. Não responda esta mensagem.
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
        from: `"Torre de Controle" <${process.env.SMTP_USER ?? "torre.notificacoes@princesadoscampos.com.br"}>`,
        to: dados.destinatarioEmail,
        subject: `🚨 Ocorrência: ${dados.tipoOcorrencia} — ${dados.placa}`,
        html,
        attachments: [
            {
                filename: `ocorrencia_${dados.ocorrenciaId}.png`,
                content: imgBuffer,
                cid: "occurrence-card",
            },
        ],
    });

    console.log(`📧 Notificação (imagem) enviada para ${dados.destinatarioEmail} — ocorrência ${dados.ocorrenciaId}`);
}
