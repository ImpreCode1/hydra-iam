/**
 * DTOs para la respuesta de perfil con acceso.
 */

/**
 * DTO para información de plataforma accesible.
 */
export interface PlatformResponseDto {
  name: string;
  code: string;
  url: string;
}

/**
 * DTO para la respuesta de perfil con roles y plataformas.
 */
export interface ProfileWithAccessResponseDto {
  id: string;
  name: string;
  email: string;
  position: string | null;
  roles: string[];
  platforms: PlatformResponseDto[];
}
