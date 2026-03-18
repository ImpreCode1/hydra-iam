import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
    roles: string[];
    positionId?: string | null;
    position?: {
      id: string;
      name: string;
      description?: string | null;
    } | null;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // 🔥 Permitir preflight
    if (request.method === 'OPTIONS') {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = request.user;

    console.log('USER:', user);
    console.log('REQUIRED ROLES:', requiredRoles);

    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException('No autorizado');
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Rol insuficiente');
    }

    return true;
  }
}
