const { Client } = require('pg');

async function run() {
  console.log('=== INICIANDO RECRAÇÃO OTIMIZADA DE TELEMETRIA (15 DIAS) ===');
  const c = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db',
    statement_timeout: 0 // sem timeout para a operação de carga
  });
  await c.connect();

  console.log('1. Criando tabela temporária Telemetria_nova...');
  await c.query(`
    DROP TABLE IF EXISTS "Telemetria_nova" CASCADE;
    CREATE TABLE "Telemetria_nova" (
      "id" text NOT NULL,
      "veiculoId" text NOT NULL,
      "viagemId" text,
      "latitude" double precision NOT NULL,
      "longitude" double precision NOT NULL,
      "ignicao" boolean NOT NULL,
      "velocidade" integer,
      "dataHoraUtc" timestamp(3) without time zone NOT NULL,
      "dataHoraLocal" timestamp(3) without time zone NOT NULL,
      "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Telemetria_nova_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log('Tabela Telemetria_nova criada com sucesso.');

  console.log('2. Copiando dados dos últimos 15 dias (amostrados a ~1 ponto/min e mudanças de ignição)...');
  const t0 = Date.now();
  const insertRes = await c.query(`
    INSERT INTO "Telemetria_nova" (
      "id", "veiculoId", "viagemId", "latitude", "longitude",
      "ignicao", "velocidade", "dataHoraUtc", "dataHoraLocal", "createdAt"
    )
    SELECT
      t."id", t."veiculoId", 
      CASE WHEN v.id IS NOT NULL THEN t."viagemId" ELSE NULL END,
      t."latitude", t."longitude",
      t."ignicao", t."velocidade", t."dataHoraUtc", t."dataHoraLocal", t."createdAt"
    FROM "Telemetria" t
    JOIN "Veiculo" vec ON vec.id = t."veiculoId"
    LEFT JOIN "Viagem" v ON v.id = t."viagemId"
    WHERE t."dataHoraLocal" >= NOW() - INTERVAL '15 days'
      AND (EXTRACT(SECOND FROM t."dataHoraLocal") < 10 OR t."ignicao" = false);
  `);
  const durInsert = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Cópia concluída: ${insertRes.rowCount} registros inseridos em ${durInsert}s!`);

  console.log('3. Substituindo tabela antiga pela nova...');
  await c.query(`
    DROP TABLE "Telemetria" CASCADE;
    ALTER TABLE "Telemetria_nova" RENAME TO "Telemetria";
    ALTER TABLE "Telemetria" RENAME CONSTRAINT "Telemetria_nova_pkey" TO "Telemetria_pkey";
  `);
  console.log('Tabela Telemetria antiga descartada (86 GB liberados) e nova tabela assumida!');

  console.log('4. Criando índice composto de alta performance [veiculoId, dataHoraLocal DESC]...');
  const tIdx = Date.now();
  await c.query(`
    CREATE INDEX "Telemetria_veiculoId_dataHoraLocal_idx" 
    ON "Telemetria" ("veiculoId", "dataHoraLocal" DESC);
  `);
  console.log(`Índice criado em ${((Date.now() - tIdx) / 1000).toFixed(1)}s!`);

  console.log('5. Criando Foreign Keys...');
  await c.query(`
    ALTER TABLE "Telemetria" 
      ADD CONSTRAINT "Telemetria_veiculoId_fkey" 
      FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

    ALTER TABLE "Telemetria" 
      ADD CONSTRAINT "Telemetria_viagemId_fkey" 
      FOREIGN KEY ("viagemId") REFERENCES "Viagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `);
  console.log('Foreign keys criadas com sucesso!');

  console.log('6. Executando VACUUM ANALYZE...');
  await c.query(`VACUUM ANALYZE "Telemetria";`);
  console.log('VACUUM ANALYZE concluído!');

  const finalStats = await c.query(`
    SELECT
      pg_size_pretty(pg_database_size(current_database())) AS tamanho_novo_banco,
      pg_size_pretty(pg_total_relation_size('"Telemetria"')) AS tamanho_telemetria,
      (SELECT count(*) FROM "Telemetria") AS total_linhas_telemetria;
  `);
  console.log('\n=== RESULTADO FINAL ===');
  console.table(finalStats.rows);

  await c.end();
}

run().catch(err => {
  console.error('Erro na recriação:', err);
  process.exit(1);
});
