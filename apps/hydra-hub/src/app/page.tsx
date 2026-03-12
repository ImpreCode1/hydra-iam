"use client"

import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/modules/auth/api"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {

  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <p>Cargando sesión...</p>
  }

  if (!user) return null

  return (
    <div style={{ padding: "40px" }}>

      <h1>Hydra Hub</h1>

      <p>Bienvenido {user.name}</p>

      <p>Email: {user.email}</p>

      <p>Roles: {user.roles?.join(", ")}</p>

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px"
        }}
      >
        Logout
      </button>

    </div>
  )
}