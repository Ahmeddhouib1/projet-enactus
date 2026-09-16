export type ActivityType = "FORMATION" | "WORKSHOP" | "MEETING";
export type ActivityScopeType = "ALL" | "DEPARTMENT" | "PROJECT";

export interface ActivityScopeProject {
  id: number;
  name: string;
  slug: string;
}

export interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  activityDate: string;
  description: string | null;
  scopeType: ActivityScopeType;
  scopeDepartment: "SPONSORING" | "MARKETING" | null;
  scopeProject: ActivityScopeProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityInput {
  type: ActivityType;
  title: string;
  activityDate: string;
  description?: string;
  scopeType: ActivityScopeType;
  scopeDepartment?: "SPONSORING" | "MARKETING" | null;
  scopeProjectId?: number | null;
}

export interface Attendance {
  id: number | null;
  memberId: number;
  memberFullName: string;
  activityId: number;
  activityTitle: string;
  activityDate: string;
  present: boolean;
  remark: string | null;
}

export interface AttendanceEntryInput {
  memberId: number;
  present: boolean;
  remark?: string;
}
