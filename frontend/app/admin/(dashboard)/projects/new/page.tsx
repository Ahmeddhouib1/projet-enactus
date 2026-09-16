"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { createProject } from "@/services/admin/projects";
import type { ProjectFormValues } from "@/lib/validation";

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(values: ProjectFormValues) {
    const created = await createProject(values);
    router.push(`/admin/projects/${created.id}`);
  }

  return (
    <div className="max-w-3xl">
      <ProjectForm onSubmit={handleSubmit} submitLabel="Create project" />
    </div>
  );
}
