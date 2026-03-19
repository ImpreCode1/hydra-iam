"use client"

import { useEffect, useState, useCallback } from "react"
import {
  getPlatforms,
  getPlatformRoles,
  assignRoleToPlatform,
  removeRoleFromPlatform,
} from "@/modules/platforms/api"

interface Platform {
  id: string
  name: string
}

interface Role {
  id: string
  name: string
}

export function RolePlatformAccess({ roleId }: { roleId: string }) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [processingMap, setProcessingMap] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const allPlatforms = await getPlatforms()
      const checks: Record<string, boolean> = {}

      await Promise.all(
        allPlatforms.map(async (p) => {
          const roles: Role[] = await getPlatformRoles(p.id)
          checks[p.id] = roles.some((r) => r.id === roleId)
        }),
      )

      setPlatforms(allPlatforms)
      setCheckedMap(checks)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [roleId])

  useEffect(() => {
    load()
  }, [load])

  async function toggle(platformId: string) {
    if (processingMap[platformId]) return // previene doble click

    setProcessingMap((prev) => ({ ...prev, [platformId]: true }))

    try {
      const isChecked = checkedMap[platformId]

      if (isChecked) {
        await removeRoleFromPlatform(platformId, roleId)
      } else {
        await assignRoleToPlatform(platformId, roleId)
      }

      // Confirmamos el cambio recargando los roles de esa plataforma
      const roles: Role[] = await getPlatformRoles(platformId)
      setCheckedMap((prev) => ({
        ...prev,
        [platformId]: roles.some((r) => r.id === roleId),
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setProcessingMap((prev) => ({ ...prev, [platformId]: false }))
    }
  }

  if (loading) {
    return <p className="text-gray-500">Cargando accesos...</p>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Acceso a plataformas</h3>

      <div className="space-y-3">
        {platforms.map((platform) => {
          const isChecked = checkedMap[platform.id] || false
          const isProcessing = processingMap[platform.id] || false

          return (
            <label
              key={platform.id}
              className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition hover:bg-gray-50 ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <span>{platform.name}</span>
              <input
                type="checkbox"
                checked={isChecked}
                disabled={isProcessing}
                onChange={() => toggle(platform.id)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}