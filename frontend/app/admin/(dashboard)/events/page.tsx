"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { deleteEvent, listAdminEvents } from "@/services/admin/events";
import type { AdminEvent } from "@/types/event";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<AdminEvent | null>(null);

  async function refresh() {
    setEvents(await listAdminEvents());
  }

  useEffect(() => {
    listAdminEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteEvent(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const columns: DataTableColumn<AdminEvent>[] = [
    {
      header: "Name",
      cell: (event) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{event.name}</span>
          {event.featured && <Star size={14} className="fill-enactus-yellow text-enactus-yellow" />}
        </div>
      ),
    },
    { header: "Editions", cell: (event) => event.editions.length },
    {
      header: "Actions",
      cell: (event) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/events/${event.id}`}
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
            aria-label="Edit event"
          >
            <Pencil size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setPendingDelete(event)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
            aria-label="Delete event"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading events...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">Manage events and their editions.</p>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Event
        </Link>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={events}
          keyExtractor={(e) => e.id}
          emptyTitle="No events yet"
          emptyDescription="Create the first event to start adding editions."
        />
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This event and all of its editions will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
