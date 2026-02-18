import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlatformsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    name: string;
    code: string;
    url: string;
    description?: string;
  }) {
    return this.prisma.platform.create({
      data,
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
}
