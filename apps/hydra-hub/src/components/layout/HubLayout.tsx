import Link from "next/link"
import { UserMenu } from "@/components/hub/UserMenu"
import { NotificationsDropdown } from "@/components/hub/NotificationsDropdown"

export function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-50">
          <div className="flex items-center justify-between h-16">

            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
              <img
                src="/impresistem_logo.png"
                alt="Logo empresa"
                className="h-9 w-auto object-contain"
              />
              <h1 className="text-base font-semibold text-white hidden sm:block border-l border-white/30 pl-3">
                Sistema de Gestión de Accesos
              </h1>
            </Link>

            <div className="flex items-center gap-3 sm:gap-4">
              <NotificationsDropdown />
              <UserMenu />
            </div>

          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
        {children}
      </main>

      <div className="fixed bottom-6 left-6 z-40 animate-bounce-slow">
        <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white px-5 py-3 rounded-lg shadow-xl border border-[#3d3d3d] flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <div>
            <p className="text-sm font-medium">Desliza hacia abajo</p>
            <p className="text-xs text-gray-400">para encontrar los formularios</p>
          </div>
        </div>
      </div>

    </div>
  )
}