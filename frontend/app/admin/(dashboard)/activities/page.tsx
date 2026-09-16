"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Pencil, Plus, Trash2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ActivityFormModal from "@/components/admin/ActivityFormModal";
import { formatDate } from "@/lib/utils";
import { createActivity, deleteActivity, listActivities, updateActivity } from "@/services/admin/activities";
import type { Activity } from "@/types/activity";
import type { ActivityFormValues } from "@/lib/validation";

const TYPE_LABEL: Record<Activity["type"], string> = {
  FORMATION: "Formation",
  WORKSHOP: "Workshop",
  MEETING: "Meeting",
};

function scopeLabel(activity: Activity): string {
  if (activity.scopeType === "ALL") return "Everyone";
  if (activity.scopeType === "DEPARTMENT") return activity.scopeDepartment ?? "Department";
  return activity.scopeProject?.name ?? "Project team";
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null);

  async function refresh() {
    setActivities(await listActivities());
  }

  useEffect(() => {
    listActivities()
      .then(setActivities)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(values: ActivityFormValues) {
    if (editingActivity) {
      await updateActivity(editingActivity.id, values);
    } else {
      await createActivity(values);
    }
    setModalOpen(false);
    setEditingActivity(null);
    await refresh();
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteActivity(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const columns: DataTableColumn<Activity>[] = [
    {
      header: "Title",
      cell: (activity) => <span className="font-semibold">{activity.title}</span>,
    },
    {
      header: "Type",
      cell: (activity) => (
        <span className="rounded-full bg-enactus-light-gray/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy">
          {TYPE_LABEL[activity.type]}
        </span>
      ),
    },
    { header: "Date", cell: (activity) => formatDate(activity.activityDate) },
    {
      header: "Audience",
      cell: (activity) => (
        <span className="rounded-full bg-enactus-yellow/20 px-3 py-1 text-xs font-semibold text-enactus-navy">
          {scopeLabel(activity)}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (activity) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/activities/${activity.id}`}
            aria-label="Take attendance"
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
          >
            <ClipboardCheck size={16} />
          </Link>
          <button
            type="button"
            aria-label="Edit activity"
            onClick={() => {
              setEditingActivity(activity);
              setModalOpen(true);
            }}
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            aria-label="Delete activity"
            onClick={() => setPendingDelete(activity)}
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading activities...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">
          Formations, workshops and meetings. Take attendance for each one to build members&apos; presence sheets.
        </p>
        <button
          type="button"
          onClick={() => {
            setEditingActivity(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Activity
        </button>
      </div>

      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={activities}
          keyExtractor={(a) => a.id}
          emptyTitle="No activities yet"
          emptyDescription="Create a formation, workshop or meeting to start taking attendance."
        />
      </div>

      <ActivityFormModal
        open={modalOpen}
        initialValue={editingActivity}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalOpen(false);
          setEditingActivity(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.title}"?`}
        description="This activity and all recorded attendance for it will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
