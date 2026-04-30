import { apiFetch } from "@/lib/api-client"

export type ExternalSite = {
  id: string
  name: string
  url: string
  logoUrl?: string
  isActive: boolean
  sortOrder: number
}

export function getExternalSites(): Promise<ExternalSite[]> {
  return apiFetch("/external-sites")
}

export function getExternalSite(id: string): Promise<ExternalSite> {
  return apiFetch(`/external-sites/${id}`)
}

export function createExternalSite(data: Partial<ExternalSite>) {
  return apiFetch("/external-sites", {
    method: "POST",
    body: JSON.stringify(data)
  })
}

export function updateExternalSite(id: string, data: Partial<ExternalSite>) {
  return apiFetch(`/external-sites/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteExternalSite(id: string) {
  return apiFetch(`/external-sites/${id}`, {
    method: "DELETE"
  })
}

export function getActiveExternalSites() {
  return apiFetch("/external-sites/active")
}