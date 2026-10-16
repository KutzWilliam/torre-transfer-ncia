const { Client } = require('pg');
(async () => {
  const c = new Client('postgresql://admin:1234@localhost:5433/transferencias_db');
  await c.connect();

  console.log('Verificando veículos 2101636 e 2327605...');
  const v = await c.query('SELECT id, placa FROM "Veiculo" WHERE id IN (\'2101636\', \'2327605\') OR placa = \'SED4G31\';');
  console.table(v.rows);

  const tCount = await c.query('SELECT count(*) FROM "Telemetria" WHERE "veiculoId" = \'2101636\';');
  console.log('Telemetrias com 2101636:', tCount.rows[0].count);

  console.log('Migrando com segurança...');
  await c.query(`
    BEGIN;
    -- Garante que 2327605 existe
    INSERT INTO "Veiculo" ("id", "placa", "descricao", "createdAt", "updatedAt")
    VALUES ('2327605', 'SED4G31', 'Importado Sascar', NOW(), NOW())
    ON CONFLICT ("id") DO UPDATE SET "placa" = 'SED4G31', "updatedAt" = NOW();

    -- Atualiza Viagem
    UPDATE "Viagem" SET "veiculoId" = '2327605' WHERE "veiculoId" = '2101636';

    -- Atualiza Telemetria
    UPDATE "Telemetria" SET "veiculoId" = '2327605' WHERE "veiculoId" = '2101636';

    -- Deleta o antigo se ainda existir
    DELETE FROM "Veiculo" WHERE "id" = '2101636';
    COMMIT;
  `);

  console.log('Migração do veículo concluída com sucesso!');
  await c.end();
})();
