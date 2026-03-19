"use client";

import { useState, useEffect } from "react";
import { createPlatform } from "@/modules/platforms/api";
import { uploadPlatformLogo } from "@/modules/media/api";

export function PlatformForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // 🔥 liberar memoria del preview
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
        const res = await uploadPlatformLogo(file);
        logoUrl = res.url;
      }

      await createPlatform({
        name,
        code,
        description,
        url,
        logoUrl,
      });

      // reset
      setName("");
      setCode("");
      setDescription("");
      setUrl("");
      setFile(null);
      setPreview(null);

      onCreated();
    } catch (error) {
      console.error(error);
      alert("Error creando plataforma");
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        Crear Plataforma
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="text-sm text-gray-600">Nombre</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Código */}
        <div>
          <label className="text-sm text-gray-600">Código</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </div>

        {/* URL */}
        <div>
          <label className="text-sm text-gray-600">URL</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="text-sm text-gray-600">Descripción</label>
          <textarea
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Upload mejorado */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">Logo</label>

          <div className="flex items-center gap-4">
            {/* Botón bonito */}
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg text-sm font-medium border border-gray-300">
              Seleccionar imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Nombre del archivo */}
            {file && (
              <span className="text-sm text-gray-500 truncate max-w-37.5">
                {file.name}
              </span>
            )}
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 object-cover rounded-xl border shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Botón */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 hover:bg-black transition text-white py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Plataforma"}
        </button>
      </form>
    </div>
  );
}