// src/modules/positions/api.ts
import { apiFetch } from "@/lib/api-client";

export interface Position {
  id: string;
  name: string;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
}

// Obtener todos los cargos
export function getPositions(): Promise<Position[]> {
  return apiFetch("/positions");
}

// Obtener un cargo específico
export function getPosition(id: string): Promise<Position> {
  return apiFetch(`/positions/${id}`);
}

// Obtener roles asignados a un cargo
export function getPositionRoles(positionId: string): Promise<Role[]> {
  return apiFetch(`/positions/${positionId}/roles`);
}

// Asignar rol a cargo
export function assignRoleToPosition(positionId: string, roleId: string) {
  return apiFetch(`/positions/${positionId}/roles/${roleId}`, {
    method: "POST",
  });
}

// Remover rol de cargo
export function removeRoleFromPosition(positionId: string, roleId: string) {
  return apiFetch(`/positions/${positionId}/roles/${roleId}`, {
    method: "DELETE",
  });
}