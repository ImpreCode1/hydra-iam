/**
 * Módulo de API para usuarios y roles.
 * Funciones para interactuar con el backend de usuarios.
 */
import { apiFetch } from "@/lib/api-client"

/* =========================
   TYPES
 ========================= */

/**
 * Interfaz de rol.
 */
export interface Role {
  id: string
  name: string
}

/**
 * Interfaz de plataforma.
 */
export interface Platform {
  id: string
  name: string
}

/**
 * Interfaz de cargo/posición.
 */
export interface Position {
  id: string
  name: string
  description?: string | null
}

/**
 * Interfaz de usuario.
 */
export interface User {
  id: string
  name: string | null
  email: string
  isActive: boolean

  positionId?: string | null
  position?: Position | null

  roles?: Role[]
  platforms?: Platform[]
}

/* =========================
   USERS
 ========================= */

/**
 * Obtiene todos los usuarios activos.
 * @returns Lista de usuarios
 */
export function getUsers(): Promise<User[]> {
  return apiFetch("/users")
}

/**
 * Obtiene un usuario por su ID.
 * @param id - ID del usuario
 * @returns Datos del usuario
 */
export function getUser(id: string): Promise<User> {
  return apiFetch(`/users/${id}`)
}

/**
 * Cambia el estado de un usuario.
 * @param id - ID del usuario
 * @param active - Estado activo (true/false)
 */
export function changeUserStatus(id: string, active: boolean) {
  return apiFetch(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  })
}

/* =========================
   ROLES
 ========================= */

/**
 * Obtiene los roles de un usuario.
 * @param id - ID del usuario
 * @returns Lista de roles
 */
export function getUserRoles(id: string): Promise<Role[]> {
  return apiFetch(`/users/${id}/roles`)
}

/**
 * Asigna un rol a un usuario.
 * @param userId - ID del usuario
 * @param roleId - ID del rol
 */
export function assignRoleToUser(userId: string, roleId: string) {
  return apiFetch(`/users/${userId}/roles/${roleId}`, {
    method: "POST"
  })
}

/**
 * Remueve un rol de un usuario.
 * @param userId - ID del usuario
 * @param roleId - ID del rol
 */
export function removeRoleFromUser(userId: string, roleId: string) {
  return apiFetch(`/users/${userId}/roles/${roleId}`, {
    method: "DELETE"
  })
}