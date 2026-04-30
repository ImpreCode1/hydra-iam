"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/modules/auth/api"
import { ChevronDown, LogOut, Users, Shield, LayoutGrid, Briefcase, User, ExternalLink } from "lucide-react"

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
      
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition"
      >
        <div className="w-8 h-8 rounded-full bg-[#f59e0b] flex items-center justify-center text-sm font-bold text-black shadow-sm">
          {firstLetter}
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium text-white">{user.name}</p>
          <p className="text-[10px] text-white/60">Usuario</p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-white/60 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-20 overflow-hidden">

            <div className="px-4 py-4 border-b border-[#333] bg-[#222]">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>

              <p
                className="text-xs text-white/60 truncate mt-0.5"
                title={user.email}
              >
                {user.email}
              </p>
            </div>

            {isAdmin && (
              <div className="p-1.5 border-b border-[#333]">

                <p className="px-2 py-1 text-[10px] uppercase text-white/40 font-medium">
                  Administración
                </p>

                <button
                  onClick={() => router.push("/admin/users")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <User className="w-4 h-4" />
                  Usuarios
                </button>

                <button
                  onClick={() => router.push("/admin/positions")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <Briefcase className="w-4 h-4" />
                  Cargos
                </button>

                <button
                  onClick={() => router.push("/admin/groups")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <Users className="w-4 h-4" />
                  Grupos
                </button>

                <button
                  onClick={() => router.push("/admin/roles")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <Shield className="w-4 h-4" />
                  Roles
                </button>

                <button
                  onClick={() => router.push("/admin/platforms")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <LayoutGrid className="w-4 h-4" />
                  Plataformas
                </button>

                <button
                  onClick={() => router.push("/admin/external-sites")}
                  className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 rounded-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  Sitios Externos
                </button>

              </div>
            )}

            <div className="p-1.5">
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full text-left px-2.5 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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