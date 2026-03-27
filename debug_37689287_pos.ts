import 'dotenv/config';
import { db } from './src/server/db';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37689287' },
        include: { veiculo: true }
    });

    const telemetrias = await db.telemetria.findMany({
        where: { veiculoId: viagem?.veiculoId },
        orderBy: { dataHoraLocal: 'desc' },
        take: 5
    });

    console.log("Últimas 5 posições do veículo:", viagem?.veiculo.placa);
    telemetrias.forEach(t => {
        console.log(`- ${t.dataHoraLocal.toISOString()} | Lat: ${t.latitude}, Lng: ${t.longitude} | Ignição: ${t.ignicao} | Vel: ${t.velocidade} km/h`);
    });
    process.exit(0);
}
main().catch(console.error);
