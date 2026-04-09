import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateByName(name?: string | null): Promise<string | null> {
    if (!name) return null;

    const normalized = name.trim();

    let position = await this.prisma.position.findUnique({
      where: { name: normalized },
    });

    if (!position) {
      try {
        position = await this.prisma.position.create({
          data: {
            name: normalized,
            description: 'Cargo sincronizado desde Azure AD',
          },
        });
      } catch {
        position = await this.prisma.position.findUnique({
          where: { name: normalized },
        });
      }
    }

    return position?.id ?? null;
  }

  async findAll() {
    return this.prisma.position.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.position.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async assignRole(positionId: string, roleId: string) {
    return this.prisma.positionRole.create({
      data: {
        positionId,
        roleId,
      },
    });
  }

  async removeRole(positionId: string, roleId: string) {
    return this.prisma.positionRole.delete({
      where: {
        positionId_roleId: {
          positionId,
          roleId,
        },
      },
    });
  }

  async getRoles(positionId: string) {
    const position = await this.prisma.position.findUnique({
      where: { id: positionId },
      include: {
        roles: {
          include: { role: true },
        },
        group: {
          include: {
            roles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!position) {
      return [];
    }

    const directRoles = position.roles.map((pr) => pr.role);
    const groupRoles = position.group?.roles.map((gr) => gr.role) ?? [];

    const allRoles = [...directRoles, ...groupRoles];
    const uniqueRoles = allRoles.filter(
      (role, index, self) => index === self.findIndex((r) => r.id === role.id),
    );

    return uniqueRoles.map((role) => ({
      positionId: position.id,
      roleId: role.id,
      role,
    }));
  }
}
