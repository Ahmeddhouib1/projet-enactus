import { adminApi } from "@/lib/api-client";
import type { AdminPartner, PartnerInput } from "@/types/partner";

export async function listAdminPartners(): Promise<AdminPartner[]> {
  const { data } = await adminApi.get<AdminPartner[]>("/partners");
  return data;
}

export async function createPartner(payload: PartnerInput): Promise<AdminPartner> {
  const { data } = await adminApi.post<AdminPartner>("/partners", payload);
  return data;
}

export async function updatePartner(id: number, payload: PartnerInput): Promise<AdminPartner> {
  const { data } = await adminApi.put<AdminPartner>(`/partners/${id}`, payload);
  return data;
}

export async function deletePartner(id: number): Promise<void> {
  await adminApi.delete(`/partners/${id}`);
}

export async function reorderPartners(orderedIds: number[]): Promise<void> {
  await adminApi.put("/partners/reorder", { orderedIds });
}
