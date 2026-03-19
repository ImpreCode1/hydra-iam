"use client";

import { useEffect, useState, useMemo } from "react";
import { getPositions} from "@/modules/positions/api";
import { getRoles } from "@/modules/roles/api";
import { DataTable } from "@/components/ui/DataTable";
import { PositionRoleAccess } from "@/components/positions/PositionRoleAccess";

interface Position {
  id: string;
  name: string;
  description?: string;
}

interface Role {
  id: string;
  name: string;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

  // Cargar posiciones y roles disponibles
  useEffect(() => {
    loadPositions();
    loadRoles();
  }, []);

  async function loadPositions() {
    setLoading(true);
    try {
      const data = await getPositions();
      setPositions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    }
  }

  // Columnas para DataTable
  const columns = useMemo(
    () => [
      {
        header: "Nombre",
        render: (position: Position) => (
          <span className="font-medium text-gray-900">{position.name}</span>
        ),
      },
      {
        header: "Descripción",
        render: (position: Position) => (
          <span className="text-gray-600">{position.description || "—"}</span>
        ),
      },
      {
        header: "Acciones",
        render: (position: Position) => (
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedPositionId(position.id)}
              className="text-indigo-600 hover:underline"
            >
              Roles
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Cargos</h1>
          <p className="text-gray-600">Administra los cargos y sus roles asociados</p>
        </div>
      </div>

      {/* TABLE */}
      <DataTable
        data={positions}
        columns={columns}
        loading={loading}
        emptyMessage="No hay cargos registrados"
      />

      {/* ROLES PANEL */}
      {selectedPositionId && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Roles del cargo</h2>
            <button
              onClick={() => setSelectedPositionId(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>

          <PositionRoleAccess
            positionId={selectedPositionId}
            allRoles={roles}
          />
        </div>
      )}
    </div>
  );
}