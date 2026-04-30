"use client"

import { ExternalSitesList } from "@/components/external-sites/ExternalSitesList"

export default function ExternalSitesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="section-title">Sitios Externos</h1>
        <p className="section-subtitle">
          Administra los sitios externos que aparecen en la página de login
        </p>
      </div>

      <div className="grid grid-cols-1">
        <ExternalSitesList />
      </div>
    </div>
  )
}