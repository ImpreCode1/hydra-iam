/**
 * Servicio de usuarios.
 *
 * findOrCreateFromMicrosoft:
 * - Busca usuario por azureOid o email
 * - Si existe sin azureOid, actualiza con azureOid
 * - Si no existe, crea usuario SSO (sin password)
 * - Sincroniza cargo desde Azure AD (jobTitle)
 * - Incluye roles con { role: { name } } y position
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MicrosoftUser } from '../auth/interfaces/microsoft-user.interface';
import { PositionsService } from '../positions/positions.service';

/** Usuario con roles incluidos para auth */
export interface UserWithRoles {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  azureOid?: string | null;
  positionId?: string | null;
  position?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  roles: { role: { name: string } }[];
  isActive?: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly positionsService: PositionsService,
  ) {}

  async findOrCreateFromMicrosoft(
    msUser: MicrosoftUser,
  ): Promise<UserWithRoles> {
    const positionId = await this.positionsService.findOrCreateByName(
      msUser.jobTitle,
    );

    let existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ azureOid: msUser.azureOid }, { email: msUser.email }],
      },
      include: {
        roles: { include: { role: true } },
        position: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    // =========================
    // USUARIO YA EXISTE
    // =========================
    if (existingUser) {
      if (!existingUser.isActive || existingUser.deletedAt) {
        throw new UnauthorizedException('Usuario desactivado');
      }

      const needsUpdate =
        existingUser.azureOid !== msUser.azureOid ||
        existingUser.positionId !== positionId ||
        existingUser.name !== msUser.name ||
        existingUser.email !== msUser.email;

      if (needsUpdate) {
        existingUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            azureOid: msUser.azureOid,
            positionId,
            name: msUser.name,
            email: msUser.email,
          },
          include: {
            roles: { include: { role: true } },
            position: {
              include: {
                roles: {
                  include: {
                    role: true,
                  },
                },
              },
            },
          },
        });
      }

      return existingUser as UserWithRoles;
    }

    // =========================
    // USUARIO NUEVO
    // =========================
    const newUser = await this.prisma.user.create({
      data: {
        name: msUser.name,
        email: msUser.email,
        azureOid: msUser.azureOid,
        positionId,
        isActive: true,
      },
    });

    // 🔥 Buscar rol USER
    const defaultRole = await this.prisma.role.findUnique({
      where: { name: 'USER' },
    });

    if (defaultRole) {
      await this.prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: newUser.id,
            roleId: defaultRole.id,
          },
        },
        update: {},
        create: {
          userId: newUser.id,
          roleId: defaultRole.id,
        },
      });
    }

    // 🔥 Retornar usuario con roles incluidos
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        roles: { include: { role: true } },
        position: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    return userWithRoles as UserWithRoles;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        position: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    platforms: {
                      include: {
                        platform: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        roles: {
          include: {
            role: {
              include: {
                platforms: {
                  include: {
                    platform: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((u) => {
      // 🔹 Roles directos
      const directRoles = u.roles.map((r) => r.role);

      // 🔹 Roles del cargo
      const positionRoles = u.position?.roles.map((r) => r.role) ?? [];

      // 🔹 Combinar roles sin duplicados
      const rolesMap = new Map<string, { id: string; name: string }>();

      [...directRoles, ...positionRoles].forEach((role) => {
        rolesMap.set(role.id, {
          id: role.id,
          name: role.name,
        });
      });

      // 🔹 Plataformas (de TODOS los roles)
      const platformsMap = new Map<string, { id: string; name: string }>();

      [...directRoles, ...positionRoles].forEach((role) => {
        role.platforms.forEach((p) => {
          platformsMap.set(p.platform.id, {
            id: p.platform.id,
            name: p.platform.name,
          });
        });
      });

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        isActive: u.isActive,

        position: u.position
          ? {
              id: u.position.id,
              name: u.position.name,
            }
          : null,

        // 🔥 roles ya unificados (esto soluciona tu problema)
        roles: Array.from(rolesMap.values()),

        // 🔥 plataformas también unificadas
        platforms: Array.from(platformsMap.values()),
      };
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        position: true,
        roles: { include: { role: true } },
      },
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  async resolveEffectiveRoles(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
        position: {
          include: {
            roles: { include: { role: true } },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const directRoles = user.roles.map((r) => r.role.name);

    const positionRoles = user.position?.roles.map((r) => r.role.name) ?? [];

    return [...new Set([...directRoles, ...positionRoles])];
  }

  async assignRole(userId: string, roleId: string) {
    // Validar que usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar que rol exista
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    // Crear relación (evita duplicado por PK compuesta)
    try {
      return await this.prisma.userRole.create({
        data: { userId, roleId },
      });
    } catch {
      throw new BadRequestException('El usuario ya tiene este rol');
    }
  }

  async removeRole(userId: string, roleId: string) {
    return this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }
}
