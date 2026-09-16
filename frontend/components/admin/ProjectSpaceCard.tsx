"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import DocumentManager from "@/components/admin/DocumentManager";
import StatusBadge from "@/components/public/StatusBadge";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { listMembers } from "@/services/admin/members";
import { getAdminProject } from "@/services/admin/projects";
import type { Member } from "@/types/member";
import type { AdminProject } from "@/types/project";

const PHASES: { value: AdminProject["phase"]; label: string }[] = [
  { value: "PROBLEMATIQUE", label: "Problematique" },
  { value: "IDEA_STEP_1", label: "Idea - Step 1" },
  { value: "IDEA_STEP_2", label: "Idea - Step 2" },
  { value: "PILOT_STEP_1", label: "Pilot - Step 1" },
  { value: "PILOT_STEP_2", label: "Pilot - Step 2" },
];

export default function ProjectSpaceCard({ projectId }: { projectId: number }) {
  const [project, setProject] = useState<AdminProject | null>(null);
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPhase, setOpenPhase] = useState<AdminProject["phase"] | null>(null);

  useEffect(() => {
    Promise.all([getAdminProject(projectId), listMembers(projectId)])
      .then(([p, m]) => {
        setProject(p);
        setTeam(m);
        setOpenPhase(p.phase);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return <p className="text-sm text-enactus-dark-gray">Loading project...</p>;
  }

  if (!project) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-bold text-enactus-navy">{project.name}</h2>
        <StatusBadge status={project.status} />
        <span className="rounded-full bg-enactus-yellow/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy">
          Current phase: {PHASES.find((p) => p.value === project.phase)?.label}
        </span>
      </div>

      <div className="mt-5">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-enactus-navy">
          <Users size={16} />
          Project team ({team.length})
        </h3>
        {team.length === 0 ? (
          <p className="mt-2 text-sm text-enactus-dark-gray">No members assigned to this project team yet.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-3">
            {team.map((member) => (
              <li key={member.id} className="flex items-center gap-2 rounded-full bg-[#F7F7F8] py-1.5 pl-1.5 pr-3">
                <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-enactus-light-gray/30">
                  <Image
                    src={resolveMediaUrl(member.photoUrl) || "/images/team/placeholder.svg"}
                    alt={member.fullName}
                    fill
                    unoptimized={isUploadedMedia(member.photoUrl)}
                    className="object-cover"
                  />
                </span>
                <span className="text-xs font-medium text-enactus-navy">{member.fullName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-enactus-navy">Documents by phase</h3>
        <div className="mt-3 space-y-2">
          {PHASES.map((phase) => (
            <div key={phase.value} className="rounded-xl border border-enactus-light-gray/30">
              <button
                type="button"
                onClick={() => setOpenPhase(openPhase === phase.value ? null : phase.value)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-enactus-navy"
              >
                <span className="flex items-center gap-2">
                  {phase.label}
                  {project.phase === phase.value && (
                    <span className="rounded-full bg-enactus-yellow/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-enactus-navy">
                      Current
                    </span>
                  )}
                </span>
                {openPhase === phase.value ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openPhase === phase.value && (
                <div className="border-t border-enactus-light-gray/30 p-4">
                  <DocumentManager
                    scope="PROJECT"
                    projectId={projectId}
                    phase={phase.value}
                    emptyDescription={`No documents yet for the ${phase.label} phase.`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
