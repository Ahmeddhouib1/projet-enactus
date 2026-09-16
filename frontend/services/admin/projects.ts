import { adminApi } from "@/lib/api-client";
import type { AdminProject, ProjectImage, ProjectInput } from "@/types/project";

export async function listAdminProjects(): Promise<AdminProject[]> {
  const { data } = await adminApi.get<AdminProject[]>("/projects");
  return data;
}

export async function getAdminProject(id: number): Promise<AdminProject> {
  const { data } = await adminApi.get<AdminProject>(`/projects/${id}`);
  return data;
}

export async function createProject(payload: ProjectInput): Promise<AdminProject> {
  const { data } = await adminApi.post<AdminProject>("/projects", payload);
  return data;
}

export async function updateProject(id: number, payload: ProjectInput): Promise<AdminProject> {
  const { data } = await adminApi.put<AdminProject>(`/projects/${id}`, payload);
  return data;
}

export async function deleteProject(id: number): Promise<void> {
  await adminApi.delete(`/projects/${id}`);
}

export async function reorderProjects(orderedIds: number[]): Promise<void> {
  await adminApi.put("/projects/reorder", { orderedIds });
}

export async function addProjectImage(
  projectId: number,
  payload: { imageUrl: string; caption?: string; displayOrder?: number },
): Promise<ProjectImage> {
  const { data } = await adminApi.post<ProjectImage>(`/projects/${projectId}/images`, payload);
  return data;
}

export async function deleteProjectImage(projectId: number, imageId: number): Promise<void> {
  await adminApi.delete(`/projects/${projectId}/images/${imageId}`);
}

export async function reorderProjectImages(projectId: number, orderedIds: number[]): Promise<void> {
  await adminApi.put(`/projects/${projectId}/images/reorder`, { orderedIds });
}
