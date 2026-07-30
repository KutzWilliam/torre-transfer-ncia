/**
 * Serviço de Relatório Semanal por Gerente/Regional.
 * 
 * Gera uma imagem PNG consolidada, agora com design premium,
 * incluindo a descrição das resoluções.
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
    return text.length > max ? text.slice(0, max - 1) + "..." : text;
}

function wrapText(ctx: SKRSContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number {
    const words = text.replace(/\n/g, " \n ").split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
        if (words[n] === '\n') {
            ctx.fillText(line.trim(), x, currentY);
            line = '';
            currentY += lineHeight;
            continue;
        }

        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line.trim(), x, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
        } else {
            line = testLine;
        }
    }
    if (line.trim().length > 0) {
        ctx.fillText(line.trim(), x, currentY);
        currentY += lineHeight;
    }
    return currentY;
}

function measureWrapHeight(ctx: SKRSContext2D, text: string, maxWidth: number, lineHeight: number): number {
    const words = text.replace(/\n/g, " \n ").split(' ');
    let line = '';
    let lines = 0;

    for (let n = 0; n < words.length; n++) {
        if (words[n] === '\n') {
            lines++;
            line = '';
            continue;
        }

        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            lines++;
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    if (line.trim().length > 0) lines++;
    return Math.max(1, lines) * lineHeight;
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface OcorrenciaResumo {
    placa:                  string;
    tipo:                   string;
    status:                 string;
    dataAbertura:           Date;
    rota:                   string;
    resolucao:              string | null;
    notaTorre:              string | null;
    abertaPorNome:          string | null;
    acionadoPorNome:        string | null;
    acionadoEm:             Date | null;
    resolvidaPorNome:       string | null;
    resolvidaEm:            Date | null;
    unidadeResponsavelNome: string | null;
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
    const agora = new Date();
    
    // Fim = Hoje até 23:59:59
    const dataFim = new Date(agora);
    dataFim.setHours(23, 59, 59, 999);

    // Início = 6 dias antes (ex: de Sábado a Sexta são 7 dias corridos)
    const dataInicio = new Date(dataFim);
    dataInicio.setDate(dataFim.getDate() - 6);
    dataInicio.setHours(0, 0, 0, 0);

    const regionais = await db.regional.findMany({
        orderBy: { nome: "asc" },
        include: { veiculos: true },
    });

    const resultado: RegionalResumo[] = [];

    for (const regional of regionais) {
        const placas = regional.veiculos.map(v => v.placa.replace(/-/g, "").toUpperCase());
        if (placas.length === 0) continue;

        const ocorrencias = await db.ocorrencia.findMany({
            where: {
                createdAt: { gte: dataInicio, lte: dataFim },
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
                unidadeResponsavel: { select: { nome: true } },
                abertaPor:   { select: { name: true } },
                acionadoPor: { select: { name: true } },
                resolvidaPor: { select: { name: true } },
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
            placa:                  o.viagem.veiculo.placa,
            tipo:                   o.tipoOcorrencia,
            status:                 o.status,
            dataAbertura:           o.createdAt,
            rota:                   `${o.viagem.baseOrigem?.nome ?? "?"} -> ${o.viagem.baseDestino?.nome ?? "?"}`,
            resolucao:              o.resolucao,
            notaTorre:              o.notaTorre,
            abertaPorNome:          o.abertaPor?.name ?? null,
            acionadoPorNome:        o.acionadoPor?.name ?? null,
            acionadoEm:             o.acionadoEm ?? null,
            resolvidaPorNome:       o.resolvidaPor?.name ?? null,
            resolvidaEm:            o.resolvidaEm ?? null,
            unidadeResponsavelNome: o.unidadeResponsavel?.nome ?? null,
        }));

        resultado.push({
            nome:        regional.nome,
            total:       ocorrencias.length,
            resolvidas:  ocorrencias.filter(o => o.status === "RESOLVIDA").length,
            emAberto:    ocorrencias.filter(o => o.status !== "RESOLVIDA").length,
            ocorrencias: resumoOcorrencias,
        });
    }

    return { regionais: resultado, inicio: dataInicio, fim: dataFim };
}

// ─── Geração da imagem ───────────────────────────────────────────────────────

export async function gerarImagemRelatorio(
    regionais: RegionalResumo[],
    inicio: Date,
    fim: Date,
): Promise<Buffer> {
    const SCALE = 2; // Qualidade Retina
    const W   = 900;
    const PAD = 40;
    const INNER = W - PAD * 2;

    const fmtData = (d: Date) =>
        d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "America/Sao_Paulo" });

    // Instancia um canvas temporário só para medir textos dinâmicos (não precisa de scale para medir)
    const dummyCanvas = createCanvas(W, 100);
    const dCtx = dummyCanvas.getContext("2d");

    // Constantes e cálculos de layout (medidas lógicas)
    const HEADER_H   = 160;
    const PERIOD_H   = 50;
    const REGIONAL_HEADER_H = 80;
    const EMPTY_H    = 50;
    const GAP        = 24;
    const FOOTER_H   = 70;
    // Tabela mais larga com as novas colunas
    const COLS = {
        placa:       { x: PAD + 8,   w: 75 },
        tipo:        { x: PAD + 88,  w: 120 },
        abertaPor:   { x: PAD + 213, w: 95 },
        atendimento: { x: PAD + 313, w: 95 },
        abAc:        { x: PAD + 413, w: 55 },
        unidade:     { x: PAD + 473, w: 100 },
        resolvidaPor:{ x: PAD + 578, w: 100 },
        acRes:       { x: PAD + 683, w: 55 },
        status:      { x: PAD + 743, w: 70 },
    };

    let totalH = HEADER_H + PERIOD_H + GAP;
    
    // Calcula as alturas dinâmicas para cada regional e ocorrência
    const regionalLayouts: Array<{
        r: RegionalResumo;
        rowLayouts: Array<{ oc: OcorrenciaResumo; h: number; descText: string }>;
    }> = [];

    for (const r of regionais) {
        totalH += REGIONAL_HEADER_H + 10;
        const rowLayouts = [];
        
        if (r.ocorrencias.length === 0) {
            totalH += EMPTY_H;
        } else {
            totalH += 38; // Header da tabela
            
            dCtx.font = "11px Arial";
            for (const oc of r.ocorrencias) {
                // Cada linha tem altura fixa mínima
                const rowH = 44;
                rowLayouts.push({ oc, h: rowH, descText: "" });
                totalH += rowH;
            }
        }
        regionalLayouts.push({ r, rowLayouts });
        totalH += GAP;
    }
    totalH += FOOTER_H;

    // Aplica o scale ao criar o canvas oficial
    const canvas = createCanvas(W * SCALE, totalH * SCALE);
    const ctx = canvas.getContext("2d");
    ctx.scale(SCALE, SCALE);

    // ── BG ─────────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, totalH);

    // ── HEADER PREMIUM ─────────────────────────────────────────────────────────
    let Y = 0;
    const hGrad = ctx.createLinearGradient(0, 0, W, HEADER_H);
    hGrad.addColorStop(0, "#020617");
    hGrad.addColorStop(0.5, "#0f172a");
    hGrad.addColorStop(1, "#1e293b");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Glow verde esmeralda no topo
    const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 400);
    glow.addColorStop(0, "rgba(16, 185, 129, 0.15)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, HEADER_H);

    // Logo Princesa
    const logoPath = path.join(process.cwd(), "public", "cropped-icon.png");
    if (fs.existsSync(logoPath)) {
        try {
            const { loadImage } = await import("@napi-rs/canvas");
            const logo = await loadImage(logoPath);
            const lH = Math.round((logo.height / logo.width) * 50);
            ctx.drawImage(logo, PAD, Y + 25, 50, lH);
        } catch { /* ignore */ }
    }

    // Badge "RELATÓRIO SEMANAL"
    const bdGrad = ctx.createLinearGradient(PAD, Y + 92, PAD + 210, Y + 116);
    bdGrad.addColorStop(0, "#059669");
    bdGrad.addColorStop(1, "#047857");
    ctx.fillStyle = bdGrad;
    roundRect(ctx, PAD, Y + 92, 210, 24, 12);
    ctx.fill();
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("RELATÓRIO SEMANAL DE OCORRÊNCIAS", PAD + 12, Y + 108);

    // Title
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "#f8fafc";
    const t1 = "Torre de ";
    ctx.fillText(t1, PAD, Y + 140);
    ctx.fillStyle = "#10b981"; // Emerald 500
    ctx.fillText("Controle", PAD + ctx.measureText(t1).width, Y + 140);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Princesa dos Campos Transportes - Consolidado por Gerente", PAD, Y + 155);

    Y += HEADER_H;

    // ── PERÍODO ─────────────────────────────────────────────────────────────────
    const stripe = ctx.createLinearGradient(0, Y, W, Y);
    stripe.addColorStop(0, "#10b981"); // Emerald
    stripe.addColorStop(0.5, "#3b82f6"); // Blue
    stripe.addColorStop(1, "#8b5cf6"); // Violet
    ctx.fillStyle = stripe;
    ctx.fillRect(0, Y, W, 4);
    Y += 4;

    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, Y, W, PERIOD_H - 4);
    ctx.font = "13px Arial";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    const diasSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    ctx.fillText(
        `Período: ${fmtData(inicio)} (${diasSemana[inicio.getDay()]}) até ${fmtData(fim)} (${diasSemana[fim.getDay()]})`,
        W / 2, Y + 28,
    );
    ctx.textAlign = "left";
    Y += PERIOD_H - 4 + GAP;

    // ── KPIs GLOBAIS ────────────────────────────────────────────────────────────
    const totalOcorrencias  = regionais.reduce((a, r) => a + r.total, 0);
    const totalResolvidas   = regionais.reduce((a, r) => a + r.resolvidas, 0);
    const totalEmAberto     = regionais.reduce((a, r) => a + r.emAberto, 0);

    const kpiW = (INNER - 2 * GAP) / 3;
    const kpiH = 76;
    const kpis = [
        { label: "Total de Ocorrências", value: totalOcorrencias.toString(), color: "#3b82f6", bg: "#1e293b", border: "#334155" },
        { label: "Resolvidas na Semana", value: totalResolvidas.toString(), color: "#10b981", bg: "#1e293b", border: "#334155" },
        { label: "Aguardando Tratativa", value: totalEmAberto.toString(), color: "#f43f5e", bg: "#1e293b", border: "#334155" },
    ];

    for (let i = 0; i < kpis.length; i++) {
        const kpi = kpis[i]!;
        const kx = PAD + i * (kpiW + GAP);
        ctx.fillStyle = kpi.bg;
        roundRect(ctx, kx, Y, kpiW, kpiH, 12);
        ctx.fill();
        ctx.strokeStyle = kpi.border;
        ctx.lineWidth = 1;
        roundRect(ctx, kx, Y, kpiW, kpiH, 12);
        ctx.stroke();
        
        ctx.font = "bold 32px Arial";
        ctx.fillStyle = kpi.color;
        ctx.textAlign = "center";
        ctx.fillText(kpi.value, kx + kpiW / 2, Y + 45);
        ctx.font = "bold 11px Arial";
        ctx.fillStyle = "#94a3b8";
        ctx.fillText(kpi.label.toUpperCase(), kx + kpiW / 2, Y + 65);
        ctx.textAlign = "left";
    }
    Y += kpiH + GAP * 1.5;

    // ── POR REGIONAL / GERENTE ──────────────────────────────────────────────────
    for (const { r, rowLayouts } of regionalLayouts) {
        
        const hasAberto = r.emAberto > 0;
        const colorAlerta = hasAberto ? "#f43f5e" : "#10b981"; // Rose / Emerald
        const bgAlerta    = hasAberto ? "rgba(244, 63, 94, 0.05)" : "rgba(16, 185, 129, 0.05)";

        // Card da Regional
        ctx.fillStyle = bgAlerta;
        roundRect(ctx, PAD, Y, INNER, REGIONAL_HEADER_H, 16);
        ctx.fill();
        ctx.strokeStyle = hasAberto ? "rgba(244, 63, 94, 0.2)" : "rgba(16, 185, 129, 0.2)";
        ctx.lineWidth = 1.5;
        roundRect(ctx, PAD, Y, INNER, REGIONAL_HEADER_H, 16);
        ctx.stroke();

        // Barra lateral colorida de status
        ctx.fillStyle = colorAlerta;
        roundRect(ctx, PAD, Y, 8, REGIONAL_HEADER_H, 16);
        ctx.fill();

        // Nome gerente
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(`${truncate(r.nome, 40)}`, PAD + 24, Y + 32);

        // KPIs inline
        const stats = [
            { v: r.total, l: "Total", c: "#60a5fa" },
            { v: r.resolvidas, l: "Resolvidas", c: "#34d399" },
            { v: r.emAberto, l: "Em Aberto", c: "#fb7185" },
        ];
        let statsX = PAD + 24;
        const statsY = Y + 60;
        for (const s of stats) {
            ctx.font = "bold 20px Arial";
            ctx.fillStyle = s.c;
            ctx.fillText(s.v.toString(), statsX, statsY);
            const numW = ctx.measureText(s.v.toString()).width;
            ctx.font = "11px Arial";
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(s.l, statsX + numW + 6, statsY - 2);
            statsX += numW + ctx.measureText(s.l).width + 30;
        }

        Y += REGIONAL_HEADER_H + 10;

        // Tabela de ocorrências
        if (rowLayouts.length === 0) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
            roundRect(ctx, PAD, Y, INNER, EMPTY_H, 12);
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.stroke();
            ctx.font = "12px Arial";
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("Nenhuma ocorrência registrada nesta semana.", W / 2, Y + 29);
            ctx.textAlign = "left";
            Y += EMPTY_H;
        } else {
            // Cabeçalho da tabela
            ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
            roundRect(ctx, PAD, Y, INNER, 38, 10);
            ctx.fill();
            ctx.font = "bold 9px Arial";
            ctx.fillStyle = "#94a3b8";
            
            ctx.fillText("PLACA / DATA",       COLS.placa.x,        Y + 14);
            ctx.fillText("TIPO / ROTA",         COLS.tipo.x,         Y + 14);
            ctx.fillText("ABERTA POR",          COLS.abertaPor.x,    Y + 14);
            ctx.fillText("ATENDIMENTO",         COLS.atendimento.x,  Y + 14);
            ctx.fillText("AB+AC",               COLS.abAc.x,         Y + 14);
            ctx.fillText("UNIDADE RESP.",       COLS.unidade.x,      Y + 14);
            ctx.fillText("RESOLVIDA POR",       COLS.resolvidaPor.x, Y + 14);
            ctx.fillText("AC+RES",              COLS.acRes.x,        Y + 14);
            ctx.fillText("STATUS",              COLS.status.x,       Y + 14);

            // Sub-header: SOLUÇÃO
            ctx.font = "9px Arial";
            ctx.fillStyle = "#64748b";
            ctx.fillText("(Solução na segunda linha)", COLS.abertaPor.x, Y + 28);
            Y += 38;

            // Função para calcular tempo em minutos
            const calcMin = (de: Date | null, ate: Date | null): string => {
                if (!de || !ate) return "—";
                const ms = new Date(ate).getTime() - new Date(de).getTime();
                if (ms <= 0) return "—";
                const totalMin = Math.floor(ms / 60000);
                const h = Math.floor(totalMin / 60);
                const m = totalMin % 60;
                return h > 0 ? `${h}h ${m}min` : `${m} Min`;
            };

            // Linhas
            for (let i = 0; i < rowLayouts.length; i++) {
                const { oc, h } = rowLayouts[i]!;
                
                // Background da linha
                const rowBg = i % 2 === 0 ? "rgba(255, 255, 255, 0.025)" : "rgba(255, 255, 255, 0)";
                ctx.fillStyle = rowBg;
                ctx.fillRect(PAD, Y, INNER, h);

                // Borda inferior (exceto na última)
                if (i < rowLayouts.length - 1) {
                    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(PAD + 10, Y + h);
                    ctx.lineTo(PAD + INNER - 10, Y + h);
                    ctx.stroke();
                }

                const textY = Y + 16;
                const statusColor  = oc.status === "RESOLVIDA" ? "#10b981" : oc.status === "EM_ATENDIMENTO" ? "#f59e0b" : "#f43f5e";
                const statusLabel  = oc.status === "RESOLVIDA" ? "Resolvida" : oc.status === "EM_ATENDIMENTO" ? "Em Atend." : "Aberta";

                const abAcStr  = calcMin(oc.dataAbertura, oc.acionadoEm);
                const acResStr = calcMin(oc.acionadoEm, oc.resolvidaEm);

                // Placa
                ctx.font = "bold 11px Courier New";
                ctx.fillStyle = "#60a5fa";
                ctx.fillText(oc.placa, COLS.placa.x, textY);
                // Data da abertura
                ctx.font = "9px Arial";
                ctx.fillStyle = "#64748b";
                const dtAb = oc.dataAbertura.toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                    timeZone: "America/Sao_Paulo",
                });
                ctx.fillText(dtAb, COLS.placa.x, textY + 14);

                // Tipo
                ctx.font = "bold 10px Arial";
                ctx.fillStyle = "#e2e8f0";
                ctx.fillText(truncate(oc.tipo, 18), COLS.tipo.x, textY);
                // Rota
                ctx.font = "9px Arial";
                ctx.fillStyle = "#94a3b8";
                ctx.fillText(truncate(oc.rota, 22), COLS.tipo.x, textY + 14);

                // Aberta Por
                ctx.font = "10px Arial";
                ctx.fillStyle = "#cbd5e1";
                ctx.fillText(truncate(oc.abertaPorNome ?? "Sistema", 16), COLS.abertaPor.x, textY);
                // Solução (abaixo do aberta por)
                if (oc.resolucao) {
                    ctx.font = "9px Arial";
                    ctx.fillStyle = "#10b981";
                    ctx.fillText(truncate(oc.resolucao, 18), COLS.abertaPor.x, textY + 14);
                }

                // Atendimento (acionadoPor)
                ctx.font = "10px Arial";
                ctx.fillStyle = "#fbbf24";
                ctx.fillText(truncate(oc.acionadoPorNome ?? "—", 16), COLS.atendimento.x, textY);
                // notaTorre abaixo
                if (oc.notaTorre) {
                    ctx.font = "9px Arial";
                    ctx.fillStyle = "#94a3b8";
                    ctx.fillText(truncate(oc.notaTorre, 18), COLS.atendimento.x, textY + 14);
                }

                // AB+AC
                ctx.font = "bold 10px Arial";
                ctx.fillStyle = abAcStr !== "—" ? "#f59e0b" : "#475569";
                ctx.fillText(abAcStr, COLS.abAc.x, textY);

                // Unidade Responsável
                ctx.font = "10px Arial";
                ctx.fillStyle = "#e2e8f0";
                ctx.fillText(truncate(oc.unidadeResponsavelNome ?? "—", 16), COLS.unidade.x, textY);

                // Resolvida Por
                ctx.font = "10px Arial";
                ctx.fillStyle = "#34d399";
                ctx.fillText(truncate(oc.resolvidaPorNome ?? "—", 16), COLS.resolvidaPor.x, textY);

                // AC+RES
                ctx.font = "bold 10px Arial";
                ctx.fillStyle = acResStr !== "—" ? "#34d399" : "#475569";
                ctx.fillText(acResStr, COLS.acRes.x, textY);

                // Status
                ctx.font = "bold 10px Arial";
                ctx.fillStyle = statusColor;
                ctx.fillText(statusLabel, COLS.status.x, textY);

                Y += h;
            }
        }
        Y += GAP;
    }

    // ── FOOTER ──────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, Y, W, FOOTER_H);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(0, Y, W, 1);
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#10b981";
    ctx.textAlign = "center";
    ctx.fillText("Princesa dos Campos Transportes", W / 2, Y + 25);
    ctx.font = "11px Arial";
    ctx.fillStyle = "#475569";
    ctx.fillText("Torre de Controle - Relatório Semanal de Ocorrências", W / 2, Y + 43);
    ctx.fillStyle = "#334155";
    ctx.fillText("E-mail gerado automaticamente. Não responda.", W / 2, Y + 58);
    ctx.textAlign = "left";

    return canvas.toBuffer("image/png") as unknown as Buffer;
}

