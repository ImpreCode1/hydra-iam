"use client";

/**
 * Componente de lista de plataformas.
 * Muestra todas las plataformas registradas con búsqueda y acciones.
 */
import { useEffect, useState } from "react";
import {
  getPlatforms,
  deletePlatform,
  updatePlatform,
} from "@/modules/platforms/api";
import { EditPlatformModal } from "./EditPlatformModal";
import { Search, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

/**
 * Interfaz de plataforma.
 */
type Platform = {
  id: string;
  name: string;
  code: string;
  url: string;
  logoUrl?: string;
  isActive: boolean;
};

/**
 * Propiedades del componente.
 */
interface PlatformListProps {
  refreshKey?: number;
}

/**
 * Componente que muestra la lista de plataformas.
 * Permite buscar, editar, activar/desactivar y eliminar plataformas.
 * @param refreshKey - Clave para forzar actualización de datos
 */
export function PlatformList({ refreshKey }: PlatformListProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getPlatforms();
      setPlatforms(data);
      setFilteredPlatforms(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const filtered = platforms.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredPlatforms(filtered);
  }, [search, platforms]);

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

  async function toggleStatus(platform: Platform) {
    try {
      setActionLoading(platform.id);
      const updated = !platform.isActive;
      await updatePlatform(platform.id, { isActive: updated });
      setPlatforms((prev) =>
        prev.map((p) => (p.id === platform.id ? { ...p, isActive: updated } : p)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  function handleUpdate(updated: Platform) {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar plataforma por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 
                   text-sm text-slate-800 placeholder:text-slate-400
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30
                   focus:border-blue-500 transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredPlatforms.map((platform) => (
          <div
            key={platform.id}
            className="group relative bg-white border border-slate-200 rounded-xl p-3 
                     shadow-sm hover:shadow-md hover:border-blue-400/40 
                     transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {platform.logoUrl ? (
                  <img
                    src={platform.logoUrl}
                    className="w-full h-full object-contain"
                    alt={platform.name}
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    {platform.code.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm truncate">
                  {platform.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono">{platform.code}</p>
                <span
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    platform.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      platform.isActive ? "bg-green-500" : "bg-slate-400"
                    }`}
                  />
                  {platform.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === platform.id ? null : platform.id)
                  }
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>

                {openMenu === platform.id && (
                  <div className="absolute right-0 top-8 bg-white border border-slate-200 
                                  rounded-lg shadow-lg py-1 z-10 min-w-32">
                    <button
                      onClick={() => {
                        setSelectedPlatform(platform);
                        setOpenMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 
                                hover:bg-slate-50"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        toggleStatus(platform);
                        setOpenMenu(null);
                      }}
                      disabled={actionLoading === platform.id}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 
                                hover:bg-slate-50"
                    >
                      {platform.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Activar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(platform.id);
                        setOpenMenu(null);
                      }}
                      disabled={actionLoading === platform.id}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 
                                hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredPlatforms.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          {search ? "No se encontraron plataformas" : "No hay plataformas registradas"}
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