"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  
  const notifications = [
    "Tu acceso a BI fue aprobado",
    "Nueva plataforma disponible: Finance",
    "Actualización del sistema CRM",
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/10 transition relative"
      >
        <Bell className="w-5 h-5 text-white" />
        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          
          <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h3 className="font-semibold text-sm text-white">
                Notificaciones
              </h3>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">
                {notifications.length} nuevas
              </span>
            </div>

            <ul className="divide-y divide-[#333]">
              {notifications.map((n, i) => (
                <li 
                  key={i} 
                  className="p-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-white/80 leading-tight">{n}</p>
                  <span className="text-[10px] text-white/40">Hace un momento</span>
                </li>
              ))}
            </ul>
            
            <div className="p-3 border-t border-[#333]">
              <button className="text-xs font-medium text-[#f59e0b] hover:underline">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}