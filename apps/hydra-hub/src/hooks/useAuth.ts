"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/modules/auth/api"

/**
 * Interfaz de plataforma.
 */
interface Platform {
  id: string
  name: string
  code: string
  url: string
}

/**
 * Interfaz de usuario.
 */
interface User {
  id: string
  name: string
  email: string
  roles: string[]
  position?: string
  platforms: Platform[]
}

/**
 * Hook para obtener el usuario autenticado.
 * Carga el usuario actual y maneja el estado de autenticación.
 * @returns Objeto con user, loading y isAuthenticated
 */
export function useAuth() {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadUser() {

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } finally {
        setLoading(false)
      }

    }

    loadUser()

  }, [])

  return {
    user,
    loading,
    isAuthenticated: !!user
  }
}