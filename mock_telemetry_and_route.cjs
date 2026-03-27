const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

async function mock() {
  const nomeRota = "CURITIBA X PONTA GROSSA X GUARAPUAVA X CASCAVEL";
  console.log("Criando matriz:", nomeRota);

  // 1. Setup RotaPadrao
  const rotaPadrao = await prisma.rotaPadrao.upsert({
      where: { nome: nomeRota },
      update: {},
      create: { nome: nomeRota }
  });

  const cidades = [
    { nome: "CURITIBA", lat: -25.4284, lng: -49.2733 },
    { nome: "PONTA GROSSA", lat: -25.0945, lng: -50.1634 },
    { nome: "GUARAPUAVA", lat: -25.3953, lng: -51.4581 },
    { nome: "CASCAVEL", lat: -24.9573, lng: -53.4590 },
  ];

  await prisma.paradaPadrao.deleteMany({ where: { rotaId: rotaPadrao.id } });

  for (let i = 0; i < cidades.length; i++) {
    const cid = cidades[i];
    const base = await prisma.base.upsert({
      where: { nome: cid.nome },
      update: { latitude: cid.lat, longitude: cid.lng, raioMetros: 5000 }, // Geocerca grande para garantir mock
      create: { nome: cid.nome, cidade: cid.nome, latitude: cid.lat, longitude: cid.lng, raioMetros: 5000 }
    });

    await prisma.paradaPadrao.create({
      data: {
          rotaId: rotaPadrao.id,
          baseId: base.id,
          ordem: i,
          prevChegada: i > 0 ? `0${i}:00:00` : null,
          prevSaida: i < cidades.length - 1 ? `0${i}:30:00` : null
      }
    });
  }

  // 2. Link viagem 37668249
  const viagem = await prisma.viagem.findUnique({ where: { id: "37668249" }});
  if (!viagem) return console.log("Viagem 37668249 não existe.");

  await prisma.viagem.update({
    where: { id: viagem.id },
    data: { rotaPadraoId: rotaPadrao.id }
  });

  await prisma.paradaViagem.deleteMany({ where: { viagemId: viagem.id } });

  const rotaCompleta = await prisma.rotaPadrao.findUnique({
    where: { id: rotaPadrao.id },
    include: { paradas: { orderBy: { ordem: 'asc' } } }
  });

  let dataReferencia = new Date();
  dataReferencia.setHours(0,0,0,0);

  for (const parada of rotaCompleta.paradas) {
    let cheg = new Date(dataReferencia);
    cheg.setHours(parada.ordem, 0, 0);

    let sai = new Date(dataReferencia);
    sai.setHours(parada.ordem, 30, 0);

    await prisma.paradaViagem.create({
        data: {
            viagemId: viagem.id, 
            baseId: parada.baseId, 
            ordem: parada.ordem,
            prevChegada: parada.ordem > 0 ? cheg : null, 
            prevSaida: sai
        }
    });
  }

  // 3. Mock Telemetry for ATB5H78
  // Temos veiculoId 'temp_ATB5H78' de acordo com a ultima inspeção
  await prisma.telemetria.deleteMany({ where: { veiculoId: viagem.veiculoId } });

  const now = new Date();
  const rawTelemetrias = [
    // Curitiba
    { lat: -25.4284, lng: -49.2733, offset: -180 }, 
    // Indo para Ponta Grossa
    { lat: -25.2, lng: -49.7, offset: -150 },
    // Chegando em Ponta Grossa
    { lat: -25.0945, lng: -50.1634, offset: -120 },
    // Saindo de Ponta Grossa (ainda dentro da cerca)
    { lat: -25.0945, lng: -50.1634, offset: -110 },
  ];

  for (const t of rawTelemetrias) {
    const dataMock = new Date(now.getTime() + t.offset * 60000);
    await prisma.telemetria.create({
      data: {
        veiculoId: viagem.veiculoId,
        viagemId: viagem.id,
        latitude: t.lat,
        longitude: t.lng,
        ignicao: true,
        velocidade: 80,
        dataHoraUtc: dataMock,
        dataHoraLocal: dataMock
      }
    });
  }

  console.log("Matriz criada, Viagem ligada, Bases atualizadas (MOCK INJECTED).");
  await prisma.$disconnect();
}

mock().catch(console.error);
