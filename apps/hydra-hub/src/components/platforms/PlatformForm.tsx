"use client"

import { useState } from "react"
import { createPlatform } from "@/modules/platforms/api"
import { uploadPlatformLogo } from "@/modules/media/api"

export function PlatformForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl: string | undefined

      if (file) {
        logoUrl = await uploadPlatformLogo(file)
      }

      await createPlatform({
        name,
        code,
        description,
        url,
        logoUrl,
      })

      // reset
      setName("")
      setCode("")
      setDescription("")
      setUrl("")
      setFile(null)
      setPreview(null)

      onCreated()
    } catch (error) {
      console.error(error)
      alert("Error creando plataforma")
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] || null
    setFile(selected)

    if (selected) {
      setPreview(URL.createObjectURL(selected))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 rounded-2xl shadow-md border max-w-lg"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Crear Plataforma
      </h2>

      {/* Nombre */}
      <div>
        <label className="text-sm text-gray-600">Nombre</label>
        <input
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Código */}
      <div>
        <label className="text-sm text-gray-600">Código</label>
        <input
          className="mt-1 w-full border rounded-lg px-3 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          required
        />
      </div>

      {/* URL */}
      <div>
        <label className="text-sm text-gray-600">URL</label>
        <input
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm text-gray-600">Descripción</label>
        <textarea
          className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Upload */}
      <div>
        <label className="text-sm text-gray-600">Logo</label>

        <div className="mt-2 flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-14 h-14 object-cover rounded-lg border"
            />
          )}
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Creando..." : "Crear Plataforma"}
      </button>
    </form>
  )
}