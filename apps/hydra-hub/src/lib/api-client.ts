const API_URL = process.env.NEXT_PUBLIC_API_URL

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    })

    if (!res.ok) {
      throw new Error("Refresh failed")
    }

    return true
  } catch {
    return false
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  })

  // Si el access token expiró
  if (response.status === 401) {

    const refreshed = await refreshToken()

    if (!refreshed) {
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }

      throw new Error("Session expired")
    }

    // Reintentar request original
    const retry = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    })

    if (!retry.ok) {
      throw new Error("API Error")
    }

    return retry.json()
  }

  if (!response.ok) {
    throw new Error("API Error")
  }

  return response.json()
}