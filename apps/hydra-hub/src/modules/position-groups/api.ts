import { apiFetch } from "@/lib/api-client";

export type PositionGroup = {
  id: string;
  name: string;
  description?: string;
  positions: {
    id: string;
    name: string;
  }[];
  roles: {
    role: {
      id: string;
      name: string;
    };
  }[];
};

// 🔹 Obtener todos los grupos
export function getPositionGroups(): Promise<PositionGroup[]> {
  return apiFetch("/position-groups");
}

// 🔹 Obtener uno
export function getPositionGroup(id: string): Promise<PositionGroup> {
  return apiFetch(`/position-groups/${id}`);
}

// 🔹 Crear grupo
export function createPositionGroup(data: {
  name: string;
  description?: string;
}) {
  return apiFetch("/position-groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 🔹 Asignar rol a grupo
export function assignRoleToGroup(groupId: string, roleId: string) {
  return apiFetch(`/position-groups/${groupId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roleId }),
  });
}

// 🔹 Quitar rol
export function removeRoleFromGroup(groupId: string, roleId: string) {
  return apiFetch(`/position-groups/${groupId}/roles/${roleId}`, {
    method: "DELETE",
  });
}

// 🔹 Asignar cargo al grupo
export function assignPositionToGroup(
  groupId: string,
  positionId: string
) {
  return apiFetch(`/position-groups/${groupId}/positions/${positionId}`, {
    method: "PATCH",
  });
}

// 🔹 Quitar cargo del grupo
export function removePositionFromGroup(positionId: string) {
  return apiFetch(`/position-groups/positions/${positionId}`, {
    method: "DELETE",
  });
}