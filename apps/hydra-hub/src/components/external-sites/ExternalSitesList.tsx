"use client";

import { useEffect, useState } from "react";
import {
  getExternalSites,
  deleteExternalSite,
  toggleExternalSiteStatus,
  ExternalSite,
} from "@/modules/external-sites/api";
import { ExternalSiteForm } from "./ExternalSiteForm";
import { Search, MoreVertical, Edit, Trash2, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";

interface ExternalSitesListProps {
  refreshKey?: number;
}

export function ExternalSitesList({ refreshKey }: ExternalSitesListProps) {
  const [sites, setSites] = useState<ExternalSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<ExternalSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<ExternalSite | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await getExternalSites();
      setSites(data);
      setFilteredSites(data);
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
    const filtered = sites.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.url.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredSites(filtered);
  }, [search, sites]);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar sitio externo?")) return;
    try {
      setActionLoading(id);
      await deleteExternalSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error eliminando");
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleStatus(site: ExternalSite) {
    try {
      setActionLoading(site.id);
      const updated = !site.isActive;
      await toggleExternalSiteStatus(site.id);
      setSites((prev) =>
        prev.map((s) => (s.id === site.id ? { ...s, isActive: updated } : s)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  function handleSave(saved: ExternalSite) {
    if (selectedSite) {
      setSites((prev) =>
        prev.map((s) => (s.id === saved.id ? saved : s)),
      );
    } else {
      setSites((prev) => [...prev, saved]);
    }
    setShowForm(false);
    setSelectedSite(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar sitio externo por nombre o URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 
                     text-sm text-slate-800 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500/30
                     focus:border-blue-500 transition-all duration-200"
          />
        </div>
        <button
          onClick={() => {
            setSelectedSite(null);
            setShowForm(true);
          }}
          className="ml-4 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium 
                   rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuevo Sitio
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="group relative bg-white border border-slate-200 rounded-xl p-3 
                     shadow-sm hover:shadow-md hover:border-blue-400/40 
                     transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {site.logoUrl ? (
                  <img
                    src={site.logoUrl}
                    className="w-full h-full object-contain"
                    alt={site.name}
                  />
                ) : (
                  <ExternalLink className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 text-sm truncate">
                  {site.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono truncate">{site.url}</p>
                <span
                  className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    site.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      site.isActive ? "bg-green-500" : "bg-slate-400"
                    }`}
                  />
                  {site.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === site.id ? null : site.id)
                  }
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>

                {openMenu === site.id && (
                  <div className="absolute right-0 top-8 bg-white border border-slate-200 
                                  rounded-lg shadow-lg py-1 z-10 min-w-32">
                    <button
                      onClick={() => {
                        setSelectedSite(site);
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
                        toggleStatus(site);
                        setOpenMenu(null);
                      }}
                      disabled={actionLoading === site.id}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 
                                hover:bg-slate-50"
                    >
                      {site.isActive ? (
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
                        handleDelete(site.id);
                        setOpenMenu(null);
                      }}
                      disabled={actionLoading === site.id}
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

      {!loading && filteredSites.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          {search ? "No se encontraron sitios externos" : "No hay sitios externos registrados"}
        </div>
      )}

      {showForm && (
        <ExternalSiteForm
          site={selectedSite}
          onClose={() => {
            setShowForm(false);
            setSelectedSite(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}