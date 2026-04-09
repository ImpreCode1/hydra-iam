/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  getUsers,
  getUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
  changeUserStatus,
  type User,
  type Role,
} from "@/modules/users/api";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetch } from "@/lib/api-client";
import { Search } from "lucide-react";

/* =========================
   ROLES
========================= */

async function getAllRoles(): Promise<Role[]> {
  return apiFetch("/roles");
}

/* =========================
   UI HELPERS
========================= */

function RolesCell({ roles }: { roles: Role[] }) {
  const MAX_VISIBLE = 2;

  if (!roles || roles.length === 0) {
    return <span className="text-xs text-slate-400">Sin roles</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {roles.slice(0, MAX_VISIBLE).map((role) => (
        <span
          key={role.id}
          className="badge badge-primary"
        >
          {role.name}
        </span>
      ))}

      {roles.length > MAX_VISIBLE && (
        <span
          title={roles.map((r) => r.name).join(", ")}
          className="text-xs text-slate-500 cursor-default"
        >
          +{roles.length - MAX_VISIBLE}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`badge flex items-center gap-1.5 w-fit ${
        isActive ? "badge-success" : "badge-danger"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

/* =========================
   PAGE
========================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  /* =========================
     LOAD USERS
  ========================= */

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  /* =========================
     STATUS
  ========================= */

  async function toggleStatus(user: User) {
    try {
      await changeUserStatus(user.id, !user.isActive);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
     COLUMNS
  ========================= */

  const columns = [
    {
      header: "Usuario",
      render: (user: User) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">
            {user.name || "Sin nombre"}
          </span>
          <span className="text-xs text-slate-500">{user.email}</span>
        </div>
      ),
    },
    {
      header: "Cargo",
      render: (user: User) => (
        <span className="text-sm text-slate-600">
          {user.position?.name || "—"}
        </span>
      ),
    },
    {
      header: "Roles",
      render: (user: User) => <RolesCell roles={user.roles || []} />,
    },
    {
      header: "Estado",
      render: (user: User) => <StatusBadge isActive={user.isActive} />,
    },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="section-title">Gestión de Usuarios</h1>
          <p className="section-subtitle">
            Administra accesos, roles y estado de los usuarios en Hydra
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuario por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 
                     text-sm text-slate-800 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30
                     focus:border-[var(--primary)] transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          emptyMessage="No hay usuarios registrados"
        />
      </div>
    </div>
  );
}