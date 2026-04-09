"use client";

import { useState } from "react";
import { updatePlatform } from "@/modules/platforms/api";

type Platform = {
  id: string;
  name: string;
  code: string;
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
    url: platform.url,
    isActive: platform.isActive,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const updated = await updatePlatform(platform.id, form);

      onUpdated(updated); // 🔥 actualiza lista
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
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Editar Plataforma</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
