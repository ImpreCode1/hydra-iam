"use client"

import { useAuth } from "@/hooks/useAuth"

export function Welcome() {

  const { user } = useAuth()

  if (!user) return null

  const firstName = user.name.split(" ")[0]

  return (

    <div className="text-center">
      <h1 className="text-3xl font-bold text">
        Bienvenido, {firstName}
      </h1>

      <p className="opacity-70 mt-2">
        Estas son las plataformas a las que tienes acceso.
      </p>

    </div>

  )
}