export type ProjectStatus = "IDEA" | "IN_PROGRESS" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type ProjectPhase = "PROBLEMATIQUE" | "IDEA_STEP_1" | "IDEA_STEP_2" | "PILOT_STEP_1" | "PILOT_STEP_2";

export interface ProjectImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  displayOrder: number;
}

export interface ProjectSummary {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  coverImage: string | null;
  logo: string | null;
  category: string | null;
  status: ProjectStatus;
  featured: boolean;
}

export interface ProjectDetail {
  id: number;
  slug: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  context: string | null;
  solution: string | null;
  impact: string | null;
  objectives: string | null;
  coverImage: string | null;
  logo: string | null;
  category: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  images: ProjectImage[];
}

export interface AdminProject extends ProjectDetail {
  phase: ProjectPhase;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  context?: string;
  solution?: string;
  impact?: string;
  objectives?: string;
  coverImage?: string;
  logo?: string;
  category?: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  startDate?: string | null;
  endDate?: string | null;
  featured: boolean;
  displayOrder?: number;
}
