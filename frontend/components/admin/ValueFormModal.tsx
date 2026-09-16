"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { valueSchema, type ValueFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import type { AdminValue } from "@/types/content";

interface ValueFormModalProps {
  open: boolean;
  initialValue?: AdminValue | null;
  onSubmit: (values: ValueFormValues) => Promise<void>;
  onClose: () => void;
}

export default function ValueFormModal({ open, initialValue, onSubmit, onClose }: ValueFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ValueFormValues>({
    resolver: zodResolver(valueSchema),
    values: {
      title: initialValue?.title ?? "",
      description: initialValue?.description ?? "",
      icon: initialValue?.icon ?? "",
      displayOrder: initialValue?.displayOrder ?? 0,
      active: initialValue?.active ?? true,
    },
  });

  if (!open) return null;

  async function submit(values: ValueFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">{initialValue ? "Edit Value" : "Add Value"}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <FormField label="Title" htmlFor="value-title" error={errors.title?.message} required>
            <input id="value-title" className={inputClassName} {...register("title")} />
          </FormField>
          <FormField label="Description" htmlFor="value-description" error={errors.description?.message}>
            <textarea id="value-description" rows={3} className={inputClassName} {...register("description")} />
          </FormField>
          <FormField
            label="Icon key"
            htmlFor="value-icon"
            hint="One of: compass, lightbulb, rocket, heart-handshake, users, leaf"
            error={errors.icon?.message}
          >
            <input id="value-icon" className={inputClassName} {...register("icon")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Display order" htmlFor="value-order" error={errors.displayOrder?.message}>
              <input
                id="value-order"
                type="number"
                className={inputClassName}
                {...register("displayOrder")}
              />
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
