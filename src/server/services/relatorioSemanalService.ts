/**
 * Serviço de Relatório Semanal por Regional.
 * 
 * Gera uma imagem PNG consolidada com todas as regionais e suas ocorrências
 * da semana (segunda → domingo anterior), e envia por e-mail para os
 * usuários com recebeRelatorioSemanal = true.
 */
import nodemailer from "nodemailer";
import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import { db } from "@/server/db";

// ─── Helpers Canvas ──────────────────────────────────────────────────────────

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

function truncate(text: string, max: number): string {
    return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface OcorrenciaResumo {
    placa:          string;
    tipo:           string;
    status:         string;
    dataAbertura:   Date;
    rota:           string;
}

interface RegionalResumo {
    nome:       string;
    total:      number;
    resolvidas: number;
    emAberto:   number;
    ocorrencias: OcorrenciaResumo[];
}

// ─── Coleta de dados ─────────────────────────────────────────────────────────

export async function coletarDadosRelatorio(): Promise<{
    regionais:  RegionalResumo[];
    inicio:     Date;
    fim:        Date;
}> {
    // Período: segunda-feira anterior até domingo anterior (semana cheia)
    const agora  = new Date();
    const diaSemana = agora.getDay(); // 0=dom, 5=sex
    // Calculamos em relação à sexta (dia 5) — 7 dias atrás = sexta passada
    // Mas usamos sempre segunda→domingo da semana passada
    const diasAteDomingo = diaSemana === 0 ? 0 : diaSemana;
    const domingoPassado = new Date(agora);
    domingoPassado.setDate(agora.getDate() - diasAteDomingo);
    domingoPassado.setHours(23, 59, 59, 999);

    const segundaPassada = new Date(domingoPassado);
    segundaPassada.setDate(domingoPassado.getDate() - 6);
    segundaPassada.setHours(0, 0, 0, 0);

    // Busca todas as regionais com seus veículos
    const regionais = await db.regional.findMany({
        orderBy: { nome: "asc" },
        include: { veiculos: true },
    });

    const resultado: RegionalResumo[] = [];

    for (const regional of regionais) {
        const placas = regional.veiculos.map(v => v.placa.replace(/-/g, "").toUpperCase());
        if (placas.length === 0) continue;

        // Busca ocorrências onde a viagem tem veículo com placa na lista da regional
        const ocorrencias = await db.ocorrencia.findMany({
            where: {
                createdAt: { gte: segundaPassada, lte: domingoPassado },
                viagem: {
                    veiculo: {
                        OR: [
                            { placa: { in: regional.veiculos.map(v => v.placa) } },
                            { placa: { in: placas } },
                        ],
                    },
                },
            },
            include: {
                viagem: {
                    include: {
                        veiculo: true,
                        baseOrigem: true,
                        baseDestino: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const resumoOcorrencias: OcorrenciaResumo[] = ocorrencias.map(o => ({
            placa:        o.viagem.veiculo.placa,
            tipo:         o.tipoOcorrencia,
            status:       o.status,
            dataAbertura: o.createdAt,
            rota:         `${o.viagem.baseOrigem?.nome ?? "?"} → ${o.viagem.baseDestino?.nome ?? "?"}`,
        }));

        resultado.push({
            nome:        regional.nome,
            total:       ocorrencias.length,
            resolvidas:  ocorrencias.filter(o => o.status === "RESOLVIDA").length,
            emAberto:    ocorrencias.filter(o => o.status !== "RESOLVIDA").length,
            ocorrencias: resumoOcorrencias,
        });
    }

    return { regionais: resultado, inicio: segundaPassada, fim: domingoPassado };
}

// ─── Geração da imagem ───────────────────────────────────────────────────────

export async function gerarImagemRelatorio(
    regionais: RegionalResumo[],
    inicio: Date,
    fim: Date,
): Promise<Buffer> {
    const W   = 780;
    const PAD = 32;
    const INNER = W - PAD * 2;

    const fmtData = (d: Date) =>
        d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });

    // Calcula altura total
    const HEADER_H   = 160;
    const PERIOD_H   = 50;
    const REGIONAL_HEADER_H = 80;
    const ROW_H      = 36;
    const EMPTY_H    = 48;
    const GAP        = 16;
    const FOOTER_H   = 60;

    let totalH = HEADER_H + PERIOD_H + GAP;
    for (const r of regionais) {
        totalH += REGIONAL_HEADER_H + GAP;
        totalH += r.ocorrencias.length > 0 ? r.ocorrencias.length * ROW_H + 40 : EMPTY_H;
        totalH += GAP;
    }
    totalH += FOOTER_H;

    const canvas = createCanvas(W, totalH);
    const ctx = canvas.getContext("2d");

    // ── BG ─────────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, totalH);

    // ── HEADER ─────────────────────────────────────────────────────────────────
    let Y = 0;
    const hGrad = ctx.createLinearGradient(0, 0, W, HEADER_H);
    hGrad.addColorStop(0, "#111827");
    hGrad.addColorStop(0.6, "#1a2744");
    hGrad.addColorStop(1, "#0f2027");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Glow
    const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 280);
    glow.addColorStop(0, "rgba(34,197,94,0.15)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Logo
    const logoPath = path.join(process.cwd(), "public", "cropped-icon.png");
    if (fs.existsSync(logoPath)) {
        try {
            const { loadImage } = await import("@napi-rs/canvas");
            const logo = await loadImage(logoPath);
            const lH = Math.round((logo.height / logo.width) * 48);
            ctx.drawImage(logo, PAD, Y + 20, 48, lH);
        } catch { /* ignore */ }
    }

    // Badge "RELATÓRIO SEMANAL"
    const bdGrad = ctx.createLinearGradient(PAD, Y + 90, PAD + 200, Y + 114);
    bdGrad.addColorStop(0, "#16a34a");
    bdGrad.addColorStop(1, "#15803d");
    ctx.fillStyle = bdGrad;
    roundRect(ctx, PAD, Y + 90, 200, 24, 12);
    ctx.fill();
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("📊  RELATÓRIO SEMANAL DE OCORRÊNCIAS", PAD + 10, Y + 106);

    // Title
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#fff";
    const t1 = "Torre de ";
    ctx.fillText(t1, PAD, Y + 136);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("Controle", PAD + ctx.measureText(t1).width, Y + 136);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Princesa dos Campos Transportes — Consolidado por Regional", PAD, Y + 152);

    Y += HEADER_H;

    // ── PERÍODO ─────────────────────────────────────────────────────────────────
    const stripe = ctx.createLinearGradient(0, Y, W, Y);
    stripe.addColorStop(0, "#22c55e");
    stripe.addColorStop(0.4, "#16a34a");
    stripe.addColorStop(1, "#0ea5e9");
    ctx.fillStyle = stripe;
    ctx.fillRect(0, Y, W, 4);
    Y += 4;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, Y, W, PERIOD_H - 4);
    ctx.font = "13px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.fillText(
        `Período: ${fmtData(inicio)} (segunda-feira) até ${fmtData(fim)} (domingo)`,
        W / 2, Y + 30,
    );
    ctx.textAlign = "left";
    Y += PERIOD_H - 4 + GAP;

    // ── KPIs GLOBAIS ────────────────────────────────────────────────────────────
    const totalOcorrencias  = regionais.reduce((a, r) => a + r.total, 0);
    const totalResolvidas   = regionais.reduce((a, r) => a + r.resolvidas, 0);
    const totalEmAberto     = regionais.reduce((a, r) => a + r.emAberto, 0);

    const kpiW = (INNER - 2 * GAP) / 3;
    const kpiH = 70;
    const kpis = [
        { label: "Total de Ocorrências", value: totalOcorrencias.toString(), color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
        { label: "Resolvidas", value: totalResolvidas.toString(), color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Em Aberto", value: totalEmAberto.toString(), color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    for (let i = 0; i < kpis.length; i++) {
        const kpi = kpis[i]!;
        const kx = PAD + i * (kpiW + GAP);
        ctx.fillStyle = kpi.bg;
        roundRect(ctx, kx, Y, kpiW, kpiH, 12);
        ctx.fill();
        ctx.strokeStyle = kpi.border;
        ctx.lineWidth = 1.5;
        roundRect(ctx, kx, Y, kpiW, kpiH, 12);
        ctx.stroke();
        ctx.font = "bold 28px Arial";
        ctx.fillStyle = kpi.color;
        ctx.textAlign = "center";
        ctx.fillText(kpi.value, kx + kpiW / 2, Y + 40);
        ctx.font = "10px Arial";
        ctx.fillStyle = "#475569";
        ctx.fillText(kpi.label, kx + kpiW / 2, Y + 58);
        ctx.textAlign = "left";
    }
    Y += kpiH + GAP * 2;

    // ── POR REGIONAL ────────────────────────────────────────────────────────────
    for (const regional of regionais) {
        // Cabeçalho da regional
        const colorAlerta = regional.emAberto > 0 ? "#dc2626" : "#16a34a";
        const bgAlerta    = regional.emAberto > 0 ? "#fef2f2" : "#f0fdf4";

        ctx.fillStyle = bgAlerta;
        roundRect(ctx, PAD, Y, INNER, REGIONAL_HEADER_H, 14);
        ctx.fill();
        ctx.strokeStyle = regional.emAberto > 0 ? "#fca5a5" : "#86efac";
        ctx.lineWidth = 2;
        roundRect(ctx, PAD, Y, INNER, REGIONAL_HEADER_H, 14);
        ctx.stroke();

        // Barra lateral colorida
        ctx.fillStyle = colorAlerta;
        roundRect(ctx, PAD, Y, 6, REGIONAL_HEADER_H, 6);
        ctx.fill();

        // Nome regional
        ctx.font = "bold 15px Arial";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(truncate(regional.nome, 40), PAD + 20, Y + 26);

        // KPIs inline
        const stats = [
            { v: regional.total, l: "Total", c: "#3b82f6" },
            { v: regional.resolvidas, l: "Resolvidas", c: "#16a34a" },
            { v: regional.emAberto, l: "Em Aberto", c: "#dc2626" },
        ];
        let statsX = PAD + 20;
        const statsY = Y + 46;
        for (const s of stats) {
            ctx.font = "bold 20px Arial";
            ctx.fillStyle = s.c;
            ctx.fillText(s.v.toString(), statsX, statsY);
            const numW = ctx.measureText(s.v.toString()).width;
            ctx.font = "10px Arial";
            ctx.fillStyle = "#64748b";
            ctx.fillText(s.l, statsX + numW + 4, statsY);
            statsX += numW + ctx.measureText(s.l).width + 24;
        }

        Y += REGIONAL_HEADER_H + 8;

        // Tabela de ocorrências
        if (regional.ocorrencias.length === 0) {
            ctx.fillStyle = "#f8fafc";
            roundRect(ctx, PAD, Y, INNER, EMPTY_H, 10);
            ctx.fill();
            ctx.font = "12px Arial";
            ctx.fillStyle = "#94a3b8";
            ctx.textAlign = "center";
            ctx.fillText("✅  Nenhuma ocorrência registrada neste período para esta regional", W / 2, Y + 28);
            ctx.textAlign = "left";
            Y += EMPTY_H;
        } else {
            // Cabeçalho da tabela
            ctx.fillStyle = "#f1f5f9";
            roundRect(ctx, PAD, Y, INNER, 30, 8);
            ctx.fill();
            ctx.font = "bold 9px Arial";
            ctx.fillStyle = "#64748b";
            const cols = [
                { label: "PLACA",   x: PAD + 10, w: 80 },
                { label: "TIPO",    x: PAD + 100, w: 180 },
                { label: "ROTA",    x: PAD + 290, w: 240 },
                { label: "STATUS",  x: PAD + 540, w: 90 },
                { label: "DATA",    x: PAD + 640, w: 76 },
            ];
            for (const col of cols) {
                ctx.fillText(col.label, col.x, Y + 20);
            }
            Y += 30;

            for (let i = 0; i < regional.ocorrencias.length; i++) {
                const oc = regional.ocorrencias[i]!;
                const rowBg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
                ctx.fillStyle = rowBg;
                ctx.fillRect(PAD, Y, INNER, ROW_H);

                // Borda inferior
                ctx.strokeStyle = "#e2e8f0";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(PAD, Y + ROW_H);
                ctx.lineTo(PAD + INNER, Y + ROW_H);
                ctx.stroke();

                const textY = Y + 23;
                const statusColor = oc.status === "RESOLVIDA" ? "#16a34a" : oc.status === "EM_ATENDIMENTO" ? "#d97706" : "#dc2626";
                const statusLabel = oc.status === "RESOLVIDA" ? "✅ Resolvida" : oc.status === "EM_ATENDIMENTO" ? "🟡 Em Atend." : "🔴 Aberta";

                ctx.font = "bold 11px Courier New";
                ctx.fillStyle = "#1d4ed8";
                ctx.fillText(oc.placa, PAD + 10, textY);

                ctx.font = "11px Arial";
                ctx.fillStyle = "#374151";
                ctx.fillText(truncate(oc.tipo, 26), PAD + 100, textY);

                ctx.font = "10px Arial";
                ctx.fillStyle = "#6b7280";
                ctx.fillText(truncate(oc.rota, 34), PAD + 290, textY);

                ctx.font = "bold 10px Arial";
                ctx.fillStyle = statusColor;
                ctx.fillText(statusLabel, PAD + 540, textY);

                ctx.font = "10px Arial";
                ctx.fillStyle = "#94a3b8";
                ctx.fillText(
                    oc.dataAbertura.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" }),
                    PAD + 640, textY,
                );

                Y += ROW_H;
            }
        }

        Y += GAP;
    }

    // ── FOOTER ──────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, Y, W, FOOTER_H);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, Y, W, 1);
    ctx.font = "bold 11px Arial";
    ctx.fillStyle = "#22c55e";
    ctx.textAlign = "center";
    ctx.fillText("Princesa dos Campos Transportes", W / 2, Y + 20);
    ctx.font = "10px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText("Torre de Controle — Relatório Semanal por Regional", W / 2, Y + 36);
    ctx.fillStyle = "#334155";
    ctx.fillText("E-mail gerado automaticamente. Não responda.", W / 2, Y + 52);
    ctx.textAlign = "left";

    return canvas.toBuffer("image/png") as unknown as Buffer;
}

// ─── Envio do e-mail ─────────────────────────────────────────────────────────

export async function enviarRelatorioSemanal(): Promise<{ enviados: number; erros: number }> {
    console.log("📊 Iniciando geração do relatório semanal...");

    // Coleta dados
    const { regionais, inicio, fim } = await coletarDadosRelatorio();
    const imgBuffer = await gerarImagemRelatorio(regionais, inicio, fim);

    // Busca destinatários
    const destinatarios = await db.user.findMany({
        where: { recebeRelatorioSemanal: true },
        select: { email: true, name: true },
    });

    if (destinatarios.length === 0) {
        console.log("⚠️  Nenhum destinatário configurado para o relatório semanal.");
        return { enviados: 0, erros: 0 };
    }

    const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST ?? "smtp.office365.com",
        port:   Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:   { user: process.env.SMTP_USER ?? "", pass: process.env.SMTP_PASS ?? "" },
        tls:    { rejectUnauthorized: false },
    });

    const fmtData = (d: Date) =>
        d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });

    const totalOcorrencias = regionais.reduce((a, r) => a + r.total, 0);
    const totalEmAberto    = regionais.reduce((a, r) => a + r.emAberto, 0);
    const assunto = totalEmAberto > 0
        ? `🚨 Relatório Semanal — ${totalEmAberto} ocorrências em aberto | ${fmtData(inicio)} – ${fmtData(fim)}`
        : `✅ Relatório Semanal — ${totalOcorrencias} ocorrências | ${fmtData(inicio)} – ${fmtData(fim)}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 0;">
    <tr><td align="center">
      <img src="cid:relatorio-semanal" alt="Relatório Semanal de Ocorrências"
           width="780" style="display:block;border-radius:16px;max-width:100%;" />
    </td></tr>
    <tr><td align="center" style="padding:12px;font-family:Arial,sans-serif;font-size:10px;color:#475569;">
      Este e-mail foi gerado automaticamente. Não responda esta mensagem.
    </td></tr>
  </table>
</body>
</html>`;

    let enviados = 0;
    let erros = 0;

    for (const dest of destinatarios) {
        try {
            await transporter.sendMail({
                from:    `"Torre de Controle" <${process.env.SMTP_USER ?? ""}>`,
                to:      dest.email,
                subject: assunto,
                html,
                attachments: [{
                    filename: `relatorio_semanal_${inicio.toISOString().split("T")[0]}.png`,
                    content:  imgBuffer,
                    cid:      "relatorio-semanal",
                }],
            });
            enviados++;
            console.log(`📧 Relatório enviado para ${dest.email}`);
        } catch (err) {
            erros++;
            console.error(`❌ Erro ao enviar para ${dest.email}:`, err);
        }
    }

    console.log(`✅ Relatório semanal concluído: ${enviados} enviados, ${erros} erros`);
    return { enviados, erros };
}
