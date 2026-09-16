import { adminApi } from "@/lib/api-client";
import type { Activity, ActivityInput, AttendanceEntryInput, Attendance } from "@/types/activity";

export async function listActivities(): Promise<Activity[]> {
  const { data } = await adminApi.get<Activity[]>("/activities");
  return data;
}

export async function getActivity(id: number): Promise<Activity> {
  const { data } = await adminApi.get<Activity>(`/activities/${id}`);
  return data;
}

export async function createActivity(payload: ActivityInput): Promise<Activity> {
  const { data } = await adminApi.post<Activity>("/activities", payload);
  return data;
}

export async function updateActivity(id: number, payload: ActivityInput): Promise<Activity> {
  const { data } = await adminApi.put<Activity>(`/activities/${id}`, payload);
  return data;
}

export async function deleteActivity(id: number): Promise<void> {
  await adminApi.delete(`/activities/${id}`);
}

export async function getActivityAttendance(id: number): Promise<Attendance[]> {
  const { data } = await adminApi.get<Attendance[]>(`/activities/${id}/attendance`);
  return data;
}

export async function saveActivityAttendance(
  id: number,
  entries: AttendanceEntryInput[],
): Promise<Attendance[]> {
  const { data } = await adminApi.put<Attendance[]>(`/activities/${id}/attendance`, { entries });
  return data;
}

/**
 * Collective ("fiche de presence collectif") attendance across many
 * activities: filtered to one department for the Marketing/Sponsoring
 * spaces, or across every activity for every team (SG's space) when
 * department is omitted.
 */
export async function getCollectiveAttendance(department?: "MARKETING" | "SPONSORING"): Promise<Attendance[]> {
  const { data } = await adminApi.get<Attendance[]>("/attendance/collective", {
    params: department ? { department } : undefined,
  });
  return data;
}
