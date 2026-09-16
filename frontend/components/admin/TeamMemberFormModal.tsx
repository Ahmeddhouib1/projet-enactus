"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import type { AdminTeamMember } from "@/types/team";

interface TeamMemberFormModalProps {
  open: boolean;
  initialValue?: AdminTeamMember | null;
  onSubmit: (values: TeamMemberFormValues) => Promise<void>;
  onClose: () => void;
}

export default function TeamMemberFormModal({ open, initialValue, onSubmit, onClose }: TeamMemberFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    values: {
      fullName: initialValue?.fullName ?? "",
      role: initialValue?.role ?? "",
      photoUrl: initialValue?.photoUrl ?? "",
      displayOrder: initialValue?.displayOrder ?? 0,
      active: initialValue?.active ?? true,
    },
  });

  if (!open) return null;

  async function submit(values: TeamMemberFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">
          {initialValue ? "Edit Team Member" : "Add Team Member"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <FormField label="Portrait">
            <ImageUploader
              category="team"
              value={watch("photoUrl")}
              onChange={(url) => setValue("photoUrl", url, { shouldValidate: true })}
              label="Portrait"
            />
          </FormField>
          <FormField label="Full name" htmlFor="member-name" error={errors.fullName?.message} required>
            <input id="member-name" className={inputClassName} {...register("fullName")} />
          </FormField>
          <FormField label="Role" htmlFor="member-role" error={errors.role?.message} required>
            <input id="member-role" className={inputClassName} {...register("role")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Display order" htmlFor="member-order" error={errors.displayOrder?.message}>
              <input id="member-order" type="number" className={inputClassName} {...register("displayOrder")} />
            </FormField>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-semibold text-enactus-navy">
              <input type="checkbox" className="h-4 w-4" {...register("active")} />
              Active
            </label>
          </div>

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
