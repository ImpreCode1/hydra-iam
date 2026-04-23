/**
 * Módulo de API para roles.
 * Funciones para interactuar con el backend de roles.
 */
import { apiFetch } from "@/lib/api-client"

/**
 * Interfaz de rol.
 */
export interface Role {
  id: string
  name: string
}

/**
 * Obtiene todos los roles disponibles.
 * @returns Lista de roles
 */
export function getRoles(): Promise<Role[]> {
  return apiFetch("/roles")
}

/**
 * Obtiene un rol por su ID.
 * @param id - ID del rol
 * @returns Datos del rol
 */
export function getRole(id: string): Promise<Role> {
  return apiFetch(`/roles/${id}`)
}

/**
 * Crea un nuevo rol.
 * @param data - Datos del rol a crear
 * @returns Rol creado
 */
export function createRole(data: Partial<Role>) {
  return apiFetch("/roles", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

/**
 * Actualiza un rol existente.
 * @param id - ID del rol
 * @param data - Datos a actualizar
 * @returns Rol actualizado
 */
export function updateRole(id: string, data: Partial<Role>) {
  return apiFetch(`/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

/**
 * Elimina un rol.
 * @param id - ID del rol a eliminar
 */
export function deleteRole(id: string) {
  return apiFetch(`/roles/${id}`, {
    method: "DELETE"
  })
}