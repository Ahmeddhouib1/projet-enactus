"use client";

import { use, useEffect, useState } from "react";
import ProjectForm from "@/components/admin/ProjectForm";
import GalleryManager from "@/components/admin/GalleryManager";
import DocumentManager from "@/components/admin/DocumentManager";
import {
  addProjectImage,
  deleteProjectImage,
  getAdminProject,
  reorderProjectImages,
  updateProject,
} from "@/services/admin/projects";
import type { AdminProject } from "@/types/project";
import type { ProjectFormValues } from "@/lib/validation";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);

  const [project, setProject] = useState<AdminProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  async function refresh() {
    setProject(await getAdminProject(projectId));
  }

  useEffect(() => {
    getAdminProject(projectId)
      .then(setProject)
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleSubmit(values: ProjectFormValues) {
    setSaved(false);
    await updateProject(projectId, values);
    setSaved(true);
    await refresh();
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading project...</p>;
  }

  if (!project) {
    return <p className="text-sm text-red-600">Project not found.</p>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        {saved && (
          <p className="mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
            Project saved successfully.
          </p>
        )}
        <ProjectForm initialValue={project} onSubmit={handleSubmit} submitLabel="Save changes" />
      </div>

      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Gallery</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">Photos shown on the project&apos;s public page.</p>
        <div className="mt-5">
          <GalleryManager
            images={project.images}
            category="projects"
            onAdd={async (imageUrl, caption) => {
              await addProjectImage(projectId, { imageUrl, caption });
              await refresh();
            }}
            onDelete={async (imageId) => {
              await deleteProjectImage(projectId, imageId);
              await refresh();
            }}
            onReorder={async (orderedIds) => {
              await reorderProjectImages(projectId, orderedIds);
              await refresh();
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Documents</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          The project manager&apos;s document room for this project.
        </p>
        <div className="mt-5">
          <DocumentManager
            scope="PROJECT"
            projectId={projectId}
            emptyDescription="Upload the first document for this project."
          />
        </div>
      </div>
    </div>
  );
}
