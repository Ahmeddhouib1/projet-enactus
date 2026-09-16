import { adminApi } from "@/lib/api-client";
import type { Attendance } from "@/types/activity";
import type { Member, MemberInput } from "@/types/member";

export async function listMembers(projectId?: number): Promise<Member[]> {
  const { data } = await adminApi.get<Member[]>("/members", {
    params: projectId ? { projectId } : undefined,
  });
  return data;
}

export async function getMember(id: number): Promise<Member> {
  const { data } = await adminApi.get<Member>(`/members/${id}`);
  return data;
}

export async function createMember(payload: MemberInput): Promise<Member> {
  const { data } = await adminApi.post<Member>("/members", payload);
  return data;
}

export async function updateMember(id: number, payload: MemberInput): Promise<Member> {
  const { data } = await adminApi.put<Member>(`/members/${id}`, payload);
  return data;
}

export async function deleteMember(id: number): Promise<void> {
  await adminApi.delete(`/members/${id}`);
}

export async function getMemberPresenceSheet(id: number): Promise<Attendance[]> {
  const { data } = await adminApi.get<Attendance[]>(`/members/${id}/attendance`);
  return data;
}

export async function updateMemberAttendance(
  memberId: number,
  activityId: number,
  payload: { present: boolean; remark?: string },
): Promise<Attendance> {
  const { data } = await adminApi.put<Attendance>(`/members/${memberId}/attendance/${activityId}`, payload);
  return data;
}

/** Sets a member's Project Space password - only allowed once, on first use. */
export async function setPmPassword(memberId: number, password: string): Promise<void> {
  await adminApi.post(`/members/${memberId}/pm-password`, { password });
}

export async function verifyPmPassword(memberId: number, password: string): Promise<boolean> {
  const { data } = await adminApi.post<{ valid: boolean }>(`/members/${memberId}/pm-password/verify`, { password });
  return data.valid;
}

/** Admin-only: clears a member's Project Space password so they can set a new one. */
export async function resetPmPassword(memberId: number): Promise<void> {
  await adminApi.delete(`/members/${memberId}/pm-password`);
}
