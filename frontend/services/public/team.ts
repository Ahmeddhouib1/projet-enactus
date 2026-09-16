import { publicApi } from "@/lib/api-client";
import type { TeamMember } from "@/types/team";

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await publicApi.get<TeamMember[]>("/team");
  return data;
}
