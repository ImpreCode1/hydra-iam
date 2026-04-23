"use client";

/**
 * Componente de formulario para crear plataformas.
 * Maneja la creación de nuevas plataformas con logo opcional.
 */
import { useState, useEffect } from "react";
import { createPlatform } from "@/modules/platforms/api";
import { uploadPlatformLogo } from "@/modules/media/api";

/**
 * Formulario para crear una nueva plataforma.
 * @param onCreated - Callback ejecutado después de crear la plataforma
 */
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-5">
        Crear Plataforma
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Código</label>
            <input
              className="input-corporate uppercase"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>
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
          <label className="text-sm font-medium text-slate-600 mb-1.5 block">Descripción</label>
          <textarea
            className="input-corporate min-h-[80px] resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          {loading ? "Creando..." : "Crear Plataforma"}
        </button>
      </form>
    </div>
  );
}