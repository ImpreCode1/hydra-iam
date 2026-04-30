/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '../src/generated/prisma/client';
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

  // =========================
  // 1️⃣ Roles base
  // =========================
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

  // =========================
  // 2️⃣ Asignar ADMIN
  // =========================
  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (adminEmail) {
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (user) {
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

        console.log('👑 Rol ADMIN asignado');
      }
    }
  }

  // =========================
  // 3️⃣ External Sites
  // =========================
  const platforms = [
    {
      name: 'Impresistem',
      url: 'https://www.impresistem.com/',
      logoUrl: '/impresistem_logos.png',
      sortOrder: 1,
    },
    {
      name: 'Portal Victoria',
      url: 'https://portal.victoriasolutions.ai/es',
      logoUrl: '/victoria.ico',
      sortOrder: 2,
    },
    {
      name: 'CRM David',
      url: 'https://www.maxgp.com.co/index.php?view=vistas/login.php',
      logoUrl: '/crm.png',
      sortOrder: 3,
    },
    {
      name: 'Infolaft',
      url: 'https://www.infolaftsearch.com/#!/signin',
      logoUrl: '/infolaft.png',
      sortOrder: 4,
    },
    {
      name: 'GLPI',
      url: 'https://soporteit.impresistem.com/',
      logoUrl: '/glpi.png',
      sortOrder: 5,
    },
    {
      name: 'Heinsohn',
      url: 'https://nomina58.heinsohn.com.co/NominaWEB/common/mainPages/login.seam',
      logoUrl: '/heinsohn.png',
      sortOrder: 6,
    },
    {
      name: 'IM Academy',
      url: 'https://login.ubitslearning.com/login?state=...',
      logoUrl: '/ubits.png',
      sortOrder: 7,
    },
    {
      name: 'Linkus',
      url: 'https://telefonia.impresistem.com:8088/login',
      logoUrl: '/linkus.png',
      sortOrder: 8,
    },
    {
      name: 'Plytix',
      url: 'https://auth.plytix.com/auth/login',
      logoUrl: '/plytix.png',
      sortOrder: 9,
    },
    {
      name: 'IMPREDATA',
      url: 'https://informesbi.impresistem.com/reports/browse/IMPREDATA',
      logoUrl: '/impredata.png',
      sortOrder: 10,
    },
  ];

  for (const site of platforms) {
    const existing = await prisma.externalSite.findFirst({
      where: {
        url: site.url,
        deletedAt: null, // importante si usas soft delete
      },
    });

    if (existing) {
      await prisma.externalSite.update({
        where: { id: existing.id },
        data: {
          name: site.name,
          logoUrl: site.logoUrl,
          sortOrder: site.sortOrder,
          isActive: true,
        },
      });

      console.log(`🔄 Actualizado: ${site.name}`);
    } else {
      await prisma.externalSite.create({
        data: {
          name: site.name,
          url: site.url,
          logoUrl: site.logoUrl,
          sortOrder: site.sortOrder,
          isActive: true,
        },
      });

      console.log(`🆕 Creado: ${site.name}`);
    }
  }

  console.log('🌐 External sites verificados');

  console.log('🌱 Seed finalizado correctamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
