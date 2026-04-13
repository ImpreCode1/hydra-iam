/* eslint-disable @next/next/no-img-element */
"use client"

import { loginWithMicrosoft } from "@/modules/auth/api"

export default function MicrosoftButton() {
  return (
    <button onClick={loginWithMicrosoft} className="microsoft-button">

      <img
        src="https://aadcdn.msauth.net/shared/1.0/content/images/favicon_a_eupayfgghqiai7k9sol6lg2.ico"
        alt="Microsoft"
        className="ms-icon"
      />

      Iniciar sesión con Microsoft

    </button>
  )
}