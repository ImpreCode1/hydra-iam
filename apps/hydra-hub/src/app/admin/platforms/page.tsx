"use client"

import { useState } from "react"
import { PlatformForm } from "@/components/platforms/PlatformForm"
import { PlatformList } from "@/components/platforms/PlatformList"

export default function PlatformsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  function handleCreated() {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="section-title">Gestión de Plataformas</h1>
        <p className="section-subtitle">
          Administra las plataformas disponibles en el sistema
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2">
          <PlatformForm onCreated={handleCreated} />
        </div>
        <div className="xl:col-span-3">
          <PlatformList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}