"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getActivity, getActivityAttendance, saveActivityAttendance } from "@/services/admin/activities";
import type { Activity, Attendance, AttendanceEntryInput } from "@/types/activity";

const TYPE_LABEL: Record<Activity["type"], string> = {
  FORMATION: "Formation",
  WORKSHOP: "Workshop",
  MEETING: "Meeting",
};

function scopeLabel(activity: Activity): string {
  if (activity.scopeType === "ALL") return "Everyone";
  if (activity.scopeType === "DEPARTMENT") return `${activity.scopeDepartment} department`;
  return `${activity.scopeProject?.name ?? "Project"} team`;
}

export default function TakeAttendancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const activityId = Number(id);

  const [activity, setActivity] = useState<Activity | null>(null);
  const [entries, setEntries] = useState<AttendanceEntryInput[]>([]);
  const [names, setNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function applyAttendance(list: Attendance[]) {
    setEntries(list.map((a) => ({ memberId: a.memberId, present: a.present, remark: a.remark ?? "" })));
    setNames(Object.fromEntries(list.map((a) => [a.memberId, a.memberFullName])));
  }

  useEffect(() => {
    Promise.all([getActivity(activityId), getActivityAttendance(activityId)])
      .then(([act, attendance]) => {
        setActivity(act);
        applyAttendance(attendance);
      })
      .finally(() => setLoading(false));
  }, [activityId]);

  function updateEntry(memberId: number, patch: Partial<AttendanceEntryInput>) {
    setEntries((prev) => prev.map((e) => (e.memberId === memberId ? { ...e, ...patch } : e)));
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await saveActivityAttendance(activityId, entries);
      applyAttendance(updated);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading activity...</p>;
  }

  if (!activity) {
    return <p className="text-sm text-red-600">Activity not found.</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/activities" className="inline-flex items-center gap-1.5 text-sm font-semibold text-enactus-navy">
        <ArrowLeft size={16} />
        Back to activities
      </Link>

      <div className="mt-5 rounded-2xl border border-enactus-light-gray/30 bg-white p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-enactus-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy">
            {TYPE_LABEL[activity.type]}
          </span>
          <span className="rounded-full bg-enactus-light-gray/20 px-3 py-1 text-xs font-semibold text-enactus-navy">
            Audience: {scopeLabel(activity)}
          </span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-enactus-navy">{activity.title}</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">{formatDate(activity.activityDate)}</p>
        {activity.description && <p className="mt-3 text-sm text-enactus-dark-gray">{activity.description}</p>}
      </div>

      <div className="mt-8 rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-enactus-navy">Attendance</h2>
            <p className="mt-1 text-sm text-enactus-dark-gray">
              Mark each member present or absent and add remarks. Only active members are listed.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || entries.length === 0}
            className="inline-flex items-center gap-2 rounded-full bg-enactus-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-enactus-navy/90 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save attendance"}
          </button>
        </div>
        {saved && (
          <p className="mt-4 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
            Attendance saved.
          </p>
        )}

        {entries.length === 0 ? (
          <p className="mt-6 text-sm text-enactus-dark-gray">No active members to take attendance for.</p>
        ) : (
          <ul className="mt-6 divide-y divide-enactus-light-gray/20">
            {entries.map((entry) => (
              <li key={entry.memberId} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:gap-6">
                <label className="flex w-48 shrink-0 items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={entry.present}
                    onChange={(e) => updateEntry(entry.memberId, { present: e.target.checked })}
                  />
                  <span className="text-sm font-semibold text-enactus-navy">{names[entry.memberId]}</span>
                </label>
                <input
                  type="text"
                  placeholder="Remark (optional)"
                  value={entry.remark}
                  onChange={(e) => updateEntry(entry.memberId, { remark: e.target.value })}
                  className="flex-1 rounded-lg border border-enactus-light-gray/50 px-4 py-2 text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
