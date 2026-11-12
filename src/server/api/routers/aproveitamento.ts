import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { telemetriaDb } from "@/server/db-telemetria";
import {
    obterRotasContratuais,
    identificarParceiroBrudam,
    encontrarRotaCompativel,
    type RotaContratual
} from "@/server/services/capacidadeFornecedores";

interface ManifestoBrudamRow {
    id_manifesto: string;
    prev_saida_data: string;
    saida_efetiva_data: string | null;
    status: string;
    status_descricao: string | null;
    placa: string | null;
    modelo_veiculo: string | null;
    capacidade_veiculo_kg: string | null;
    capacidade_veiculo_m3: string | null;
    fornecedor_nome: string | null;
    fornecedor_cnpj: string | null;
    origem_aero: string | null;
    destino_aero: string | null;
    origem_unidade: string | null;
    destino_unidade: string | null;
    custo_motorista: string | null;
    valor_total_km: string | null;
    pedagio: string | null;
    total_minutas: string;
    soma_peso_kg: string | null;
    soma_peso_cubado_kg: string | null;
    soma_peso_taxado_kg: string | null;
    soma_cubo_m3: string | null;
    soma_cubo_m3_bruto: string | null;
    soma_volumes: string | null;
    soma_nf_valor: string | null;
    soma_frete_bruto: string | null;
    soma_frete_rateado: string | null;
    soma_custo_coleta: string | null;
    soma_custo_entrega: string | null;
    soma_custo_seguro: string | null;
    soma_impostos: string | null;
    tipo_manifesto_id: string | null;
    tipo_manifesto_descricao: string | null;
    tipo_veiculo_banco: string | null;
}

function inferirCapacidadeVeiculo(
    rotaContratual: RotaContratual | null,
    rawCapacidadeKg: string | null,
    rawCapacidadeM3: string | null,
    modeloVeiculo: string | null,
    tipoVeiculoBanco: string | null
): { tipoVeiculo: "TRUCK" | "CAVALO MECANICO" | "VUC / 3/4" | "ONIBUS"; capacidadeKg: number; capacidadeM3: number; modalidade: "CAMINHAO" | "ONIBUS" } {
    const isOnibus = tipoVeiculoBanco === "5";
    const modalidade: "CAMINHAO" | "ONIBUS" = isOnibus ? "ONIBUS" : "CAMINHAO";

    if (isOnibus) {
        let pesoKg = Number(rawCapacidadeKg) || 0;
        if (pesoKg <= 0 || pesoKg === 999.99 || pesoKg > 10000) {
            pesoKg = 3000; // Padrão bagageiro ônibus (3 toneladas)
        }
        let m3 = Number(rawCapacidadeM3) || 0;
        if (m3 <= 0 || m3 > 30) {
            m3 = 8; // Padrão bagageiro ônibus (8 m³)
        }
        return {
            tipoVeiculo: "ONIBUS",
            capacidadeKg: pesoKg,
            capacidadeM3: m3,
            modalidade: "ONIBUS",
        };
    }
    const mod = (modeloVeiculo || "").toUpperCase();
    const isCavaloMod = mod.includes("AXOR") || mod.includes("ACTROS") || mod.includes("SCANIA") ||
                     mod.includes("FH") || mod.includes("R124") || mod.includes("R440") ||
                     mod.includes("TGX") || mod.includes("STRIS") || mod.includes("STRALIS") ||
                     mod.includes("T113") || mod.includes("CAVALO") || mod.includes("CARRETA") ||
                     mod.includes("RANDON") || mod.includes("19320") || mod.includes("2540") ||
                     mod.includes("2536") || mod.includes("2646") || mod.includes("2544") ||
                     mod.includes("P360") || mod.includes("P 360") || mod.includes("R 440") ||
                     mod.includes("CONSTELLATION 19");

    const isTruckPesado = mod.includes("24280") || mod.includes("24250") || mod.includes("2426") ||
                       mod.includes("24.280") || mod.includes("24.250") || mod.includes("24.260") ||
                       mod.includes("ATEGO 24") || mod.includes("VM 330") || mod.includes("VM 270") ||
                       mod.includes("TECTOR") || mod.includes("16170");

    // Veículos leves / 3/4 / VUC
    const isLeveMod = mod.includes("ACCELO") || mod.includes("815") || mod.includes("816") ||
                   mod.includes("8.120") || mod.includes("8.140") || mod.includes("8.150") || mod.includes("8.160") ||
                   mod.includes("8120") || mod.includes("8140") || mod.includes("8150") || mod.includes("8160") ||
                   mod.includes("DAILY") || mod.includes("SPRINTER") || mod.includes("HR") ||
                   mod.includes("MASTER") || mod.includes("VUC") || mod.includes("3/4") ||
                   mod.includes("STRADA") || mod.includes("DUCATO");

    const isFurgao = mod.includes("DAILY 35") || mod.includes("35S") || mod.includes("SPRINTER") ||
                     mod.includes("MASTER") || mod.includes("HR") || mod.includes("DUCATO") || mod.includes("STRADA");

    // Caminhões médios / trucks de transferência (ex: VW Delivery, Ford Cargo, Atego, Constellation)
    const isTruckMod = !isLeveMod && (isTruckPesado || mod.includes("DELIVERY") || mod.includes("CARGO") ||
                      mod.includes("1719") || mod.includes("1723") || mod.includes("1726") || mod.includes("1729") ||
                      mod.includes("11.180") || mod.includes("13.180") || mod.includes("14.180") ||
                      mod.includes("11180") || mod.includes("13180") || mod.includes("14180") ||
                      mod.includes("9.170") || mod.includes("9170") || mod.includes("TRUCK") ||
                      tipoVeiculoBanco === "2");

    // 1. Analisa capacidade bruta do banco de dados
    let pesoKgBanco = Number(rawCapacidadeKg) || 0;
    let temCapacidadeRealBanco = false;

    if (pesoKgBanco > 0 && pesoKgBanco !== 999.99 && pesoKgBanco < 999999) {
        if (pesoKgBanco <= 60) {
            // Cadastrado em TONELADAS no Brudam (ex: 16.57 -> 16570 kg, 23 -> 23000 kg, 30 -> 30000 kg)
            const pesoConvertido = Math.round(pesoKgBanco * 1000);
            // Se for Cavalo ou Truck e o valor der <= 6000 kg (ex: 3.00 -> 3000 kg), é DUMMY no ERP!
            if ((isCavaloMod || isTruckMod) && pesoConvertido <= 6000) {
                temCapacidadeRealBanco = false;
            } else if (isLeveMod && pesoConvertido > 5500) {
                // Caso AZT-7C03 (Accelo 815): cadastrado 15.00 no Brudam. Para caminhão leve/3/4 isso é erro (copiado do m³ ou perfil errado)
                temCapacidadeRealBanco = false;
            } else {
                pesoKgBanco = pesoConvertido;
                temCapacidadeRealBanco = true;
            }
        } else if (pesoKgBanco > 60 && pesoKgBanco < 3500 && (isCavaloMod || isTruckMod || !isLeveMod)) {
            // Erro clássico de digitação de 1 zero a menos no Brudam (ex: 1400 -> 14000 kg)
            pesoKgBanco = Math.round(pesoKgBanco * 10);
            temCapacidadeRealBanco = true;
        } else if (pesoKgBanco >= 3500 && pesoKgBanco <= 60000) {
            // Se for Cavalo Mecânico e tiver menos de 10000 kg cadastrado, é dummy
            if (isCavaloMod && pesoKgBanco < 10000) {
                temCapacidadeRealBanco = false;
            } else if (isTruckMod && pesoKgBanco <= 6000) {
                // Truck com 3.000 kg ou 4.000 kg cadastrado é dummy/placeholder no ERP
                temCapacidadeRealBanco = false;
            } else if (isLeveMod && pesoKgBanco > 5500) {
                // Veículo leve cadastrado com 14400, 16000, 18000 ou 35000 kg no Brudam (usaram perfil de Truck ou erro)
                temCapacidadeRealBanco = false;
            } else {
                temCapacidadeRealBanco = true;
            }
        }
    }

    // 2. Determina o tipo de veículo real utilizado
    let tipoVeiculo: "TRUCK" | "CAVALO MECANICO" | "VUC / 3/4";
    if (isCavaloMod || (temCapacidadeRealBanco && pesoKgBanco >= 19000)) {
        tipoVeiculo = "CAVALO MECANICO";
    } else if (isTruckMod) {
        tipoVeiculo = "TRUCK";
    } else if (isLeveMod || (temCapacidadeRealBanco && pesoKgBanco <= 6000)) {
        tipoVeiculo = "VUC / 3/4";
    } else if (rotaContratual) {
        tipoVeiculo = rotaContratual.tipoVeiculo === "CAVALO MECANICO" ? "CAVALO MECANICO" : "TRUCK";
    } else {
        tipoVeiculo = "TRUCK";
    }

    // 3. Define capacidade em Kg (Prioridade: Banco de Dados do Veículo > Rota Contratual da Planilha > Padrão)
    let capacidadeKg: number;
    if (temCapacidadeRealBanco) {
        capacidadeKg = pesoKgBanco;
    } else if (rotaContratual && rotaContratual.pesoKg > 0 && rotaContratual.tipoVeiculo === tipoVeiculo) {
        capacidadeKg = rotaContratual.pesoKg;
    } else {
        if (tipoVeiculo === "CAVALO MECANICO") {
            capacidadeKg = 24000;
        } else if (tipoVeiculo === "VUC / 3/4") {
            capacidadeKg = isFurgao ? 1800 : 4000;
        } else {
            capacidadeKg = 14000;
        }
    }

    // Trava de coerência física para evitar que qualquer valor aberrante cadastrado fure o limite da categoria
    if (tipoVeiculo === "VUC / 3/4" && capacidadeKg > 5500) {
        capacidadeKg = isFurgao ? 1800 : 4000;
    }

    // 4. Define capacidade em m3 (baú)
    let m3 = Number(rawCapacidadeM3) || 0;
    let m3Valido = false;

    if (tipoVeiculo === "CAVALO MECANICO" && m3 >= 70 && m3 <= 140) m3Valido = true;
    if (tipoVeiculo === "TRUCK" && m3 >= 35 && m3 <= 75) m3Valido = true;
    if (tipoVeiculo === "VUC / 3/4" && m3 >= 8 && m3 <= 35) m3Valido = true;

    if (!m3Valido) {
        if (rotaContratual && rotaContratual.cubagemM3 > 0 && rotaContratual.tipoVeiculo === tipoVeiculo) {
            m3 = rotaContratual.cubagemM3;
        } else {
            m3 = tipoVeiculo === "CAVALO MECANICO" ? 100 : (tipoVeiculo === "TRUCK" ? 50 : (isFurgao ? 12 : 25));
        }
    }

    return {
        tipoVeiculo,
        capacidadeKg,
        capacidadeM3: m3,
        modalidade: "CAMINHAO",
    };
}

