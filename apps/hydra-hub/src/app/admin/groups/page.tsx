"use client";

import { useEffect, useState } from "react";
import {
  getPositionGroups,
  createPositionGroup,
  assignRoleToGroup,
  removeRoleFromGroup,
  assignPositionToGroup,
  removePositionFromGroup,
  type PositionGroup,
} from "@/modules/position-groups/api";

import { getRoles, type Role } from "@/modules/roles/api";
import { getPositions, type Position } from "@/modules/positions/api";

import { DataTable } from "@/components/ui/DataTable";

/* =========================
   PAGE
========================= */

export default function PositionGroupsPage() {
  const [groups, setGroups] = useState<PositionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedGroup, setSelectedGroup] = useState<PositionGroup | null>(
    null,
  );

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allPositions, setAllPositions] = useState<Position[]>([]);

  /* =========================
     LOAD
  ========================= */

  async function loadGroups() {
    try {
      const data = await getPositionGroups();
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroups();
  }, []);

  /* =========================
     CREATE
  ========================= */

  async function handleCreate() {
    const name = prompt("Nombre del grupo");

    if (!name) return;

    await createPositionGroup({ name });
    await loadGroups();
  }

  async function removePosition(positionId: string) {
    if (!selectedGroup) return;

    await removePositionFromGroup(positionId);
    await loadGroups();
  }

  /* =========================
     MODAL
  ========================= */

  async function openGroup(group: PositionGroup) {
    setSelectedGroup(group);

    const [roles, positions] = await Promise.all([getRoles(), getPositions()]);

    setAllRoles(roles);
    setAllPositions(positions);
  }

  function closeModal() {
    setSelectedGroup(null);
  }

  /* =========================
     ROLES
  ========================= */

  async function addRole(roleId: string) {
    if (!selectedGroup) return;

    await assignRoleToGroup(selectedGroup.id, roleId);
    await loadGroups();
  }

  async function removeRole(roleId: string) {
    if (!selectedGroup) return;

    await removeRoleFromGroup(selectedGroup.id, roleId);
    await loadGroups();
  }

  /* =========================
     POSITIONS
  ========================= */

  async function addPosition(positionId: string) {
    if (!selectedGroup) return;

    await assignPositionToGroup(selectedGroup.id, positionId);
    await loadGroups();
  }

  /* =========================
     FILTER
  ========================= */

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* =========================
     COLUMNS
  ========================= */

  const columns = [
    {
      header: "Grupo",
      render: (g: PositionGroup) => (
        <div>
          <p className="font-medium">{g.name}</p>
          <p className="text-xs text-gray-500">{g.description}</p>
        </div>
      ),
    },
    {
      header: "Roles",
      render: (g: PositionGroup) => (
        <div className="flex flex-wrap gap-2">
          {g.roles.map((r) => (
            <span
              key={r.role.id}
              className="px-2 py-1 text-xs rounded bg-purple-50 text-purple-700 border"
            >
              {r.role.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Cargos",
      render: (g: PositionGroup) => (
        <div className="flex flex-wrap gap-2">
          {g.positions.map((p) => (
            <span
              key={p.id}
              className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border"
            >
              {p.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Acciones",
      render: (g: PositionGroup) => (
        <button
          onClick={() => openGroup(g)}
          className="text-xs px-3 py-1 bg-gray-100 rounded"
        >
          Gestionar
        </button>
      ),
    },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Grupos de Cargos</h1>
        <p className="text-gray-600">Administra roles compartidos por cargos</p>
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Crear
        </button>
      </div>

      <DataTable data={filtered} columns={columns} loading={loading} />

      {/* =========================
          MODAL
      ========================= */}

      {selectedGroup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-150 space-y-4">
            <h2 className="text-lg font-semibold">{selectedGroup.name}</h2>

            {/* ROLES */}
            <div>
              <h3 className="font-medium">Roles</h3>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedGroup.roles.map((r) => (
                  <span
                    key={r.role.id}
                    onClick={() => removeRole(r.role.id)}
                    className="cursor-pointer px-2 py-1 text-xs bg-red-50 text-red-700 rounded"
                  >
                    {r.role.name} ✕
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addRole(e.target.value)}
                className="mt-2 border px-2 py-1"
              >
                <option>Agregar rol</option>
                {allRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* POSITIONS */}
            <div>
              <h3 className="font-medium">Cargos</h3>

              <div className="flex flex-wrap gap-2 mt-2">
                {selectedGroup.positions.map((p) => (
                  <span
                    key={p.id}
                    onClick={() => removePosition(p.id)}
                    className="cursor-pointer px-2 py-1 text-xs bg-red-50 text-red-700 rounded"
                  >
                    {p.name} ✕
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addPosition(e.target.value)}
                className="mt-2 border px-2 py-1"
              >
                <option>Agregar cargo</option>
                {allPositions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 bg-gray-200 px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
