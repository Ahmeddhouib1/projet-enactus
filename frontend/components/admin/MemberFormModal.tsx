"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberSchema, type MemberFormInput, type MemberFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import { listAdminProjects } from "@/services/admin/projects";
import type { Member } from "@/types/member";
import type { AdminProject } from "@/types/project";

interface MemberFormModalProps {
  open: boolean;
  initialValue?: Member | null;
  onSubmit: (values: MemberFormValues) => Promise<void>;
  onClose: () => void;
}

export default function MemberFormModal({ open, initialValue, onSubmit, onClose }: MemberFormModalProps) {
  const [projects, setProjects] = useState<AdminProject[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemberFormInput, unknown, MemberFormValues>({
    resolver: zodResolver(memberSchema),
    values: {
      fullName: initialValue?.fullName ?? "",
      email: initialValue?.email ?? "",
      phone: initialValue?.phone ?? "",
      photoUrl: initialValue?.photoUrl ?? "",
      department: initialValue?.department ?? "",
      role: initialValue?.role ?? "",
      active: initialValue?.active ?? true,
      projectIds: initialValue?.projects.map((p) => p.id) ?? [],
    },
  });

  useEffect(() => {
    if (open) {
      listAdminProjects().then(setProjects).catch(() => setProjects([]));
    }
  }, [open]);

  if (!open) return null;

  const selectedProjectIds = watch("projectIds");

  function toggleProject(id: number) {
    const current = selectedProjectIds ?? [];
    setValue(
      "projectIds",
      current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
      { shouldValidate: true },
    );
  }

  async function submit(values: MemberFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">{initialValue ? "Edit Member" : "Add Member"}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <FormField label="Photo">
            <ImageUploader
              category="team"
              value={watch("photoUrl")}
              onChange={(url) => setValue("photoUrl", url, { shouldValidate: true })}
              label="Photo"
            />
          </FormField>
          <FormField label="Full name" htmlFor="member-full-name" error={errors.fullName?.message} required>
            <input id="member-full-name" className={inputClassName} {...register("fullName")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" htmlFor="member-email" error={errors.email?.message} required>
              <input id="member-email" type="email" className={inputClassName} {...register("email")} />
            </FormField>
            <FormField label="Phone" htmlFor="member-phone" error={errors.phone?.message}>
              <input id="member-phone" className={inputClassName} {...register("phone")} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Department" htmlFor="member-department" error={errors.department?.message} required>
              <select id="member-department" className={inputClassName} {...register("department")}>
                <option value="">No department</option>
                <option value="MARKETING">Marketing</option>
                <option value="SPONSORING">Sponsoring</option>
              </select>
            </FormField>
            <FormField
              label="Role / Title"
              htmlFor="member-role"
              error={errors.role?.message}
              hint='Set to exactly "Project Manager" to appear in the Project Space picker.'
            >
              <input id="member-role" list="member-role-options" className={inputClassName} {...register("role")} />
              <datalist id="member-role-options">
                <option value="Project Manager" />
                <option value="Team Leader" />
                <option value="Vice Team Leader" />
                <option value="Secretaire Generale" />
                <option value="RH" />
                <option value="Responsable Pole Marketing" />
                <option value="Responsable Sponsoring" />
                <option value="Responsable Logistique & Financier" />
              </datalist>
            </FormField>
          </div>

          <FormField label="Project team(s)" error={errors.projectIds?.message}>
            {projects.length === 0 ? (
              <p className="text-xs text-enactus-dark-gray">No projects yet - create one first.</p>
            ) : (
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-enactus-light-gray/40 p-3">
                {projects.map((project) => (
                  <label key={project.id} className="flex items-center gap-2 text-sm text-enactus-navy">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selectedProjectIds?.includes(project.id) ?? false}
                      onChange={() => toggleProject(project.id)}
                    />
                    {project.name}
                  </label>
                ))}
              </div>
            )}
          </FormField>

          <label className="flex items-center gap-2 text-sm font-semibold text-enactus-navy">
            <input type="checkbox" className="h-4 w-4" {...register("active")} />
            Active member
          </label>

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
