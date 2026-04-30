"use client";

import { useState, useEffect } from "react";
import { createExternalSite } from "@/modules/external-sites/api";
import { uploadMedia } from "@/modules/media/api";

export function ExternalSitesForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl: string | undefined;

      if (file) {
        const res = await uploadMedia(file);
        logoUrl = res.url;
      }

      await createExternalSite({
        name,
        url,
        logoUrl,
        sortOrder,
      });

      setName("");
      setUrl("");
      setSortOrder(0);
      setFile(null);
      setPreview(null);

      onCreated();
    } catch (error) {
      console.error(error);
      alert("Error creando sitio externo");
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Crear Sitio Externo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre</label>
          <input
            className="input-corporate"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Ej: Impresistem"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-600 mb-1.5 block">URL</label>
          <input
            className="input-corporate"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://..."
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
              Seleccionar imagen
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

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Creando..." : "Crear Sitio"}
        </button>
      </form>
    </div>
  );
}