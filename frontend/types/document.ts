import type { ProjectPhase } from "@/types/project";

export type DocumentScope = "PROJECT" | "MARKETING" | "SPONSORING" | "GENERAL";

export interface Document {
  id: number;
  title: string;
  fileUrl: string;
  scope: DocumentScope;
  projectId: number | null;
  projectName: string | null;
  phase: ProjectPhase | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentInput {
  title: string;
  fileUrl: string;
  scope: DocumentScope;
  projectId?: number | null;
  phase?: ProjectPhase | null;
  description?: string;
}
