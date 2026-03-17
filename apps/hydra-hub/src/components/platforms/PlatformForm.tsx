"use client"

import { useState } from "react"
import { createPlatform } from "@/modules/platforms/api"
//import { uploadFile } from "@/modules/uploads/api"

export function PlatformForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      let logoUrl: string | undefined

      // 🧠 1. Subir imagen primero
    //   if (file) {
    //     logoUrl = await uploadFile(file)
    //   }

      // 🧠 2. Crear plataforma
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

      onCreated()
    } catch (error) {
      console.error(error)
      alert("Error creando plataforma")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded">
      <h2 className="font-semibold text-lg">Crear Plataforma</h2>

      <input
        className="border p-2 w-full"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Código (ej: CRM)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* 🔥 Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear"}
      </button>
    </form>
  )
}