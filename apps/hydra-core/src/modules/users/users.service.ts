/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

type RoleWithPlatform = {
  id: string;
  name: string;
  platforms: {
    platform: {
      id: string;
      name: string;
    };
  }[];
};

type RoleRelation = {
  role: RoleWithPlatform;
};

type GroupRelation = {
  roles: RoleRelation[];
};

type PositionWithRelations = {
  id: string;
  name: string;
  roles: RoleRelation[];
  group?: GroupRelation | null;
};
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

const userWithRolesInclude = {
  roles: { include: { role: true } },
  position: {
    include: {
      roles: { include: { role: true } },
      group: {
        include: {
          roles: { include: { role: true } },
        },
      },
    },
  },
};

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
      include: userWithRolesInclude,
    });

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
          include: userWithRolesInclude,
        });
      }

      return existingUser as UserWithRoles;
    }

    const newUser = await this.prisma.user.create({
      data: {
        name: msUser.name,
        email: msUser.email,
        azureOid: msUser.azureOid,
        positionId,
        isActive: true,
      },
    });

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

    return (await this.prisma.user.findUnique({
      where: { id: newUser.id },
      include: userWithRolesInclude,
    })) as UserWithRoles;
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
                    platforms: { include: { platform: true } },
                  },
                },
              },
            },
            group: {
              include: {
                roles: {
                  include: {
                    role: {
                      include: {
                        platforms: { include: { platform: true } },
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
                platforms: { include: { platform: true } },
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((u) => {
      const position = u.position as PositionWithRelations | null;

      const directRoles: RoleWithPlatform[] = u.roles.map(
        (r: RoleRelation) => r.role,
      );

      const positionRoles: RoleWithPlatform[] =
        position?.roles.map((r: RoleRelation) => r.role) ?? [];

      const groupRoles: RoleWithPlatform[] =
        position?.group?.roles.map((r: RoleRelation) => r.role) ?? [];

      const rolesMap = new Map<string, RoleWithPlatform>();

      [...directRoles, ...positionRoles, ...groupRoles].forEach((role) => {
        rolesMap.set(role.id, role);
      });

      const platformsMap = new Map<string, { id: string; name: string }>();

      [...directRoles, ...positionRoles, ...groupRoles].forEach((role) => {
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
        position: position ? { id: position.id, name: position.name } : null,
        roles: Array.from(rolesMap.values()),
        platforms: Array.from(platformsMap.values()),
      };
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: userWithRolesInclude,
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
      include: userWithRolesInclude,
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const directRoles = user.roles.map((r) => r.role.name);
    const positionRoles = user.position?.roles.map((r) => r.role.name) ?? [];
    const groupRoles =
      user.position?.group?.roles.map((r) => r.role.name) ?? [];

    return [...new Set([...directRoles, ...positionRoles, ...groupRoles])];
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
