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
        <span className="text-slate-500 text-sm animate-pulse">
          Cargando accesos...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-4">Acceso a plataformas</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {platforms.map((platform) => {
          const isChecked = checkedMap[platform.id] || false;
          const isProcessing = processingMap[platform.id] || false;

          return (
            <div
              key={platform.id}
              className={`flex items-center justify-between p-3.5 bg-white rounded-lg border border-slate-200 transition ${
                isProcessing ? "opacity-60" : ""
              }`}
            >
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-slate-800 text-sm">{platform.name}</span>
                <span className="text-xs text-slate-400 truncate">{platform.url}</span>
              </div>

              <button
                onClick={() => toggle(platform.id)}
                disabled={isProcessing}
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg border-2 shrink-0 ml-2 ${
                  isChecked
                    ? "bg-[var(--primary)] border-[var(--primary)]"
                    : "bg-white border-slate-300"
                } focus:outline-none transition`}
              >
                {isProcessing ? (
                  <svg
                    className="animate-spin h-4 w-4 text-slate-400"
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
                    className={`w-4 h-4 text-white transition-transform ${
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