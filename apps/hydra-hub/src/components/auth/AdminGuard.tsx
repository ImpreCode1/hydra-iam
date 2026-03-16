"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.roles?.includes("ADMIN");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }

    if (!loading && user && !isAdmin) {
      router.replace("/");
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-zinc-400">Cargando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return <>{children}</>;
}
