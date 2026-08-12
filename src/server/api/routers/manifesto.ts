import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { telemetriaDb } from "@/server/db-telemetria";

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface ManifestoComValorRow {
    id_manifesto: string;
    prev_saida_data: string;
    prev_saida_hora: string | null;
    unidade: string;
    placa: string;
    valor_total: string; // NUMERIC vem como string no node-postgres
    origem: string | null;
    destino: string | null;
    tipo_manifesto: string | null;
}

// ─── Router ──────────────────────────────────────────────────────────────────

export const manifestoRouter = createTRPCRouter({

    /**
     * Busca manifestos cuja soma das minutas ultrapassa R$ 140.000,
     * e verifica se há uma viagem registrada no sistema para a mesma
     * placa e data do manifesto.
     *
     * Usa uma única query JOIN (manifesto → manifesto_list → minuta) para
     * calcular o valor total com precisão — evita N+1 e problemas de casting.
     */
    auditoria: protectedProcedure
        .input(z.object({
            data: z.string(), // "yyyy-MM-dd"
        }))
        .query(async ({ ctx, input }) => {

            // ── 1. Query única: busca todos os manifestos do dia com seu valor total ──
            // - Filtra datas inválidas "0000-00-00" com LIKE antes de qualquer cast
            // - JOINs todos com ::text para evitar bigint/integer/text mismatches
            // - HAVING > 140000 filtra direto no banco, sem loop no Node
            const manifestosQuery = await telemetriaDb.query<ManifestoComValorRow>(`
                SELECT
                    m.id_manifesto::text                                      AS id_manifesto,
                    LEFT(m.prev_saida_data::text, 10)                         AS prev_saida_data,
                    m.prev_saida_hora::text                                   AS prev_saida_hora,
                    COALESCE(u.fantasia,  m.base::text)                       AS unidade,
                    COALESCE(v.placa,     m.veiculo::text)                    AS placa,
                    COALESCE(SUM(CAST(mn.total_nf_valor AS NUMERIC)), 0)      AS valor_total,
                    ao.aeroporto                                              AS origem,
                    ad.aeroporto                                              AS destino,
                    mt.tipo                                                   AS tipo_manifesto
                FROM manifesto m
                LEFT JOIN unidades      u  ON u.id_unidade::text   = m.base::text
                LEFT JOIN veiculos      v  ON v.id_veiculo::text   = m.veiculo::text
                LEFT JOIN manifesto_list ml ON ml.id_manifesto::text = m.id_manifesto::text
                LEFT JOIN minuta        mn ON mn.id_minuta::text   = ml.minuta::text
                LEFT JOIN aero          ao ON ao.id_aero::text      = m.transf_origem::text
                LEFT JOIN aero          ad ON ad.id_aero::text      = m.transf_destino::text
                LEFT JOIN manifesto_tipo mt ON mt.id_tipo::text     = m.tipo::text
                WHERE m.prev_saida_data::text NOT LIKE '0000%'
                  AND LEFT(m.prev_saida_data::text, 10) = $1
                  AND m.veiculo IS NOT NULL
                GROUP BY
                    m.id_manifesto, m.prev_saida_data, m.prev_saida_hora,
                    u.fantasia, m.base, v.placa, m.veiculo,
                    ao.aeroporto, ad.aeroporto, mt.tipo
                HAVING COALESCE(SUM(CAST(mn.total_nf_valor AS NUMERIC)), 0) > 140000
                ORDER BY valor_total DESC
            `, [input.data]);

            const manifestos = manifestosQuery.rows;

            if (manifestos.length === 0) {
                return { itens: [], totalManifestos: 0, comAlerta: 0, semAlerta: 0 };
            }

            // ── 2. Verifica viagem no sistema para cada manifesto (em paralelo) ──
            const resultados = await Promise.all(manifestos.map(async (m) => {
                const valorTotal = parseFloat(m.valor_total ?? "0");

                // Monta janela do dia usando a data da saída do manifesto
                const dataParte = m.prev_saida_data; // já vem como "yyyy-MM-dd"
                const inicioDia = new Date(dataParte + "T00:00:00");
                const fimDia    = new Date(dataParte + "T23:59:59");

                // Normaliza a placa: o manifesto usa traço (AXW-6H75) mas o sistema pode
                // ter cadastrado sem traço (AXW6H75) — buscamos as duas variantes com OR.
                const placaOriginal = (m.placa ?? "").trim().toUpperCase();
                const placaSemTraco = placaOriginal.replace(/-/g, "").replace(/\s+/g, "");

                // Nova regra: a data do manifesto pode ser qualquer dia DENTRO da viagem.
                // Ex: viagem 08/07→10/07 cobre um manifesto de 09/07 (dia intermediário).
                // Buscamos viagens onde:  prevInicioReal <= fim_do_dia_manifesto
                //                    AND prevFimReal   >= inicio_do_dia_manifesto
                const viagem = placaSemTraco
                    ? await ctx.db.viagem.findFirst({
                        where: {
                            veiculo: {
                                OR: [
                                    { placa: placaOriginal },   // ex: AXW-6H75
                                    { placa: placaSemTraco },   // ex: AXW6H75
                                ],
                            },
                            prevInicioReal: { lte: fimDia },    // viagem iniciou antes ou no fim do dia do manifesto
                            prevFimReal:    { gte: inicioDia }, // viagem termina após ou no início do dia do manifesto
                        },
                        select: { id: true },
                    })
                    : null;

                return {
                    idManifesto:  parseInt(m.id_manifesto, 10),
                    prevSaidaData: dataParte,
                    prevSaidaHora: m.prev_saida_hora ?? null,
                    unidade:   m.unidade ?? "—",
                    placa:     m.placa   ?? "—",
                    origem:    m.origem  ?? null,
                    destino:   m.destino ?? null,
                    tipoManifesto: m.tipo_manifesto ?? "—",
                    valorTotal,
                    temViagem: !!viagem,
                    viagemId:  viagem?.id ?? null,
                    status:    (viagem ? "OK" : "ALERTA") as "OK" | "ALERTA",
                };
            }));

            // Alertas primeiro, depois por valor decrescente
            resultados.sort((a, b) => {
                if (a.status === "ALERTA" && b.status !== "ALERTA") return -1;
                if (b.status === "ALERTA" && a.status !== "ALERTA") return 1;
                return b.valorTotal - a.valorTotal;
            });

            const comAlerta = resultados.filter(r => r.status === "ALERTA").length;
            const semAlerta = resultados.filter(r => r.status === "OK").length;

            return {
                itens: resultados,
                totalManifestos: resultados.length,
                comAlerta,
                semAlerta,
            };
        }),

    /**
     * Retorna as últimas datas com manifestos (até 60 dias)
     */
    datasDisponiveis: protectedProcedure.query(async () => {
        const hoje = new Date();
        const sesentaDiasAtras = new Date(hoje.getTime() - 60 * 24 * 60 * 60 * 1000);
        const dataLimite = sesentaDiasAtras.toISOString().split("T")[0]!;

        const result = await telemetriaDb.query<{ data: string }>(`
            SELECT DISTINCT LEFT(prev_saida_data::text, 10) AS data
            FROM manifesto
            WHERE prev_saida_data::text NOT LIKE '0000%'
              AND LEFT(prev_saida_data::text, 10) >= $1
            ORDER BY data DESC
            LIMIT 6
        `, [dataLimite]);

        return result.rows
            .map(r => r.data)
            .filter(d => d && d.length === 10);
    }),

    /**
     * Agrupa manifestos do dia por unidade de destino (transf_destino),
     * vincula cada manifesto à viagem correspondente (placa + janela de data)
     * e retorna as contagens: chegaram (FINALIZADA) e chegando (demais).
     */
    chegadasPorUnidade: protectedProcedure
        .input(z.object({ data: z.string() }))
        .query(async ({ ctx, input }) => {
            const manifestosResult = await telemetriaDb.query<{
                id_manifesto: string;
                placa: string;
                prev_saida_data: string;
                id_aero: string;
                nome_unidade: string;
            }>(`
                SELECT
                    m.id_manifesto::text                                AS id_manifesto,
                    COALESCE(v.placa, m.veiculo::text)                  AS placa,
                    LEFT(m.prev_saida_data::text, 10)                   AS prev_saida_data,
                    a.id_aero::text                                     AS id_aero,
                    a.aeroporto                                         AS nome_unidade
                FROM manifesto m
                LEFT JOIN veiculos v ON v.id_veiculo::text = m.veiculo::text
                JOIN  aero        a ON a.id_aero::text     = m.transf_destino::text
                WHERE m.prev_saida_data::text NOT LIKE '0000%'
                  AND LEFT(m.prev_saida_data::text, 10) = $1
                  AND m.transf_destino IS NOT NULL
                ORDER BY a.aeroporto
            `, [input.data]);

            const resultados = await Promise.all(manifestosResult.rows.map(async (row) => {
                const placaOriginal = (row.placa ?? "").trim().toUpperCase();
                const placaSemTraco = placaOriginal.replace(/-/g, "").replace(/\s+/g, "");
                const dataParte = row.prev_saida_data;
                const inicioDia = new Date(dataParte + "T00:00:00");
                const fimDia    = new Date(dataParte + "T23:59:59");

                const viagem = placaSemTraco
                    ? await ctx.db.viagem.findFirst({
                        where: {
                            veiculo: { OR: [{ placa: placaOriginal }, { placa: placaSemTraco }] },
                            prevInicioReal: { lte: fimDia },
                            prevFimReal:    { gte: inicioDia },
                        },
                        select: { id: true, status: true },
                    })
                    : null;

                return { idAero: row.id_aero, nomeUnidade: row.nome_unidade, viagem };
            }));

            // Agrupa por unidade de destino
            const mapa = new Map<string, {
                idAero: string; nomeUnidade: string;
                total: number; chegaram: number; chegando: number; semViagem: number;
            }>();

            for (const r of resultados) {
                if (!mapa.has(r.idAero)) {
                    mapa.set(r.idAero, { idAero: r.idAero, nomeUnidade: r.nomeUnidade, total: 0, chegaram: 0, chegando: 0, semViagem: 0 });
                }
                const u = mapa.get(r.idAero)!;
                u.total++;
                if (!r.viagem)                          u.semViagem++;
                else if (r.viagem.status === "FINALIZADA") u.chegaram++;
                else                                    u.chegando++;
            }

            return Array.from(mapa.values())
                .sort((a, b) => a.nomeUnidade.localeCompare(b.nomeUnidade, "pt-BR"));
        }),

    /**
     * Retorna todos os manifestos de um dia cuja unidade de destino é idAero,
     * enriquecidos com a viagem vinculada (placa + janela de data).
     * Também devolve o nome da unidade de destino.
     */
    manifestosPorUnidade: protectedProcedure
        .input(z.object({ idAero: z.string(), data: z.string() }))
        .query(async ({ ctx, input }) => {
            const rows = await telemetriaDb.query<{
                id_manifesto: string;
                placa: string;
                prev_saida_data: string;
                origem: string | null;
                nome_unidade: string | null;
            }>(`
                SELECT
                    m.id_manifesto::text                                AS id_manifesto,
                    COALESCE(v.placa, m.veiculo::text)                  AS placa,
                    LEFT(m.prev_saida_data::text, 10)                   AS prev_saida_data,
                    ao.aeroporto                                        AS origem,
                    ad.aeroporto                                        AS nome_unidade
                FROM manifesto m
                LEFT JOIN veiculos v  ON v.id_veiculo::text  = m.veiculo::text
                LEFT JOIN aero    ao ON ao.id_aero::text     = m.transf_origem::text
                LEFT JOIN aero    ad ON ad.id_aero::text     = m.transf_destino::text
                WHERE m.prev_saida_data::text NOT LIKE '0000%'
                  AND LEFT(m.prev_saida_data::text, 10) = $1
                  AND m.transf_destino::text = $2
                ORDER BY m.id_manifesto DESC
            `, [input.data, input.idAero]);

            const nomeUnidade = rows.rows[0]?.nome_unidade ?? `Unidade ${input.idAero}`;

            const manifestos = await Promise.all(rows.rows.map(async (row) => {
                const placaOriginal = (row.placa ?? "").trim().toUpperCase();
                const placaSemTraco = placaOriginal.replace(/-/g, "").replace(/\s+/g, "");
                const dataParte = row.prev_saida_data;
                const inicioDia = new Date(dataParte + "T00:00:00");
                const fimDia    = new Date(dataParte + "T23:59:59");

                const viagem = placaSemTraco
                    ? await ctx.db.viagem.findFirst({
                        where: {
                            veiculo: { OR: [{ placa: placaOriginal }, { placa: placaSemTraco }] },
                            prevInicioReal: { lte: fimDia },
                            prevFimReal:    { gte: inicioDia },
                        },
                        select: { id: true, status: true, dataFimEfetivo: true },
                    })
                    : null;

                return {
                    idManifesto: parseInt(row.id_manifesto, 10),
                    placa:       row.placa ?? "—",
                    origem:      row.origem ?? "—",
                    viagem:      viagem ? { id: viagem.id, status: viagem.status, dataFimEfetivo: viagem.dataFimEfetivo } : null,
                    chegou:      viagem?.status === "FINALIZADA",
                };
            }));

            // Chegados primeiro, depois a chegar, depois sem viagem
            manifestos.sort((a, b) => {
                const peso = (m: typeof a) => m.chegou ? 0 : m.viagem ? 1 : 2;
                return peso(a) - peso(b) || b.idManifesto - a.idManifesto;
            });

            return { nomeUnidade, manifestos };
        }),

    /**
     * Retorna as minutas de um manifesto com nomes de cliente (via fornecedores)
     * e nomes de unidade origem/destino (via aero).
     */
    minutasPorManifesto: protectedProcedure
        .input(z.object({ idManifesto: z.number(), idAero: z.string() }))
        .query(async ({ input }) => {
            const result = await telemetriaDb.query<{
                id_minuta:            string;
                cliente_remetente:    string | null;
                cliente_destinatario: string | null;
                prev_entrega:         string | null;
                total_volumes:        string | null;
                unidade_origem:       string | null;
                unidade_destino:      string | null;
                id_aero_destino:      string | null;
            }>(`
                SELECT
                    mn.id_minuta::text                                  AS id_minuta,
                    fo.fantasia                                         AS cliente_remetente,
                    fd.fantasia                                         AS cliente_destinatario,
                    mn.prev_entrega::text                               AS prev_entrega,
                    mn.total_volumes::text                              AS total_volumes,
                    ao.aeroporto                                        AS unidade_origem,
                    ad.aeroporto                                        AS unidade_destino,
                    mn.transf_destino::text                             AS id_aero_destino
                FROM manifesto_list ml
                JOIN   minuta        mn ON mn.id_minuta::text   = ml.minuta::text
                LEFT JOIN aero       ao ON ao.id_aero::text     = mn.transf_origem::text
                LEFT JOIN aero       ad ON ad.id_aero::text     = mn.transf_destino::text
                LEFT JOIN fornecedores fo ON fo.id_local::text  = mn.id_origem::text
                LEFT JOIN fornecedores fd ON fd.id_local::text  = mn.id_destino::text
                WHERE ml.id_manifesto::text = $1
                ORDER BY
                    CASE WHEN mn.transf_destino::text = $2 THEN 0 ELSE 1 END,
                    mn.id_minuta
            `, [input.idManifesto.toString(), input.idAero]);

            return result.rows.map(row => ({
                idMinuta:            parseInt(row.id_minuta, 10),
                clienteRemetente:    row.cliente_remetente    ?? "—",
                clienteDestinatario: row.cliente_destinatario ?? "—",
                prevEntrega:         row.prev_entrega         ?? null,
                totalVolumes:        row.total_volumes ? parseInt(row.total_volumes, 10) : null,
                unidadeOrigem:       row.unidade_origem  ?? "—",
                unidadeDestino:      row.unidade_destino ?? "—",
                isDestinoFinal:      row.id_aero_destino === input.idAero,
            }));
        }),
});

