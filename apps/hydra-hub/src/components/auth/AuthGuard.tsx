"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-6">

          {/* Spinner */}
          <div className="relative">
            <div className="w-14 h-14 border-4 border-zinc-700 rounded-full"></div>
            <div className="w-14 h-14 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>

          {/* Texto */}
          <div className="text-center">
            <p className="text-white text-lg font-medium">
              Verificando sesión
            </p>
            <p className="text-zinc-400 text-sm">
              Cargando tu espacio de trabajo...
            </p>
          </div>

        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  );
}