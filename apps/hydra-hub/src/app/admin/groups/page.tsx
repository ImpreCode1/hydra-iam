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
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, MAX).map((i) => (
        <span
          key={i.id}
          className="badge bg-slate-100 text-slate-700 border border-slate-200"
        >
          {i.name}
        </span>
      ))}

      {items.length > MAX && (
        <span className="text-xs text-slate-400">
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
          <p className="font-semibold text-slate-900">{g.name}</p>
          <p className="text-xs text-slate-500">
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
          className="group p-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition"
        >
          <Layers className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
        </button>
      ),
    },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="section-title">Grupos de Cargos</h1>
          <p className="section-subtitle">
            Administra roles compartidos por cargos
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Crear
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <input
          placeholder="Buscar grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-corporate"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable data={filtered} columns={columns} loading={loading} />
      </div>

      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                {selectedGroup.name}
              </h2>

              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Roles
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedGroup.roles.map((r) => (
                  <span
                    key={r.role.id}
                    onClick={() => removeRole(r.role.id)}
                    className="cursor-pointer badge badge-danger"
                  >
                    {r.role.name}
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addRole(e.target.value)}
                className="input-corporate mt-3"
              >
                <option value="">Agregar rol</option>
                {allRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">
                Cargos
              </h3>

              <div className="flex flex-wrap gap-2">
                {selectedGroup.positions.map((p) => (
                  <span
                    key={p.id}
                    onClick={() => removePosition(p.id)}
                    className="cursor-pointer badge badge-danger"
                  >
                    {p.name}
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => addPosition(e.target.value)}
                className="input-corporate mt-3"
              >
                <option value="">Agregar cargo</option>
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