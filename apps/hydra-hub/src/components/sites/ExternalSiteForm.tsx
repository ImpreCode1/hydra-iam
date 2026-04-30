"use client";

import { useState } from "react";
import { createExternalSite, updateExternalSite, ExternalSite } from "@/modules/sites/api";
import { X } from "lucide-react";

interface ExternalSiteFormProps {
  site?: ExternalSite | null;
  onClose: () => void;
  onSave: (site: ExternalSite) => void;
}

export function ExternalSiteForm({ site, onClose, onSave }: ExternalSiteFormProps) {
  const [name, setName] = useState(site?.name || "");
  const [url, setUrl] = useState(site?.url || "");
  const [logoUrl, setLogoUrl] = useState(site?.logoUrl || "");
  const [description, setDescription] = useState(site?.description || "");
  const [sortOrder, setSortOrder] = useState(site?.sortOrder || 0);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      alert("Nombre y URL son obligatorios");
      return;
    }

    try {
      setLoading(true);
      const data = {
        name: name.trim(),
        url: url.trim(),
        logoUrl: logoUrl.trim() || undefined,
        description: description.trim() || undefined,
        sortOrder,
      };

      let saved: ExternalSite;
      if (site) {
        saved = await updateExternalSite(site.id, data);
      } else {
        saved = await createExternalSite(data);
      }
      onSave(saved);
    } catch (err) {
      console.error(err);
      alert("Error guardando");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {site ? "Editar Sitio Externo" : "Nuevo Sitio Externo"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="Ej: CRM David"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL del Logo
            </label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="https://.../logo.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              rows={2}
              placeholder="Descripción opcional..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Orden
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white font-medium 
                       rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}