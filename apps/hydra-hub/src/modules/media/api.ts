import { apiFetch } from "@/lib/api-client"

type UploadResponse = {
  filename: string
  path: string
  url: string
  size: number
  mimetype: string
}

export async function uploadPlatformLogo(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const data = await apiFetch("/media/platform-logo", {
    method: "POST",
    body: formData,

    // 👇 IMPORTANTE
    isFormData: true, // esto lo usaremos en apiFetch
  })

  return data
}