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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Editar Plataforma</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-sm text-gray-600">Nombre</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>

          {/* Código */}
          <div>
            <label className="text-sm text-gray-600">Código</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>

          {/* URL */}
          <div>
            <label className="text-sm text-gray-600">URL</label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-sm border rounded-md"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
