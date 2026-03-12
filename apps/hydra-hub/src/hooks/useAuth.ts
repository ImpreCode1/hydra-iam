"use client"

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/modules/auth/api"

interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

export function useAuth() {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {

      const currentUser = await getCurrentUser()

      setUser(currentUser)
      setLoading(false)
    }

    loadUser()
  }, [])

  return {
    user,
    loading
  }
}