// ─── Envio do e-mail ─────────────────────────────────────────────────────────

export async function enviarRelatorioSemanal(): Promise<{ enviados: number; erros: number }> {
    console.log("Iniciando geração do relatório semanal...");

    // Coleta dados
    const { regionais, inicio, fim } = await coletarDadosRelatorio();
    const imgBuffer = await gerarImagemRelatorio(regionais, inicio, fim);

    // Busca destinatários
    const destinatarios = await db.user.findMany({
        where: { recebeRelatorioSemanal: true },
        select: { email: true, name: true },
    });

    if (destinatarios.length === 0) {
        console.log("Nenhum destinatário configurado para o relatório semanal.");
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
        ? `Relatório Semanal - ${totalEmAberto} ocorrências aguardando tratativa | ${fmtData(inicio)} - ${fmtData(fim)}`
        : `Relatório Semanal - ${totalOcorrencias} ocorrências | ${fmtData(inicio)} - ${fmtData(fim)}`;

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:32px 0;">
    <tr><td align="center">
      <img src="cid:relatorio-semanal" alt="Relatório Semanal de Ocorrências"
           width="900" style="display:block;border-radius:16px;max-width:100%;" />
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
            console.log(`Relatório enviado para ${dest.email}`);
        } catch (err) {
            erros++;
            console.error(`Erro ao enviar para ${dest.email}:`, err);
        }
    }

    console.log(`Relatório semanal concluído: ${enviados} enviados, ${erros} erros`);
    return { enviados, erros };
}
