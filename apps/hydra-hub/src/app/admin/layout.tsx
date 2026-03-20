import { AdminGuard } from "@/components/auth/AdminGuard";
import { HubLayout } from "@/components/layout/HubLayout";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <HubLayout>
        <div className="max-w-7xl mx-auto flex gap-8">

          {/* Sidebar */}
          <aside className="w-56 bg-white border border-gray-200 rounded-lg p-4 h-fit">

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Hydra Admin
            </h2>

            <nav className="flex flex-col gap-1 text-sm">

              <Link
                href="/admin/users"
                className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
              >
                Usuarios
              </Link>

              <Link
                href="/admin/positions"
                className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
              >
                Cargos
              </Link>

              <Link
                href="/admin/roles"
                className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
              >
                Roles
              </Link>

              <Link
                href="/admin/platforms"
                className="px-3 py-2 rounded text-gray-700 hover:bg-gray-100"
              >
                Plataformas
              </Link>

            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 bg-white border border-gray-200 rounded-lg p-6">
            {children}
          </main>

        </div>
      </HubLayout>
    </AdminGuard>
  );
}