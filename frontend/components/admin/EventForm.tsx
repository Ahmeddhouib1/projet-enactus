"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventFormValues } from "@/lib/validation";
import FormField, { inputClassName } from "@/components/admin/FormField";
import ImageUploader from "@/components/admin/ImageUploader";
import type { AdminEvent } from "@/types/event";

interface EventFormProps {
  initialValue?: AdminEvent | null;
  onSubmit: (values: EventFormValues) => Promise<void>;
  submitLabel?: string;
}

export default function EventForm({ initialValue, onSubmit, submitLabel = "Save event" }: EventFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: initialValue?.name ?? "",
      description: initialValue?.description ?? "",
      coverImage: initialValue?.coverImage ?? "",
      featured: initialValue?.featured ?? false,
    },
  });

  return (
    <form className="space-y-5 rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormField label="Name" htmlFor="event-name" error={errors.name?.message} required>
        <input id="event-name" className={inputClassName} {...register("name")} />
      </FormField>
      <FormField label="Description" htmlFor="event-description" error={errors.description?.message}>
        <textarea id="event-description" rows={3} className={inputClassName} {...register("description")} />
      </FormField>
      <FormField label="Cover image">
        <ImageUploader
          category="events"
          value={watch("coverImage")}
          onChange={(url) => setValue("coverImage", url, { shouldValidate: true })}
          label="Cover"
        />
      </FormField>
      <label className="flex items-center gap-2 text-sm font-semibold text-enactus-navy">
        <input type="checkbox" className="h-4 w-4" {...register("featured")} />
        Featured on homepage
      </label>

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
