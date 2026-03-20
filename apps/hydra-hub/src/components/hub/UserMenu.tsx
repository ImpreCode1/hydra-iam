"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/modules/auth/api"
import { ChevronDown, LogOut, Users, Shield, LayoutGrid, Briefcase } from "lucide-react"

export function UserMenu() {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const firstLetter = user.name.charAt(0).toUpperCase()

  // 🔹 Validación de ADMIN
  const isAdmin = user.roles?.includes("ADMIN")

  return (
    <div className="relative">
      
      {/* BOTÓN PERFIL */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 hover:bg-zinc-800 px-3 py-2 rounded-lg transition border border-transparent hover:border-zinc-700"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
          {firstLetter}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-xs font-medium text-zinc-100">{user.name}</p>
          <p className="text-[10px] text-zinc-400">Usuario Activo</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <>
          {/* BACKDROP */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-150">

            {/* INFO USUARIO */}
            <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>

              <p
                className="text-xs text-zinc-400 truncate mt-0.5"
                title={user.email}
              >
                {user.email}
              </p>
            </div>

            {/* ADMIN SECTION */}
            {isAdmin && (
              <div className="p-1 border-b border-zinc-800">

                <p className="px-3 py-1 text-[10px] uppercase text-zinc-500">
                  Administración
                </p>

                <button
                  onClick={() => router.push("/admin/users")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                >
                  <Users className="w-4 h-4" />
                  Usuarios
                </button>

                <button
                  onClick={() => router.push("/admin/positions")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                >
                  <Briefcase className="w-4 h-4" />
                  Cargos
                </button>

                <button
                  onClick={() => router.push("/admin/roles")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                >
                  <Shield className="w-4 h-4" />
                  Roles
                </button>

                <button
                  onClick={() => router.push("/admin/platforms")}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Plataformas
                </button>

              </div>
            )}

            {/* LOGOUT */}
            <div className="p-1">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  )
}