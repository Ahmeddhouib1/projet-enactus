export type MemberDepartment = "SPONSORING" | "MARKETING";

export interface ProjectRef {
  id: number;
  name: string;
  slug: string;
}

export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  department: MemberDepartment | null;
  role: string | null;
  active: boolean;
  hasPmPassword: boolean;
  projects: ProjectRef[];
  createdAt: string;
  updatedAt: string;
}

export interface MemberInput {
  fullName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  department?: MemberDepartment | null;
  role?: string;
  active: boolean;
  projectIds: number[];
}
