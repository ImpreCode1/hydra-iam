import { apiFetch } from "@/lib/api-client"

export type Platform = {
  id: string
  name: string
  code: string
  description?: string
  url: string
  logoUrl?: string
  isActive: boolean
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
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
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