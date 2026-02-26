import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    code: string;
    url: string;
    logoUrl: string;
    description?: string;
  }) {
    const clientSecretPlain = this.generateRandomSecret();
    const hashedSecret = await bcrypt.hash(clientSecretPlain, 10);

    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Crear plataforma
      const platform = await tx.platform.create({
        data,
      });

      // 2️⃣ Crear ServiceClient asociado
      const serviceClient = await tx.serviceClient.create({
        data: {
          name: `${platform.name} Service`,
          clientId: `${platform.code}-service`,
          clientSecret: hashedSecret,
          platformId: platform.id, // requiere relación en schema
        },
      });

      return {
        platform,
        serviceCredentials: {
          clientId: serviceClient.clientId,
          clientSecret: clientSecretPlain, // SOLO se muestra una vez
        },
      };
    });
  }

  async findAll() {
    return this.prisma.platform.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.platform.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.platform.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.platform.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async assignRole(platformId: string, roleId: string) {
    return this.prisma.platformRole.create({
      data: {
        platformId,
        roleId,
      },
    });
  }

  async removeRole(platformId: string, roleId: string) {
    return this.prisma.platformRole.delete({
      where: {
        platformId_roleId: {
          platformId,
          roleId,
        },
      },
    });
  }

  async getRoles(platformId: string) {
    return this.prisma.platformRole.findMany({
      where: { platformId },
      include: { role: true },
    });
  }

  async getAccessiblePlatforms(userId: string) {
    // 1️⃣ Obtener usuario con cargo y roles directos
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        position: {
          include: {
            roles: true,
          },
        },
        roles: true,
      },
    });

    if (!user) return [];

    // 2️⃣ Recolectar roles
    const positionRoles = user.position?.roles.map((pr) => pr.roleId) ?? [];

    const directRoles = user.roles.map((ur) => ur.roleId);

    const allRoleIds = [...new Set([...positionRoles, ...directRoles])];

    // 3️⃣ Buscar plataformas asociadas
    return this.prisma.platform.findMany({
      where: {
        isActive: true,
        roles: {
          some: {
            roleId: { in: allRoleIds },
          },
        },
      },
    });
  }

  private generateRandomSecret(): string {
    return randomBytes(32).toString('hex'); // 64 caracteres seguros
  }
}
