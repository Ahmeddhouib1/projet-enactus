"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Pencil, Plus, Search, Trash2 } from "lucide-react";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import MemberFormModal from "@/components/admin/MemberFormModal";
import { inputClassName } from "@/components/admin/FormField";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { createMember, deleteMember, listMembers, updateMember } from "@/services/admin/members";
import type { Member } from "@/types/member";
import type { MemberFormValues } from "@/lib/validation";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<"ALL" | "MARKETING" | "SPONSORING">("ALL");
  const [projectFilter, setProjectFilter] = useState<"ALL" | number>("ALL");

  async function refresh() {
    setMembers(await listMembers());
  }

  useEffect(() => {
    listMembers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(values: MemberFormValues) {
    if (editingMember) {
      await updateMember(editingMember.id, values);
    } else {
      await createMember(values);
    }
    setModalOpen(false);
    setEditingMember(null);
    await refresh();
  }

  async function handleDeleteConfirmed() {
    if (!pendingDelete) return;
    await deleteMember(pendingDelete.id);
    setPendingDelete(null);
    await refresh();
  }

  const projectOptions = useMemo(() => {
    const byId = new Map<number, string>();
    members.forEach((m) => m.projects.forEach((p) => byId.set(p.id, p.name)));
    return Array.from(byId.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [members]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesSearch =
        query === "" ||
        member.fullName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);
      const matchesDepartment = departmentFilter === "ALL" || member.department === departmentFilter;
      const matchesProject = projectFilter === "ALL" || member.projects.some((p) => p.id === projectFilter);
      return matchesSearch && matchesDepartment && matchesProject;
    });
  }, [members, search, departmentFilter, projectFilter]);

  const columns: DataTableColumn<Member>[] = [
    {
      header: "Member",
      cell: (member) => (
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-enactus-light-gray/20">
            <Image
              src={resolveMediaUrl(member.photoUrl) || "/images/team/placeholder.svg"}
              alt={member.fullName}
              fill
              unoptimized={isUploadedMedia(member.photoUrl)}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-enactus-navy">{member.fullName}</p>
            <p className="text-xs text-enactus-dark-gray">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      cell: (member) =>
        member.department ? (
          <span className="rounded-full bg-enactus-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy">
            {member.department}
          </span>
        ) : (
          <span className="text-xs text-enactus-light-gray">-</span>
        ),
    },
    {
      header: "Role",
      cell: (member) =>
        member.role ? (
          <span className="text-xs font-medium text-enactus-navy">{member.role}</span>
        ) : (
          <span className="text-xs text-enactus-light-gray">-</span>
        ),
    },
    {
      header: "Project team(s)",
      cell: (member) =>
        member.projects.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {member.projects.map((p) => (
              <span key={p.id} className="rounded-full bg-enactus-light-gray/20 px-2.5 py-1 text-xs text-enactus-navy">
                {p.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-enactus-dark-gray">None</span>
        ),
    },
    {
      header: "Status",
      cell: (member) =>
        member.active ? (
          <span className="text-xs font-semibold text-green-700">Active</span>
        ) : (
          <span className="text-xs font-semibold text-enactus-dark-gray">Inactive</span>
        ),
    },
    {
      header: "Actions",
      cell: (member) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/members/${member.id}`}
            aria-label="View presence sheet"
            className="rounded-md p-2 text-enactus-navy hover:bg-enactus-light-gray/15"
          >
            <ClipboardList size={16} />
          </Link>
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
      ),
    },
  ];

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading members...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">
          Internal club roster: department, project teams and attendance history.
        </p>
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-enactus-light-gray" />
          <input
            type="search"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClassName} pl-10`}
            aria-label="Search members"
          />
        </div>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value as typeof departmentFilter)}
          className={`${inputClassName} sm:w-52`}
          aria-label="Filter by department"
        >
          <option value="ALL">All departments</option>
          <option value="MARKETING">Marketing</option>
          <option value="SPONSORING">Sponsoring</option>
        </select>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value === "ALL" ? "ALL" : Number(e.target.value))}
          className={`${inputClassName} sm:w-56`}
          aria-label="Filter by project team"
        >
          <option value="ALL">All project teams</option>
          {projectOptions.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <DataTable
          columns={columns}
          rows={filteredMembers}
          keyExtractor={(m) => m.id}
          emptyTitle={members.length === 0 ? "No members yet" : "No members match your filters"}
          emptyDescription={
            members.length === 0
              ? "Add the first club member to start tracking project teams and attendance."
              : "Try a different search term or clear the filters."
          }
        />
      </div>

      <MemberFormModal
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
        description="This member and their attendance history will be permanently removed."
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
