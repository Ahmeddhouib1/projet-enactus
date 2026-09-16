import { adminApi } from "@/lib/api-client";
import type { DashboardStats } from "@/types/api";

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await adminApi.get<DashboardStats>("/dashboard");
  return data;
}
