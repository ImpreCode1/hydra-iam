import { apiFetch } from "@/lib/api-client"

/* =========================
   TYPES
========================= */

export interface Role {
  id: string
  name: string
}

export interface Platform {
  id: string
  name: string
}

export interface Position {
  id: string
  name: string
  description?: string | null
}

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

export function getUsers(): Promise<User[]> {
  return apiFetch("/users")
}

export function getUser(id: string): Promise<User> {
  return apiFetch(`/users/${id}`)
}

export function changeUserStatus(id: string, active: boolean) {
  return apiFetch(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ active })
  })
}

/* =========================
   ROLES
========================= */

export function getUserRoles(id: string): Promise<Role[]> {
  return apiFetch(`/users/${id}/roles`)
}

export function assignRoleToUser(userId: string, roleId: string) {
  return apiFetch(`/users/${userId}/roles/${roleId}`, {
    method: "POST"
  })
}

export function removeRoleFromUser(userId: string, roleId: string) {
  return apiFetch(`/users/${userId}/roles/${roleId}`, {
    method: "DELETE"
  })
}