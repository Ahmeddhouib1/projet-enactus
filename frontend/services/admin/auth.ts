import { authApi } from "@/lib/api-client";
import type { CurrentAdmin, LoginPayload, LoginResponse } from "@/types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await authApi.post<LoginResponse>("/login", payload);
  return data;
}

export async function getCurrentAdmin(): Promise<CurrentAdmin> {
  const { data } = await authApi.get<CurrentAdmin>("/me");
  return data;
}
