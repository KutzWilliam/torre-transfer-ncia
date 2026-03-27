const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();

const normalizeString = (str) => {
    if (!str) return "";
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
};

async function deduplicateBases() {
  const bases = await prisma.base.findMany();
  
  // Agrupar bases pelo nome normalizado
  const grouped = {};
  for (const base of bases) {
    const norm = normalizeString(base.nome);
    if (!grouped[norm]) grouped[norm] = [];
    grouped[norm].push(base);
  }

  let mergedCount = 0;

  for (const norm in grouped) {
    const group = grouped[norm];
    if (group.length > 1) {
      // Ordenar para manter a mais antiga ou a que tem geolocalização (latitude)
      group.sort((a, b) => {
        if (a.latitude && !b.latitude) return -1;
        if (!a.latitude && b.latitude) return 1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

      const master = group[0];
      const duplicates = group.slice(1);

      console.log(`\nNormalizing ${norm}. Master: ${master.id} (${master.nome}). Duplicates: ${duplicates.length}`);

      for (const dup of duplicates) {
        // Redirecionar todas as relações de dup para master
        await prisma.user.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.viagem.updateMany({ where: { baseOrigemId: dup.id }, data: { baseOrigemId: master.id }});
        await prisma.viagem.updateMany({ where: { baseDestinoId: dup.id }, data: { baseDestinoId: master.id }});
        await prisma.justificativaAtraso.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.paradaPadrao.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        await prisma.paradaViagem.updateMany({ where: { baseId: dup.id }, data: { baseId: master.id }});
        
        // Deletar o duplicado
        await prisma.base.delete({ where: { id: dup.id } });
        mergedCount++;
      }

      // Updating master name to normalized name
      if (master.nome !== norm) {
         await prisma.base.update({ where: { id: master.id }, data: { nome: norm } });
      }
    } else {
        // Just normalize the name
        const master = group[0];
        if (master.nome !== norm) {
            await prisma.base.update({ where: { id: master.id }, data: { nome: norm } });
        }
    }
  }

  console.log(`Deduplication finished. Removed ${mergedCount} duplicated bases.`);
  await prisma.$disconnect();
}

deduplicateBases().catch(console.error);
