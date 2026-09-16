import { publicApi } from "@/lib/api-client";
import type { EventSummary } from "@/types/event";

export async function getEvents(): Promise<EventSummary[]> {
  const { data } = await publicApi.get<EventSummary[]>("/events");
  return data;
}

export async function getEventBySlug(slug: string): Promise<EventSummary> {
  const { data } = await publicApi.get<EventSummary>(`/events/${slug}`);
  return data;
}
