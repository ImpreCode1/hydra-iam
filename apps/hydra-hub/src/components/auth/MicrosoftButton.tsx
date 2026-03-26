/* eslint-disable @next/next/no-img-element */
"use client"

import { loginWithMicrosoft } from "@/modules/auth/api"

export default function MicrosoftButton() {
  return (
    <button onClick={loginWithMicrosoft} className="microsoft-button">

      <img
        src="https://cdn.dribbble.com/users/177405/screenshots/14714885/downloads/ms%20symbol.svg"
        alt="Microsoft"
        className="ms-icon"
      />

      Iniciar sesión con Microsoft

    </button>
  )
}