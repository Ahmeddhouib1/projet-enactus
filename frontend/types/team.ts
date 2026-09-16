export interface TeamMember {
  id: number;
  fullName: string;
  role: string;
  photoUrl: string | null;
  displayOrder: number;
}

export interface AdminTeamMember extends TeamMember {
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMemberInput {
  fullName: string;
  role: string;
  photoUrl?: string;
  displayOrder?: number;
  active: boolean;
}
