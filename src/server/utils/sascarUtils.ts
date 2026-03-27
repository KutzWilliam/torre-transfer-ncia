import { Client } from 'pg';

let sascarPlacasCache: Set<string> | null = null;

export async function getPlacaAtivaSascar(placaProg: string, placaMob: string, reboque: string): Promise<string> {
    if (!process.env.TELEMETRIA_DB_URL) {
        console.warn("TELEMETRIA_DB_URL não configurado, ignora checagem Sascar.");
        return placaProg || placaMob;
    }

    if (!sascarPlacasCache) {
        try {
            const client = new Client({ connectionString: process.env.TELEMETRIA_DB_URL });
            await client.connect();
            const res = await client.query('SELECT "placa" FROM veiculos_sascar WHERE "placa" IS NOT NULL');
            sascarPlacasCache = new Set(
                res.rows.map(r => String(r.placa).replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7))
            );
            await client.end();
        } catch (e) {
            console.error("Erro ao conectar no banco da Sascar para cache de placas:", e);
            return placaProg || placaMob;
        }
    }

    const p1 = placaProg.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
    const p2 = placaMob.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
    const p3 = reboque.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);

    // Ordem de prioridade definida na regra de negócio: Mobile > Cavalo > Reboque
    if (p2 && sascarPlacasCache.has(p2)) return p2;
    if (p1 && sascarPlacasCache.has(p1)) return p1;
    if (p3 && sascarPlacasCache.has(p3)) return p3;

    // Se nenhum existir, retorna a Placa Mobile como fallback principal, ou Programação se não houver
    return p2 || p1 || "SEMPLACA";
}
