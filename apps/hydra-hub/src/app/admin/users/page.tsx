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
   HELPERS UI
========================= */

function RolesCell({ roles }: { roles: Role[] }) {
  const MAX_VISIBLE = 2;

  if (!roles || roles.length === 0) {
    return <span className="text-xs text-gray-400">Sin roles</span>;
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {roles.slice(0, MAX_VISIBLE).map((role) => (
        <span
          key={role.id}
          className="px-2 py-1 text-xs rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200"
        >
          {role.name}
        </span>
      ))}

      {roles.length > MAX_VISIBLE && (
        <span
          title={roles.map((r) => r.name).join(", ")}
          className="text-xs text-gray-500 cursor-default"
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
      className={`px-2 py-1 text-xs font-medium rounded-md border flex items-center gap-1 w-fit ${
        isActive
          ? "bg-green-100 text-green-700 border-green-200"
          : "bg-red-100 text-red-700 border-red-200"
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
          <span className="font-medium text-gray-900">
            {user.name || "Sin nombre"}
          </span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      ),
    },
    {
      header: "Cargo",
      render: (user: User) => (
        <span className="text-sm text-gray-700">
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
    // {
    //   header: "Acciones",
    //   render: (user: User) => (
    //     <div className="flex gap-2">
    //       <button
    //         onClick={() => toggleStatus(user)}
    //         className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition"
    //       >
    //         {user.isActive ? "Desactivar" : "Activar"}
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-gray-500">
          Administra accesos, roles y estado de los usuarios en Hydra
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar usuario por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
          rowClassName="hover:bg-gray-50 transition"
        />
      </div>
    </div>
  );
}