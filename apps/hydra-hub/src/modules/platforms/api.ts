/**
 * Módulo de API para plataformas.
 * Funciones para interactuar con el backend de plataformas.
 */
import { apiFetch } from "@/lib/api-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Interfaz de plataforma.
 */
export type Platform = {
  id: string
  name: string
  code: string
  description?: string
  url: string
  logoUrl?: string
  isActive: boolean
}

/**
 * Obtiene todas las plataformas disponibles.
 * @returns Lista de plataformas
 */
export function getPlatforms(): Promise<Platform[]> {
  return apiFetch("/platform")
}

/**
 * Obtiene una plataforma por su ID.
 * @param id - ID de la plataforma
 * @returns Datos de la plataforma
 */
export function getPlatform(id: string): Promise<Platform> {
  return apiFetch(`/platform/${id}`)
}

/**
 * Crea una nueva plataforma.
 * @param data - Datos de la plataforma a crear
 * @returns Plataforma creada
 */
export function createPlatform(data: Partial<Platform>) {
  return apiFetch("/platform", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

/**
 * Actualiza una plataforma existente.
 * @param id - ID de la plataforma
 * @param data - Datos a actualizar
 * @returns Plataforma actualizada
 */
export function updatePlatform(id: string, data: Partial<Platform>) {
  return apiFetch(`/platform/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Elimina una plataforma.
 * @param id - ID de la plataforma a eliminar
 */
export function deletePlatform(id: string) {
  return apiFetch(`/platform/${id}`, {
    method: "DELETE"
  })
}

/**
 * Asigna un rol a una plataforma.
 * @param platformId - ID de la plataforma
 * @param roleId - ID del rol
 */
export function assignRoleToPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platform/${platformId}/roles/${roleId}`, {
    method: "POST"
  })
}

/**
 * Remueve un rol de una plataforma.
 * @param platformId - ID de la plataforma
 * @param roleId - ID del rol
 */
export function removeRoleFromPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platform/${platformId}/roles/${roleId}`, {
    method: "DELETE"
  })
}

/**
 * Obtiene los roles de una plataforma.
 * @param platformId - ID de la plataforma
 * @returns Lista de roles de la plataforma
 */
export function getPlatformRoles(platformId: string) {
  return apiFetch(`/platform/${platformId}/roles`)
}

/**
 * Obtiene las plataformas accesibles para el usuario actual.
 * @returns Lista de plataformas accesibles
 */
export function getMyPlatforms() {
  return apiFetch("/platforms/me/access")
}

/**
 * Accede a una plataforma específica.
 * Abre la URL de acceso en una nueva pestaña.
 * @param code - Código de la plataforma
 * @throws Error si no tiene acceso
 */
export async function accessPlatform(code: string) {
  const response = await fetch(
    `${API_URL}/platforms/access-url/${code}`,
    { credentials: "include" }
  );
  
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("No tienes acceso a esta plataforma");
    }
    throw new Error("Error al acceder a la plataforma");
  }
  
  const { redirectUrl } = await response.json();
  window.open(redirectUrl, "_blank");
}