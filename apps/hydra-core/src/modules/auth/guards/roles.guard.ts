/**
 * Guard de verificación de roles.
 * Valida que el usuario tenga los roles requeridos para acceder al endpoint.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 *RolesGuard - Guard que verifica los roles del usuario.
 *@description Valida que el usuario posea los roles necesarios definidos en el decorator @Roles.
 *Permite peticiones OPTIONS (preflight).
 */
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

  /**
   * Valida si el usuario tiene los roles requeridos.
   * @param context - Contexto de ejecución de NestJS
   * @returns true si tiene acceso, lanza ForbiddenException si no
   */
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
