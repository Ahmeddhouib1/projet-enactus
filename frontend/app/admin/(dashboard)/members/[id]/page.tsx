"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Check, Save, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatDate, isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { getMember, getMemberPresenceSheet, updateMemberAttendance } from "@/services/admin/members";
import type { Attendance } from "@/types/activity";
import type { Member } from "@/types/member";

export default function MemberPresenceSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const memberId = Number(id);

  const [member, setMember] = useState<Member | null>(null);
  const [sheet, setSheet] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [pendingToggle, setPendingToggle] = useState<Attendance | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getMember(memberId), getMemberPresenceSheet(memberId)])
      .then(([m, s]) => {
        setMember(m);
        setSheet(s);
      })
      .finally(() => setLoading(false));
  }, [memberId]);

  function updateLocalRemark(activityId: number, remark: string) {
    setSheet((prev) => prev.map((e) => (e.activityId === activityId ? { ...e, remark } : e)));
    setSavedId(null);
  }

  async function saveRemark(entry: Attendance) {
    setSavingId(entry.activityId);
    try {
      const updated = await updateMemberAttendance(memberId, entry.activityId, {
        present: entry.present,
        remark: entry.remark ?? "",
      });
      setSheet((prev) => prev.map((e) => (e.activityId === entry.activityId ? updated : e)));
      setSavedId(entry.activityId);
    } finally {
      setSavingId(null);
    }
  }

  async function confirmToggle() {
    if (!pendingToggle) return;
    const entry = pendingToggle;
    setTogglingId(entry.activityId);
    try {
      const updated = await updateMemberAttendance(memberId, entry.activityId, {
        present: !entry.present,
        remark: entry.remark ?? "",
      });
      setSheet((prev) => prev.map((e) => (e.activityId === entry.activityId ? updated : e)));
    } finally {
      setTogglingId(null);
      setPendingToggle(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading member...</p>;
  }

  if (!member) {
    return <p className="text-sm text-red-600">Member not found.</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/members" className="inline-flex items-center gap-1.5 text-sm font-semibold text-enactus-navy">
        <ArrowLeft size={16} />
        Back to members
      </Link>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-enactus-light-gray/30 bg-white p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-enactus-light-gray/20">
          <Image
            src={resolveMediaUrl(member.photoUrl) || "/images/team/placeholder.svg"}
            alt={member.fullName}
            fill
            unoptimized={isUploadedMedia(member.photoUrl)}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-enactus-navy">{member.fullName}</h2>
          <p className="text-sm text-enactus-dark-gray">{member.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-enactus-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy">
              {member.department}
            </span>
            {member.projects.map((p) => (
              <span key={p.id} className="rounded-full bg-enactus-light-gray/20 px-3 py-1 text-xs text-enactus-navy">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Presence Sheet</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          Every formation, workshop or meeting this member is part of appears here as soon as it&apos;s created.
          Toggling present/absent asks for confirmation first to avoid misclicks.
        </p>

        {sheet.length === 0 ? (
          <p className="mt-6 text-sm text-enactus-dark-gray">
            No activities target this member yet - create one from the Activities page.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-enactus-light-gray/20">
            {sheet.map((entry) => (
              <li key={entry.activityId} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start">
                <button
                  type="button"
                  onClick={() => setPendingToggle(entry)}
                  disabled={togglingId === entry.activityId}
                  aria-pressed={entry.present}
                  aria-label={entry.present ? "Mark as absent" : "Mark as present"}
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-60 ${
                    entry.present ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {entry.present ? <Check size={16} /> : <X size={16} />}
                </button>
                <div className="flex-1">
                  <p className="font-semibold text-enactus-navy">{entry.activityTitle}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-enactus-dark-gray">
                    <Calendar size={13} />
                    {formatDate(entry.activityDate)}
                  </p>
                  <input
                    type="text"
                    placeholder="Remark (optional)"
                    value={entry.remark ?? ""}
                    onChange={(e) => updateLocalRemark(entry.activityId, e.target.value)}
                    className="mt-3 w-full rounded-lg border border-enactus-light-gray/50 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => saveRemark(entry)}
                  disabled={savingId === entry.activityId}
                  className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-enactus-navy px-4 py-2 text-xs font-semibold text-white hover:bg-enactus-navy/90 disabled:opacity-60 sm:self-center"
                >
                  <Save size={14} />
                  {savingId === entry.activityId ? "Saving..." : savedId === entry.activityId ? "Saved" : "Save remark"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={pendingToggle !== null}
        title={
          pendingToggle
            ? `Mark ${member.fullName} as ${pendingToggle.present ? "absent" : "present"}?`
            : ""
        }
        description={pendingToggle ? `For "${pendingToggle.activityTitle}".` : undefined}
        confirmLabel={pendingToggle?.present ? "Mark absent" : "Mark present"}
        danger={false}
        onConfirm={confirmToggle}
        onCancel={() => setPendingToggle(null)}
      />
    </div>
  );
}
