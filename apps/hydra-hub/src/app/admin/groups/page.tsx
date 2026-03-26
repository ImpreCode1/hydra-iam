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
import { Shield, Layers, X, Plus } from "lucide-react";

/* =========================
   HELPERS
========================= */

function Chips({ items }: { items: { id: string; name: string }[] }) {
  const MAX = 2;

  return (
    <div className="flex flex-wrap gap-1">
      {items.slice(0, MAX).map((i) => (
        <span
          key={i.id}
          className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 border"
        >
          {i.name}
        </span>
      ))}

      {items.length > MAX && (
        <span className="text-xs text-gray-400">
          +{items.length - MAX}
        </span>
      )}
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function PositionGroupsPage() {
  const [groups, setGroups] = useState<PositionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] =
    useState<PositionGroup | null>(null);

  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allPositions, setAllPositions] = useState<Position[]>([]);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    try {
      const data = await getPositionGroups();
      setGroups(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    const name = prompt("Nombre del grupo");
    if (!name) return;

    await createPositionGroup({ name });
    await loadGroups();
  }

  async function openGroup(group: PositionGroup) {
    setSelectedGroup(group);

    const [roles, positions] = await Promise.all([
      getRoles(),
      getPositions(),
    ]);

    setAllRoles(roles);
    setAllPositions(positions);
  }

  function closeModal() {
    setSelectedGroup(null);
  }

  /* =========================
     ACTIONS
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

  async function addPosition(positionId: string) {
    if (!selectedGroup) return;
    await assignPositionToGroup(selectedGroup.id, positionId);
    await loadGroups();
  }

  async function removePosition(positionId: string) {
    if (!selectedGroup) return;
    await removePositionFromGroup(positionId);
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
          <p className="font-semibold text-gray-900">{g.name}</p>
          <p className="text-xs text-gray-500">
            {g.description || "Sin descripción"}
          </p>
        </div>
      ),
    },
    {
      header: "Roles",
      render: (g: PositionGroup) => (
        <Chips
          items={g.roles.map((r) => ({
            id: r.role.id,
            name: r.role.name,
          }))}
        />
      ),
    },
    {
      header: "Cargos",
      render: (g: PositionGroup) => (
        <Chips items={g.positions} />
      ),
    },
    {
      header: "Acciones",
      render: (g: PositionGroup) => (
        <button
          onClick={() => openGroup(g)}
          className="group p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition relative"
        >
          <Layers className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />

          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Gestionar
          </span>
        </button>
      ),
    },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Grupos de Cargos
        </h1>
        <p className="text-sm text-gray-500">
          Administra roles compartidos por cargos
        </p>
      </div>

      {/* SEARCH + CREATE */}
      <div className="flex gap-3">
        <input
          placeholder="Buscar grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Crear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable data={filtered} columns={columns} loading={loading} />
      </div>

      {/* MODAL */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* CONTENT */}
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                {selectedGroup.name}
              </h2>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ROLES */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Roles
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedGroup.roles.map((r) => (
                  <span
                    key={r.role.id}
                    onClick={() => removeRole(r.role.id)}
                    className="cursor-pointer px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    {r.role.name} ✕
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addRole(e.target.value)}
                className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Cargos
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedGroup.positions.map((p) => (
                  <span
                    key={p.id}
                    onClick={() => removePosition(p.id)}
                    className="cursor-pointer px-2 py-1 text-xs rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
                  >
                    {p.name} ✕
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addPosition(e.target.value)}
                className="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option>Agregar cargo</option>
                {allPositions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}