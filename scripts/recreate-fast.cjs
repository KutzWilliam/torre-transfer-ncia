const { Client } = require('pg');

async function run() {
  console.log('=== INICIANDO OTIMIZAÇÃO E RECRAÇÃO DA TELEMETRIA (15 DIAS) ===');
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://admin:1234@localhost:5433/transferencias_db',
    statement_timeout: 0
  });

  await client.connect();
  console.log('✓ Conectado ao PostgreSQL!');

  // Otimização de memória para esta sessão
  await client.query(`SET maintenance_work_mem = '1GB';`);
  await client.query(`SET work_mem = '256MB';`);

  console.log('1. Criando índice BRIN em dataHoraLocal para acelerar a leitura dos últimos 15 dias...');
  const tBrin = Date.now();
  await client.query(`
    CREATE INDEX IF NOT EXISTS "Telemetria_dataHoraLocal_brin_idx" 
    ON "Telemetria" USING brin ("dataHoraLocal");
  `);
  console.log(`✓ Índice BRIN criado em ${((Date.now() - tBrin) / 1000).toFixed(1)}s!`);

  console.log('2. Criando tabela limpa Telemetria_nova (sem índices ainda, para máxima velocidade de INSERT)...');
  await client.query(`DROP TABLE IF EXISTS "Telemetria_nova" CASCADE;`);
  await client.query(`
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
      "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✓ Tabela Telemetria_nova criada.');

  console.log('3. Copiando telemetrias dos últimos 15 dias (amostragem inteligente: ignição desligada ou ponto inicial do minuto)...');
  const tInsert = Date.now();
  const insertRes = await client.query(`
    INSERT INTO "Telemetria_nova" (
      "id", "veiculoId", "viagemId", "latitude", "longitude",
      "ignicao", "velocidade", "dataHoraUtc", "dataHoraLocal", "createdAt"
    )
    SELECT
      t."id", t."veiculoId", t."viagemId", t."latitude", t."longitude",
      t."ignicao", t."velocidade", t."dataHoraUtc", t."dataHoraLocal", t."createdAt"
    FROM "Telemetria" t
    WHERE t."dataHoraLocal" >= NOW() - INTERVAL '15 days'
      AND (EXTRACT(SECOND FROM t."dataHoraLocal") < 10 OR t."ignicao" = false);
  `);
  console.log(`✓ Cópia concluída: ${insertRes.rowCount} registros inseridos em ${((Date.now() - tInsert) / 1000).toFixed(1)}s!`);

  console.log('4. Substituindo tabela antiga de 86 GB pela nova tabela de 15 dias...');
  await client.query(`DROP TABLE "Telemetria" CASCADE;`);
  await client.query(`ALTER TABLE "Telemetria_nova" RENAME TO "Telemetria";`);
  console.log('✓ Tabela antiga descartada e nova tabela ativada!');

  console.log('5. Criando Primary Key...');
  const tPk = Date.now();
  await client.query(`ALTER TABLE "Telemetria" ADD CONSTRAINT "Telemetria_pkey" PRIMARY KEY ("id");`);
  console.log(`✓ Chave primária criada em ${((Date.now() - tPk) / 1000).toFixed(1)}s!`);

  console.log('6. Criando índice composto de alta performance [veiculoId, dataHoraLocal DESC]...');
  const tIdx = Date.now();
  await client.query(`
    CREATE INDEX "Telemetria_veiculoId_dataHoraLocal_idx" 
    ON "Telemetria" ("veiculoId", "dataHoraLocal" DESC);
  `);
  console.log(`✓ Índice composto criado em ${((Date.now() - tIdx) / 1000).toFixed(1)}s!`);

  console.log('7. Criando Foreign Keys (Veiculo e Viagem)...');
  await client.query(`
    -- Limpa viagemId órfão se houver algum
    UPDATE "Telemetria" t
    SET "viagemId" = NULL
    WHERE "viagemId" IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM "Viagem" v WHERE v.id = t."viagemId");

    ALTER TABLE "Telemetria" 
      ADD CONSTRAINT "Telemetria_veiculoId_fkey" 
      FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

    ALTER TABLE "Telemetria" 
      ADD CONSTRAINT "Telemetria_viagemId_fkey" 
      FOREIGN KEY ("viagemId") REFERENCES "Viagem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `);
  console.log('✓ Foreign keys restabelecidas!');

  console.log('8. Executando VACUUM ANALYZE...');
  await client.query(`VACUUM ANALYZE "Telemetria";`);
  console.log('✓ VACUUM ANALYZE concluído!');

  console.log('9. Executando CHECKPOINT para sincronizar com o disco...');
  await client.query(`CHECKPOINT;`);
  console.log('✓ CHECKPOINT concluído!');

  const finalStats = await client.query(`
    SELECT
      pg_size_pretty(pg_database_size(current_database())) AS tamanho_novo_banco,
      pg_size_pretty(pg_total_relation_size('"Telemetria"')) AS tamanho_telemetria,
      (SELECT count(*) FROM "Telemetria") AS total_linhas_telemetria;
  `);
  console.log('\n=== RESULTADO FINAL ===');
  console.table(finalStats.rows);

  await client.end();
}

run().catch(err => {
  console.error('❌ Erro no processo:', err);
  process.exit(1);
});
