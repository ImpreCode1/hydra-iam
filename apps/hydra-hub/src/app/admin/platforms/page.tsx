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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Plataformas</h1>

      <PlatformForm onCreated={handleCreated} />

      <PlatformList refreshKey={refreshKey} />
    </div>
  )
}