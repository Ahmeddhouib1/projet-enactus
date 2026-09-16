import { publicApi } from "@/lib/api-client";
import type { Partner } from "@/types/partner";

export async function getPartners(): Promise<Partner[]> {
  const { data } = await publicApi.get<Partner[]>("/partners");
  return data;
}
