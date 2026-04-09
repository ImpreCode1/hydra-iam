"use client";

import { AdminGuard } from "@/components/auth/AdminGuard";
import { HubLayout } from "@/components/layout/HubLayout";
import Link from "next/link";
import { Users, Briefcase, Layers, Shield, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/positions", label: "Cargos", icon: Briefcase },
  { href: "/admin/groups", label: "Grupos", icon: Layers },
  { href: "/admin/roles", label: "Roles", icon: Shield },
  { href: "/admin/platforms", label: "Plataformas", icon: Globe },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <HubLayout>
        <div className="flex gap-6 lg:gap-8">

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border border-slate-200 rounded-xl p-4 h-fit
            transform transition-transform duration-300 ease-in-out
            lg:transform-none lg:block
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-lg font-bold text-slate-900">Hydra Admin</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="hidden lg:block mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Hydra Admin
              </h2>
              <p className="text-xs text-slate-500 mt-1">Panel de administración</p>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg 
                           text-sm font-medium text-slate-600 
                           hover:bg-slate-100 hover:text-slate-900 
                           transition-colors duration-150"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 flex items-center gap-2 px-3 py-2 
                       bg-white border border-slate-200 rounded-lg text-sm font-medium
                       text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-4 h-4" />
              Menú
            </button>

            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
              {children}
            </div>
          </main>

        </div>
      </HubLayout>
    </AdminGuard>
  );
}