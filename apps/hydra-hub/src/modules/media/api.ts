import { apiFetch } from "@/lib/api-client"

export async function uploadPlatformLogo(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const data = await apiFetch("/media/upload", {
    method: "POST",
    body: formData,

    // 👇 IMPORTANTE
    isFormData: true, // esto lo usaremos en apiFetch
  })

  return data.url
}