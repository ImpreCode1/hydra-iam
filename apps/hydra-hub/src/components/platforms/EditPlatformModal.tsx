"use client";

import { useState, useEffect } from "react";
import { updatePlatform } from "@/modules/platforms/api";
import { uploadPlatformLogo } from "@/modules/media/api";

type Platform = {
  id: string;
  name: string;
  code: string;
  description?: string;
  url: string;
  logoUrl?: string;
  isActive: boolean;
};

interface Props {
  platform: Platform;
  onClose: () => void;
  onUpdated: (updated: Platform) => void;
}

export function EditPlatformModal({ platform, onClose, onUpdated }: Props) {
  const [form, setForm] = useState({
    name: platform.name,
    code: platform.code,
    description: platform.description || "",
    url: platform.url,
    isActive: platform.isActive,
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(platform.logoUrl || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview && preview !== platform.logoUrl) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl: string | undefined;

      if (file) {
        const res = await uploadPlatformLogo(file);
        logoUrl = res.url;
      }

      const updated = await updatePlatform(platform.id, {
        ...form,
        ...(logoUrl && { logoUrl }),
      });

      onUpdated(updated);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error actualizando plataforma");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Editar Plataforma</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Nombre</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-corporate"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Código</label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                className="input-corporate uppercase"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className="input-corporate"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-corporate min-h-[80px] resize-y"
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
                  className="w-20 h-20 object-contain rounded-xl border shadow-sm bg-slate-100"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-sm"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
