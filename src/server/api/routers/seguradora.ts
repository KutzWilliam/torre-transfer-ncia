import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { telemetriaDb } from "@/server/db-telemetria";

// ─── Helpers de Normalização e Datas ──────────────────────────────────────────

function normalizarCPF(cpf: string | null | undefined): string {
    if (!cpf) return "";
    const apenasNum = cpf.replace(/\D/g, "").trim();
    if (!apenasNum) return "";
    return apenasNum.length <= 11 ? apenasNum.padStart(11, "0") : apenasNum;
}

function normalizarPlaca(placa: string | null | undefined): string {
    if (!placa) return "";
    return placa.replace(/[^A-Z0-9]/gi, "").trim().toUpperCase();
}

function parseDataBR(dataStr: string | null | undefined): Date | null {
    if (!dataStr || dataStr === "0000-00-00") return null;
    try {
        const partes = dataStr.trim().split(",")[0]?.split("T")[0]?.trim();
        if (!partes) return null;
        if (partes.includes("-")) {
            const [ano, mes, dia] = partes.split("-");
            if (!ano || !mes || !dia) return null;
            return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        }
        const [dia, mes, ano] = partes.split("/");
        if (!dia || !mes || !ano) return null;
        return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    } catch {
        return null;
    }
}

function calcularStatusVigencia(
    diasRestantes: number | null,
    vigenciaDate: Date | null
): {
    expirado: boolean;
    venceEm7Dias: boolean;
    venceEm30Dias: boolean;
    diasRestantes: number | null;
    dataVigencia: Date | null;
} {
    let dias = diasRestantes;

    if (vigenciaDate) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dias = Math.floor(
            (vigenciaDate.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
        );
    }

    return {
        expirado: dias !== null && dias < 0,
        venceEm7Dias: dias !== null && dias >= 0 && dias <= 7,
        venceEm30Dias: dias !== null && dias > 7 && dias <= 30,
        diasRestantes: dias,
        dataVigencia: vigenciaDate,
    };
}

function prioridadeAngel(ad: {
    expirado: boolean;
    venceEm7Dias: boolean;
    venceEm30Dias: boolean;
} | undefined): number {
    if (!ad) return 4;
    if (ad.expirado) return 0;
    if (ad.venceEm7Dias) return 1;
    if (ad.venceEm30Dias) return 2;
    return 3;
}

// ─── Interfaces das Tabelas ───────────────────────────────────────────────────

interface MotoristaTerceiroRow {
    id: string | number;
    nome: string | null;
    nome_completo: string | null;
    cpf: string | null;
    rg: string | null;
    habilitacao: string | null;
    h_validade: string | Date | null;
    h_categoria: string | null;
    seguro_status: string | number | null;
    seguro_validade: string | null;
    seguro_autorizacao: string | null;
    status: string | number | null;
    telefone_c: string | null;
    rntrc: string | null;
    cidade: string | null;
    transportadora: string | null;
    transportadora_razao: string | null;
    transportadora_cnpj: string | null;
}

interface VeiculoRow {
    id_veiculo: number;
    placa: string | null;
    renavam: string | null;
    marca: string | null;
    modelo: string | null;
    cor: string | null;
    ano: number | null;
    capacidade: string | number | null;
    venc_licenciamento: string | Date | null;
    gerenciadora: string | null;
    seguro_status: number | null;
    seguro_validade: string | Date | null;
    seguro_autorizacao: string | null;
    rntrc: string | null;
    status: number | null;
    transportadora: string | null;
    transportadora_razao: string | null;
    transportadora_cnpj: string | null;
}

interface CadastroAngelMotoristaRow {
    id: string;
    nome: string;
    cpf: string;
    cpfOriginal: string | null;
    tipo: string | null;
    validadeDias: number | null;
    ultimoCadastro: Date | null;
    vigencia: Date | null;
    updatedAt: Date;
}

interface CadastroAngelVeiculoRow {
    id: string;
    placa: string;
    placaOriginal: string | null;
    proprietario: string | null;
    cnpjCpf: string | null;
    validadeDias: number | null;
    ultimoCadastro: Date | null;
    vigencia: Date | null;
    updatedAt: Date;
}

