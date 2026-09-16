"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventEditionSchema, type EventEditionFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import type { EventEdition } from "@/types/event";

interface EditionFormModalProps {
  open: boolean;
  initialValue?: EventEdition | null;
  onSubmit: (values: EventEditionFormValues) => Promise<void>;
  onClose: () => void;
}

export default function EditionFormModal({ open, initialValue, onSubmit, onClose }: EditionFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EventEditionFormValues>({
    resolver: zodResolver(eventEditionSchema),
    values: {
      editionName: initialValue?.editionName ?? "",
      year: initialValue?.year ?? new Date().getFullYear(),
      description: initialValue?.description ?? "",
      startDate: initialValue?.startDate ?? "",
      endDate: initialValue?.endDate ?? "",
      location: initialValue?.location ?? "",
      coverImage: initialValue?.coverImage ?? "",
      displayOrder: initialValue?.displayOrder ?? 0,
    },
  });

  if (!open) return null;

  async function submit(values: EventEditionFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">{initialValue ? "Edit Edition" : "Add Edition"}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Edition name" htmlFor="edition-name" error={errors.editionName?.message} required>
              <input id="edition-name" className={inputClassName} {...register("editionName")} />
            </FormField>
            <FormField label="Year" htmlFor="edition-year" error={errors.year?.message} required>
              <input id="edition-year" type="number" className={inputClassName} {...register("year")} />
            </FormField>
          </div>
          <FormField label="Description" htmlFor="edition-description" error={errors.description?.message}>
            <textarea id="edition-description" rows={3} className={inputClassName} {...register("description")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start date" htmlFor="edition-start" error={errors.startDate?.message}>
              <input id="edition-start" type="date" className={inputClassName} {...register("startDate")} />
            </FormField>
            <FormField label="End date" htmlFor="edition-end" error={errors.endDate?.message}>
              <input id="edition-end" type="date" className={inputClassName} {...register("endDate")} />
            </FormField>
          </div>
          <FormField label="Location" htmlFor="edition-location" error={errors.location?.message}>
            <input id="edition-location" className={inputClassName} {...register("location")} />
          </FormField>

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
