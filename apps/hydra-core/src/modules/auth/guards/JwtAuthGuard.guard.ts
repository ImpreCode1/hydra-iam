/**
 * Guard de autenticación JWT.
 * Valida que el token JWT sea válido para acceder al endpoint.
 */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 *JwtAuthGuard - Guard que valida tokens JWT.
 *@description Extiende AuthGuard de Passport para validar JWT.
 *Permite peticiones OPTIONS (preflight CORS).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Valida el token JWT del request.
   * @param context - Contexto de ejecución
   * @returns true si el token es válido
   */
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 🔥 CLAVE: permitir preflight
    if (request.method === 'OPTIONS') {
      return true;
    }

    return super.canActivate(context);
  }
}
