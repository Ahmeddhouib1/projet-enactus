"use client";

import { use, useEffect, useState } from "react";
import { CalendarDays, ImageIcon, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import EditionFormModal from "@/components/admin/EditionFormModal";
import GalleryManager from "@/components/admin/GalleryManager";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  addEdition,
  addEditionImage,
  deleteEdition,
  deleteEditionImage,
  getAdminEvent,
  reorderEditionImages,
  updateEdition,
  updateEvent,
} from "@/services/admin/events";
import type { AdminEvent, EventEdition } from "@/types/event";
import type { EventEditionFormValues, EventFormValues } from "@/lib/validation";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const eventId = Number(id);

  const [event, setEvent] = useState<AdminEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [editionModalOpen, setEditionModalOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<EventEdition | null>(null);
  const [pendingDeleteEdition, setPendingDeleteEdition] = useState<EventEdition | null>(null);
  const [expandedEditionId, setExpandedEditionId] = useState<number | null>(null);

  async function refresh() {
    setEvent(await getAdminEvent(eventId));
  }

  useEffect(() => {
    getAdminEvent(eventId)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [eventId]);

  async function handleEventSubmit(values: EventFormValues) {
    setSaved(false);
    await updateEvent(eventId, values);
    setSaved(true);
    await refresh();
  }

  async function handleEditionSubmit(values: EventEditionFormValues) {
    if (editingEdition) {
      await updateEdition(eventId, editingEdition.id, values);
    } else {
      await addEdition(eventId, values);
    }
    setEditionModalOpen(false);
    setEditingEdition(null);
    await refresh();
  }

  async function handleDeleteEditionConfirmed() {
    if (!pendingDeleteEdition) return;
    await deleteEdition(eventId, pendingDeleteEdition.id);
    setPendingDeleteEdition(null);
    await refresh();
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-sm text-red-600">Event not found.</p>;
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        {saved && (
          <p className="mb-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
            Event saved successfully.
          </p>
        )}
        <EventForm initialValue={event} onSubmit={handleEventSubmit} submitLabel="Save changes" />
      </div>

      <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-enactus-navy">Editions</h2>
            <p className="mt-1 text-sm text-enactus-dark-gray">Each edition can have its own photo gallery.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingEdition(null);
              setEditionModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
          >
            <Plus size={16} />
            Add Edition
          </button>
        </div>

        {event.editions.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No editions yet" description="Add the first edition of this event." />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {event.editions.map((edition) => (
              <div key={edition.id} className="rounded-xl border border-enactus-light-gray/30">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold text-enactus-navy">
                      {edition.editionName} <span className="text-enactus-dark-gray">({edition.year})</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-enactus-dark-gray">
                      {edition.startDate && (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays size={13} />
                          {formatDate(edition.startDate)}
                        </span>
                      )}
                      {edition.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {edition.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedEditionId(expandedEditionId === edition.id ? null : edition.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-enactus-navy px-3 py-1.5 text-xs font-bold text-enactus-navy hover:bg-enactus-navy hover:text-white"
                    >
                      <ImageIcon size={14} />
                      {expandedEditionId === edition.id ? "Hide photos" : `Photos (${edition.images.length})`}
                    </button>
                    <button
                      type="button"
                      aria-label="Edit edition"
                      onClick={() => {
                        setEditingEdition(edition);
                        setEditionModalOpen(true);
                      }}
                      className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete edition"
                      onClick={() => setPendingDeleteEdition(edition)}
                      className="rounded-md p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {expandedEditionId === edition.id && (
                  <div className="border-t border-enactus-light-gray/30 p-4">
                    <GalleryManager
                      images={edition.images}
                      category="events"
                      onAdd={async (imageUrl, caption) => {
                        await addEditionImage(eventId, edition.id, { imageUrl, caption });
                        await refresh();
                      }}
                      onDelete={async (imageId) => {
                        await deleteEditionImage(eventId, edition.id, imageId);
                        await refresh();
                      }}
                      onReorder={async (orderedIds) => {
                        await reorderEditionImages(eventId, edition.id, orderedIds);
                        await refresh();
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <EditionFormModal
        open={editionModalOpen}
        initialValue={editingEdition}
        onSubmit={handleEditionSubmit}
        onClose={() => {
          setEditionModalOpen(false);
          setEditingEdition(null);
        }}
      />

      <ConfirmDialog
        open={pendingDeleteEdition !== null}
        title={`Delete "${pendingDeleteEdition?.editionName}"?`}
        description="This edition and its photos will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteEditionConfirmed}
        onCancel={() => setPendingDeleteEdition(null)}
      />
    </div>
  );
}
