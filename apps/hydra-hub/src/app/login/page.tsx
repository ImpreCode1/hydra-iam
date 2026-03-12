"use client"

import { loginWithMicrosoft } from "@/modules/auth/api"

export default function LoginPage() {

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px"
      }}
    >

      <h1>Hydra IAM</h1>

      <button
        onClick={loginWithMicrosoft}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Login with Microsoft
      </button>

    </div>
  )
}