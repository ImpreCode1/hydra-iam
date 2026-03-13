import { apiFetch } from "@/lib/api-client"

export interface User {
  id: string
  name: string
  email: string
  active: boolean
}

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

export function getUserRoles(id: string) {
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