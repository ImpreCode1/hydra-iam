"use client";

import { useEffect, useState, useMemo } from "react";
import { getPositions } from "@/modules/positions/api";
import { getRoles } from "@/modules/roles/api";
import { DataTable } from "@/components/ui/DataTable";
import { PositionRoleAccess } from "@/components/positions/PositionRoleAccess";
import { Users, Shield } from "lucide-react";

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

  const columns = useMemo(
    () => [
      {
        header: "Cargo",
        render: (position: Position) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {position.name}
            </span>
            <span className="text-xs text-gray-500">
              {position.description || "Sin descripción"}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        render: (position: Position) => (
          <div className="flex items-center gap-2">
            
            {/* GESTIONAR ROLES */}
            <button
              onClick={() => setSelectedPositionId(position.id)}
              className="group p-2 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition"
              title="Gestionar roles del cargo"
            >
              <Shield className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
            </button>

            {/* FUTURO: puedes agregar editar aquí */}
            {/* 
            <button className="group p-2 rounded-lg border hover:bg-gray-50">
              <Users className="w-4 h-4" />
            </button> 
            */}

          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestión de Cargos
        </h1>
        <p className="text-sm text-gray-500">
          Administra los cargos organizacionales y sus roles asociados
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <DataTable
          data={positions}
          columns={columns}
          loading={loading}
          emptyMessage="No hay cargos registrados"
        />
      </div>

      {/* ROLES PANEL */}
      {selectedPositionId && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Roles del cargo
            </h2>

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