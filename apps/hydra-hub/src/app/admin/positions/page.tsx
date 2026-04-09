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
      console.log("Roles cargados:", data);
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
            <span className="font-semibold text-slate-900">
              {position.name}
            </span>
            <span className="text-xs text-slate-500">
              {position.description || "Sin descripción"}
            </span>
          </div>
        ),
      },
      {
        header: "Acciones",
        render: (position: Position) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPositionId(position.id)}
              className="group p-2 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition"
              title="Gestionar roles del cargo"
            >
              <Shield className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="section-title">Gestión de Cargos</h1>
        <p className="section-subtitle">
          Administra los cargos organizacionales y sus roles asociados
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable
          data={positions}
          columns={columns}
          loading={loading}
          emptyMessage="No hay cargos registrados"
        />
      </div>

      {selectedPositionId && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Roles del cargo
            </h2>

            <button
              onClick={() => setSelectedPositionId(null)}
              className="btn-ghost text-sm"
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