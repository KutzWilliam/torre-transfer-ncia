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
});
