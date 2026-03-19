"use client";

import { useEffect, useState } from "react";
import {
  getPlatforms,
  deletePlatform,
  updatePlatform,
} from "@/modules/platforms/api";

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

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getPlatforms();
      setPlatforms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar plataforma?")) return;

    try {
      await deletePlatform(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error eliminando");
    }
  }

  async function toggleStatus(platform: Platform) {
    try {
      await updatePlatform(platform.id, {
        isActive: !platform.isActive,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Plataformas
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Cargando...</p>
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
                        className="w-10 h-10 object-cover rounded-md border"
                        alt="logo"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-md" />
                    )}
                  </td>

                  {/* Nombre */}
                  <td className="font-medium text-gray-800">{p.name}</td>

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
                      onClick={() => toggleStatus(p)}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-gray-100"
                    >
                      {p.isActive ? "Desactivar" : "Activar"}
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => alert("Abrir modal editar")}
                      className="text-xs px-2 py-1 rounded-md border hover:bg-gray-100"
                    >
                      Editar
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs px-2 py-1 rounded-md border text-red-600 hover:bg-red-50"
                    >
                      Eliminar
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
    </div>
  );
}