import Link from "next/link"
import { UserMenu } from "@/components/hub/UserMenu"
import { NotificationsDropdown } from "@/components/hub/NotificationsDropdown"

export function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

    </div>
  )
}