/**
 * SEED OFICIAL — Torre de Transferência
 *
 * Contém:
 * 1. Todas as Bases cadastradas (com coordenadas GPS e raio de geocerca)
 * 2. Todos os Usuários cadastrados no sistema
 *
 * Para executar: npx tsx prisma/seed.ts
 * Ou via npm:    npm run db:seed (se configurado no package.json)
 *
 * ATENÇÃO: Use upsert para ser seguro re-executar sem duplicar dados.
 * Senhas dos usuários de teste ficam como "senha123" - alterar após primeiro acesso.
 */

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── 1. BASES ─────────────────────────────────────────────────────────────────
const BASES = [
    { id: "cmmz8tugi000aqsn0gd3g9gyn", nome: "TOLEDO",                    cidade: "TOLEDO",                    latitude: -24.7022195,  longitude: -53.7410334, raioMetros: 500 },
    { id: "cmmz8tufn0004qsn0upk5d2cc", nome: "MARINGA",                   cidade: "MARINGA",                   latitude: -23.4504492,  longitude: -51.9891713, raioMetros: 500 },
    { id: "cmmz8tuhk000hqsn0pl7u1tyh", nome: "LONDRINA",                  cidade: "LONDRINA",                  latitude: -23.2984452,  longitude: -51.2193788, raioMetros: 500 },
    { id: "cmmz8tul20018qsn0a5h3dxbk", nome: "SAO PAULO",                 cidade: "SAO PAULO",                 latitude: -23.5150196,  longitude: -46.657303,  raioMetros: 500 },
    { id: "cmmz8tuld001bqsn0htptmmgq", nome: "REGISTRO",                  cidade: "REGISTRO",                  latitude: -24.4971527,  longitude: -47.8398161, raioMetros: 500 },
    { id: "cmmz8tuot0022qsn0sw23risz", nome: "MEDIANEIRA",                cidade: "MEDIANEIRA",                latitude: -25.2806223,  longitude: -54.0805466, raioMetros: 500 },
    { id: "cmmz8tuql002cqsn02xdygure", nome: "MARECHAL CANDIDO RONDON",   cidade: "MARECHAL CANDIDO RONDON",   latitude: -24.5566,     longitude: -54.0534,    raioMetros: 500 },
    { id: "cmmz8tuvj003hqsn0fqdw9bmg", nome: "TUBARAO",                   cidade: "TUBARAO",                   latitude: -28.4773,     longitude: -49.0095,    raioMetros: 500 },
    { id: "cmmz8tuwn003rqsn07zdml2ym", nome: "SAO MATEUS",                cidade: "SAO MATEUS",                latitude: -18.7148,     longitude: -39.8585,    raioMetros: 500 },
    { id: "cmmz8tuww003uqsn0m4g384ic", nome: "UNIAO DA VITORIA",          cidade: "UNIAO DA VITORIA",          latitude: -26.2283,     longitude: -51.087,     raioMetros: 500 },
    { id: "cmmz8tuzm004hqsn0epqnmdhr", nome: "UMUARAMA",                  cidade: "UMUARAMA",                  latitude: -23.7661371,  longitude: -53.3148351, raioMetros: 500 },
    { id: "cmmz8tv6e0067qsn0ds9ml63l", nome: "TELEMACO BORBA",            cidade: "TELEMACO BORBA",            latitude: -24.3351384,  longitude: -50.6251143, raioMetros: 500 },
    { id: "cmmz8tvdt006zqsn0lv5yqqkg", nome: "PORTO ALEGRE",              cidade: "PORTO ALEGRE",              latitude: -30.0331,     longitude: -51.23,      raioMetros: 500 },
    { id: "cmmz8tvju007dqsn0srnrb4w6", nome: "JOINVILLE",                 cidade: "JOINVILLE",                 latitude: -26.3711873,  longitude: -48.8544886, raioMetros: 500 },
    { id: "cmmz8tvpi0081qsn07zr0759q", nome: "PALMEIRA",                  cidade: "PALMEIRA",                  latitude: -25.43,       longitude: -50.0028,    raioMetros: 500 },
    { id: "cmmz8tvqj0087qsn0meh9milz", nome: "PRUDENTOPOLIS",             cidade: "PRUDENTOPOLIS",             latitude: -25.2127,     longitude: -51.1315,    raioMetros: 500 },
    { id: "cmmz8twai00c2qsn0xraie2ro", nome: "RIO DO SUL",                cidade: "RIO DO SUL",                latitude: -27.2144,     longitude: -49.644,     raioMetros: 500 },
    { id: "cmmz8twaz00c5qsn0xkq35tj4", nome: "LAGES",                     cidade: "LAGES",                     latitude: -27.8159,     longitude: -50.3265,    raioMetros: 500 },
    { id: "cmmz8twm100eiqsn0oepvznow", nome: "PRESIDENTE PRUDENTE",       cidade: "PRESIDENTE PRUDENTE",       latitude: -22.1256,     longitude: -51.3889,    raioMetros: 500 },
    { id: "cmmz8twn800esqsn0vjxlcxqy", nome: "SAO JOSE DO RIO PRETO",     cidade: "SAO JOSE DO RIO PRETO",     latitude: -20.8113,     longitude: -49.3758,    raioMetros: 500 },
    { id: "cmmz8twsr00g7qsn0qb1dvgzk", nome: "PARANAVAI",                 cidade: "PARANAVAI",                 latitude: -23.0747,     longitude: -52.4633,    raioMetros: 500 },
    { id: "cmmz8twwj00h5qsn01e4kxcw7", nome: "SAO MATEUS DO SUL",         cidade: "SAO MATEUS DO SUL",         latitude: -25.8718,     longitude: -50.3947,    raioMetros: 500 },
    { id: "cmmz8tw6d00b4qsn06oq87o8x", nome: "PATO BRANCO",               cidade: "PATO BRANCO",               latitude: -26.2306,     longitude: -52.6697,    raioMetros: 500 },
    { id: "cmmz8tx8a00jkqsn0rncm9hdb", nome: "PONTA GROSSA",              cidade: "PONTA GROSSA",              latitude: -25.0702625,  longitude: -50.1616513, raioMetros: 500 },
    { id: "cmmz8txd200kuqsn0d37adi6c", nome: "RIBEIRAO PRETO",            cidade: "RIBEIRAO PRETO",            latitude: -21.1775,     longitude: -47.8103,    raioMetros: 500 },
    { id: "cmmz8txj300m9qsn0kkq7oc4e", nome: "MANGUEIRINHA",              cidade: "MANGUEIRINHA",              latitude: -25.9419,     longitude: -52.1792,    raioMetros: 500 },
    { id: "cmmz8txje00mcqsn0ddjaijg1", nome: "PALMAS",                    cidade: "PALMAS",                    latitude: -26.4822,     longitude: -51.9884,    raioMetros: 500 },
    { id: "cmmz8txng00n6qsn0gff7pv2r", nome: "PALOTINA",                  cidade: "PALOTINA",                  latitude: -24.2862,     longitude: -53.8395,    raioMetros: 500 },
    { id: "cmmz8txny00n9qsn0p667mmjs", nome: "TERRA ROXA",                cidade: "TERRA ROXA",                latitude: -24.1574,     longitude: -54.1254,    raioMetros: 500 },
    { id: "cmmxra1uo002lqsyc7ek3byv7", nome: "SUMARE",                    cidade: "SUMARE",                    latitude: -22.8214,     longitude: -47.2671,    raioMetros: 500 },
    // Bases que podem não ter coordenadas ainda — upsert seguro:
    { id: "cmmz8tuk90011qsn0xwr7jmot", nome: "CURITIBA",                  cidade: "CURITIBA",                  latitude: -25.4244,     longitude: -49.2654,    raioMetros: 500 },
    { id: "cmmz8tuke0013qsn0v0agzjub", nome: "GUARAPUAVA",                cidade: "GUARAPUAVA",                latitude: -25.3904,     longitude: -51.4578,    raioMetros: 500 },
    { id: "cmmz8tukk0015qsn07j3bxbll", nome: "CASCAVEL",                  cidade: "CASCAVEL",                  latitude: -24.9578,     longitude: -53.4595,    raioMetros: 500 },
    { id: "cmmz8tukn0016qsn08k8l5l2o", nome: "FRANCISCO BELTRAO",         cidade: "FRANCISCO BELTRAO",         latitude: -26.0779,     longitude: -53.0556,    raioMetros: 500 },
    { id: "cmmz8tul00017qsn0qxf0sqeh", nome: "ITAJAI",                    cidade: "ITAJAI",                    latitude: -26.9078,     longitude: -48.6625,    raioMetros: 500 },
    { id: "cmmz8tulh001eqsn0fwgm0ckj", nome: "CAMPINAS",                  cidade: "CAMPINAS",                  latitude: -22.9056,     longitude: -47.0608,    raioMetros: 500 },
    { id: "cmmz8tump001rqsn0wqh9gv3q", nome: "APUCARANA",                 cidade: "APUCARANA",                 latitude: -23.5504,     longitude: -51.461,     raioMetros: 500 },
    { id: "cmmz8tun8001yqsn0z88oqwbt", nome: "CAMPO MOURAO",              cidade: "CAMPO MOURAO",              latitude: -24.046,      longitude: -52.3784,    raioMetros: 500 },
    { id: "cmmz8tunr0021qsn0qh3abf7g", nome: "IRATI",                     cidade: "IRATI",                     latitude: -25.4675,     longitude: -50.6505,    raioMetros: 500 },
    { id: "cmmz8tuo40026qsn011c8p8ke", nome: "DOIS VIZINHOS",             cidade: "DOIS VIZINHOS",             latitude: -25.7516,     longitude: -53.0527,    raioMetros: 500 },
    { id: "cmmz8tuom0029qsn0gkrdyp8m", nome: "CHOPINZINHO",               cidade: "CHOPINZINHO",               latitude: -25.856,      longitude: -52.5226,    raioMetros: 500 },
    { id: "cmmz8tuos002bqsn0yxkm374w", nome: "CANDOI",                    cidade: "CANDOI",                    latitude: -25.5703,     longitude: -52.0206,    raioMetros: 500 },
    { id: "cmmz8tuow002eqsn0xtlbkvzx", nome: "IBEMA",                     cidade: "IBEMA",                     latitude: -25.099,      longitude: -53.0087,    raioMetros: 500 },
    { id: "cmmz8tuoz002hqsn0oq0i2zqd", nome: "ASSIS CHATEAUBRIAND",       cidade: "ASSIS CHATEAUBRIAND",       latitude: -24.4156,     longitude: -53.5134,    raioMetros: 500 },
    { id: "cmmz8tup3002kqsn0nnz7rclu", nome: "CASTRO",                    cidade: "CASTRO",                    latitude: -24.7914,     longitude: -50.0122,    raioMetros: 500 },
];

