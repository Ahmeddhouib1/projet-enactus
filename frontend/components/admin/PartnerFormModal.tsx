"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partnerSchema, type PartnerFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import type { AdminPartner } from "@/types/partner";

const PARTNER_TYPES = ["SPONSOR", "ACADEMIC", "INSTITUTIONAL", "MEDIA", "TECHNOLOGY", "OTHER"] as const;

interface PartnerFormModalProps {
  open: boolean;
  initialValue?: AdminPartner | null;
  onSubmit: (values: PartnerFormValues) => Promise<void>;
  onClose: () => void;
}

export default function PartnerFormModal({ open, initialValue, onSubmit, onClose }: PartnerFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    values: {
      name: initialValue?.name ?? "",
      logo: initialValue?.logo ?? "",
      websiteUrl: initialValue?.websiteUrl ?? "",
      description: initialValue?.description ?? "",
      partnerType: initialValue?.partnerType ?? "SPONSOR",
      displayOrder: initialValue?.displayOrder ?? 0,
      active: initialValue?.active ?? true,
    },
  });

  if (!open) return null;

  async function submit(values: PartnerFormValues) {
    await onSubmit(values);
    reset();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-enactus-navy">{initialValue ? "Edit Partner" : "Add Partner"}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)} noValidate>
          <FormField label="Logo" error={errors.logo?.message} required>
            <ImageUploader
              category="partners"
              value={watch("logo")}
              onChange={(url) => setValue("logo", url, { shouldValidate: true })}
              label="Logo"
            />
          </FormField>
          <FormField label="Name" htmlFor="partner-name" error={errors.name?.message} required>
            <input id="partner-name" className={inputClassName} {...register("name")} />
          </FormField>
          <FormField label="Website URL" htmlFor="partner-website" error={errors.websiteUrl?.message}>
            <input id="partner-website" className={inputClassName} {...register("websiteUrl")} />
          </FormField>
          <FormField label="Type" htmlFor="partner-type" error={errors.partnerType?.message} required>
            <select id="partner-type" className={inputClassName} {...register("partnerType")}>
              {PARTNER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Description" htmlFor="partner-description" error={errors.description?.message}>
            <textarea id="partner-description" rows={3} className={inputClassName} {...register("description")} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Display order" htmlFor="partner-order" error={errors.displayOrder?.message}>
              <input id="partner-order" type="number" className={inputClassName} {...register("displayOrder")} />
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
