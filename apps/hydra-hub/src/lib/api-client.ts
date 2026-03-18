const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  isFormData?: boolean;
};

async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
) {
    const isFormData =
    options.isFormData ?? options.body instanceof FormData;

  const hasBody = !!options.body;

  const baseHeaders: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!isFormData && hasBody) {
    baseHeaders["Content-Type"] = "application/json";
  }
  const makeRequest = () =>
    fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: baseHeaders,
    });

  let response = await makeRequest();

  // 🔁 Manejo de refresh token
  if (response.status === 401) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired");
    }

    response = await makeRequest();
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return handleResponse(response);
}

async function handleResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response;
}