"use client"

import { useEffect, useState } from "react"
import { PlatformCard } from "./PlatformCard"
import { FormsSection } from "./FormsSection"
import { useAuth } from "@/hooks/useAuth"
import { getMyPlatforms } from "@/modules/platforms/api"

interface Platform {
  id: string
  name: string
  code: string
  description: string
  image: string
  url: string
}

export function PlatformGrid() {

  const { user } = useAuth()

  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  const firstName = user?.name?.split(" ")[0] ?? "Usuario"

  useEffect(() => {

    async function loadPlatforms() {
      try {
        const data = await getMyPlatforms()
        setPlatforms(data)
      } catch (error) {
        console.error("Error cargando plataformas", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlatforms()

  }, [])

  return (

    <div className="text-center space-y-8">

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Bienvenido(a), {firstName}
        </h2>

        <p className="text-slate-600 max-w-md mx-auto">
          Estas son las plataformas a las que tienes acceso.
        </p>
      </div>

      {loading && (
        <p className="text-slate-500">Cargando plataformas...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 justify-items-center max-w-5xl mx-auto">

        {platforms.map((platform) => (
          <div className="w-full max-w-sm" key={platform.id}>
            <PlatformCard platform={platform} />
          </div>
        ))}

      </div>

      <FormsSection />

    </div>
  )
}