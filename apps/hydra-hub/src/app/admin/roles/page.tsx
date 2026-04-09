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
            <span className="font-semibold text-slate-900">
              {role.name}
            </span>
            <span className="text-xs text-slate-500">
              {role.description || "Sin descripción"}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        render: (role: Role) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRoleId(role.id)}
              className="group p-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition"
              title="Gestionar permisos"
            >
              <Shield className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
            </button>

            <button
              onClick={() => handleDeleteRole(role.id)}
              className="group p-2 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 transition"
              title="Eliminar rol"
            >
              <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-600" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="section-title">Gestión de Roles</h1>
        <p className="section-subtitle">
          Administra los roles y sus permisos dentro de Hydra
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Nombre del rol"
            value={newRole.name}
            onChange={(e) =>
              setNewRole({ ...newRole, name: e.target.value })
            }
            className="input-corporate flex-1"
          />

          <input
            type="text"
            placeholder="Descripción"
            value={newRole.description}
            onChange={(e) =>
              setNewRole({ ...newRole, description: e.target.value })
            }
            className="input-corporate flex-1"
          />

          <button
            onClick={handleCreateRole}
            disabled={creating}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {creating ? "Creando..." : "Crear"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable
          data={roles}
          columns={columns}
          loading={loading}
          emptyMessage="No hay roles registrados"
        />
      </div>

      {selectedRoleId && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Permisos del rol
            </h2>

            <button
              onClick={() => setSelectedRoleId(null)}
              className="btn-ghost text-sm"
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