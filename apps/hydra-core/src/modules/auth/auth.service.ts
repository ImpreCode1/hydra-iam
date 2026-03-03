/**
 * Servicio de autenticación.
 * loginWithMicrosoft: busca/crea usuario, genera JWT con roles y cargo, devuelve token + user (sin password).
 */

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MicrosoftUser } from './interfaces/microsoft-user.interface';

import { ProfileWithAccessResponseDto } from './dto/profile-with-access.dto';

import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async loginWithMicrosoft(msUser: MicrosoftUser) {
    const user = await this.usersService.findOrCreateFromMicrosoft(msUser);

    const roleNames: string[] =
      user.roles?.flatMap((ur) => (ur.role?.name ? [ur.role.name] : [])) ?? [];

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles: roleNames,
      positionId: user.positionId ?? null,
    };

    const { password, ...userWithoutPassword } = user;

    // evitar warning unused variable
    void password;

    const accessToken = this.jwtService.sign(payload, {
      issuer: 'hydra-iam',
      audience: 'internal-platforms',
      expiresIn: '15m',
    });

    const refreshToken = randomBytes(64).toString('hex');

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async getProfileWithAccess(
    userId: string,
  ): Promise<ProfileWithAccessResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        position: {
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        },
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const rolesFromPosition = user.position?.roles.map((pr) => pr.role) ?? [];

    const directRoles = user.roles.map((ur) => ur.role);

    const roleMap = new Map<string, (typeof rolesFromPosition)[number]>();

    for (const role of rolesFromPosition) {
      roleMap.set(role.id, role);
    }

    for (const role of directRoles) {
      roleMap.set(role.id, role);
    }

    const effectiveRoles = Array.from(roleMap.values());

    const platforms = await this.prisma.platform.findMany({
      where: {
        roles: {
          some: {
            roleId: {
              in: effectiveRoles.map((role) => role.id),
            },
          },
        },
        isActive: true,
        deletedAt: null,
      },
      select: {
        name: true,
        code: true,
        url: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      position: user.position ? user.position.name : null,
      roles: effectiveRoles.map((role) => role.name),
      platforms,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        isRevoked: false,
      },
      include: {
        user: true,
      },
    });

    type TokenWithUser = (typeof tokens)[number];

    let validToken: TokenWithUser | null = null;

    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (validToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const payload = {
      sub: validToken.user.id,
      email: validToken.user.email,
    };

    const newAccessToken = this.jwtService.sign(payload, {
      issuer: 'hydra-iam',
      audience: 'internal-platforms',
      expiresIn: '15m',
    });

    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;

    const tokens = await this.prisma.refreshToken.findMany({
      where: { isRevoked: false },
    });

    for (const token of tokens) {
      const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);
      if (isMatch) {
        await this.prisma.refreshToken.update({
          where: { id: token.id },
          data: { isRevoked: true },
        });
      }
    }
  }

  async issueServiceToken(clientId: string, clientSecret: string) {
    const service = await this.prisma.serviceClient.findUnique({
      where: { clientId },
    });

    if (!service || !service.isActive) {
      throw new UnauthorizedException('Servicio inválido');
    }

    const isValid = await bcrypt.compare(clientSecret, service.clientSecret);

    if (!isValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: service.id,
      client_id: service.clientId,
      type: 'service' as const,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
    };
  }
}
