"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import TeamMemberFormModal from "@/components/admin/TeamMemberFormModal";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import {
  createTeamMember,
  deleteTeamMember,
  listAdminTeam,
  reorderTeamMembers,
  updateTeamMember,
} from "@/services/admin/team";
import type { AdminTeamMember } from "@/types/team";
import type { TeamMemberFormValues } from "@/lib/validation";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<AdminTeamMember | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AdminTeamMember | null>(null);

  async function refresh() {
    setMembers(await listAdminTeam());
  }

  useEffect(() => {
    listAdminTeam()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(values: TeamMemberFormValues) {
    if (editingMember) {
      await updateTeamMember(editingMember.id, values);
    } else {
      await createTeamMember(values);
    }
    setModalOpen(false);
    setEditingMember(null);
    await refresh();
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteTeamMember(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  async function moveMember(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= members.length) return;
    const reordered = [...members];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setMembers(reordered);
    await reorderTeamMembers(reordered.map((m) => m.id));
  }

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading team...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">Manage the executive board shown on the public Team page.</p>
        <button
          type="button"
          onClick={() => {
            setEditingMember(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-enactus-yellow px-5 py-2.5 text-sm font-bold text-enactus-navy hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {members.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No team members yet" description="Add the first executive board member." />
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-enactus-light-gray/20 rounded-2xl border border-enactus-light-gray/30 bg-white">
          {members.map((member, index) => (
            <li key={member.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-enactus-light-gray/20">
                <Image
                  src={resolveMediaUrl(member.photoUrl) || "/images/team/placeholder.svg"}
                  alt={member.fullName}
                  fill
                  unoptimized={isUploadedMedia(member.photoUrl)}
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-enactus-navy">
                  {member.fullName}
                  {!member.active && (
                    <span className="ml-2 rounded-full bg-enactus-light-gray/30 px-2 py-0.5 text-xs font-medium text-enactus-dark-gray">
                      Inactive
                    </span>
                  )}
                </p>
                <p className="text-sm text-enactus-dark-gray">{member.role}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => moveMember(index, -1)}
                  disabled={index === 0}
                  className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => moveMember(index, 1)}
                  disabled={index === members.length - 1}
                  className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Edit member"
                  onClick={() => {
                    setEditingMember(member);
                    setModalOpen(true);
                  }}
                  className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Delete member"
                  onClick={() => setPendingDelete(member)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <TeamMemberFormModal
        open={modalOpen}
        initialValue={editingMember}
        onSubmit={handleSubmit}
        onClose={() => {
          setModalOpen(false);
          setEditingMember(null);
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.fullName}"?`}
        description="This member will be permanently removed from the public site."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
