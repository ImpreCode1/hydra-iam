/**
 * Decorator para definir roles requeridos en endpoints.
 * Se usa junto con RolesGuard para proteger endpoints.
 */
import { SetMetadata } from '@nestjs/common';

/**
 * Clave de metadata para roles.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador para especificar roles requeridos.
 * @param roles - Lista de roles permitidos
 * @returns Decorador SetMetadata
 *
 * @example
 * @Roles('ADMIN')
 * @Get('admin-only')
 * adminRoute() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
