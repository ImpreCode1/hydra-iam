"use client";

import { useEffect, useState, useMemo } from "react";
import { getRoles, createRole, deleteRole } from "@/modules/roles/api";
import { DataTable } from "@/components/ui/DataTable";
import { RolePlatformAccess } from "@/components/roles/RolePlatformAccess";
import { Shield, Trash2, Plus } from "lucide-react";

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
        header: "Rol",
        render: (role: Role) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {role.name}
            </span>
            <span className="text-xs text-gray-500">
              {role.description || "Sin descripción"}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        render: (role: Role) => (
          <div className="flex items-center gap-2">
            
            {/* PERMISOS */}
            <button
              onClick={() => setSelectedRoleId(role.id)}
              className="group p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition"
              title="Gestionar permisos"
            >
              <Shield className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
            </button>

            {/* ELIMINAR */}
            <button
              onClick={() => handleDeleteRole(role.id)}
              className="group p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition"
              title="Eliminar rol"
            >
              <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
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
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestión de Roles
        </h1>
        <p className="text-sm text-gray-500">
          Administra los roles y sus permisos dentro de Hydra
        </p>
      </div>

      {/* CREATE ROLE */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          
          <input
            type="text"
            placeholder="Nombre del rol"
            value={newRole.name}
            onChange={(e) =>
              setNewRole({ ...newRole, name: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="text"
            placeholder="Descripción"
            value={newRole.description}
            onChange={(e) =>
              setNewRole({ ...newRole, description: e.target.value })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleCreateRole}
            disabled={creating}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={roles}
          columns={columns}
          loading={loading}
          emptyMessage="No hay roles registrados"
        />
      </div>

      {/* PERMISSIONS PANEL */}
      {selectedRoleId && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Permisos del rol
            </h2>

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