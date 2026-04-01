import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { telemetriaDb } from "@/server/db-telemetria";
import { processarStatusViagens } from "@/server/services/viagemService";

export async function GET() {
    try {
        console.log("A iniciar sincronização de telemetria...");

        // 1. Sincronizar Veículos — usando raw SQL para evitar conflito de FK ao atualizar o ID
        const resultVeiculos = await telemetriaDb.query(`
            SELECT "idVeiculo", "placa", "descricao"
            FROM veiculos_sascar
            WHERE "placa" IS NOT NULL AND "idVeiculo" IS NOT NULL
        `);

        let veiculosAtualizados = 0;
        for (const row of resultVeiculos.rows) {
            if (!row.placa) continue;
            const placaLimpa = row.placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
            const idNovo = String(row.idVeiculo);

            // Verificar se já existe pelo ID real
            const porId = await db.veiculo.findUnique({ where: { id: idNovo } });
            // Verificar se existe pela placa (pode estar com um ID temporário)
            const porPlaca = await db.veiculo.findUnique({ where: { placa: placaLimpa } });

            if (porPlaca && porPlaca.id !== idNovo) {
                // Existe pela placa mas com ID errado (temp_XXXX). Migrar via raw SQL.
                const idVelho = porPlaca.id;
                if (porId) {
                    // Já existe um registro com o ID novo e outro com placa errada — merge: apagar o que caiu num ID errado.
                    await db.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);
                    await db.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);
                    await db.$executeRawUnsafe(`DELETE FROM "Veiculo" WHERE "id" = $1`, idVelho);
                    await db.veiculo.update({ where: { id: idNovo }, data: { placa: placaLimpa, descricao: row.descricao } });
                } else {
                    // Apenas muda o ID via raw SQL com cascade manual de FKs
                    await db.$executeRawUnsafe(`UPDATE "Viagem" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);
                    await db.$executeRawUnsafe(`UPDATE "Telemetria" SET "veiculoId" = $1 WHERE "veiculoId" = $2`, idNovo, idVelho);
                    await db.$executeRawUnsafe(`UPDATE "Veiculo" SET "id" = $1, "descricao" = $2, "updatedAt" = NOW() WHERE "id" = $3`, idNovo, row.descricao, idVelho);
                }
            } else if (!porPlaca && !porId) {
                // Novo veículo
                await db.veiculo.create({ data: { id: idNovo, placa: placaLimpa, descricao: row.descricao } });
            } else if (porId && !porPlaca) {
                // ID existe mas placa errada — só atualizar placa
                await db.veiculo.update({ where: { id: idNovo }, data: { placa: placaLimpa, descricao: row.descricao } });
            }
            veiculosAtualizados++;
        }

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

            if (dadosFiltrados.length > 0) {
                await db.telemetria.createMany({
                    data: dadosFiltrados,
                    skipDuplicates: true,
                });
                telemetriasInseridas = dadosFiltrados.length;
            } else {
                telemetriasInseridas = 0;
            }
        }

        // 4. Processar chegadas nas bases e atualizar status das viagens
        const viagensBaixadas = await processarStatusViagens();

        return NextResponse.json({
            success: true,
            message: "Sincronização concluída",
            veiculos: veiculosAtualizados,
            telemetriasNovas: telemetriasInseridas,
            viagensAtualizadas: viagensBaixadas,
        });

    } catch (error) {
        console.error("Erro na sincronização:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}