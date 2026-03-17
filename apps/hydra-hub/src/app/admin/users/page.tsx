"use client";

import { useEffect, useState } from "react";
import { getUsers, type User } from "@/modules/users/api";
import { DataTable } from "@/components/ui/DataTable"

const columns = [
  {
    header: "Usuario",
    render: (user: User) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {user.name || "Sin nombre"}
        </span>
        <span className="text-xs text-gray-500">
          {user.email}
        </span>
      </div>
    ),
  },
  {
    header: "Cargo",
    render: (user: User) => user.position?.name || "—",
  },
  {
    header: "Roles",
    render: (user: User) => (
      <div className="flex flex-wrap gap-2">
        {user.roles?.length === 0 && (
          <span className="text-xs text-gray-400">Sin roles</span>
        )}

        {user.roles?.map((role) => (
          <span
            key={role.id}
            className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-200"
          >
            {role.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    header: "Plataformas",
    render: (user: User) => (
      <div className="flex flex-wrap gap-2">
        {user.platforms?.length === 0 && (
          <span className="text-xs text-gray-400">
            Sin plataformas
          </span>
        )}

        {user.platforms?.map((platform) => (
          <span
            key={platform.id}
            className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-200"
          >
            {platform.name}
          </span>
        ))}
      </div>
    ),
  },
  {
    header: "Estado",
    render: (user: User) => (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-md ${
          user.isActive
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-red-100 text-red-700 border border-red-200"
        }`}
      >
        {user.isActive ? "Activo" : "Inactivo"}
      </span>
    ),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestión de Usuarios
          </h1>

          <p className="text-gray-600">
            Administra los usuarios registrados en Hydra
          </p>
        </div>
      </div>

      {/* SEARCH */}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* TABLE */}

      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
        <DataTable
          data={filteredUsers}
          columns={columns}
          loading={loading}
        />
      </div>
    </div>
  );
}
