"use client"

import { useEffect, useState } from "react"
import { PlatformCard } from "./PlatformCard"
import { useAuth } from "@/hooks/useAuth"
import { getMyPlatforms } from "@/modules/platforms/api"

interface Platform {
  id: string
  name: string
  description: string
  image: string
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

    <div className="text-center">

      <h2 className="text-3xl font-semibold mb-2">
        Bienvenido(a), {firstName}
      </h2>

      <p className="text-gray-600 mb-10">
        Estas son las plataformas a las que tienes acceso.
      </p>

      {loading && (
        <p className="text-gray-500">Cargando plataformas...</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {platforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}

      </div>

    </div>
  )
}