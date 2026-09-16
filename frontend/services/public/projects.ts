import { publicApi } from "@/lib/api-client";
import type { ProjectDetail, ProjectSummary } from "@/types/project";

export async function getProjects(featuredOnly = false): Promise<ProjectSummary[]> {
  const { data } = await publicApi.get<ProjectSummary[]>("/projects", {
    params: featuredOnly ? { featured: true } : undefined,
  });
  return data;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const { data } = await publicApi.get<ProjectDetail>(`/projects/${slug}`);
  return data;
}
