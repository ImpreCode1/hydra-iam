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

export function PlatformList() {
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
  }, []);

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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Plataformas
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando plataformas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Logo</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>Estado</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {platforms.map((p) => (
                <tr
                  key={p.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Logo */}
                  <td className="py-2">
                    {p.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logoUrl}
                        className="w-12 h-12 object-contain"
                        alt={p.name}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Nombre */}
                  <td className="font-medium text-gray-800">
                    {p.name}
                  </td>

                  {/* Código */}
                  <td className="text-gray-600">{p.code}</td>

                  {/* Estado */}
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {p.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="text-right space-x-2">
                    {/* Toggle */}
                    <button
                      disabled={actionLoading === p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(p);
                      }}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                    >
                      {actionLoading === p.id
                        ? "..."
                        : p.isActive
                          ? "Desactivar"
                          : "Activar"}
                    </button>

                    {/* Editar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlatform(p);
                      }}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-gray-100"
                    >
                      Editar
                    </button>

                    {/* Eliminar */}
                    <button
                      disabled={actionLoading === p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p.id);
                      }}
                      className="text-xs px-2 py-1 rounded-md border text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {actionLoading === p.id ? "..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {platforms.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">
              No hay plataformas registradas
            </p>
          )}
        </div>
      )}

      {/* 🔥 MODAL */}
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