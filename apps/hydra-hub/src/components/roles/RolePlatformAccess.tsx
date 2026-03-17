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

  const load = useCallback(async () => {
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
    const isChecked = checkedMap[platformId]

    setCheckedMap((prev) => ({
      ...prev,
      [platformId]: !isChecked,
    }))

    try {
      if (isChecked) {
        await removeRoleFromPlatform(platformId, roleId)
      } else {
        await assignRoleToPlatform(platformId, roleId)
      }
    } catch (err) {
      console.error(err)

      setCheckedMap((prev) => ({
        ...prev,
        [platformId]: isChecked,
      }))
    }
  }

  if (loading) {
    return <p className="text-gray-500">Cargando accesos...</p>
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      <h3 className="font-semibold mb-4">
        Acceso a plataformas
      </h3>

      <div className="space-y-3">

        {platforms.map((platform) => (
          <label
            key={platform.id}
            className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
          >
            <span>{platform.name}</span>

            <input
              type="checkbox"
              checked={checkedMap[platform.id] || false}
              onChange={() => toggle(platform.id)}
            />
          </label>
        ))}

      </div>

    </div>
  )
}