"use client";

import { useRouter } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { createEvent } from "@/services/admin/events";
import type { EventFormValues } from "@/lib/validation";

export default function NewEventPage() {
  const router = useRouter();

  async function handleSubmit(values: EventFormValues) {
    const created = await createEvent(values);
    router.push(`/admin/events/${created.id}`);
  }

  return (
    <div className="max-w-3xl">
      <EventForm onSubmit={handleSubmit} submitLabel="Create event" />
    </div>
  );
}