// ─── 2. USUÁRIOS ──────────────────────────────────────────────────────────────
// IMPORTANTE: No seed, reiniciamos as senhas para um padrão seguro.
// Usuários que possuem senha real no banco não são afetados (update: {} não sobrescreve senhaHash).
async function main() {
    console.log("🌱 Iniciando seed da Torre de Transferência...\n");

    // ── Bases ──
    console.log(`📍 Inserindo ${BASES.length} bases...`);
    for (const base of BASES) {
        await prisma.base.upsert({
            where: { nome: base.nome },
            update: {
                cidade: base.cidade,
                latitude: base.latitude,
                longitude: base.longitude,
                raioMetros: base.raioMetros,
            },
            create: {
                nome: base.nome,
                cidade: base.cidade,
                latitude: base.latitude,
                longitude: base.longitude,
                raioMetros: base.raioMetros,
            },
        });
    }
    console.log(`✅ ${BASES.length} bases inseridas/atualizadas.\n`);

    // ── Usuários ──
    const senhaAdmin = await bcrypt.hash("Princesa@2025", 10);
    const senhaOperador = await bcrypt.hash("operador123", 10);
    const senhaGerente = await bcrypt.hash("gerente123", 10);

    const USUARIOS = [
        // ── Usuários Reais do Sistema ──
        {
            id: "cmmxjtv0k0000qs2k8rd94gcc",
            name: "Administrador do Sistema",
            email: "admin@sistema.local",
            role: "ADMIN" as const,
            baseId: null,
            senhaHash: senhaAdmin,
        },
        {
            id: "cmn8vhf5t36eyqs5c4vks51s9",
            name: "William Kutz",
            email: "william.kutz@princesadoscampos.com.br",
            role: "ADMIN" as const,
            baseId: null,
            senhaHash: senhaAdmin,
        },
        {
            id: "cmn8w7msm069eqs5k4kb4u1cy",
            name: "Weslen Rian",
            email: "weslen.silva@princesadoscampos.com.br",
            role: "ADMIN" as const,
            baseId: null,
            senhaHash: senhaAdmin,
        },
        // ── Usuários de Teste ──
        {
            id: "cmmxjtv1e0002qs2kcsvu23s4",
            name: "Operador Curitiba",
            email: "operador.cwb@sistema.local",
            role: "OPERADOR" as const,
            baseId: "cmmz8tuk90011qsn0xwr7jmot", // CURITIBA
            senhaHash: senhaOperador,
        },
        {
            id: "cmn7uhryf6xwaqs5k61uu7s2k",
            name: "Operador Ponta Grossa",
            email: "operador@sistema.com",
            role: "OPERADOR" as const,
            baseId: "cmmz8tx8a00jkqsn0rncm9hdb", // PONTA GROSSA
            senhaHash: senhaOperador,
        },
        {
            id: "cmn7uifn06xwcqs5k7pyqvr4c",
            name: "Gerente Ponta Grossa",
            email: "gerente@sistema.com",
            role: "GERENTE" as const,
            baseId: "cmmz8tx8a00jkqsn0rncm9hdb", // PONTA GROSSA
            senhaHash: senhaGerente,
        },
    ];

    console.log(`👤 Inserindo ${USUARIOS.length} usuários...`);
    for (const u of USUARIOS) {
        await prisma.user.upsert({
            where: { id: u.id },
            update: {
                name: u.name,
                role: u.role,
                baseId: u.baseId,
                // Não sobrescreve senhaHash de usuários já existentes em produção
            },
            create: {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                baseId: u.baseId,
                senhaHash: u.senhaHash,
            },
        });
    }
    console.log(`✅ ${USUARIOS.length} usuários inseridos/atualizados.\n`);

    console.log("🎉 Seed concluído com sucesso!");
    console.log("\n📋 Credenciais padrão:");
    console.log("   ADMINs: william.kutz@... / weslen.silva@... / admin@sistema.local → Princesa@2025");
    console.log("   OPERADOR: operador.cwb@sistema.local / operador@sistema.com → operador123");
    console.log("   GERENTE:  gerente@sistema.com → gerente123");
}

main()
    .then(async () => { await prisma.$disconnect(); })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
