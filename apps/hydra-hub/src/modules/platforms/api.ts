import { apiFetch } from "@/lib/api-client"

export interface Platform {
  id: string
  name: string
  description: string
  logo_url?: string
  launch_url: string
}

export function getPlatforms(): Promise<Platform[]> {
  return apiFetch("/platforms")
}

export function getPlatform(id: string): Promise<Platform> {
  return apiFetch(`/platforms/${id}`)
}

export function createPlatform(data: Partial<Platform>) {
  return apiFetch("/platforms", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export function updatePlatform(id: string, data: Partial<Platform>) {
  return apiFetch(`/platforms/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  })
}

export function deletePlatform(id: string) {
  return apiFetch(`/platforms/${id}`, {
    method: "DELETE"
  })
}

export function assignRoleToPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platforms/${platformId}/roles/${roleId}`, {
    method: "POST"
  })
}

export function removeRoleFromPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platforms/${platformId}/roles/${roleId}`, {
    method: "DELETE"
  })
}

export function getPlatformRoles(platformId: string) {
  return apiFetch(`/platforms/${platformId}/roles`)
}

export function getMyPlatforms() {
  return apiFetch("/platforms/me/access")
}