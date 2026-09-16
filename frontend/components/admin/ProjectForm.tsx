"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import type { AdminProject } from "@/types/project";

const STATUS_OPTIONS = ["IDEA", "IN_PROGRESS", "ACTIVE", "COMPLETED", "ARCHIVED"] as const;
const PHASE_OPTIONS = [
  { value: "PROBLEMATIQUE", label: "Problematique" },
  { value: "IDEA_STEP_1", label: "Idea - Step 1" },
  { value: "IDEA_STEP_2", label: "Idea - Step 2" },
  { value: "PILOT_STEP_1", label: "Pilot - Step 1" },
  { value: "PILOT_STEP_2", label: "Pilot - Step 2" },
] as const;

interface ProjectFormProps {
  initialValue?: AdminProject | null;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({ initialValue, onSubmit, submitLabel = "Save project" }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      shortDescription: initialValue?.shortDescription ?? "",
      fullDescription: initialValue?.fullDescription ?? "",
      context: initialValue?.context ?? "",
      solution: initialValue?.solution ?? "",
      impact: initialValue?.impact ?? "",
      objectives: initialValue?.objectives ?? "",
      coverImage: initialValue?.coverImage ?? "",
      logo: initialValue?.logo ?? "",
      category: initialValue?.category ?? "",
      status: initialValue?.status ?? "IDEA",
      phase: initialValue?.phase ?? "PROBLEMATIQUE",
      startDate: initialValue?.startDate ?? "",
      endDate: initialValue?.endDate ?? "",
      featured: initialValue?.featured ?? false,
      displayOrder: initialValue?.displayOrder ?? 0,
    },
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">General information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
            <input id="name" className={inputClassName} {...register("name")} />
          </FormField>
          <FormField label="Category" htmlFor="category" error={errors.category?.message}>
            <input id="category" className={inputClassName} {...register("category")} />
          </FormField>
          <FormField label="Status" htmlFor="status" error={errors.status?.message} required>
            <select id="status" className={inputClassName} {...register("status")}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ")}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Phase"
            htmlFor="phase"
            error={errors.phase?.message}
            hint="Enactus methodology stage - shown in the project manager's space."
            required
          >
            <select id="phase" className={inputClassName} {...register("phase")}>
              {PHASE_OPTIONS.map((phase) => (
                <option key={phase.value} value={phase.value}>
                  {phase.label}
                </option>
              ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-semibold text-enactus-navy">
            <input type="checkbox" className="h-4 w-4" {...register("featured")} />
            Featured on homepage
          </label>
          <FormField label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
            <input id="startDate" type="date" className={inputClassName} {...register("startDate")} />
          </FormField>
          <FormField label="End date" htmlFor="endDate" error={errors.endDate?.message}>
            <input id="endDate" type="date" className={inputClassName} {...register("endDate")} />
          </FormField>
          <FormField label="Display order" htmlFor="displayOrder" error={errors.displayOrder?.message}>
            <input id="displayOrder" type="number" className={inputClassName} {...register("displayOrder")} />
          </FormField>
        </div>
      </div>

      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Media</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <FormField label="Cover image">
            <ImageUploader
              category="projects"
              value={watch("coverImage")}
              onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
              label="Cover"
            />
          </FormField>
          <FormField label="Logo">
            <ImageUploader
              category="projects"
              value={watch("logo")}
              onChange={(url) => setValue("logo", url, { shouldValidate: true })}
              label="Logo"
            />
          </FormField>
        </div>
      </div>

      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Story</h2>
        <div className="mt-5 space-y-5">
          <FormField label="Short description" htmlFor="shortDescription" error={errors.shortDescription?.message}>
            <textarea id="shortDescription" rows={2} className={inputClassName} {...register("shortDescription")} />
          </FormField>
          <FormField label="Full description" htmlFor="fullDescription" error={errors.fullDescription?.message}>
            <textarea id="fullDescription" rows={4} className={inputClassName} {...register("fullDescription")} />
          </FormField>
          <FormField label="Context & problem" htmlFor="context" error={errors.context?.message}>
            <textarea id="context" rows={3} className={inputClassName} {...register("context")} />
          </FormField>
          <FormField label="Solution" htmlFor="solution" error={errors.solution?.message}>
            <textarea id="solution" rows={3} className={inputClassName} {...register("solution")} />
          </FormField>
          <FormField label="Impact" htmlFor="impact" error={errors.impact?.message}>
            <textarea id="impact" rows={3} className={inputClassName} {...register("impact")} />
          </FormField>
          <FormField label="Objectives" htmlFor="objectives" error={errors.objectives?.message}>
            <textarea id="objectives" rows={3} className={inputClassName} {...register("objectives")} />
          </FormField>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-enactus-navy px-8 py-3 text-sm font-bold text-white hover:bg-enactus-navy/90 disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
