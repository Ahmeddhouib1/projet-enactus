"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Trash2 } from "lucide-react";
import { documentSchema, type DocumentFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import FileUploader from "@/components/admin/FileUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { resolveMediaUrl } from "@/lib/utils";
import {
  createDocument,
  deleteDocument,
  listDocumentsByProject,
  listDocumentsByScope,
} from "@/services/admin/documents";
import type { Document, DocumentScope } from "@/types/document";
import type { ProjectPhase } from "@/types/project";

interface DocumentManagerProps {
  scope: DocumentScope;
  projectId?: number;
  /** When set, only shows/creates documents tagged with this phase (used by the Project Space, one instance per phase). */
  phase?: ProjectPhase;
  emptyDescription?: string;
}

export default function DocumentManager({ scope, projectId, phase, emptyDescription }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Document | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: "", fileUrl: "", description: "" },
  });

  async function refresh() {
    const data = projectId ? await listDocumentsByProject(projectId) : await listDocumentsByScope(scope);
    setDocuments(phase ? data.filter((d) => d.phase === phase) : data);
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, projectId, phase]);

  async function submit(values: DocumentFormValues) {
    await createDocument({
      title: values.title,
      fileUrl: values.fileUrl,
      description: values.description,
      scope,
      projectId,
      phase,
    });
    reset({ title: "", fileUrl: "", description: "" });
    setFormOpen(false);
    await refresh();
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteDocument(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading documents...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">Shared documents for this space.</p>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-enactus-navy px-4 py-2 text-xs font-semibold text-white hover:bg-enactus-navy/90"
        >
          <Plus size={14} />
          Add document
        </button>
      </div>

      {formOpen && (
        <form
          className="mt-4 space-y-4 rounded-xl border border-dashed border-enactus-light-gray/60 p-5"
          onSubmit={handleSubmit(submit)}
          noValidate
        >
          <FormField label="Title" htmlFor="document-title" error={errors.title?.message} required>
            <input id="document-title" className={inputClassName} {...register("title")} />
          </FormField>
          <FormField label="File" error={errors.fileUrl?.message} required>
            <FileUploader value={watch("fileUrl")} onChange={(url) => setValue("fileUrl", url, { shouldValidate: true })} />
          </FormField>
          <FormField label="Description" htmlFor="document-description" error={errors.description?.message}>
            <textarea id="document-description" rows={2} className={inputClassName} {...register("description")} />
          </FormField>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-enactus-yellow px-5 py-2 text-xs font-bold uppercase tracking-wide text-enactus-navy disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save document"}
          </button>
        </form>
      )}

      {documents.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={FileText}
            title="No documents yet"
            description={emptyDescription ?? "Upload the first document for this space."}
          />
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-enactus-light-gray/20 rounded-2xl border border-enactus-light-gray/30 bg-white">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <a
                href={resolveMediaUrl(doc.fileUrl)}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-w-0 items-center gap-3 hover:underline"
              >
                <FileText size={18} className="shrink-0 text-enactus-navy" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-enactus-navy">{doc.title}</span>
                  {doc.description && (
                    <span className="block truncate text-xs text-enactus-dark-gray">{doc.description}</span>
                  )}
                </span>
              </a>
              <button
                type="button"
                aria-label="Delete document"
                onClick={() => setPendingDelete(doc)}
                className="shrink-0 rounded-md p-2 text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This document will be permanently removed."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
