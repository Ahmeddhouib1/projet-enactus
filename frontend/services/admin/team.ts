import { adminApi } from "@/lib/api-client";
import type { AdminTeamMember, TeamMemberInput } from "@/types/team";

export async function listAdminTeam(): Promise<AdminTeamMember[]> {
  const { data } = await adminApi.get<AdminTeamMember[]>("/team");
  return data;
}

export async function createTeamMember(payload: TeamMemberInput): Promise<AdminTeamMember> {
  const { data } = await adminApi.post<AdminTeamMember>("/team", payload);
  return data;
}

export async function updateTeamMember(id: number, payload: TeamMemberInput): Promise<AdminTeamMember> {
  const { data } = await adminApi.put<AdminTeamMember>(`/team/${id}`, payload);
  return data;
}

export async function deleteTeamMember(id: number): Promise<void> {
  await adminApi.delete(`/team/${id}`);
}

export async function reorderTeamMembers(orderedIds: number[]): Promise<void> {
  await adminApi.put("/team/reorder", { orderedIds });
}
