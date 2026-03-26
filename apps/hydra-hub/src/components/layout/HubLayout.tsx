import Link from "next/link"
import { UserMenu } from "@/components/hub/UserMenu"
import { NotificationsDropdown } from "@/components/hub/NotificationsDropdown"

export function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      <header className="bg-zinc-900 text-white border-b border-zinc-800">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO + NOMBRE */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">

            <img
              src="/impresistem_logo.png"
              alt="Logo empresa"
              className="h-10 max-w-45 w-full object-contain object-left"
            />

            <h1 className="text-lg font-semibold border-l border-zinc-700 pl-3">
              Sistema de Gestión de Accesos
            </h1>

          </Link>

          {/* ACCIONES */}
          <div className="flex items-center gap-4">

            <NotificationsDropdown />

            <UserMenu />

          </div>

        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </main>

    </div>
  )
}