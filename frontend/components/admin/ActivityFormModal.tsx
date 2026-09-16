"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivityFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import { listAdminProjects } from "@/services/admin/projects";
import type { Activity } from "@/types/activity";
import type { AdminProject } from "@/types/project";

interface ActivityFormModalProps {
  open: boolean;
  initialValue?: Activity | null;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  onClose: () => void;
}

export default function ActivityFormModal({ open, initialValue, onSubmit, onClose }: ActivityFormModalProps) {
  const [projects, setProjects] = useState<AdminProject[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    values: {
      type: initialValue?.type ?? "WORKSHOP",
      title: initialValue?.title ?? "",
      activityDate: initialValue?.activityDate ?? new Date().toISOString().slice(0, 10),
      description: initialValue?.description ?? "",
      scopeType: initialValue?.scopeType ?? "ALL",
      scopeDepartment: initialValue?.scopeDepartment ?? undefined,
      scopeProjectId: initialValue?.scopeProject?.id ?? undefined,
    },
  });

  useEffect(() => {
    if (open) {
      listAdminProjects().then(setProjects).catch(() => setProjects([]));
    }
  }, [open]);

  if (!open) return null;

  const scopeType = watch("scopeType");

  async function submit(values: ActivityFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">
          {initialValue ? "Edit Activity" : "Add Activity"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Type" htmlFor="activity-type" error={errors.type?.message} required>
              <select id="activity-type" className={inputClassName} {...register("type")}>
                <option value="FORMATION">Formation</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="MEETING">Meeting</option>
              </select>
            </FormField>
            <FormField label="Date" htmlFor="activity-date" error={errors.activityDate?.message} required>
              <input id="activity-date" type="date" className={inputClassName} {...register("activityDate")} />
            </FormField>
          </div>
          <FormField label="Title" htmlFor="activity-title" error={errors.title?.message} required>
            <input id="activity-title" className={inputClassName} {...register("title")} />
          </FormField>
          <FormField label="Description" htmlFor="activity-description" error={errors.description?.message}>
            <textarea id="activity-description" rows={3} className={inputClassName} {...register("description")} />
          </FormField>

          <FormField
            label="Audience"
            htmlFor="activity-scope-type"
            hint="Who this activity is for - determines who shows up when taking attendance."
            required
          >
            <select id="activity-scope-type" className={inputClassName} {...register("scopeType")}>
              <option value="ALL">Everyone</option>
              <option value="DEPARTMENT">One department</option>
              <option value="PROJECT">One project team</option>
            </select>
          </FormField>

          {scopeType === "DEPARTMENT" && (
            <FormField
              label="Department"
              htmlFor="activity-scope-department"
              error={errors.scopeDepartment?.message}
              required
            >
              <select id="activity-scope-department" className={inputClassName} {...register("scopeDepartment")}>
                <option value="">Select a department</option>
                <option value="MARKETING">Marketing</option>
                <option value="SPONSORING">Sponsoring</option>
              </select>
            </FormField>
          )}

          {scopeType === "PROJECT" && (
            <FormField
              label="Project team"
              htmlFor="activity-scope-project"
              error={errors.scopeProjectId?.message}
              required
            >
              <select id="activity-scope-project" className={inputClassName} {...register("scopeProjectId")}>
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-semibold text-enactus-dark-gray hover:bg-enactus-light-gray/15"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-enactus-navy px-5 py-2 text-sm font-semibold text-white hover:bg-enactus-navy/90 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
