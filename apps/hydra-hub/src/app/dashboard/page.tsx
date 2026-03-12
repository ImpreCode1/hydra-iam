"use client"

import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/modules/auth/api"

export default function DashboardPage() {

  const { user, loading } = useAuth()

  if (loading) {
    return <p>Cargando sesión...</p>
  }

  return (
    <div style={{ padding: "40px" }}>

      <h1>Dashboard</h1>

      <p>Bienvenido {user?.name}</p>

      <p>Email: {user?.email}</p>

      <p>Roles: {user?.roles?.join(", ")}</p>

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