import 'dotenv/config';
import { db } from './src/server/db';

async function main() {
    const viagem = await db.viagem.findUnique({
        where: { id: '37694012' }
    });
    console.log(`Viagem 37694012 => dataInicioEfetivo: ${viagem?.dataInicioEfetivo}`);
    process.exit(0);
}
main();
