import { adminApi } from "@/lib/api-client";
import type { AdminEvent, EventEdition, EventEditionInput, EventImage, EventInput } from "@/types/event";

export async function listAdminEvents(): Promise<AdminEvent[]> {
  const { data } = await adminApi.get<AdminEvent[]>("/events");
  return data;
}

export async function getAdminEvent(id: number): Promise<AdminEvent> {
  const { data } = await adminApi.get<AdminEvent>(`/events/${id}`);
  return data;
}

export async function createEvent(payload: EventInput): Promise<AdminEvent> {
  const { data } = await adminApi.post<AdminEvent>("/events", payload);
  return data;
}

export async function updateEvent(id: number, payload: EventInput): Promise<AdminEvent> {
  const { data } = await adminApi.put<AdminEvent>(`/events/${id}`, payload);
  return data;
}

export async function deleteEvent(id: number): Promise<void> {
  await adminApi.delete(`/events/${id}`);
}

export async function addEdition(eventId: number, payload: EventEditionInput): Promise<EventEdition> {
  const { data } = await adminApi.post<EventEdition>(`/events/${eventId}/editions`, payload);
  return data;
}

export async function updateEdition(
  eventId: number,
  editionId: number,
  payload: EventEditionInput,
): Promise<EventEdition> {
  const { data } = await adminApi.put<EventEdition>(`/events/${eventId}/editions/${editionId}`, payload);
  return data;
}

export async function deleteEdition(eventId: number, editionId: number): Promise<void> {
  await adminApi.delete(`/events/${eventId}/editions/${editionId}`);
}

export async function addEditionImage(
  eventId: number,
  editionId: number,
  payload: { imageUrl: string; caption?: string; displayOrder?: number },
): Promise<EventImage> {
  const { data } = await adminApi.post<EventImage>(
    `/events/${eventId}/editions/${editionId}/images`,
    payload,
  );
  return data;
}

export async function deleteEditionImage(eventId: number, editionId: number, imageId: number): Promise<void> {
  await adminApi.delete(`/events/${eventId}/editions/${editionId}/images/${imageId}`);
}

export async function reorderEditionImages(
  eventId: number,
  editionId: number,
  orderedIds: number[],
): Promise<void> {
  await adminApi.put(`/events/${eventId}/editions/${editionId}/images/reorder`, { orderedIds });
}
