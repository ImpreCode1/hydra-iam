"use client";

import { useState, useEffect } from "react";
import { updateExternalSite, ExternalSite } from "@/modules/external-sites/api";
import { uploadMedia } from "@/modules/media/api";
import { X } from "lucide-react";

interface EditExternalSiteModalProps {
  site: ExternalSite;
  onClose: () => void;
  onUpdated: (updated: ExternalSite) => void;
}

export function EditExternalSiteModal({ site, onClose, onUpdated }: EditExternalSiteModalProps) {
  const [name, setName] = useState(site.name);
  const [url, setUrl] = useState(site.url);
  const [sortOrder, setSortOrder] = useState(site.sortOrder);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(site.logoUrl || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview && preview !== site.logoUrl) URL.revokeObjectURL(preview);
    };
  }, [preview, site.logoUrl]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = site.logoUrl;

      if (file) {
        const res = await uploadMedia(file);
        logoUrl = res.url;
      }

      const updated = await updateExternalSite(site.id, {
        name,
        url,
        sortOrder,
        logoUrl,
      });

      onUpdated(updated);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error actualizando sitio");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-lg font-semibold text-slate-800 mb-5">
          Editar Sitio Externo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre</label>
            <input
              className="input-corporate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">URL</label>
            <input
              className="input-corporate"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Orden</label>
            <input
              type="number"
              className="input-corporate"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">Logo</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 transition px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-300">
                Cambiar imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {file && (
                <span className="text-sm text-slate-500 truncate max-w-[200px]">
                  {file.name}
                </span>
              )}
            </div>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded-xl border shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}