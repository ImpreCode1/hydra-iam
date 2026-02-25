/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1️⃣ Roles base
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      description: 'Administrador de Hydra',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: {
      name: 'USER',
      description: 'Usuario estándar',
    },
  });

  console.log('✅ Roles verificados');

  // 2️⃣ Admin inicial
  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (!adminEmail) {
    console.log('⚠ SEED_ADMIN_EMAIL no está definido en .env');
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!user) {
    console.log(`⚠ Usuario ${adminEmail} aún no existe`);
    return;
  }

  const existing = await prisma.userRole.findFirst({
    where: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  if (!existing) {
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
      },
    });

    console.log('👑 Rol ADMIN asignado correctamente');
  } else {
    console.log('ℹ Usuario ya tiene rol ADMIN');
  }

  console.log('🌱 Seed finalizado correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
