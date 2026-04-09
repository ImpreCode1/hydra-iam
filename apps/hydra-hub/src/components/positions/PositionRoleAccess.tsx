"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getPositionRoles,
  assignRoleToPosition,
  removeRoleFromPosition,
} from "@/modules/positions/api";

interface Role {
  id: string;
  name: string;
}

interface PositionRoleAccessProps {
  positionId: string;
  allRoles: Role[];
}

type RoleApiResponse =
  | { role: { id: string; name: string } }
  | { id: string; name: string };

export function PositionRoleAccess({ positionId, allRoles }: PositionRoleAccessProps) {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [processingMap, setProcessingMap] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const assignedRoles: RoleApiResponse[] = await getPositionRoles(positionId);
      const assignedIds = assignedRoles.map(r => "role" in r ? r.role.id : r.id);

      const map: Record<string, boolean> = {};
      allRoles.forEach(role => {
        map[role.id] = assignedIds.includes(role.id);
      });
      setCheckedMap(map);
    } catch (error) {
      console.error("Error cargando roles de cargo:", error);
    } finally {
      setLoading(false);
    }
  }, [positionId, allRoles]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (roleId: string) => {
    if (processingMap[roleId]) return;
    setProcessingMap(prev => ({ ...prev, [roleId]: true }));

    try {
      const isChecked = checkedMap[roleId];

      if (isChecked) {
        await removeRoleFromPosition(positionId, roleId);
      } else {
        await assignRoleToPosition(positionId, roleId);
      }

      // Recargar estado real desde API
      const assignedRoles: RoleApiResponse[] = await getPositionRoles(positionId);
      const assignedIds = assignedRoles.map(r => "role" in r ? r.role.id : r.id);

      setCheckedMap(prev => ({
        ...prev,
        [roleId]: assignedIds.includes(roleId),
      }));
    } catch (error) {
      console.error("Error actualizando rol en cargo:", error);
    } finally {
      setProcessingMap(prev => ({ ...prev, [roleId]: false }));
    }
  };

  if (loading) {
    return <p className="text-slate-500 text-sm animate-pulse">Cargando roles...</p>;
  }

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
      <h3 className="font-semibold text-slate-800 mb-4">Roles del cargo</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {allRoles.map(role => {
          const isChecked = checkedMap[role.id] || false;
          const isProcessing = processingMap[role.id] || false;

          return (
            <div
              key={role.id}
              className={`flex items-center justify-between p-3.5 bg-white rounded-lg border border-slate-200 transition ${
                isProcessing ? "opacity-60" : ""
              }`}
            >
              <span className="font-medium text-slate-800 text-sm">{role.name}</span>
              <button
                onClick={() => toggle(role.id)}
                disabled={isProcessing}
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg border-2 shrink-0 ${
                  isChecked ? "bg-[var(--primary)] border-[var(--primary)]" : "bg-white border-slate-300"
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
                    className={`w-4 h-4 text-white transition-transform ${isChecked ? "scale-100" : "scale-0"}`}
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