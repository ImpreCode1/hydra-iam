import { apiFetch } from "@/lib/api-client"

export interface Role {
  id: string
  name: string
}

export function getRoles(): Promise<Role[]> {
  return apiFetch("/roles")
}

export function getRole(id: string): Promise<Role> {
  return apiFetch(`/roles/${id}`)
}

export function createRole(data: Partial<Role>) {
  return apiFetch("/roles", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export function updateRole(id: string, data: Partial<Role>) {
  return apiFetch(`/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export function deleteRole(id: string) {
  return apiFetch(`/roles/${id}`, {
    method: "DELETE"
  })
}