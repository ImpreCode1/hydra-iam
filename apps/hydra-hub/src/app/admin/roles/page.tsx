"use client";

import { useEffect, useState, useMemo } from "react";
import { getRoles, createRole, deleteRole } from "@/modules/roles/api";
import { DataTable } from "@/components/ui/DataTable";
import { RolePlatformAccess } from "@/components/roles/RolePlatformAccess";

interface Role {
  id: string;
  name: string;
  description?: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRole() {
    if (!newRole.name.trim()) return;

    try {
      setCreating(true);

      await createRole(newRole);

      setNewRole({ name: "", description: "" });
      await loadRoles();

      // feedback simple
      alert("Rol creado correctamente");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteRole(id: string) {
    if (!confirm("¿Eliminar este rol?")) return;

    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        render: (role: Role) => (
          <span className="font-medium text-gray-900">{role.name}</span>
        ),
      },
      {
        header: "Descripción",
        render: (role: Role) => (
          <span className="text-gray-600">{role.description || "—"}</span>
        ),
      },
      {
        header: "Acciones",
        render: (role: Role) => (
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedRoleId(role.id)}
              className="text-indigo-600 hover:underline"
            >
              Permisos
            </button>

            <button
              onClick={() => handleDeleteRole(role.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestión de Roles
          </h1>

          <p className="text-gray-600">Administra los roles del sistema</p>
        </div>
      </div>

      {/* CREATE ROLE */}

      <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
        <input
          type="text"
          placeholder="Nombre del rol"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-1/3"
        />

        <input
          type="text"
          placeholder="Descripción"
          value={newRole.description}
          onChange={(e) =>
            setNewRole({ ...newRole, description: e.target.value })
          }
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-1/2"
        />

        <button
          onClick={handleCreateRole}
          disabled={creating}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {creating ? "Creando..." : "Crear"}
        </button>
      </div>

      {/* TABLE */}

      <DataTable
        data={roles}
        columns={columns}
        loading={loading}
        emptyMessage="No hay roles registrados"
      />

      {/* PERMISSIONS PANEL */}

      {selectedRoleId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Permisos del rol</h2>

            <button
              onClick={() => setSelectedRoleId(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>

          <RolePlatformAccess roleId={selectedRoleId} />
        </div>
      )}
    </div>
  );
}
