"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getPlatforms,
  getPlatformRoles,
  assignRoleToPlatform,
  removeRoleFromPlatform,
} from "@/modules/platforms/api";

// Tipos de datos
interface Platform {
  id: string;
  name: string;
  code: string;
  url: string;
  isActive: boolean;
}

type RoleApiResponse =
  | { role: { id: string; name: string } }
  | { id: string; name: string };

interface RolePlatformAccessProps {
  roleId: string;
}

export function RolePlatformAccess({ roleId }: RolePlatformAccessProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [processingMap, setProcessingMap] = useState<Record<string, boolean>>({});

  // Carga inicial de plataformas y roles
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const allPlatforms: Platform[] = await getPlatforms();
      const platformRolesResponses = await Promise.all(
        allPlatforms.map((p) => getPlatformRoles(p.id))
      );

      const checks: Record<string, boolean> = {};

      allPlatforms.forEach((platform, index) => {
        const roles: RoleApiResponse[] = platformRolesResponses[index];
        const roleIds = roles.map((r) => ("role" in r ? r.role.id : r.id));
        checks[platform.id] = roleIds.includes(roleId);
      });

      setPlatforms(allPlatforms);
      setCheckedMap(checks);
    } catch (error) {
      console.error("Error cargando plataformas y roles:", error);
    } finally {
      setLoading(false);
    }
  }, [roleId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (platformId: string) => {
    if (processingMap[platformId]) return;

    setProcessingMap((prev) => ({ ...prev, [platformId]: true }));

    try {
      const isChecked = checkedMap[platformId];

      if (isChecked) {
        await removeRoleFromPlatform(platformId, roleId);
      } else {
        await assignRoleToPlatform(platformId, roleId);
      }

      const roles: RoleApiResponse[] = await getPlatformRoles(platformId);
      const roleIds = roles.map((r) => ("role" in r ? r.role.id : r.id));

      setCheckedMap((prev) => ({
        ...prev,
        [platformId]: roleIds.includes(roleId),
      }));
    } catch (error) {
      console.error("Error actualizando rol en la plataforma:", error);
    } finally {
      setProcessingMap((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-gray-500 text-lg animate-pulse">
          Cargando accesos...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-lg">
      <h3 className="font-bold text-xl mb-6 text-gray-800">Acceso a plataformas</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {platforms.map((platform) => {
          const isChecked = checkedMap[platform.id] || false;
          const isProcessing = processingMap[platform.id] || false;

          return (
            <div
              key={platform.id}
              className={`flex items-center justify-between p-4 bg-white rounded-xl shadow-sm transition transform hover:scale-[1.01] hover:shadow-md ${
                isProcessing ? "opacity-60" : "opacity-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">{platform.name}</span>
                  <span className="text-sm text-gray-400">{platform.url}</span>
                </div>
              </div>

              <button
                onClick={() => toggle(platform.id)}
                disabled={isProcessing}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isChecked
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-300"
                } focus:outline-none transition`}
              >
                {isProcessing ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className={`w-5 h-5 text-white transition-transform ${
                      isChecked ? "scale-100" : "scale-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}