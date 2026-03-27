const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

// Coordenadas do centro de cada cidade (obtidas do OpenStreetMap manualmente)
const coords = {
    'CURITIBA':              { lat: -25.4297,  lon: -49.2711 },
    'PONTA GROSSA':          { lat: -25.0945,  lon: -50.1616 },
    'GUARAPUAVA':            { lat: -25.3935,  lon: -51.4578 },
    'CASCAVEL':              { lat: -24.9578,  lon: -53.4596 },
    'FOZ DO IGUACU':         { lat: -25.5478,  lon: -54.5882 },
    'LONDRINA':              { lat: -23.3045,  lon: -51.1696 },
    'MARINGA':               { lat: -23.4273,  lon: -51.9375 },
    'APUCARANA':             { lat: -23.5508,  lon: -51.4610 },
    'TOLEDO':                { lat: -24.7254,  lon: -53.7414 },
    'MEDIANEIRA':            { lat: -25.2945,  lon: -54.0944 },
    'BLUMENAU':              { lat: -26.9195,  lon: -49.0661 },
    'JOINVILLE':             { lat: -26.3045,  lon: -48.8487 },
    'ITAJAI':                { lat: -26.9049,  lon: -48.6614 },
    'CHAPECO':               { lat: -27.1009,  lon: -52.6153 },
    'PORTO ALEGRE':          { lat: -30.0331,  lon: -51.2300 },
    'SAO PAULO':             { lat: -23.5505,  lon: -46.6333 },
    'CAMPINAS':              { lat: -22.9099,  lon: -47.0626 },
    'UMUARAMA':              { lat: -23.7661,  lon: -53.3250 },
    'CIANORTE':              { lat: -23.6613,  lon: -52.6034 },
    'CAMPO MOURAO':          { lat: -24.0448,  lon: -52.3793 },
    'FRANCISCO BELTRAO':     { lat: -26.0828,  lon: -53.0553 },
    'PATO BRANCO':           { lat: -26.2306,  lon: -52.6697 },
    'DOIS VIZINHOS':         { lat: -25.7546,  lon: -53.0596 },
    'PRUDENTOPOLIS':         { lat: -25.2127,  lon: -51.1315 },
    'IRATI':                 { lat: -25.4673,  lon: -50.6501 },
    'UNIAO DA VITORIA':      { lat: -26.2283,  lon: -51.0870 },
    'JAGUARIAIVA':           { lat: -24.2467,  lon: -49.7027 },
    'CASTRO':                { lat: -24.7913,  lon: -50.0088 },
    'TELEMACO BORBA':        { lat: -24.3259,  lon: -50.6161 },
    'IBAITI':                { lat: -23.8518,  lon: -50.1935 },
    'CORNELIO PROCOPIO':     { lat: -23.1762,  lon: -50.6487 },
    'PARANAVAI':             { lat: -23.0747,  lon: -52.4633 },
    'MARECHAL CANDIDO RONDON': { lat: -24.5566, lon: -54.0534 },
    'PALOTINA':              { lat: -24.2862,  lon: -53.8395 },
    'ASSIS CHATEAUBRIAND':   { lat: -24.4132,  lon: -53.5251 },
    'MANGUEIRINHA':          { lat: -25.9419,  lon: -52.1792 },
    'PALMAS':                { lat: -26.4822,  lon: -51.9884 },
    'PALMEIRA':              { lat: -25.4300,  lon: -50.0028 },
    'IBEMA':                 { lat: -25.0981,  lon: -52.9883 },
    'CANDOI':                { lat: -25.5856,  lon: -51.9792 },
    'CHOPINZINHO':           { lat: -25.8542,  lon: -52.5198 },
    'FLORIANOPOLIS':         { lat: -27.5954,  lon: -48.5480 },
    'CRICIUMA':              { lat: -28.6773,  lon: -49.3699 },
    'LAGES':                 { lat: -27.8159,  lon: -50.3265 },
    'RIO DO SUL':            { lat: -27.2144,  lon: -49.6440 },
    'JOACABA':               { lat: -27.1741,  lon: -51.5103 },
    'SAO MATEUS DO SUL':     { lat: -25.8718,  lon: -50.3947 },
    'TUBARAO':               { lat: -28.4773,  lon: -49.0095 },
    'COTIA':                 { lat: -23.6037,  lon: -46.9191 },
    'BIRIGUI':               { lat: -21.2883,  lon: -50.3394 },
    'PRESIDENTE PRUDENTE':   { lat: -22.1256,  lon: -51.3889 },
    'RIBEIRAO PRETO':        { lat: -21.1775,  lon: -47.8103 },
    'SAO JOSE DO RIO PRETO': { lat: -20.8113,  lon: -49.3758 },
    'FERNANDOPOLIS':         { lat: -20.2834,  lon: -50.2460 },
    'SAO MATEUS':            { lat: -18.7148,  lon: -39.8585 },
    'REGISTRO':              { lat: -24.4875,  lon: -47.8440 },
    'SUMARE':                { lat: -22.8214,  lon: -47.2671 },
    'PORTO ALEGRE':          { lat: -30.0331,  lon: -51.2300 },
    'PORTO ALEGRE':          { lat: -30.0331,  lon: -51.2300 },
    'CAMPINA GRANDE DO SUL': { lat: -25.3136,  lon: -49.0580 },
    'TERRA ROXA':            { lat: -24.1574,  lon: -54.1254 },
};

async function populate() {
    let updated = 0;
    for (const [nome, { lat, lon }] of Object.entries(coords)) {
        const base = await prisma.base.findUnique({ where: { nome } });
        if (!base) continue;
        if (base.latitude) continue; // skip se já tem

        await prisma.base.update({
            where: { nome },
            data: { latitude: lat, longitude: lon, raioMetros: base.raioMetros ?? 1500 }
        });
        updated++;
    }
    console.log(`✅ Atualizou ${updated} bases com coordenadas.`);
    await prisma.$disconnect();
}

populate().catch(console.error);
