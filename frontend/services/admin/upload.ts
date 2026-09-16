import { adminApi } from "@/lib/api-client";
import type { UploadResult } from "@/types/api";

export type UploadCategory = "team" | "projects" | "events" | "partners" | "documents" | "misc";

export async function uploadFile(file: File, category: UploadCategory): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await adminApi.post<UploadResult>("/upload", formData, {
    params: { category },
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
