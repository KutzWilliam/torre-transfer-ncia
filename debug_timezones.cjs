const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();

async function checkDates() {
    const viagens = await prisma.viagem.findMany({
        where: { id: "37696752" }
    });
    
    for (const v of viagens) {
        console.log("Trip ID:", v.id);
        console.log("prevInicioReal String:", v.prevInicioReal.toString());
        console.log("prevInicioReal ISO:", v.prevInicioReal.toISOString());
        console.log("dataInicioEfetivo ISO:", v.dataInicioEfetivo ? v.dataInicioEfetivo.toISOString() : "null");
        console.log("dataFimEfetivo ISO:", v.dataFimEfetivo ? v.dataFimEfetivo.toISOString() : "null");
        
        let atrasoSaidaMinutos = null;
        if (v.dataInicioEfetivo) {
            atrasoSaidaMinutos = Math.round(
                (v.dataInicioEfetivo.getTime() - v.prevInicioReal.getTime()) / 60000
            );
        }
        console.log("Calculated Atraso Saida (backend logic):", atrasoSaidaMinutos);
    }
}
checkDates().finally(() => prisma.$disconnect());
