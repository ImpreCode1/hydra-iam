import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';

type RoleEntity = {
  id: string;
  name: string;
};

type PlatformEntity = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  logoUrl?: string | null;
  url: string;
  isActive: boolean;
  deletedAt: Date | null;
};

type AccessiblePlatform = {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  image?: string | null;
  url: string;
};

@Injectable()
export class PlatformsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly config: ConfigService,
  ) {}

  async create(data: {
    name: string;
    code: string;
    url: string;
    logoUrl: string;
    description?: string;
  }) {
    const clientSecretPlain = this.generateRandomSecret();
    const hashedSecret = await bcrypt.hash(clientSecretPlain, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const platform = await tx.platform.create({
        data,
      });

      const serviceClient = await tx.serviceClient.create({
        data: {
          name: `${platform.name} Service`,
          clientId: `${platform.code}-service`,
          clientSecret: hashedSecret,
          platformId: platform.id,
        },
      });

      return {
        platform,
        serviceCredentials: {
          clientId: serviceClient.clientId,
          clientSecret: clientSecretPlain,
        },
      };
    });

    const adminId = this.config.get<string>('SEED_ADMIN_ID');
    if (adminId) {
      this.notificationsService.notifyNewPlatformCreated(
        adminId,
        result.platform.name,
        result.serviceCredentials.clientId,
      ).catch((err) => console.error('Error sending notification:', err));
    }

    return result;
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                platforms: {
                  include: { platform: true },
                },
              },
            },
          },
        },
        position: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    platforms: {
                      include: { platform: true },
                    },
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
                        platforms: {
                          include: { platform: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const platformsMap = new Map<string, AccessiblePlatform>();

    // 🔥 helper centralizado
    const addPlatform = (p: PlatformEntity | null | undefined) => {
      if (!p) return;

      if (p.deletedAt !== null || !p.isActive) return;

      platformsMap.set(p.id, {
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description,
        image: p.logoUrl, // ✅ ahora sí válido
        url: p.url,
      });
    };

    // directos
    user.roles.forEach((ur) => {
      ur.role.platforms.forEach((rp) => {
        addPlatform(rp.platform);
      });
    });

    // cargo
    user.position?.roles.forEach((pr) => {
      pr.role.platforms.forEach((rp) => {
        addPlatform(rp.platform);
      });
    });

    // grupo
    user.position?.group?.roles.forEach((gr) => {
      gr.role.platforms.forEach((rp) => {
        addPlatform(rp.platform);
      });
    });

    return Array.from(platformsMap.values());
  }

  private generateRandomSecret(): string {
    return randomBytes(32).toString('hex'); // 64 caracteres seguros
  }

  async generatePlatformAccessToken(userId: string, platformCode: string) {
    const accessiblePlatforms = await this.getAccessiblePlatforms(userId);

    const hasAccess = accessiblePlatforms.some((p) => p.code === platformCode);

    if (!hasAccess) {
      throw new ForbiddenException('No tienes acceso a esta plataforma');
    }

    const platformData = await this.prisma.platform.findUnique({
      where: { code: platformCode },
      select: { id: true, name: true, url: true, isActive: true, deletedAt: true },
    });

    if (!platformData || !platformData.isActive || platformData.deletedAt) {
      throw new ForbiddenException('Plataforma no disponible');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
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
      },
    });

    const effectiveRoles = this.resolveEffectiveRoles(user);

    const positionRoles: RoleEntity[] = (user?.position?.roles ?? []).map(
      (pr: any) => pr.role as RoleEntity,
    );
    const groupRoles: RoleEntity[] = (user?.position?.group?.roles ?? []).map(
      (gr: any) => gr.role as RoleEntity,
    );

    const allRoles: RoleEntity[] = [
      ...effectiveRoles,
      ...positionRoles,
      ...groupRoles,
    ];
    const uniqueRoles = Array.from(
      new Map(allRoles.map((r: RoleEntity) => [r.id, r])).values(),
    );

    const payload = {
      sub: userId,
      email: user?.email,
      name: user?.name,
      roles: uniqueRoles.map((r: RoleEntity) => r.name),
      positionId: user?.positionId ?? null,
      platform: platformCode,
    };

    const token = this.jwtService.sign(payload, {
      issuer: 'hydra-iam',
      audience: 'internal-platforms',
      expiresIn: '15m',
    });

    try {
      await this.notificationsService.notifyPlatformAccess(userId, platformData.name);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    return {
      redirectUrl: `${platformData.url}?token=${token}`,
      token,
    };
  }

  private resolveEffectiveRoles(user: any): RoleEntity[] {
    return (user?.roles ?? []).map((ur: any) => ur.role as RoleEntity);
  }
}
