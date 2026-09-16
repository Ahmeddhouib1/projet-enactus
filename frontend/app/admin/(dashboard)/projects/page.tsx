"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import StatusBadge from "@/components/public/StatusBadge";
import { deleteProject, listAdminProjects } from "@/services/admin/projects";
import type { AdminProject } from "@/types/project";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminProject | null>(null);

  async function refresh() {
    setProjects(await listAdminProjects());
  }

  useEffect(() => {
    listAdminProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteProject(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const columns: DataTableColumn<AdminProject>[] = [
    {
      header: "Name",
      cell: (project) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{project.name}</span>
          {project.featured && <Star size={14} className="fill-enactus-yellow text-enactus-yellow" />}
        </div>
      ),
    },
    { header: "Category", cell: (project) => project.category || "-" },
    { header: "Status", cell: (project) => <StatusBadge status={project.status} /> },
    {
      header: "Actions",
      cell: (project) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/projects/${project.id}`}
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
            aria-label="Edit project"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setPendingDelete(project)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
            aria-label="Delete project"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading projects...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">Manage the projects shown on the public site.</p>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={projects}
          keyExtractor={(p) => p.id}
          emptyTitle="No projects yet"
          emptyDescription="Create the first project to showcase it on the public site."
        />
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This project and its gallery images will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
