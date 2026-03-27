import { Pool } from "pg";

// Usamos um Pool para manter conexões abertas e agilizar consultas frequentes
export const telemetriaDb = new Pool({
    connectionString: process.env.TELEMETRIA_DB_URL,
    // Configuramos um limite seguro para não sobrecarregar o banco da torre
    max: 10,
    idleTimeoutMillis: 30000,
});

// Teste rápido para ver se a conexão funciona
telemetriaDb.on('connect', () => {
    console.log('Conectado ao banco de telemetria da Torre com sucesso!');
});

telemetriaDb.on('error', (err) => {
    console.error('Erro no banco de telemetria:', err);
});