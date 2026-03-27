import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs";
const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  // 1. Criar Bases Iniciais (baseadas nos seus ficheiros)
  const baseCuritiba = await prisma.base.upsert({
    where: { id: 'cl_base_cwb' },
    update: {},
    create: {
      id: 'cl_base_cwb',
      nome: 'EPC-CURITIBA-PR - 135',
      cidade: 'Curitiba',
    },
  })

  const baseGuarapuava = await prisma.base.upsert({
    where: { id: 'cl_base_gpb' },
    update: {},
    create: {
      id: 'cl_base_gpb',
      nome: 'EPC-GUARAPUAVA-PR - 117',
      cidade: 'Guarapuava',
    },
  })

// 2. Criar ou Atualizar Utilizador Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sistema.local' },
    update: {
      senhaHash: password,
    },
    create: {
      email: 'admin@sistema.local',
      name: 'Administrador do Sistema', // <-- Alterado aqui
      senhaHash: password,
      role: 'ADMIN',
    },
  })

  // 3. Criar ou Atualizar Utilizador Operador
  const operador = await prisma.user.upsert({
    where: { email: 'operador.cwb@sistema.local' },
    update: {
      senhaHash: password,
    },
    create: {
      email: 'operador.cwb@sistema.local',
      name: 'Operador Curitiba', // <-- Alterado aqui
      senhaHash: password,
      role: 'OPERADOR',
      baseId: baseCuritiba.id,
    },
  })

  console.log({ baseCuritiba, baseGuarapuava, admin, operador })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })