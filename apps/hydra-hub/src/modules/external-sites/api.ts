import { apiFetch } from "@/lib/api-client"

export type ExternalSite = {
  id: string
  name: string
  url: string
  logoUrl?: string
  description?: string
  sortOrder: number
  isActive: boolean
}

export function getExternalSites(): Promise<ExternalSite[]> {
  return apiFetch("/external-sites")
}

export function getExternalSitesActive(): Promise<ExternalSite[]> {
  return apiFetch("/external-sites/active")
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

export function toggleExternalSiteStatus(id: string) {
  return apiFetch(`/external-sites/${id}/toggle`, {
    method: "PATCH"
  })
}