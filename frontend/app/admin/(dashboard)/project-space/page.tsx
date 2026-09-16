"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
import PmPasswordGate from "@/components/admin/PmPasswordGate";
import ProjectSpaceCard from "@/components/admin/ProjectSpaceCard";
import StatusBadge from "@/components/public/StatusBadge";
import { isTeamLeadership } from "@/lib/space-access";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { listAdminProjects } from "@/services/admin/projects";
import type { Member } from "@/types/member";
import type { AdminProject } from "@/types/project";

export default function AdminProjectSpacePage() {
  const [member, setMember] = useState<Member | null>(null);
  const [allProjects, setAllProjects] = useState<AdminProject[]>([]);
  const [allProjectsLoaded, setAllProjectsLoaded] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (!member) return;
    listAdminProjects()
      .then(setAllProjects)
      .finally(() => setAllProjectsLoaded(true));
  }, [member]);

  if (!member) {
    return (
      <PmPasswordGate
        onUnlock={(m) => {
          setMember(m);
          setSelectedProjectId(null);
        }}
      />
    );
  }

  const seesEveryProject = isTeamLeadership(member);
  const assignedIds = new Set(member.projects.map((p) => p.id));
  const visibleProjects = seesEveryProject ? allProjects : allProjects.filter((p) => assignedIds.has(p.id));
  const emptyProjectsMessage = seesEveryProject
    ? "No project teams have been created yet."
    : "You are not assigned to any project team yet.";

  if (!seesEveryProject && selectedProjectId === null && allProjectsLoaded && visibleProjects.length === 1) {
    setSelectedProjectId(visibleProjects[0].id);
  }

  function switchMember() {
    setMember(null);
    setSelectedProjectId(null);
    setAllProjects([]);
    setAllProjectsLoaded(false);
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-enactus-dark-gray">
        Signed in as <span className="font-semibold text-enactus-navy">{member.fullName}</span>
        {seesEveryProject && <span className="ml-2 text-xs text-enactus-dark-gray">(all project teams)</span>}
      </p>
      <button type="button" onClick={switchMember} className="text-xs font-semibold text-enactus-dark-gray hover:underline">
        Switch
      </button>
    </div>
  );

  if (!allProjectsLoaded) {
    return (
      <div className="space-y-8">
        {header}
        <p className="text-sm text-enactus-dark-gray">Loading projects...</p>
      </div>
    );
  }

  const selectedProject = visibleProjects.find((p) => p.id === selectedProjectId) ?? null;

  if (selectedProject) {
    return (
      <div className="space-y-8">
        {header}
        {visibleProjects.length > 1 && (
          <button
            type="button"
            onClick={() => setSelectedProjectId(null)}
            className="text-xs font-semibold text-enactus-dark-gray hover:underline"
          >
            &larr; Back to project teams
          </button>
        )}
        <ProjectSpaceCard projectId={selectedProject.id} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {header}

      {visibleProjects.length === 0 ? (
        <p className="text-sm text-enactus-dark-gray">{emptyProjectsMessage}</p>
      ) : (
        <div>
          <h2 className="text-base font-bold text-enactus-navy">Choose a project team</h2>
          <p className="mt-1 text-sm text-enactus-dark-gray">
            {seesEveryProject
              ? "Pick the project team whose space you want to open."
              : "Pick which of your assigned project teams you want to open."}
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => setSelectedProjectId(project.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-enactus-light-gray/40 bg-white p-4 text-left transition-colors hover:border-enactus-yellow hover:bg-enactus-yellow/5"
                >
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-enactus-light-gray/20">
                    {project.logo || project.coverImage ? (
                      <Image
                        src={resolveMediaUrl(project.logo || project.coverImage) || ""}
                        alt={project.name}
                        fill
                        unoptimized={isUploadedMedia(project.logo || project.coverImage)}
                        className="object-cover"
                      />
                    ) : (
                      <FolderKanban size={18} className="text-enactus-navy" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-enactus-navy">{project.name}</span>
                    <span className="mt-1 block">
                      <StatusBadge status={project.status} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
