"use client"

import { PlatformCard } from "./PlatformCard"
import { useAuth } from "@/hooks/useAuth"

const platforms = [
  {
    id: "crm",
    name: "CRM",
    description: "Gestión de clientes",
    image: "/platforms/crm.png"
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Métricas de negocio",
    image: "/platforms/analytics.png"
  },
  {
    id: "tickets",
    name: "Tickets",
    description: "Sistema de soporte",
    image: "/platforms/tickets.png"
  },
  {
    id: "tickets2",
    name: "Tickets",
    description: "Sistema de soporte",
    image: "/platforms/tickets.png"
  }
]

export function PlatformGrid() {

  const { user } = useAuth()

  const firstName = user?.name?.split(" ")[0] ?? "Usuario"

  return (

    <div className="text-center">

      <h2 className="text-3xl font-semibold mb-2">
        Bienvenido(a), {firstName}
      </h2>

      <p className="text-gray-600 mb-10">
        Estas son las plataformas a las que tienes acceso.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {platforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}

      </div>

    </div>
  )
}