interface ColetaManifestoAggRow {
    id_manifesto: string;
    total_coletas: string;
    total_minutas_coleta: string;
    soma_peso_kg: string;
    soma_peso_cubado_kg: string;
    soma_peso_taxado_kg: string;
    soma_cubo_m3: string;
    soma_cubo_m3_bruto: string;
    soma_volumes: string;
    soma_nf_valor: string;
    soma_frete_bruto: string;
    soma_frete_rateado: string;
    soma_custo_coleta: string;
    soma_custo_entrega: string;
    soma_custo_seguro: string;
    soma_impostos: string;
}

export const aproveitamentoRouter = createTRPCRouter({
    obterAnaliseAproveitamento: protectedProcedure
        .input(z.object({
            dataInicio: z.string(), // "yyyy-MM-dd"
            dataFim: z.string(),    // "yyyy-MM-dd"
            parceiro: z.string().optional(),
            tipoVeiculo: z.string().optional(),
            modalidade: z.enum(["TODAS", "CAMINHAO", "ONIBUS"]).optional().default("TODAS"),
            tipoOperacao: z.enum(["TODAS", "TRANSFERENCIA", "COLETA_ENTREGA"]).optional().default("TODAS"),
            statusManifesto: z.string().optional(),
            tipoManifesto: z.string().optional(),
            statusOcupacao: z.enum(["TODAS", "CRITICA", "ATENCAO", "IDEAL"]).optional().default("TODAS"),
            statusMargem: z.enum(["TODAS", "LUCRO", "PREJUIZO"]).optional().default("TODAS"),
            search: z.string().optional(),
        }))
        .query(async ({ input }) => {
            const rotasContratuais = obterRotasContratuais();

            // 1. Queries otimizadas em paralelo no Brudam:
            // - Query A: Manifestos + Minutas diretas (manifesto_list.tipo = 1)
            // - Query B: Coletas vinculadas ao manifesto (manifesto_list.tipo = 2), consolidando tabela `coleta` + minutas geradas pela coleta (`minuta.coleta_numero`)
            const [queryResult, coletasResult] = await Promise.all([
                telemetriaDb.query<ManifestoBrudamRow>(`
                    WITH manifestos_filtrados AS (
                        SELECT id_manifesto
                        FROM manifesto m
                        WHERE m.prev_saida_data::text NOT LIKE '0000%'
                          AND LEFT(m.prev_saida_data::text, 10) >= $1
                          AND LEFT(m.prev_saida_data::text, 10) <= $2
                          AND m.status != 3
                    ),
                    minutas_envolvidas AS (
                        SELECT DISTINCT ml.minuta
                        FROM manifesto_list ml
                        JOIN manifestos_filtrados mf ON mf.id_manifesto = ml.id_manifesto
                        WHERE ml.tipo = 1
                    ),
                    rateio_minuta AS (
                        SELECT 
                            ml.minuta,
                            COUNT(DISTINCT ml.id_manifesto) as total_trechos
                        FROM manifesto_list ml
                        JOIN minutas_envolvidas me ON me.minuta = ml.minuta
                        JOIN manifesto m ON m.id_manifesto = ml.id_manifesto
                        WHERE ml.tipo = 1 AND m.status != 3 AND m.tipo IN (1, 2, 4)
                        GROUP BY ml.minuta
                    ),
                    manifesto_agregado AS (
                        SELECT 
                            ml.id_manifesto,
                            COUNT(DISTINCT ml.minuta) as total_minutas,
                            COALESCE(SUM(mn.total_peso), 0) as soma_peso_kg,
                            COALESCE(SUM(mn.total_cubo), 0) as soma_peso_cubado_kg,
                            COALESCE(SUM(mn.total_taxado), 0) as soma_peso_taxado_kg,
                            COALESCE(SUM(
                                CASE 
                                    -- Proteção contra erros operacionais grotescos no Brudam (ex: milímetros ou cubagem > 120m³ em CTE)
                                    WHEN (mn.metragem_cubica > 120 OR (mn.metragem_cubica > 30 AND mn.total_peso > 50 AND (mn.metragem_cubica / GREATEST(mn.total_peso, 1)) > 0.2)) THEN
                                        LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)
                                    -- Proteção quando o operador digita a quantidade de volumes no campo metragem_cubica
                                    WHEN (mn.metragem_cubica > 30 AND mn.total_cubo > 0 AND mn.metragem_cubica > (mn.total_cubo / 250.0) * 2.5) THEN
                                        (mn.total_cubo / 250.0)
                                    WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica 
                                    WHEN mn.total_cubo > 0 AND (mn.total_cubo / 250.0) <= 120 THEN mn.total_cubo / 250.0 
                                    WHEN mn.total_cubo > 0 THEN LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)
                                    ELSE 0 
                                END
                            ), 0) as soma_cubo_m3,
                            COALESCE(SUM(
                                CASE 
                                    WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica 
                                    WHEN mn.total_cubo > 0 THEN mn.total_cubo / 250.0 
                                    ELSE 0 
                                END
                            ), 0) as soma_cubo_m3_bruto,
                            COALESCE(SUM(mn.total_volumes), 0) as soma_volumes,
                            COALESCE(SUM(mn.total_nf_valor), 0) as soma_nf_valor,
                            COALESCE(SUM(mn.frete_total), 0) as soma_frete_bruto,
                            COALESCE(SUM(mn.frete_total / GREATEST(rm.total_trechos, 1)), 0) as soma_frete_rateado,
                            COALESCE(SUM(COALESCE(mn.coleta_custo, 0) / GREATEST(rm.total_trechos, 1)), 0) as soma_custo_coleta,
                            COALESCE(SUM(COALESCE(mn.entrega_custo, 0) / GREATEST(rm.total_trechos, 1)), 0) as soma_custo_entrega,
                            COALESCE(SUM((COALESCE(mn.seguro_rcfdc, 0) + COALESCE(mn.seguro_rctrc, 0)) / GREATEST(rm.total_trechos, 1)), 0) as soma_custo_seguro,
                            COALESCE(SUM((COALESCE(mn.frete_total, 0) * 0.0925) / GREATEST(rm.total_trechos, 1)), 0) as soma_impostos
                        FROM manifesto_list ml
                        JOIN manifestos_filtrados mf ON mf.id_manifesto = ml.id_manifesto
                        JOIN minuta mn ON mn.id_minuta = ml.minuta
                        LEFT JOIN rateio_minuta rm ON rm.minuta = ml.minuta
                        WHERE ml.tipo = 1
                        GROUP BY ml.id_manifesto
                    )
                    SELECT 
                        m.id_manifesto::text,
                        LEFT(m.prev_saida_data::text, 10) as prev_saida_data,
                        LEFT(m.saida_efetiva_data::text, 10) as saida_efetiva_data,
                        m.status::text,
                        ms.descricao as status_descricao,
                        COALESCE(v.placa, t.ve_placa) as placa,
                        COALESCE(v.modelo, t.ve_modelo) as modelo_veiculo,
                        COALESCE(v.capacidade::text, t.ve_capacidade::text) as capacidade_veiculo_kg,
                        COALESCE(v."capM3"::text, t."capM3"::text) as capacidade_veiculo_m3,
                        COALESCE(fv.fantasia, fmt.fantasia, ft.fantasia) as fornecedor_nome,
                        COALESCE(fv.cnpj, fmt.cnpj, ft.cnpj) as fornecedor_cnpj,
                        ao.aeroporto as origem_aero,
                        ad.aeroporto as destino_aero,
                        uo.fantasia as origem_unidade,
                        ud.fantasia as destino_unidade,
                        m.custo_motorista::text,
                        m.valor_total_km::text,
                        m.pedagio::text,
                        COALESCE(ma.total_minutas, 0)::text as total_minutas,
                        ma.soma_peso_kg::text,
                        ma.soma_peso_cubado_kg::text,
                        ma.soma_peso_taxado_kg::text,
                        ma.soma_cubo_m3::text,
                        ma.soma_cubo_m3_bruto::text,
                        ma.soma_volumes::text,
                        ma.soma_nf_valor::text,
                        ma.soma_frete_bruto::text,
                        ma.soma_frete_rateado::text,
                        ma.soma_custo_coleta::text,
                        ma.soma_custo_entrega::text,
                        ma.soma_custo_seguro::text,
                        ma.soma_impostos::text,
                        m.tipo::text as tipo_manifesto_id,
                        COALESCE(mt.tipo, 'Outro') as tipo_manifesto_descricao,
                        COALESCE(v.tipo_veiculo::text, t.tipo_ve::text) as tipo_veiculo_banco
                    FROM manifesto m
                    LEFT JOIN manifesto_status ms ON ms.id_status = m.status
                    LEFT JOIN manifesto_tipo mt ON mt.id_tipo::text = m.tipo::text
                    LEFT JOIN veiculos v ON v.id_veiculo = COALESCE(NULLIF(m.veiculo, 0), NULLIF(m.veiculo_terceiro, 0), NULLIF(m.veiculo_agente, 0))
                    LEFT JOIN fornecedores fv ON v.proprietario::text = fv.id_local::text
                    LEFT JOIN motorista_terceiro mt_mot ON mt_mot.id::text = COALESCE(NULLIF(m.motorista_agente::text, '0'), NULLIF(m.motorista::text, '0'))
                    LEFT JOIN fornecedores fmt ON fmt.id_local::text = mt_mot.id_local::text
                    LEFT JOIN terceiros t ON t.id_terceiro = m.veiculo_terceiro
                    LEFT JOIN fornecedores ft ON t.fornecedor::text = ft.id_local::text
                    LEFT JOIN aero ao ON ao.id_aero::text = m.transf_origem::text
                    LEFT JOIN aero ad ON ad.id_aero::text = m.transf_destino::text
                    LEFT JOIN unidades uo ON uo.id_unidade::text = m.base::text
                    LEFT JOIN unidades ud ON ud.id_unidade::text = m.destino::text
                    LEFT JOIN manifesto_agregado ma ON ma.id_manifesto = m.id_manifesto
                    WHERE m.prev_saida_data::text NOT LIKE '0000%'
                      AND LEFT(m.prev_saida_data::text, 10) >= $1
                      AND LEFT(m.prev_saida_data::text, 10) <= $2
                      AND m.status != 3
                      AND (
                          ma.total_minutas > 0
                          OR EXISTS (SELECT 1 FROM manifesto_list mlc WHERE mlc.id_manifesto = m.id_manifesto AND mlc.tipo = 2)
                          OR COALESCE(NULLIF(m.veiculo, 0), NULLIF(m.veiculo_terceiro, 0), NULLIF(m.veiculo_agente, 0)) IS NOT NULL
                      )
                    ORDER BY m.id_manifesto DESC;
                `, [input.dataInicio, input.dataFim]),
                telemetriaDb.query<ColetaManifestoAggRow>(`
                    WITH manifestos_filtrados AS (
                        SELECT id_manifesto
                        FROM manifesto m
                        WHERE m.prev_saida_data::text NOT LIKE '0000%'
                          AND LEFT(m.prev_saida_data::text, 10) >= $1
                          AND LEFT(m.prev_saida_data::text, 10) <= $2
                          AND m.status != 3
                    ),
                    coletas_filtradas AS (
                        SELECT DISTINCT ml.minuta as id_coleta
                        FROM manifesto_list ml
                        JOIN manifestos_filtrados mf ON mf.id_manifesto = ml.id_manifesto
                        WHERE ml.tipo = 2
                    ),
                    minutas_de_coletas AS (
                        SELECT DISTINCT mn.coleta_numero::bigint as id_coleta, mn.id_minuta
                        FROM minuta mn
                        JOIN coletas_filtradas cf ON cf.id_coleta = mn.coleta_numero::bigint
                        WHERE mn.cte_data >= ($1::date - interval '7 days')::date::text
                          AND mn.cte_data <= ($2::date + interval '15 days')::date::text
                          AND mn.coleta_numero > 0
                          AND mn.status NOT IN (9, 13, 99)
                    ),
                    rateio_minuta_coleta AS (
                        SELECT 
                            ml.minuta,
                            COUNT(DISTINCT ml.id_manifesto) as total_trechos
                        FROM manifesto_list ml
                        JOIN (SELECT DISTINCT id_minuta FROM minutas_de_coletas) me ON me.id_minuta = ml.minuta
                        JOIN manifesto m ON m.id_manifesto = ml.id_manifesto
                        WHERE ml.tipo = 1 AND m.status != 3 AND m.tipo IN (1, 2, 4)
                        GROUP BY ml.minuta
                    ),
                    rateio_coleta AS (
                        SELECT
                            ml.minuta as id_coleta,
                            COUNT(DISTINCT ml.id_manifesto) as total_manif_coleta
                        FROM manifesto_list ml
                        JOIN coletas_filtradas cf ON cf.id_coleta = ml.minuta
                        JOIN manifesto m ON m.id_manifesto = ml.id_manifesto
                        WHERE ml.tipo = 2 AND m.status != 3 AND m.tipo IN (1, 2, 4)
                        GROUP BY ml.minuta
                    ),
                    coleta_minutas_agg AS (
                        SELECT
                            mc.id_coleta,
                            COUNT(DISTINCT mn.id_minuta) as qtd_minutas,
                            COALESCE(SUM(mn.total_peso), 0) as mds_peso_kg,
                            COALESCE(SUM(mn.total_cubo), 0) as mds_peso_cubado_kg,
                            COALESCE(SUM(mn.total_taxado), 0) as mds_peso_taxado_kg,
                            COALESCE(SUM(
                                CASE 
                                    WHEN (mn.metragem_cubica > 120 OR (mn.metragem_cubica > 30 AND mn.total_peso > 50 AND (mn.metragem_cubica / GREATEST(mn.total_peso, 1)) > 0.2)) THEN
                                        LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)
                                    WHEN (mn.metragem_cubica > 30 AND mn.total_cubo > 0 AND mn.metragem_cubica > (mn.total_cubo / 250.0) * 2.5) THEN
                                        (mn.total_cubo / 250.0)
                                    WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica 
                                    WHEN mn.total_cubo > 0 AND (mn.total_cubo / 250.0) <= 120 THEN mn.total_cubo / 250.0 
                                    WHEN mn.total_cubo > 0 THEN LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)
                                    ELSE 0 
                                END
                            ), 0) as mds_cubo_m3,
                            COALESCE(SUM(
                                CASE 
                                    WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica 
                                    WHEN mn.total_cubo > 0 THEN mn.total_cubo / 250.0 
                                    ELSE 0 
                                END
                            ), 0) as mds_cubo_m3_bruto,
                            COALESCE(SUM(mn.total_volumes), 0) as mds_volumes,
                            COALESCE(SUM(mn.total_nf_valor), 0) as mds_nf_valor,
                            COALESCE(SUM(mn.frete_total), 0) as mds_frete_bruto,
                            COALESCE(SUM(mn.frete_total / GREATEST(COALESCE(rm.total_trechos, 0) + COALESCE(rc.total_manif_coleta, 1), 1)), 0) as mds_frete_rateado,
                            COALESCE(SUM(COALESCE(mn.coleta_custo, 0) / GREATEST(COALESCE(rm.total_trechos, 0) + COALESCE(rc.total_manif_coleta, 1), 1)), 0) as mds_custo_coleta,
                            COALESCE(SUM(COALESCE(mn.entrega_custo, 0) / GREATEST(COALESCE(rm.total_trechos, 0) + COALESCE(rc.total_manif_coleta, 1), 1)), 0) as mds_custo_entrega,
                            COALESCE(SUM((COALESCE(mn.seguro_rcfdc, 0) + COALESCE(mn.seguro_rctrc, 0)) / GREATEST(COALESCE(rm.total_trechos, 0) + COALESCE(rc.total_manif_coleta, 1), 1)), 0) as mds_custo_seguro,
                            COALESCE(SUM((COALESCE(mn.frete_total, 0) * 0.0925) / GREATEST(COALESCE(rm.total_trechos, 0) + COALESCE(rc.total_manif_coleta, 1), 1)), 0) as mds_impostos
                        FROM minutas_de_coletas mc
                        JOIN minuta mn ON mn.id_minuta = mc.id_minuta
                        LEFT JOIN rateio_minuta_coleta rm ON rm.minuta = mn.id_minuta
                        LEFT JOIN rateio_coleta rc ON rc.id_coleta = mc.id_coleta
                        GROUP BY mc.id_coleta
                    )
                    SELECT
                        ml.id_manifesto::text,
                        COUNT(DISTINCT ml.minuta)::text as total_coletas,
                        COALESCE(SUM(GREATEST(COALESCE(cma.qtd_minutas, 0), 1)), 0)::text as total_minutas_coleta,
                        COALESCE(SUM(GREATEST(COALESCE(c.total_peso, 0), COALESCE(cma.mds_peso_kg, 0))), 0)::text as soma_peso_kg,
                        COALESCE(SUM(GREATEST(COALESCE(c.total_cubo, 0), COALESCE(c.cubagem_rodoviario, 0), COALESCE(cma.mds_peso_cubado_kg, 0))), 0)::text as soma_peso_cubado_kg,
                        COALESCE(SUM(GREATEST(COALESCE(c.total_taxado, 0), COALESCE(c.total_peso, 0), COALESCE(cma.mds_peso_taxado_kg, 0))), 0)::text as soma_peso_taxado_kg,
                        COALESCE(SUM(GREATEST(
                            CASE
                                WHEN c.metragem_cubica > 0 AND c.metragem_cubica <= 120 THEN c.metragem_cubica
                                WHEN COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) > 0 AND (COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) / 250.0) <= 120 THEN COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) / 250.0
                                ELSE 0
                            END,
                            COALESCE(cma.mds_cubo_m3, 0)
                        )), 0)::text as soma_cubo_m3,
                        COALESCE(SUM(GREATEST(
                            CASE
                                WHEN c.metragem_cubica > 0 THEN c.metragem_cubica
                                WHEN COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) > 0 THEN COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) / 250.0
                                ELSE 0
                            END,
                            COALESCE(cma.mds_cubo_m3_bruto, 0)
                        )), 0)::text as soma_cubo_m3_bruto,
                        COALESCE(SUM(GREATEST(COALESCE(c.total_volumes, 0), COALESCE(cma.mds_volumes, 0))), 0)::text as soma_volumes,
                        COALESCE(SUM(GREATEST(COALESCE(c.total_nf_valor, 0), COALESCE(c.valor_total_notas, 0), COALESCE(cma.mds_nf_valor, 0))), 0)::text as soma_nf_valor,
                        COALESCE(SUM(COALESCE(cma.mds_frete_bruto, 0)), 0)::text as soma_frete_bruto,
                        COALESCE(SUM(COALESCE(cma.mds_frete_rateado, 0)), 0)::text as soma_frete_rateado,
                        COALESCE(SUM(COALESCE(cma.mds_custo_coleta, 0)), 0)::text as soma_custo_coleta,
                        COALESCE(SUM(COALESCE(cma.mds_custo_entrega, 0)), 0)::text as soma_custo_entrega,
                        COALESCE(SUM(COALESCE(cma.mds_custo_seguro, 0)), 0)::text as soma_custo_seguro,
                        COALESCE(SUM(COALESCE(cma.mds_impostos, 0)), 0)::text as soma_impostos
                    FROM manifesto_list ml
                    JOIN manifestos_filtrados mf ON mf.id_manifesto = ml.id_manifesto
                    JOIN coleta c ON c.id_coleta = ml.minuta
                    LEFT JOIN coleta_minutas_agg cma ON cma.id_coleta = c.id_coleta
                    WHERE ml.tipo = 2
                    GROUP BY ml.id_manifesto;
                `, [input.dataInicio, input.dataFim]),
            ]);

            const rows = queryResult.rows;
            const mapaColetasPorManifesto = new Map<string, ColetaManifestoAggRow>();
            for (const cRow of coletasResult.rows) {
                mapaColetasPorManifesto.set(cRow.id_manifesto, cRow);
            }

            // 2. Processa cada viagem cruzando com as regras da planilha de capacidade
            const viagensProcessadas = rows.map((r) => {
                const colAgg = mapaColetasPorManifesto.get(r.id_manifesto);
                const parceiroIdentificado = identificarParceiroBrudam(r.fornecedor_nome) || "Outros / Próprio";
                const origem = r.origem_aero || r.origem_unidade || "Origem não inf.";
                const destino = r.destino_aero || r.destino_unidade || (r.tipo_manifesto_id === "4" || (Number(colAgg?.total_coletas) || 0) > 0 ? "Coleta / Entrega Local" : "Destino não inf.");

                const rotaContratual = encontrarRotaCompativel(parceiroIdentificado, origem, destino, rotasContratuais);

                // Define capacidade oficial com normalização inteligente (Planilha > Brudam saneado > Padrão)
                const { tipoVeiculo, capacidadeKg, capacidadeM3, modalidade } = inferirCapacidadeVeiculo(
                    rotaContratual,
                    r.capacidade_veiculo_kg,
                    r.capacidade_veiculo_m3,
                    r.modelo_veiculo,
                    r.tipo_veiculo_banco
                );

                // Custo: Planilha ou Lançado no Brudam
                const custoBrudam = (Number(r.custo_motorista) || 0) + (Number(r.valor_total_km) || 0) + (Number(r.pedagio) || 0);
                const custoViagem = (custoBrudam > 0) ? custoBrudam : (rotaContratual?.valorTotal || 0);

                const pesoCarregadoKg = (Number(r.soma_peso_kg) || 0) + (Number(colAgg?.soma_peso_kg) || 0);
                const cuboCarregadoM3 = (Number(r.soma_cubo_m3) || 0) + (Number(colAgg?.soma_cubo_m3) || 0);
                const cuboCarregadoM3Bruto = ((Number(r.soma_cubo_m3_bruto) || 0) + (Number(colAgg?.soma_cubo_m3_bruto) || 0)) || cuboCarregadoM3;
                const temAnomaliaVolume = cuboCarregadoM3Bruto > 150 || (cuboCarregadoM3Bruto > cuboCarregadoM3 * 2);
                const totalVolumes = (Number(r.soma_volumes) || 0) + (Number(colAgg?.soma_volumes) || 0);
                const totalMinutas = (Number(r.total_minutas) || 0) + (Number(colAgg?.total_minutas_coleta) || 0);
                const totalColetas = Number(colAgg?.total_coletas) || 0;
                const valorMercadoriaNf = (Number(r.soma_nf_valor) || 0) + (Number(colAgg?.soma_nf_valor) || 0);
                
                // Receitas e Custos Operacionais das Pontas
                const receitaRateada = (Number(r.soma_frete_rateado) || 0) + (Number(colAgg?.soma_frete_rateado) || 0); // Frete bruto rateado
                const receitaBrutaMinutas = (Number(r.soma_frete_bruto) || 0) + (Number(colAgg?.soma_frete_bruto) || 0);
                const custoColetaRateado = (Number(r.soma_custo_coleta) || 0) + (Number(colAgg?.soma_custo_coleta) || 0);
                const custoEntregaRateado = (Number(r.soma_custo_entrega) || 0) + (Number(colAgg?.soma_custo_entrega) || 0);
                const custoSeguroRateado = (Number(r.soma_custo_seguro) || 0) + (Number(colAgg?.soma_custo_seguro) || 0);
                const impostosRateados = (Number(r.soma_impostos) || 0) + (Number(colAgg?.soma_impostos) || 0); // 9,25% PIS/COFINS
                const custoPontasRateado = custoColetaRateado + custoEntregaRateado + custoSeguroRateado + impostosRateados;

                // Receita Líquida disponível para cobrir a transferência
                const receitaLiquidaRateada = Math.max(0, receitaRateada - custoPontasRateado);

                // Cálculos de ocupação (com limite de segurança de saturação para integridade gerencial)
                const ocupacaoPesoPct = capacidadeKg > 0 ? Math.min(150, Math.round((pesoCarregadoKg / capacidadeKg) * 100)) : 0;
                const ocupacaoCuboPct = capacidadeM3 > 0 ? Math.min(150, Math.round((cuboCarregadoM3 / capacidadeM3) * 100)) : 0;
                const ocupacaoGeralPct = Math.max(ocupacaoPesoPct, ocupacaoCuboPct);
                const gargalo = ocupacaoPesoPct >= ocupacaoCuboPct ? "PESO" : "VOLUME";

                const nivelOcupacao: "CRITICA" | "ATENCAO" | "IDEAL" = 
                    ocupacaoGeralPct < 50 ? "CRITICA" : (ocupacaoGeralPct < 75 ? "ATENCAO" : "IDEAL");

                // Cálculos de Lucro Líquido Real (Receita Líquida - Custo do Parceiro)
                const margemFinanceira = receitaLiquidaRateada - custoViagem;
                const margemPercentual = receitaLiquidaRateada > 0 ? Math.round((margemFinanceira / receitaLiquidaRateada) * 100) : (custoViagem > 0 ? -100 : 0);
                const resultadoFinanceiro: "LUCRO" | "PREJUIZO" = margemFinanceira >= 0 ? "LUCRO" : "PREJUIZO";

                const isTransferencia = (
                    (Boolean(r.destino_aero) && r.destino_aero !== r.origem_aero) ||
                    (Boolean(r.destino_unidade) && r.destino_unidade !== r.origem_unidade)
                );
                const tipoOperacao: "TRANSFERENCIA" | "COLETA_ENTREGA" = isTransferencia ? "TRANSFERENCIA" : "COLETA_ENTREGA";
                const tipoOperacaoDescricao = isTransferencia ? "Transferência" : "Coleta / Entrega";

                return {
                    idManifesto: r.id_manifesto,
                    data: r.prev_saida_data,
                    saidaEfetiva: r.saida_efetiva_data,
                    statusDescricao: r.status_descricao || "Encerrado",
                    parceiro: parceiroIdentificado,
                    fornecedorRazao: r.fornecedor_nome || "—",
                    placa: r.placa || "—",
                    modelo: r.modelo_veiculo || "—",
                    origem,
                    destino,
                    rotaDescricao: `${origem} ➔ ${destino}`,
                    tipoOperacao,
                    tipoOperacaoDescricao,
                    modalidade,
                    tipoVeiculo,
                    capacidadeKg,
                    capacidadeM3,
                    pesoCarregadoKg,
                    cuboCarregadoM3,
                    cuboCarregadoM3Bruto,
                    temAnomaliaVolume,
                    totalVolumes,
                    totalMinutas,
                    totalColetas,
                    valorMercadoriaNf,
                    ocupacaoPesoPct,
                    ocupacaoCuboPct,
                    ocupacaoGeralPct,
                    gargalo,
                    nivelOcupacao,
                    custoViagem,
                    receitaRateada,
                    receitaBrutaMinutas,
                    custoPontasRateado,
                    custoColetaRateado,
                    custoEntregaRateado,
                    custoSeguroRateado,
                    impostosRateados,
                    receitaLiquidaRateada,
                    margemFinanceira,
                    margemPercentual,
                    resultadoFinanceiro,
                    tipoManifestoId: r.tipo_manifesto_id,
                    tipoManifestoDescricao: r.tipo_manifesto_descricao || "Outro",
                    rotaContratualLinha: rotaContratual?.linha || null,
                    distanciaKm: rotaContratual?.totalKm || 0,
                };
            });

            // 3. Aplicação dos filtros do usuário
            const viagensFiltradas = viagensProcessadas.filter((v) => {
                if (input.modalidade && input.modalidade !== "TODAS" && v.modalidade !== input.modalidade) return false;
                if (input.tipoOperacao && input.tipoOperacao !== "TODAS" && v.tipoOperacao !== input.tipoOperacao) return false;
                if (input.parceiro && v.parceiro.toLowerCase() !== input.parceiro.toLowerCase()) return false;
                if (input.tipoVeiculo && v.tipoVeiculo !== input.tipoVeiculo) return false;
                if (input.statusManifesto && v.statusDescricao.toLowerCase() !== input.statusManifesto.toLowerCase()) return false;
                if (input.tipoManifesto && v.tipoManifestoDescricao.toLowerCase() !== input.tipoManifesto.toLowerCase() && v.tipoManifestoId !== input.tipoManifesto) return false;
                if (input.statusOcupacao !== "TODAS" && v.nivelOcupacao !== input.statusOcupacao) return false;
                if (input.statusMargem !== "TODAS" && v.resultadoFinanceiro !== input.statusMargem) return false;

                if (input.search) {
                    const q = input.search.toLowerCase();
                    const match = v.idManifesto.includes(q) ||
                        v.placa.toLowerCase().includes(q) ||
                        v.origem.toLowerCase().includes(q) ||
                        v.destino.toLowerCase().includes(q) ||
                        v.parceiro.toLowerCase().includes(q) ||
                        v.fornecedorRazao.toLowerCase().includes(q) ||
                        v.statusDescricao.toLowerCase().includes(q) ||
                        v.tipoOperacaoDescricao.toLowerCase().includes(q) ||
                        v.tipoManifestoDescricao.toLowerCase().includes(q);
                    if (!match) return false;
                }
                return true;
            });

            // 4. Agregações para KPIs Globais
            const totalViagens = viagensFiltradas.length;
            const somaPesoCarregado = viagensFiltradas.reduce((acc, v) => acc + v.pesoCarregadoKg, 0);
            const somaCapacidadePeso = viagensFiltradas.reduce((acc, v) => acc + v.capacidadeKg, 0);
            const somaCuboCarregado = viagensFiltradas.reduce((acc, v) => acc + v.cuboCarregadoM3, 0);
            const somaCapacidadeCubo = viagensFiltradas.reduce((acc, v) => acc + v.capacidadeM3, 0);

            // Blindagem matemática: taxa média não pode estourar 100% por anomalias
            const taxaMediaOcupacaoPeso = somaCapacidadePeso > 0 ? Math.min(100, Math.round((somaPesoCarregado / somaCapacidadePeso) * 100)) : 0;
            const taxaMediaOcupacaoCubo = somaCapacidadeCubo > 0 ? Math.min(100, Math.round((somaCuboCarregado / somaCapacidadeCubo) * 100)) : 0;
            const totalAnomaliasVolume = viagensFiltradas.filter(v => v.temAnomaliaVolume).length;

            const receitaTotalRateada = viagensFiltradas.reduce((acc, v) => acc + v.receitaRateada, 0);
            const receitaLiquidaTotalRateada = viagensFiltradas.reduce((acc, v) => acc + v.receitaLiquidaRateada, 0);
            const custoPontasTotal = viagensFiltradas.reduce((acc, v) => acc + v.custoPontasRateado, 0);
            const custoTotalParceiros = viagensFiltradas.reduce((acc, v) => acc + v.custoViagem, 0);
            const margemTotal = receitaLiquidaTotalRateada - custoTotalParceiros;
            const margemTotalPct = receitaLiquidaTotalRateada > 0 ? Math.round((margemTotal / receitaLiquidaTotalRateada) * 100) : 0;

            const capacidadeOciosaKg = Math.max(0, somaCapacidadePeso - somaPesoCarregado);
            const capacidadeOciosaM3 = Math.max(0, somaCapacidadeCubo - somaCuboCarregado);

            const qtdSubutilizadas = viagensFiltradas.filter(v => v.nivelOcupacao === "CRITICA").length;
            const qtdPrejuizo = viagensFiltradas.filter(v => v.resultadoFinanceiro === "PREJUIZO").length;

            // 5. Agregações por Parceiro (Ranking)
            const mapaParceiros = new Map<string, {
                parceiro: string;
                viagens: number;
                somaPeso: number;
                somaCapPeso: number;
                somaCubo: number;
                somaCapCubo: number;
                receitaBruta: number;
                receitaLiquida: number;
                custo: number;
                margem: number;
            }>();

            for (const v of viagensFiltradas) {
                const item = mapaParceiros.get(v.parceiro) || {
                    parceiro: v.parceiro,
                    viagens: 0,
                    somaPeso: 0,
                    somaCapPeso: 0,
                    somaCubo: 0,
                    somaCapCubo: 0,
                    receitaBruta: 0,
                    receitaLiquida: 0,
                    custo: 0,
                    margem: 0,
                };
                item.viagens++;
                item.somaPeso += v.pesoCarregadoKg;
                item.somaCapPeso += v.capacidadeKg;
                item.somaCubo += v.cuboCarregadoM3;
                item.somaCapCubo += v.capacidadeM3;
                item.receitaBruta += v.receitaRateada;
                item.receitaLiquida += v.receitaLiquidaRateada;
                item.custo += v.custoViagem;
                item.margem += v.margemFinanceira;
                mapaParceiros.set(v.parceiro, item);
            }

            const rankingParceiros = Array.from(mapaParceiros.values()).map(p => {
                const ocupPeso = p.somaCapPeso > 0 ? Math.min(100, Math.round((p.somaPeso / p.somaCapPeso) * 100)) : 0;
                const ocupCubo = p.somaCapCubo > 0 ? Math.min(100, Math.round((p.somaCubo / p.somaCapCubo) * 100)) : 0;
                return {
                    parceiro: p.parceiro,
                    viagens: p.viagens,
                    ocupacaoMediaPeso: ocupPeso,
                    ocupacaoMediaCubo: ocupCubo,
                    ocupacaoGeral: Math.max(ocupPeso, ocupCubo),
                    receitaTotal: p.receitaBruta,
                    receitaLiquidaTotal: p.receitaLiquida,
                    custoTotal: p.custo,
                    margemTotal: p.margem,
                    margemPct: p.receitaLiquida > 0 ? Math.round((p.margem / p.receitaLiquida) * 100) : 0,
                };
            }).sort((a, b) => b.viagens - a.viagens);

            // 6. Ranking de Rotas Subutilizadas (Menor ocupação)
            const mapaRotas = new Map<string, { rota: string; viagens: number; ocupacaoSoma: number; prejuizoSoma: number; custoTotal: number; receitaTotal: number; receitaLiquidaTotal: number; margemTotal: number }>();
            for (const v of viagensFiltradas) {
                const item = mapaRotas.get(v.rotaDescricao) || { rota: v.rotaDescricao, viagens: 0, ocupacaoSoma: 0, prejuizoSoma: 0, custoTotal: 0, receitaTotal: 0, receitaLiquidaTotal: 0, margemTotal: 0 };
                item.viagens++;
                item.ocupacaoSoma += v.ocupacaoGeralPct;
                item.custoTotal += v.custoViagem;
                item.receitaTotal += v.receitaRateada;
                item.receitaLiquidaTotal += v.receitaLiquidaRateada;
                item.margemTotal += v.margemFinanceira;
                if (v.resultadoFinanceiro === "PREJUIZO") item.prejuizoSoma++;
                mapaRotas.set(v.rotaDescricao, item);
            }

            const rotasAnalise = Array.from(mapaRotas.values()).map(r => ({
                rota: r.rota,
                viagens: r.viagens,
                ocupacaoMedia: Math.round(r.ocupacaoSoma / r.viagens),
                prejuizoQtd: r.prejuizoSoma,
                receitaTotal: r.receitaTotal,
                receitaLiquidaTotal: r.receitaLiquidaTotal,
                custoTotal: r.custoTotal,
                margemTotal: r.margemTotal,
            }));

            const rotasPiorOcupacao = [...rotasAnalise]
                .filter(r => r.viagens >= 2)
                .sort((a, b) => a.ocupacaoMedia - b.ocupacaoMedia)
                .slice(0, 8);

            const rotasMaiorMovimento = [...rotasAnalise]
                .sort((a, b) => b.receitaLiquidaTotal - a.receitaLiquidaTotal)
                .slice(0, 8);

            // 7. Distribuição das viagens
            const distribuicaoOcupacao = {
                IDEAL: viagensFiltradas.filter(v => v.nivelOcupacao === "IDEAL").length,
                ATENCAO: viagensFiltradas.filter(v => v.nivelOcupacao === "ATENCAO").length,
                CRITICA: viagensFiltradas.filter(v => v.nivelOcupacao === "CRITICA").length,
            };

            const distribuicaoGargalo = {
                PESO: viagensFiltradas.filter(v => v.gargalo === "PESO").length,
                VOLUME: viagensFiltradas.filter(v => v.gargalo === "VOLUME").length,
            };

            return {
                kpis: {
                    totalViagens,
                    taxaMediaOcupacaoPeso,
                    taxaMediaOcupacaoCubo,
                    taxaMediaGeral: Math.max(taxaMediaOcupacaoPeso, taxaMediaOcupacaoCubo),
                    receitaTotalRateada,
                    receitaLiquidaTotalRateada,
                    custoPontasTotal,
                    custoTotalParceiros,
                    margemTotal,
                    margemTotalPct,
                    capacidadeOciosaKg,
                    capacidadeOciosaM3,
                    qtdSubutilizadas,
                    qtdPrejuizo,
                    totalAnomaliasVolume,
                    totalTransferencias: viagensFiltradas.filter(v => v.tipoOperacao === "TRANSFERENCIA").length,
                    totalColetasEntregas: viagensFiltradas.filter(v => v.tipoOperacao === "COLETA_ENTREGA").length,
                },
                contadoresGlobais: {
                    totalTransferencias: viagensProcessadas.filter(v => v.tipoOperacao === "TRANSFERENCIA").length,
                    totalColetasEntregas: viagensProcessadas.filter(v => v.tipoOperacao === "COLETA_ENTREGA").length,
                },
                rankingParceiros,
                rotasPiorOcupacao,
                rotasMaiorMovimento,
                distribuicaoOcupacao,
                distribuicaoGargalo,
                viagens: viagensFiltradas,
                parceirosDisponiveis: Array.from(new Set(viagensProcessadas.map(v => v.parceiro))).sort(),
                statusDisponiveis: Array.from(new Set(viagensProcessadas.map(v => v.statusDescricao))).filter(Boolean).sort(),
                tiposManifestoDisponiveis: Array.from(new Set(viagensProcessadas.map(v => v.tipoManifestoDescricao))).filter(Boolean).sort(),
            };
        }),

    obterMinutasManifesto: protectedProcedure
        .input(z.object({
            idManifesto: z.string()
        }))
        .query(async ({ input }) => {
            // 1. Busca os dados e custos totais do manifesto
            const manifestoRes = await telemetriaDb.query(`
                SELECT 
                    m.id_manifesto,
                    m.prev_saida_data,
                    COALESCE(m.custo_motorista, 0) as custo_motorista,
                    COALESCE(m.valor_total_km, 0) as valor_total_km,
                    COALESCE(m.pedagio, 0) as pedagio
                FROM manifesto m
                WHERE m.id_manifesto = $1;
            `, [input.idManifesto]);

            const mRow = manifestoRes.rows[0];
            const custoTotalManifesto = mRow ? (Number(mRow.custo_motorista) + Number(mRow.valor_total_km) + Number(mRow.pedagio)) : 0;
            const prevSaidaData = mRow?.prev_saida_data || null;

            // 2. Busca todas as minutas vinculadas (diretas tipo = 1 OU geradas por coletas tipo = 2)
            const [minutasQuery, coletasQuery] = await Promise.all([
                telemetriaDb.query(`
                    WITH coletas_manif AS (
                        SELECT DISTINCT
                            c.id_coleta,
                            COALESCE(NULLIF(TRIM(f.fantasia), ''), NULLIF(TRIM(f.razao), ''), 'Cliente #' || COALESCE(c.id_cliente::text, '')) as remetente_nome
                        FROM manifesto_list ml
                        JOIN coleta c ON c.id_coleta = ml.minuta
                        LEFT JOIN fornecedores f ON f.id_local = c.id_cliente
                        WHERE ml.id_manifesto = $1
                          AND ml.tipo = 2
                    ),
                    minutas_via_coleta AS (
                        SELECT 
                            mn.id_minuta,
                            cm.id_coleta,
                            cm.remetente_nome
                        FROM coletas_manif cm
                        JOIN minuta mn ON mn.coleta_numero = cm.id_coleta
                        WHERE COALESCE(mn.status, 0) NOT IN (9, 13, 99)
                          AND (
                              $2::text IS NULL
                              OR (
                                  mn.cte_data >= ($2::date - interval '7 days')::date::text
                                  AND mn.cte_data <= ($2::date + interval '15 days')::date::text
                              )
                          )
                        UNION
                        SELECT 
                            mn.id_minuta,
                            cm.id_coleta,
                            cm.remetente_nome
                        FROM coletas_manif cm
                        JOIN frete_hist fh ON fh.coleta = cm.id_coleta::int
                        JOIN minuta mn ON mn.id_minuta = fh.frete
                        WHERE COALESCE(mn.status, 0) NOT IN (9, 13, 99)
                    ),
                    minutas_diretas AS (
                        SELECT DISTINCT
                            ml.minuta as id_minuta,
                            NULL::bigint as id_coleta,
                            NULL::text as remetente_nome
                        FROM manifesto_list ml
                        WHERE ml.id_manifesto = $1
                          AND ml.tipo = 1
                    ),
                    todas_minutas_manif AS (
                        SELECT DISTINCT ON (id_minuta)
                            id_minuta,
                            id_coleta,
                            remetente_nome
                        FROM (
                            SELECT id_minuta, id_coleta, remetente_nome, 1 as prioridade FROM minutas_via_coleta
                            UNION ALL
                            SELECT id_minuta, id_coleta, remetente_nome, 2 as prioridade FROM minutas_diretas
                        ) u
                        ORDER BY id_minuta, prioridade ASC
                    ),
                    todos_manifestos_minuta AS (
                        SELECT 
                            tmm.id_minuta as minuta,
                            ml2.id_manifesto,
                            COALESCE(m2.custo_motorista, 0) as custo_motorista,
                            COALESCE(m2.valor_total_km, 0) as valor_total_km,
                            COALESCE(m2.pedagio, 0) as pedagio,
                            (SELECT COALESCE(SUM(COALESCE(mn3.total_taxado, mn3.total_peso)), 1) 
                             FROM manifesto_list ml3 
                             JOIN minuta mn3 ON mn3.id_minuta = ml3.minuta 
                             WHERE ml3.id_manifesto = ml2.id_manifesto
                               AND ml3.tipo = 1) as peso_manifesto
                        FROM todas_minutas_manif tmm
                        JOIN manifesto_list ml2 ON ml2.minuta = tmm.id_minuta AND ml2.tipo = 1
                        JOIN manifesto m2 ON m2.id_manifesto = ml2.id_manifesto
                        WHERE m2.status != 3 AND m2.tipo IN (1, 2, 4)
                    ),
                    resumo_transf_minuta AS (
                        SELECT 
                            tmm.minuta,
                            COUNT(DISTINCT tmm.id_manifesto) as total_manifestos_real,
                            SUM( (COALESCE(mn.total_taxado, mn.total_peso) / GREATEST(tmm.peso_manifesto, 1)) * (tmm.custo_motorista + tmm.valor_total_km + tmm.pedagio) ) as soma_custo_transferencias
                        FROM todos_manifestos_minuta tmm
                        JOIN minuta mn ON mn.id_minuta = tmm.minuta
                        GROUP BY tmm.minuta
                    )
                    SELECT 
                        mn.id_minuta::text,
                        tmm.id_coleta::text as id_coleta,
                        tmm.remetente_nome,
                        COALESCE(mn.total_volumes, 0)::int as total_volumes,
                        COALESCE(mn.total_peso, 0)::float as total_peso,
                        COALESCE(mn.total_cubo, 0)::float as total_cubo,
                        COALESCE(mn.total_taxado, mn.total_peso, 0)::float as total_taxado,
                        CASE 
                            WHEN (mn.metragem_cubica > 120 OR (mn.metragem_cubica > 30 AND mn.total_peso > 50 AND (mn.metragem_cubica / GREATEST(mn.total_peso, 1)) > 0.2)) THEN
                                LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)::float
                            WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica::float 
                            WHEN mn.total_cubo > 0 AND (mn.total_cubo / 250.0) <= 120 THEN (mn.total_cubo / 250.0)::float 
                            WHEN mn.total_cubo > 0 THEN LEAST(GREATEST(mn.total_peso / 250.0, 0.5), 30.0)::float
                            ELSE 0 
                        END as volume_m3,
                        CASE 
                            WHEN mn.metragem_cubica > 0 THEN mn.metragem_cubica::float 
                            WHEN mn.total_cubo > 0 THEN (mn.total_cubo / 250.0)::float 
                            ELSE 0 
                        END as volume_m3_original,
                        (mn.metragem_cubica > 120 OR (mn.metragem_cubica > 30 AND mn.total_peso > 50 AND (mn.metragem_cubica / GREATEST(mn.total_peso, 1)) > 0.2)) as anomalia_volume,
                        COALESCE(mn.total_nf_valor, 0)::float as total_nf_valor,
                        COALESCE(mn.frete_total, 0)::float as frete_total,
                        COALESCE(mn.coleta_custo, 0)::float as coleta_custo,
                        COALESCE(mn.entrega_custo, 0)::float as entrega_custo,
                        (COALESCE(mn.seguro_rcfdc, 0) + COALESCE(mn.seguro_rctrc, 0))::float as seguro,
                        mn.origem,
                        mn.destino,
                        mn.chave,
                        mn.cte_numero::text,
                        (COALESCE(rtm.total_manifestos_real, 0) + CASE WHEN tmm.id_coleta IS NOT NULL THEN 1 ELSE 0 END)::int as total_manifestos,
                        COALESCE(rtm.soma_custo_transferencias, 0)::float as soma_todas_transf
                    FROM todas_minutas_manif tmm
                    JOIN minuta mn ON mn.id_minuta = tmm.id_minuta
                    LEFT JOIN resumo_transf_minuta rtm ON rtm.minuta = tmm.id_minuta
                    ORDER BY mn.total_peso DESC;
                `, [input.idManifesto, prevSaidaData]),
                // 3. Busca as coletas (tipo = 2) da tabela coleta para cobrir coletas sem minuta emitida ou com diferença de peso
                telemetriaDb.query(`
                    SELECT 
                        c.id_coleta::text as id_coleta,
                        COALESCE(NULLIF(TRIM(f.fantasia), ''), NULLIF(TRIM(f.razao), ''), 'Cliente #' || COALESCE(c.id_cliente::text, '')) as remetente_nome,
                        COALESCE(c.total_volumes, 0)::int as total_volumes,
                        COALESCE(c.total_peso, 0)::float as total_peso,
                        COALESCE(c.total_cubo, c.cubagem_rodoviario, 0)::float as total_cubo,
                        GREATEST(COALESCE(c.total_peso, 0), COALESCE(c.total_cubo, 0))::float as total_taxado,
                        CASE 
                            WHEN c.metragem_cubica > 0 AND c.metragem_cubica <= 120 THEN c.metragem_cubica::float
                            WHEN COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) > 0 AND (COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) / 250.0) <= 120 THEN (COALESCE(c.total_cubo, c.cubagem_rodoviario, 0) / 250.0)::float
                            ELSE 0
                        END as volume_m3,
                        GREATEST(COALESCE(c.total_nf_valor, 0), COALESCE(c.valor_total_notas, 0))::float as total_nf_valor,
                        COALESCE(c.coleta_custo, 0)::float as coleta_custo,
                        COALESCE(u.Sigla, u.Unidade, 'COLETA') as origem_unidade
                    FROM (
                        SELECT DISTINCT ml.minuta
                        FROM manifesto_list ml
                        WHERE ml.id_manifesto = $1
                          AND ml.tipo = 2
                    ) ml_col
                    JOIN coleta c ON c.id_coleta = ml_col.minuta
                    LEFT JOIN fornecedores f ON f.id_local = c.id_cliente
                    LEFT JOIN unidades u ON u.id = c.id_unidade
                    ORDER BY c.total_peso DESC;
                `, [input.idManifesto])
            ]);

            // Verifica se alguma coleta não possui minutas geradas (ou possui peso na coleta maior que a soma das minutas geradas)
            const pesoMinutasPorColeta = new Map<string, { qtd: number; somaPeso: number; somaTaxado: number }>();
            for (const m of minutasQuery.rows) {
                if (m.id_coleta) {
                    const atual = pesoMinutasPorColeta.get(m.id_coleta) || { qtd: 0, somaPeso: 0, somaTaxado: 0 };
                    atual.qtd += 1;
                    atual.somaPeso += Number(m.total_peso) || 0;
                    atual.somaTaxado += Number(m.total_taxado) || 0;
                    pesoMinutasPorColeta.set(m.id_coleta, atual);
                }
            }

            const coletasComplementares: Array<Record<string, unknown>> = [];
            for (const c of coletasQuery.rows) {
                const statsMinutas = pesoMinutasPorColeta.get(c.id_coleta);
                const pesoColeta = Number(c.total_peso) || 0;
                if (!statsMinutas || statsMinutas.qtd === 0) {
                    // Coleta ainda sem minutas emitidas: exibe a Coleta diretamente com seu peso real
                    coletasComplementares.push({
                        id_minuta: `COL-${c.id_coleta}`,
                        id_coleta: c.id_coleta,
                        remetente_nome: c.remetente_nome,
                        tipo_registro: "COLETA",
                        total_volumes: Number(c.total_volumes) || 0,
                        total_peso: pesoColeta,
                        total_cubo: Number(c.total_cubo) || 0,
                        total_taxado: Math.max( Number(c.total_taxado) || 0, pesoColeta ),
                        volume_m3: Number(c.volume_m3) || 0,
                        volume_m3_original: Number(c.volume_m3) || 0,
                        anomalia_volume: false,
                        total_nf_valor: Number(c.total_nf_valor) || 0,
                        frete_total: 0,
                        coleta_custo: Number(c.coleta_custo) || 0,
                        entrega_custo: 0,
                        seguro: 0,
                        origem: c.remetente_nome || c.origem_unidade,
                        destino: c.origem_unidade || "Base",
                        chave: null,
                        cte_numero: `Coleta #${c.id_coleta}`,
                        total_manifestos: 1,
                        soma_todas_transf: 0,
                    });
                } else if (pesoColeta > statsMinutas.somaPeso + 0.5) {
                    // Coleta com minutas parciais (peso na coleta supera a soma das minutas emitidas)
                    const diffPeso = Number((pesoColeta - statsMinutas.somaPeso).toFixed(2));
                    coletasComplementares.push({
                        id_minuta: `COL-${c.id_coleta}`,
                        id_coleta: c.id_coleta,
                        remetente_nome: c.remetente_nome,
                        tipo_registro: "COLETA",
                        total_volumes: 0,
                        total_peso: diffPeso,
                        total_cubo: 0,
                        total_taxado: diffPeso,
                        volume_m3: 0,
                        volume_m3_original: 0,
                        anomalia_volume: false,
                        total_nf_valor: 0,
                        frete_total: 0,
                        coleta_custo: 0,
                        entrega_custo: 0,
                        seguro: 0,
                        origem: c.remetente_nome || c.origem_unidade,
                        destino: c.origem_unidade || "Base",
                        chave: null,
                        cte_numero: `Saldo Coleta #${c.id_coleta}`,
                        total_manifestos: 1,
                        soma_todas_transf: 0,
                    });
                }
            }

            const todosRegistros = [
                ...minutasQuery.rows.map(r => ({ ...r, tipo_registro: "MINUTA" })),
                ...coletasComplementares,
            ];

            const somaTaxadoManifesto = Math.max(
                todosRegistros.reduce((acc, m) => acc + (Number(m.total_taxado) || Number(m.total_peso) || 0), 0),
                1
            );

            return todosRegistros.map(m => {
                const freteTotal = Number(m.frete_total) || 0;
                const coletaCusto = Number(m.coleta_custo) || 0;
                const entregaCusto = Number(m.entrega_custo) || 0;
                const seguro = Number(m.seguro) || 0;
                const pesoTaxado = Number(m.total_taxado) || Number(m.total_peso) || 0;
                const totalManifestos = Math.max(Number(m.total_manifestos) || 1, 1);
                const somaTodasTransf = Number(m.soma_todas_transf) || 0;

                // 1. Custo de transferência DESTE manifesto (esta perna da viagem)
                const custoTransfTrecho = (pesoTaxado / somaTaxadoManifesto) * custoTotalManifesto;

                // 2. Lucro Real Global da Minuta (conforme cálculo exato do Brudam)
                const custoTotalOperacionalMinuta = somaTodasTransf + (m.id_coleta ? custoTransfTrecho : 0) + coletaCusto + entregaCusto + seguro;
                const impostoTotal = freteTotal * 0.0925;
                const lucroGlobalMinuta = freteTotal - custoTotalOperacionalMinuta - impostoTotal;
                const margemGlobalMinutaPct = freteTotal > 0 ? (lucroGlobalMinuta / freteTotal) * 100 : 0;

                // 3. Apropriação proporcional deste Trecho / Manifesto (Alinhado 100% à query da tabela principal)
                const freteRateadoTrecho = freteTotal / totalManifestos;
                const impostoTrecho = impostoTotal / totalManifestos;
                const seguroTrecho = seguro / totalManifestos;
                const coletaTrecho = coletaCusto / totalManifestos;
                const entregaTrecho = entregaCusto / totalManifestos;
                const custoPontasTrecho = seguroTrecho + coletaTrecho + entregaTrecho;
                const receitaLiquidaTrecho = freteRateadoTrecho - custoPontasTrecho - impostoTrecho;
                const resultadoLucroTrecho = receitaLiquidaTrecho - custoTransfTrecho;
                const custoOperacionalTrecho = custoTransfTrecho + custoPontasTrecho;

                return {
                    idMinuta: String(m.id_minuta),
                    idColeta: m.id_coleta ? String(m.id_coleta) : null,
                    remetenteColeta: m.remetente_nome ? String(m.remetente_nome) : null,
                    tipoRegistro: (m.tipo_registro as "MINUTA" | "COLETA") || "MINUTA",
                    volumes: Number(m.total_volumes) || 0,
                    pesoKg: Number(m.total_peso) || 0,
                    pesoCubadoKg: Number(m.total_cubo) || 0,
                    pesoTaxadoKg: pesoTaxado,
                    cuboM3: Number(m.volume_m3) || 0,
                    cuboM3Original: Number(m.volume_m3_original) || 0,
                    anomaliaVolume: Boolean(m.anomalia_volume),
                    valorNf: Number(m.total_nf_valor) || 0,
                    freteTotal,
                    freteRateado: freteRateadoTrecho,
                    receitaLiquida: receitaLiquidaTrecho,
                    custoTransf: custoTransfTrecho,
                    custoOperacionalTotal: custoOperacionalTrecho,
                    resultadoLucro: resultadoLucroTrecho,
                    coletaCusto: coletaTrecho,
                    entregaCusto: entregaTrecho,
                    seguro: seguroTrecho,
                    imposto: impostoTrecho,
                    // Dados consolidados da carga (padrão Brudam)
                    lucroGlobalMinuta,
                    margemGlobalMinutaPct,
                    somaTodasTransf,
                    totalManifestos,
                    origem: m.origem ? String(m.origem) : null,
                    destino: m.destino ? String(m.destino) : null,
                    chave: m.chave ? String(m.chave) : null,
                    cteNumero: m.cte_numero ? String(m.cte_numero) : null,
                };
            });
        }),
});
