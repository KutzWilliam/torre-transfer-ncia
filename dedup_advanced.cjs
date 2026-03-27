const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
};

const normalizeCityName = (str) => {
    if (!str) return "DESCONHECIDA";
    let norm = normalizeString(str);
    if (norm.includes("P GROSSA") || norm.includes("PONTO GROSSA")) return "PONTA GROSSA";
    if (norm.includes("MANGUERINHA")) return "MANGUEIRINHA";
    if (norm.includes("TERRA RO")) return "TERRA ROXA";
    
    if (norm === "P GROSSA") return "PONTA GROSSA";

    const regex = /^(?:EPC|BOTICARIO|WURTH.*?(?:-|MATRIZ))?[-\s]*([A-Z\s]+?)(?:-[A-Z]{2}(?:\s*-\s*\d+)?|$)/;
    const match = norm.match(regex);
    if (match && match[1]) {
        return match[1].trim();
    }
    return norm;
};

async function deduplicateAdvanced() {
  const bases = await prisma.base.findMany();
  const grouped = {};
  
  for (const base of bases) {
    const norm = normalizeCityName(base.nome);
    if (!grouped[norm]) grouped[norm] = [];
    grouped[norm].push(base);
  }

  let mergedCount = 0;

  for (const norm in grouped) {
    const group = grouped[norm];
    if (group.length > 1) {
      group.sort((a, b) => {
        // Preferred master: short pure names usually (like "CASCAVEL" instead of "EPC-CASCAVEL")
        if (a.nome.length < b.nome.length) return -1;
        if (a.nome.length > b.nome.length) return 1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

      const master = group[0];
      const duplicates = group.slice(1);

      console.log(`\nNormalizing to ${norm}. Master: ${master.id} (${master.nome}). Duplicatas: ${duplicates.length}`);

      for (const dup of duplicates) {
        console.log(`    Mergiando duplicada: ${dup.nome}`);
        await prisma.user.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.viagem.updateMany({ where: { baseOrigemId: dup.id }, data: { baseOrigemId: master.id }});
        await prisma.viagem.updateMany({ where: { baseDestinoId: dup.id }, data: { baseDestinoId: master.id }});
        await prisma.justificativaAtraso.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.paradaPadrao.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.paradaViagem.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        
        await prisma.base.delete({ where: { id: dup.id } });
        mergedCount++;
      }

      // Updating master to 100% clean name and valid city
      if (master.nome !== norm || master.cidade !== norm) {
         await prisma.base.update({ where: { id: master.id }, data: { nome: norm, cidade: norm } });
      }
    } else {
        const master = group[0];
        if (master.nome !== norm || master.cidade !== norm) {
            console.log(`Limpando Base única: ${master.nome} -> ${norm}`);
            await prisma.base.update({ where: { id: master.id }, data: { nome: norm, cidade: norm } });
        }
    }
  }

  console.log(`Deduplication avançada terminada. Removeu ${mergedCount} bases.`);
  await prisma.$disconnect();
}

deduplicateAdvanced().catch(console.error);
