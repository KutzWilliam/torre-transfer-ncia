import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { telemetriaDb } from "@/server/db-telemetria";
import { processarStatusViagens } from "@/server/services/viagemService";

let isSyncing = false;

export async function GET() {
    if (isSyncing) {
        return NextResponse.json({ success: false, message: "Sync já em andamento." });
    }

    try {
        isSyncing = true;
        console.log("A iniciar sincronização de telemetria...");

        // 1. Sincronizar Veículos — usando raw SQL para evitar conflito de FK ao atualizar o ID
        const resultVeiculos = await telemetriaDb.query(`
            SELECT "idVeiculo", "placa", "descricao"
            FROM veiculos_sascar
            WHERE "placa" IS NOT NULL AND "idVeiculo" IS NOT NULL
        `);

        let veiculosAtualizados = 0;
        const veiculosMigrados: string[] = [];
        const veiculosCriados: string[] = [];
        const veiculosTemporarios: string[] = [];

        for (const row of resultVeiculos.rows) {
            if (!row.placa) continue;
            const placaRaw = String(row.placa);
            const placaLimpa = placaRaw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
            const idNovo = String(row.idVeiculo);

            // Verificar se já existe pelo ID real
            const porId = await db.veiculo.findUnique({ where: { id: idNovo } });
            // Verificar se existe pela placa (pode estar com um ID temporário)
            const porPlaca = await db.veiculo.findUnique({ where: { placa: placaLimpa } });

            if (porPlaca && porPlaca.id !== idNovo) {
                const idVelho = porPlaca.id;
                console.log(`[SYNC] Migrando veículo de forma segura: placa=${placaLimpa} (${idVelho} → ${idNovo})`);
                await db.$transaction(async (tx) => {
                    // 1. Libera a placa do registro antigo para não colidir com o unique constraint
                    await tx.$executeRawUnsafe(`UPDATE "Veiculo" SET "placa" = $1 WHERE "id" = $2`, `_MIG_${idVelho}`, idVelho);

                    // 2. Insere/garante o veículo com o id definitivo da Sascar
                    await tx.$executeRawUnsafe(`
                        INSERT INTO "Veiculo" ("id", "placa", "descricao", "createdAt", "updatedAt")
                        VALUES ($1, $2, $3, NOW(), NOW())
                        ON CONFLICT ("id") DO UPDATE SET "placa" = EXCLUDED."placa", "descricao" = EXCLUDED."descricao", "updatedAt" = NOW()
                    `, idNovo, placaLimpa, row.descricao ?? "Importado Sascar");

                    // 3. Redireciona viagens e telemetrias do id temporário para o id definitivo
                    await tx.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);
                    await tx.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);

                    // 4. Remove o registro temporário antigo
                    await tx.$executeRawUnsafe(`DELETE FROM "Veiculo" WHERE "id" = $1`, idVelho);
                }, { timeout: 120000, maxWait: 15000 });
                console.log(`[SYNC]   → Migração segura concluída (${idVelho} → ${idNovo})`);
                veiculosMigrados.push(`${placaLimpa}(${idVelho}→${idNovo})`);
            } else if (!porPlaca && !porId) {
                // Novo veículo
                await db.veiculo.create({ data: { id: idNovo, placa: placaLimpa, descricao: row.descricao } });
                veiculosCriados.push(`${placaLimpa}(${idNovo})`);
            } else if (porId && !porPlaca) {
                // ID existe mas placa errada — só atualizar placa
                console.log(`[SYNC] Atualizando placa do veículo id=${idNovo}: ${porId.placa} → ${placaLimpa} (raw Sascar: ${placaRaw})`);
                await db.veiculo.update({ where: { id: idNovo }, data: { placa: placaLimpa, descricao: row.descricao } });
            }
            veiculosAtualizados++;
        }

        // Verificar se ainda existem veículos com ID temporário (indício de sync incompleto)
        const tempVeiculos = await db.veiculo.findMany({
            where: { id: { startsWith: "temp_" } },
            select: { id: true, placa: true }
        });
        if (tempVeiculos.length > 0) {
            console.warn(`[SYNC] ⚠ Veículos com ID temporário (não encontrados no Sascar): ${tempVeiculos.map(v => `${v.placa}(${v.id})`).join(", ")}`);
            tempVeiculos.forEach(v => veiculosTemporarios.push(`${v.placa}(${v.id})`));
        }
        if (veiculosMigrados.length > 0) console.log(`[SYNC] Migrados: ${veiculosMigrados.join(", ")}`);
        if (veiculosCriados.length > 0) console.log(`[SYNC] Criados: ${veiculosCriados.join(", ")}`);

        // 2. Obter a data do último registo na nossa base local (ignorando datas bizarramente no futuro)
        const agoraUtc = new Date();
        const ultimaTelemetria = await db.telemetria.findFirst({
            where: { dataHoraUtc: { lte: agoraUtc } },
            orderBy: { dataHoraUtc: 'desc' },
            select: { dataHoraUtc: true }
        });

        // Janela padrão: se sem dados locais, puxar das últimas 48h
        let dataCorte: string;
        const tzOffsetMs = 3 * 3600 * 1000; // GMT-3

        if (ultimaTelemetria) {
            // Reconstroi a string Local (ex: "2026-03-24 14:35:57") que o Sascar usa no BD
            const d = new Date(ultimaTelemetria.dataHoraUtc.getTime() - tzOffsetMs);
            dataCorte = d.toISOString().replace('T', ' ').substring(0, 19);
        } else {
            const cutoff = new Date(agoraUtc.getTime() - 48 * 3600 * 1000);
            const d = new Date(cutoff.getTime() - tzOffsetMs);
            dataCorte = d.toISOString().replace('T', ' ').substring(0, 19);
        }

        const queryRastreamento = `
            SELECT "vehicleId", "positionDateUtc", "latitude", "longitude", "ignition", "speed"
            FROM rastreamento_sascar
            WHERE "vehicleId" IS NOT NULL AND "positionDateUtc" > '${dataCorte}'
            ORDER BY "positionDateUtc" ASC LIMIT 10000
        `;

        const resultRastreamento = await telemetriaDb.query(queryRastreamento);

        // 3. Inserir Registos de Telemetria em chunks para evitar queries gigantes
        let telemetriasInseridas = 0;
        if (resultRastreamento.rows.length > 0) {
            const dadosParaInserir = resultRastreamento.rows.map((row) => {
                const rawDate = row.positionDateUtc;
                let dataUtc: Date;

                if (typeof rawDate === 'string') {
                    // Se veio como string ("2026-03-24 14:35:00"), forçamos o parse como fuso -03:00
                    const isoStr = rawDate.replace(' ', 'T') + '-03:00';
                    dataUtc = new Date(isoStr);
                } else if (rawDate instanceof Date) {
                    // O pg interpretou como Local Date. Então o getTime() interno da rawDate já é o Absoluto correto em UTC!
                    // Mas como precaução, pegamos exatamente a Data que o pg construiu.
                    dataUtc = rawDate;
                } else {
                    dataUtc = new Date();
                }

                return {
                    veiculoId: String(row.vehicleId),
                    latitude: Number(row.latitude),
                    longitude: Number(row.longitude),
                    ignicao: Boolean(row.ignition),
                    velocidade: Number(row.speed) || 0,
                    dataHoraUtc: dataUtc,
                    dataHoraLocal: new Date(dataUtc.getTime() - 3 * 3600 * 1000), // Restaurado: O sistema precisa da data com offset -3h aplicado
                };
            });

            // Validate which vehicles actually exist in our db to avoid FK errors
            const idsParaVerificar = Array.from(new Set(dadosParaInserir.map(d => d.veiculoId)));
            const veiculosExistentes = await db.veiculo.findMany({
                where: { id: { in: idsParaVerificar } },
                select: { id: true }
            });
            const idsValidos = new Set(veiculosExistentes.map(v => v.id));
            
            const dadosFiltrados = dadosParaInserir.filter(d => idsValidos.has(d.veiculoId));

            // ⚡ OTIMIZAÇÃO: Amostragem inteligente (1 ponto/minuto ou mudança de ignição)
            // Evita encher o banco com pontos a cada 3 segundos, reduzindo o volume em ~90%
            const ultimasPosicoes = new Map<string, { ignicao: boolean; timestamp: number }>();
            const dadosOtimizados = dadosFiltrados.filter(d => {
                const anterior = ultimasPosicoes.get(d.veiculoId);
                const tempoAtual = d.dataHoraUtc.getTime();

                // Primeiro ponto do lote para este veículo -> mantém
                if (!anterior) {
                    ultimasPosicoes.set(d.veiculoId, { ignicao: d.ignicao, timestamp: tempoAtual });
                    return true;
                }

                // Houve mudança no status de ignição (ligou ou desligou) -> mantém
                if (anterior.ignicao !== d.ignicao) {
                    ultimasPosicoes.set(d.veiculoId, { ignicao: d.ignicao, timestamp: tempoAtual });
                    return true;
                }

                // Passou pelo menos 60 segundos desde a última posição gravada -> mantém
                if (tempoAtual - anterior.timestamp >= 60 * 1000) {
                    ultimasPosicoes.set(d.veiculoId, { ignicao: d.ignicao, timestamp: tempoAtual });
                    return true;
                }

                // Ponto redundante em intervalo inferior a 60s -> descarta
                return false;
            });

            if (dadosOtimizados.length > 0) {
                await db.telemetria.createMany({
                    data: dadosOtimizados,
                    skipDuplicates: true,
                });
                telemetriasInseridas = dadosOtimizados.length;
            } else {
                telemetriasInseridas = 0;
            }
        }

        // 4. Processar chegadas nas bases e atualizar status das viagens
        const viagensBaixadas = await processarStatusViagens();

        // 5. ⚡ Limpeza Contínua: purga telemetrias com mais de 15 dias para o banco nunca voltar a crescer descontroladamente
        try {
            const limite15Dias = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
            await db.telemetria.deleteMany({
                where: { dataHoraLocal: { lt: limite15Dias } }
            });
        } catch (purgeErr) {
            console.error("Aviso: falha na limpeza de telemetrias antigas:", purgeErr);
        }

        isSyncing = false;
        return NextResponse.json({
            success: true,
            message: "Sincronização concluída",
            veiculos: veiculosAtualizados,
            telemetriasNovas: telemetriasInseridas,
            viagensAtualizadas: viagensBaixadas,
            diagnostico: {
                migrados: veiculosMigrados,
                criados: veiculosCriados,
                semSinal_idTemp: veiculosTemporarios,
            },
        });

    } catch (error) {
        isSyncing = false;
        console.error("Erro na sincronização:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}