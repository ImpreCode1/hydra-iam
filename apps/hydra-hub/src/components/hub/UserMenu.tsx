"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { logout } from "@/modules/auth/api"
import { ChevronDown, LogOut, User } from "lucide-react" // Opcional para mejores iconos

export function UserMenu() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const firstLetter = user.name.charAt(0).toUpperCase()

  return (
    <div className="relative">
      {/* BOTÓN DE PERFIL */}
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
        
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* DESPLEGABLE */}
      {open && (
        <>
          {/* Backdrop para cerrar al hacer clic fuera */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>

          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
            
            {/* INFO DEL USUARIO CON CORREO PROTEGIDO */}
            <div className="px-4 py-4 border-b border-zinc-800 bg-zinc-900/50">
              <p className="text-sm font-semibold text-white truncate">
                {user.name}
              </p>
              <p 
                className="text-xs text-zinc-400 truncate mt-0.5" 
                title={user.email} // Muestra el correo completo al pasar el mouse
              >
                {user.email}
              </p>
            </div>

            {/* ACCIONES */}
            <div className="p-1">
              
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors mt-1"
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