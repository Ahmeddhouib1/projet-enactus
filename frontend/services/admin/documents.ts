import { adminApi } from "@/lib/api-client";
import type { Document, DocumentInput, DocumentScope } from "@/types/document";

export async function listDocumentsByScope(scope: DocumentScope): Promise<Document[]> {
  const { data } = await adminApi.get<Document[]>("/documents", { params: { scope } });
  return data;
}

export async function listDocumentsByProject(projectId: number): Promise<Document[]> {
  const { data } = await adminApi.get<Document[]>("/documents", { params: { projectId } });
  return data;
}

export async function createDocument(payload: DocumentInput): Promise<Document> {
  const { data } = await adminApi.post<Document>("/documents", payload);
  return data;
}

export async function deleteDocument(id: number): Promise<void> {
  await adminApi.delete(`/documents/${id}`);
}