// ─── Schemas Zod ──────────────────────────────────────────────────────────────

const motoristaUploadSchema = z.object({
    nome: z.string(),
    tipo: z.string().optional(),
    cpf: z.string(),
    validade: z.string().optional(),
    ultimoCadastro: z.string().optional(),
    vigencia: z.string().optional(),
});

const veiculoUploadSchema = z.object({
    placa: z.string(),
    proprietario: z.string().optional(),
    cnpjCpf: z.string().optional(),
    validade: z.string().optional(),
    ultimoCadastro: z.string().optional(),
    vigencia: z.string().optional(),
});

// ─── Router ───────────────────────────────────────────────────────────────────

export const seguradoraRouter = createTRPCRouter({

    /**
     * Retorna contadores e data da última importação salva no banco.
     */
    obterMetadadosImportacao: protectedProcedure.query(async ({ ctx }) => {
        const countMot = await ctx.db.$queryRawUnsafe<{ count: string }[]>(
            `SELECT count(*)::text as count FROM "CadastroAngelMotorista"`
        );
        const countVeic = await ctx.db.$queryRawUnsafe<{ count: string }[]>(
            `SELECT count(*)::text as count FROM "CadastroAngelVeiculo"`
        );
        const lastUpdateMot = await ctx.db.$queryRawUnsafe<{ max: Date | null }[]>(
            `SELECT max("updatedAt") as max FROM "CadastroAngelMotorista"`
        );
        const lastUpdateVeic = await ctx.db.$queryRawUnsafe<{ max: Date | null }[]>(
            `SELECT max("updatedAt") as max FROM "CadastroAngelVeiculo"`
        );

        return {
            totalMotoristasAngel: parseInt(countMot[0]?.count ?? "0"),
            totalVeiculosAngel: parseInt(countVeic[0]?.count ?? "0"),
            ultimaAtualizacaoMotoristas: lastUpdateMot[0]?.max ?? null,
            ultimaAtualizacaoVeiculos: lastUpdateVeic[0]?.max ?? null,
        };
    }),

    /**
     * Importa/Atualiza a lista de motoristas da Angel no banco de dados local.
     */
    importarMotoristasAngel: protectedProcedure
        .input(z.object({ motoristas: z.array(motoristaUploadSchema) }))
        .mutation(async ({ ctx, input }) => {
            let salvos = 0;
            for (const m of input.motoristas) {
                const cpfNorm = normalizarCPF(m.cpf);
                if (!cpfNorm) continue;

                const valNum = m.validade && !isNaN(parseInt(m.validade)) ? parseInt(m.validade) : null;
                const ultCadDate = parseDataBR(m.ultimoCadastro);
                const vigDate = parseDataBR(m.vigencia);

                await ctx.db.$executeRawUnsafe(`
                    INSERT INTO "CadastroAngelMotorista" (
                        "id", "nome", "cpf", "cpfOriginal", "tipo", "validadeDias", "ultimoCadastro", "vigencia", "updatedAt"
                    ) VALUES (
                        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW()
                    )
                    ON CONFLICT ("cpf") DO UPDATE SET
                        "nome" = EXCLUDED."nome",
                        "cpfOriginal" = EXCLUDED."cpfOriginal",
                        "tipo" = EXCLUDED."tipo",
                        "validadeDias" = EXCLUDED."validadeDias",
                        "ultimoCadastro" = EXCLUDED."ultimoCadastro",
                        "vigencia" = EXCLUDED."vigencia",
                        "updatedAt" = NOW();
                `, m.nome.trim(), cpfNorm, m.cpf.trim(), m.tipo ?? "Padrão", valNum, ultCadDate, vigDate);
                salvos++;
            }
            return { sucesso: true, salvos };
        }),

    /**
     * Importa/Atualiza a lista de veículos da Angel no banco de dados local.
     */
    importarVeiculosAngel: protectedProcedure
        .input(z.object({ veiculos: z.array(veiculoUploadSchema) }))
        .mutation(async ({ ctx, input }) => {
            let salvos = 0;
            for (const v of input.veiculos) {
                const placaNorm = normalizarPlaca(v.placa);
                if (!placaNorm) continue;

                const valNum = v.validade && !isNaN(parseInt(v.validade)) ? parseInt(v.validade) : null;
                const ultCadDate = parseDataBR(v.ultimoCadastro);
                const vigDate = parseDataBR(v.vigencia);

                await ctx.db.$executeRawUnsafe(`
                    INSERT INTO "CadastroAngelVeiculo" (
                        "id", "placa", "placaOriginal", "proprietario", "cnpjCpf", "validadeDias", "ultimoCadastro", "vigencia", "updatedAt"
                    ) VALUES (
                        gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW()
                    )
                    ON CONFLICT ("placa") DO UPDATE SET
                        "placaOriginal" = EXCLUDED."placaOriginal",
                        "proprietario" = EXCLUDED."proprietario",
                        "cnpjCpf" = EXCLUDED."cnpjCpf",
                        "validadeDias" = EXCLUDED."validadeDias",
                        "ultimoCadastro" = EXCLUDED."ultimoCadastro",
                        "vigencia" = EXCLUDED."vigencia",
                        "updatedAt" = NOW();
                `, placaNorm, v.placa.trim(), v.proprietario?.trim() ?? null, v.cnpjCpf?.trim() ?? null, valNum, ultCadDate, vigDate);
                salvos++;
            }
            return { sucesso: true, salvos };
        }),

    /**
     * Cruza os motoristas da tabela `motorista_terceiro` com join em `terceiros` e `fornecedores` (TELEMETRIA_DB_URL)
     * e a tabela `CadastroAngelMotorista` (DATABASE_URL local).
     */
    obterCruzamentoMotoristas: protectedProcedure.query(async ({ ctx }) => {
        // 1. Motoristas ERP com Transportadora (join com terceiros e fornecedores)
        const queryERP = await telemetriaDb.query<MotoristaTerceiroRow>(`
            SELECT 
                mt.id,
                mt.nome,
                mt.nome_completo,
                mt.cpf,
                mt.rg,
                mt.habilitacao,
                mt.h_validade,
                mt.h_categoria,
                mt.seguro_status,
                mt.seguro_validade,
                mt.seguro_autorizacao,
                mt.status,
                mt.telefone_c,
                mt.rntrc,
                mt.cidade,
                f.fantasia as transportadora,
                f.razao as transportadora_razao,
                f.cnpj as transportadora_cnpj
            FROM motorista_terceiro mt
            LEFT JOIN terceiros t ON mt.id_terceiro = t.id_terceiro
            LEFT JOIN fornecedores f ON t.fornecedor::text = f.id_local::text
            ORDER BY mt.id DESC
        `);
        const motoristasERP = queryERP.rows;

        // 2. Motoristas Angel salvos no banco local
        const angelRows = await ctx.db.$queryRawUnsafe<CadastroAngelMotoristaRow[]>(`
            SELECT 
                "id",
                "nome",
                "cpf",
                "cpfOriginal",
                "tipo",
                "validadeDias",
                "ultimoCadastro",
                "vigencia",
                "updatedAt"
            FROM "CadastroAngelMotorista"
            ORDER BY "nome" ASC
        `);

        // Mapas para busca instantânea
        const angelPorCPF = new Map<string, CadastroAngelMotoristaRow>();
        const angelPorNome = new Map<string, CadastroAngelMotoristaRow>();
        for (const a of angelRows) {
            if (a.cpf) angelPorCPF.set(a.cpf, a);
            if (a.nome) angelPorNome.set(a.nome.trim().toUpperCase(), a);
        }

        type MotoristaResultado = {
            idERP: string | number;
            nomeERP: string;
            nomeCompletoERP: string | null;
            cpfERP: string | null;
            transportadora: string | null;
            cnhERP?: {
                numero: string | null;
                categoria: string | null;
                validade: string | null;
            };
            seguroERP?: {
                validade: string | null;
                status: string | number | null;
                autorizacao: string | null;
            };
            statusERP: number | string | null;
            telefoneERP: string | null;
            rntrcERP: string | null;
            cadastradoAngel: boolean;
            angelData?: {
                nome: string;
                cpf: string;
                tipo: string;
                vigencia: string | null;
                ultimoCadastro: string | null;
                diasRestantes: number | null;
                expirado: boolean;
                venceEm7Dias: boolean;
                venceEm30Dias: boolean;
                dataVigencia: Date | null;
            };
        };

        const resultado: MotoristaResultado[] = [];
        const cpfsMatched = new Set<string>();
        const nomesMatched = new Set<string>();
        const motoristasERPVistos = new Set<string>();

        for (const m of motoristasERP) {
            const cpfERP = normalizarCPF(m.cpf);
            const nomeERP = (m.nome_completo || m.nome || "").trim();
            const chaveUnica = cpfERP || (m.id ? String(m.id) : nomeERP);

            if (motoristasERPVistos.has(chaveUnica)) continue;
            motoristasERPVistos.add(chaveUnica);

            const transpNome = m.transportadora || m.transportadora_razao || null;

            // Match 1: CPF
            let angelMatch = cpfERP ? angelPorCPF.get(cpfERP) : undefined;

            // Match 2 (fallback): Nome completo
            if (!angelMatch && nomeERP) {
                angelMatch = angelPorNome.get(nomeERP.toUpperCase());
            }

            // Match 3 (fallback): Primeiros 2 tokens do nome
            if (!angelMatch && nomeERP) {
                const prefixo = nomeERP.toUpperCase().split(" ").slice(0, 2).join(" ");
                if (prefixo.length >= 6) {
                    for (const [nomeAngel, dadosAngel] of angelPorNome.entries()) {
                        if (nomeAngel.startsWith(prefixo)) {
                            angelMatch = dadosAngel;
                            break;
                        }
                    }
                }
            }

            if (angelMatch) {
                if (angelMatch.cpf) cpfsMatched.add(angelMatch.cpf);
                if (angelMatch.nome) nomesMatched.add(angelMatch.nome.trim().toUpperCase());

                const status = calcularStatusVigencia(angelMatch.validadeDias, angelMatch.vigencia);

                resultado.push({
                    idERP: m.id,
                    nomeERP: m.nome_completo || m.nome || "Sem Nome",
                    nomeCompletoERP: m.nome_completo,
                    cpfERP: m.cpf,
                    transportadora: transpNome,
                    cnhERP: {
                        numero: m.habilitacao,
                        categoria: m.h_categoria,
                        validade: m.h_validade ? String(m.h_validade) : null,
                    },
                    seguroERP: {
                        validade: m.seguro_validade,
                        status: m.seguro_status,
                        autorizacao: m.seguro_autorizacao,
                    },
                    statusERP: m.status,
                    telefoneERP: m.telefone_c,
                    rntrcERP: m.rntrc,
                    cadastradoAngel: true,
                    angelData: {
                        nome: angelMatch.nome,
                        cpf: angelMatch.cpfOriginal || angelMatch.cpf,
                        tipo: angelMatch.tipo ?? "Padrão",
                        vigencia: angelMatch.vigencia ? angelMatch.vigencia.toISOString() : null,
                        ultimoCadastro: angelMatch.ultimoCadastro ? angelMatch.ultimoCadastro.toISOString() : null,
                        ...status,
                    },
                });
            } else {
                resultado.push({
                    idERP: m.id,
                    nomeERP: m.nome_completo || m.nome || "Sem Nome",
                    nomeCompletoERP: m.nome_completo,
                    cpfERP: m.cpf,
                    transportadora: transpNome,
                    cnhERP: {
                        numero: m.habilitacao,
                        categoria: m.h_categoria,
                        validade: m.h_validade ? String(m.h_validade) : null,
                    },
                    seguroERP: {
                        validade: m.seguro_validade,
                        status: m.seguro_status,
                        autorizacao: m.seguro_autorizacao,
                    },
                    statusERP: m.status,
                    telefoneERP: m.telefone_c,
                    rntrcERP: m.rntrc,
                    cadastradoAngel: false,
                });
            }
        }

        // Apenas Angel (não encontrados no ERP)
        type ApenasAngel = {
            nome: string;
            cpf: string;
            tipo: string;
            vigencia: string | null;
            ultimoCadastro: string | null;
            diasRestantes: number | null;
            expirado: boolean;
            venceEm7Dias: boolean;
            venceEm30Dias: boolean;
            dataVigencia: Date | null;
        };

        const apenasAngel: ApenasAngel[] = [];
        for (const a of angelRows) {
            const jaCruzado = (a.cpf && cpfsMatched.has(a.cpf)) || nomesMatched.has(a.nome.trim().toUpperCase());
            if (!jaCruzado) {
                const status = calcularStatusVigencia(a.validadeDias, a.vigencia);
                apenasAngel.push({
                    nome: a.nome,
                    cpf: a.cpfOriginal || a.cpf,
                    tipo: a.tipo ?? "Padrão",
                    vigencia: a.vigencia ? a.vigencia.toISOString() : null,
                    ultimoCadastro: a.ultimoCadastro ? a.ultimoCadastro.toISOString() : null,
                    ...status,
                });
            }
        }

        resultado.sort((a, b) => prioridadeAngel(a.angelData) - prioridadeAngel(b.angelData));

        return {
            motoristasERPxAngel: resultado,
            apenasAngel,
            totalERP: motoristasERPVistos.size,
            totalAngel: angelRows.length,
            totalCruzados: resultado.filter((r) => r.cadastradoAngel).length,
            totalExpirados: resultado.filter((r) => r.angelData?.expirado).length,
            totalVence7Dias: resultado.filter((r) => r.angelData?.venceEm7Dias).length,
            totalVence30Dias: resultado.filter((r) => r.angelData?.venceEm30Dias).length,
        };
    }),

    /**
     * Cruza os veículos da tabela `veiculos` com join em `fornecedores` (TELEMETRIA_DB_URL)
     * e a tabela `CadastroAngelVeiculo` (DATABASE_URL local).
     */
    obterCruzamentoVeiculos: protectedProcedure.query(async ({ ctx }) => {
        // 1. Veículos ERP com Transportadora / Empresa Proprietária (join com fornecedores)
        const queryERP = await telemetriaDb.query<VeiculoRow>(`
            SELECT 
                v.id_veiculo,
                v.placa,
                v.renavam,
                v.marca,
                v.modelo,
                v.cor,
                v.ano,
                v.capacidade,
                v.venc_licenciamento,
                v.gerenciadora,
                v.seguro_status,
                v.seguro_validade,
                v.seguro_autorizacao,
                v.rntrc,
                v.status,
                f.fantasia as transportadora,
                f.razao as transportadora_razao,
                f.cnpj as transportadora_cnpj
            FROM veiculos v
            LEFT JOIN fornecedores f ON v.proprietario::text = f.id_local::text
            WHERE v.placa IS NOT NULL AND TRIM(v.placa) != ''
            ORDER BY v.id_veiculo DESC
        `);
        const veiculosERP = queryERP.rows;

        // 2. Veículos Angel no banco local
        const angelRows = await ctx.db.$queryRawUnsafe<CadastroAngelVeiculoRow[]>(`
            SELECT 
                "id",
                "placa",
                "placaOriginal",
                "proprietario",
                "cnpjCpf",
                "validadeDias",
                "ultimoCadastro",
                "vigencia",
                "updatedAt"
            FROM "CadastroAngelVeiculo"
            ORDER BY "placa" ASC
        `);

        const angelPorPlaca = new Map<string, CadastroAngelVeiculoRow>();
        for (const a of angelRows) {
            if (a.placa) angelPorPlaca.set(a.placa, a);
        }

        type VeiculoResultado = {
            idVeiculo: number;
            placaERP: string;
            renavamERP: string | null;
            marcaERP: string | null;
            modeloERP: string | null;
            anoERP: number | null;
            transportadora: string | null;
            gerenciadoraERP: string | null;
            seguroERP?: {
                validade: string | null;
                status: number | null;
                autorizacao: string | null;
            };
            rntrcERP: string | null;
            statusERP: number | null;
            cadastradoAngel: boolean;
            angelData?: {
                placa: string;
                proprietario: string;
                cnpjCpf: string;
                vigencia: string | null;
                ultimoCadastro: string | null;
                diasRestantes: number | null;
                expirado: boolean;
                venceEm7Dias: boolean;
                venceEm30Dias: boolean;
                dataVigencia: Date | null;
            };
        };

        const resultado: VeiculoResultado[] = [];
        const placasMatched = new Set<string>();
        const placasVistas = new Set<string>();

        for (const v of veiculosERP) {
            const placaNorm = normalizarPlaca(v.placa);
            if (!placaNorm || placasVistas.has(placaNorm)) continue;
            placasVistas.add(placaNorm);

            const angelMatch = angelPorPlaca.get(placaNorm);
            const transpNome = v.transportadora || v.transportadora_razao || null;

            if (angelMatch) {
                placasMatched.add(placaNorm);
                const status = calcularStatusVigencia(angelMatch.validadeDias, angelMatch.vigencia);

                resultado.push({
                    idVeiculo: v.id_veiculo,
                    placaERP: v.placa ?? placaNorm,
                    renavamERP: v.renavam,
                    marcaERP: v.marca,
                    modeloERP: v.modelo,
                    anoERP: v.ano,
                    transportadora: transpNome,
                    gerenciadoraERP: v.gerenciadora,
                    seguroERP: {
                        validade: v.seguro_validade ? String(v.seguro_validade) : null,
                        status: v.seguro_status,
                        autorizacao: v.seguro_autorizacao,
                    },
                    rntrcERP: v.rntrc,
                    statusERP: v.status,
                    cadastradoAngel: true,
                    angelData: {
                        placa: angelMatch.placaOriginal || angelMatch.placa,
                        proprietario: angelMatch.proprietario ?? "",
                        cnpjCpf: angelMatch.cnpjCpf ?? "",
                        vigencia: angelMatch.vigencia ? angelMatch.vigencia.toISOString() : null,
                        ultimoCadastro: angelMatch.ultimoCadastro ? angelMatch.ultimoCadastro.toISOString() : null,
                        ...status,
                    },
                });
            } else {
                resultado.push({
                    idVeiculo: v.id_veiculo,
                    placaERP: v.placa ?? placaNorm,
                    renavamERP: v.renavam,
                    marcaERP: v.marca,
                    modeloERP: v.modelo,
                    anoERP: v.ano,
                    transportadora: transpNome,
                    gerenciadoraERP: v.gerenciadora,
                    seguroERP: {
                        validade: v.seguro_validade ? String(v.seguro_validade) : null,
                        status: v.seguro_status,
                        autorizacao: v.seguro_autorizacao,
                    },
                    rntrcERP: v.rntrc,
                    statusERP: v.status,
                    cadastradoAngel: false,
                });
            }
        }

        // Veículos apenas na Angel
        type ApenasAngelVeiculo = {
            placa: string;
            proprietario: string;
            cnpjCpf: string;
            vigencia: string | null;
            ultimoCadastro: string | null;
            diasRestantes: number | null;
            expirado: boolean;
            venceEm7Dias: boolean;
            venceEm30Dias: boolean;
            dataVigencia: Date | null;
        };

        const apenasAngel: ApenasAngelVeiculo[] = [];
        for (const a of angelRows) {
            if (!placasMatched.has(a.placa)) {
                const status = calcularStatusVigencia(a.validadeDias, a.vigencia);
                apenasAngel.push({
                    placa: a.placaOriginal || a.placa,
                    proprietario: a.proprietario ?? "",
                    cnpjCpf: a.cnpjCpf ?? "",
                    vigencia: a.vigencia ? a.vigencia.toISOString() : null,
                    ultimoCadastro: a.ultimoCadastro ? a.ultimoCadastro.toISOString() : null,
                    ...status,
                });
            }
        }

        resultado.sort((a, b) => prioridadeAngel(a.angelData) - prioridadeAngel(b.angelData));

        return {
            veiculosERPxAngel: resultado,
            apenasAngel,
            totalERP: placasVistas.size,
            totalAngel: angelRows.length,
            totalCruzados: resultado.filter((r) => r.cadastradoAngel).length,
            totalExpirados: resultado.filter((r) => r.angelData?.expirado).length,
            totalVence7Dias: resultado.filter((r) => r.angelData?.venceEm7Dias).length,
            totalVence30Dias: resultado.filter((r) => r.angelData?.venceEm30Dias).length,
        };
    }),
});
