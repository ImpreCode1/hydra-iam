"use client";

import { useEffect, useState } from "react";
import {
  getPlatforms,
  deletePlatform,
  updatePlatform,
} from "@/modules/platforms/api";
import { EditPlatformModal } from "./EditPlatformModal"; // 👈 importa el modal

type Platform = {
  id: string;
  name: string;
  code: string;
  url: string;
  logoUrl?: string;
  isActive: boolean;
};

interface PlatformListProps {
  refreshKey?: number;
}

export function PlatformList({ refreshKey }: PlatformListProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null,
  );

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPlatforms();
      setPlatforms(data);
    } catch (err) {
      console.error(err);
      alert("Error cargando plataformas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // 🔥 ELIMINAR
  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar plataforma?")) return;

    try {
      setActionLoading(id);

      await deletePlatform(id);

      setPlatforms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando");
    } finally {
      setActionLoading(null);
    }
  }

  // 🔥 TOGGLE
  async function toggleStatus(platform: Platform) {
    try {
      setActionLoading(platform.id);

      const updated = !platform.isActive;

      await updatePlatform(platform.id, {
        isActive: updated,
      });

      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platform.id ? { ...p, isActive: updated } : p,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Error actualizando estado");
    } finally {
      setActionLoading(null);
    }
  }

  // 🔥 ACTUALIZAR DESDE MODAL
  function handleUpdate(updated: Platform) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Plataformas
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando plataformas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-3 font-medium">Logo</th>
                <th className="pb-3 font-medium">Nombre</th>
                <th className="pb-3 font-medium">Código</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {platforms.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3">
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl}
                        className="w-10 h-10 object-contain rounded-lg border"
                        alt={p.name}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="font-medium text-slate-800 py-3">
                    {p.name}
                  </td>

                  <td className="text-slate-600 py-3 font-mono text-xs">{p.code}</td>

                  <td className="py-3">
                    <span
                      className={`badge ${
                        p.isActive ? "badge-success" : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        disabled={actionLoading === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(p);
                        }}
                        className="btn-ghost text-xs px-2.5 py-1.5"
                      >
                        {actionLoading === p.id
                          ? "..."
                          : p.isActive
                            ? "Desactivar"
                            : "Activar"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlatform(p);
                        }}
                        className="btn-ghost text-xs px-2.5 py-1.5"
                      >
                        Editar
                      </button>

                      <button
                        disabled={actionLoading === p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="btn-ghost text-xs px-2.5 py-1.5 text-red-600 hover:bg-red-50"
                      >
                        {actionLoading === p.id ? "..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {platforms.length === 0 && (
            <p className="text-sm text-slate-500 mt-4">
              No hay plataformas registradas
            </p>
          )}
        </div>
      )}

      {selectedPlatform && (
        <EditPlatformModal
          platform={selectedPlatform}
          onClose={() => setSelectedPlatform(null)}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}