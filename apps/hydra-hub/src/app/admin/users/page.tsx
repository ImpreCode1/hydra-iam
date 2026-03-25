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

/* =========================
   ROLES
========================= */

async function getAllRoles(): Promise<Role[]> {
  return apiFetch("/roles");
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
     ROLES MODAL
  ========================= */

  async function openRolesModal(user: User) {
    try {
      setSelectedUser(user);
      setLoadingRoles(true);

      const [rolesFromApiRaw, all] = await Promise.all([
        getUserRoles(user.id),
        getAllRoles(),
      ]);

      const rolesFromApi = rolesFromApiRaw as unknown as string[];

      /**
       * 🔥 AQUÍ ESTÁ LA CLAVE
       * convertimos string[] → Role[]
       */
      const mappedRoles: Role[] = rolesFromApi
        .map((name) => {
          const role = all.find((r) => r.name === name);

          if (!role) return null;

          return role; // ya tiene id correcto
        })
        .filter(Boolean) as Role[];

      setUserRoles(mappedRoles);
      setAllRoles(all);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoles(false);
    }
  }

  function closeModal() {
    setSelectedUser(null);
    setUserRoles([]);
  }

  async function addRole(roleId: string) {
    if (!selectedUser || !roleId) return;

    try {
      await assignRoleToUser(selectedUser.id, roleId);
      await openRolesModal(selectedUser); // recargar
    } catch (err) {
      console.error(err);
    }
  }

  async function removeRole(roleId: string) {
    if (!selectedUser) return;

    try {
      await removeRoleFromUser(selectedUser.id, roleId);
      await openRolesModal(selectedUser); // recargar
    } catch (err) {
      console.error(err);
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
      render: (user: User) => user.position?.name || "—",
    },
    {
      header: "Roles",
      render: (user: User) => (
        <div className="flex flex-wrap gap-2">
          {user.roles?.length === 0 && (
            <span className="text-xs text-gray-400">Sin roles</span>
          )}

          {user.roles?.map((role, index) => (
            <span
              key={`${role.id}-${user.id}-${index}`}
              className="px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-200"
            >
              {role.name}
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
    {
      header: "Acciones",
      render: (user: User) => (
        <div className="flex gap-2">
          <button
            onClick={() => toggleStatus(user)}
            className="text-xs px-3 py-1 rounded-md bg-gray-100"
          >
            {user.isActive ? "Desactivar" : "Activar"}
          </button>
        </div>
      ),
    },
  ];

  /* =========================
     UI
  ========================= */

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra los usuarios registrados en Hydra
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
        <DataTable data={filteredUsers} columns={columns} loading={loading} />
      </div>
    </div>
  );
}
