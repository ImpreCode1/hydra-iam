"use client"

import { logout } from "@/modules/auth/api"

export function LogoutButton() {
  return (
    <button
      onClick={logout}
      className="text-sm text-gray-400 hover:text-white transition"
    >
      Logout
    </button>
  )
}