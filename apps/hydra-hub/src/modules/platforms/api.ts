import { apiFetch } from "@/lib/api-client"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  return apiFetch("/platform")
}

export function getPlatform(id: string): Promise<Platform> {
  return apiFetch(`/platform/${id}`)
}

export function createPlatform(data: Partial<Platform>) {
  return apiFetch("/platform", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export function updatePlatform(id: string, data: Partial<Platform>) {
  return apiFetch(`/platform/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deletePlatform(id: string) {
  return apiFetch(`/platform/${id}`, {
    method: "DELETE"
  })
}

export function assignRoleToPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platform/${platformId}/roles/${roleId}`, {
    method: "POST"
  })
}

export function removeRoleFromPlatform(platformId: string, roleId: string) {
  return apiFetch(`/platform/${platformId}/roles/${roleId}`, {
    method: "DELETE"
  })
}

export function getPlatformRoles(platformId: string) {
  return apiFetch(`/platform/${platformId}/roles`)
}

export function getMyPlatforms() {
  return apiFetch("/platforms/me/access")
}

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