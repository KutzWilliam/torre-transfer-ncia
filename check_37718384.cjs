const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTrip() {
    try {
        const trip = await prisma.viagem.findUnique({
            where: { id: "37718384" },
            include: { veiculo: true }
        });
        
        console.log("Viagem encontrada:", JSON.stringify(trip, null, 2));
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        await prisma.$disconnect();
    }
}

checkTrip();
