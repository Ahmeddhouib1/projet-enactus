import { adminApi } from "@/lib/api-client";
import type { AdminValue, SiteContent, ValueInput } from "@/types/content";

export async function getAdminContent(): Promise<SiteContent> {
  const { data } = await adminApi.get<SiteContent>("/content");
  return data;
}

export async function updateAdminContent(payload: SiteContent): Promise<SiteContent> {
  const { data } = await adminApi.put<SiteContent>("/content", payload);
  return data;
}

export async function listAdminValues(): Promise<AdminValue[]> {
  const { data } = await adminApi.get<AdminValue[]>("/values");
  return data;
}

export async function createValue(payload: ValueInput): Promise<AdminValue> {
  const { data } = await adminApi.post<AdminValue>("/values", payload);
  return data;
}

export async function updateValue(id: number, payload: ValueInput): Promise<AdminValue> {
  const { data } = await adminApi.put<AdminValue>(`/values/${id}`, payload);
  return data;
}

export async function deleteValue(id: number): Promise<void> {
  await adminApi.delete(`/values/${id}`);
}

export async function reorderValues(orderedIds: number[]): Promise<void> {
  await adminApi.put("/values/reorder", { orderedIds });
}
