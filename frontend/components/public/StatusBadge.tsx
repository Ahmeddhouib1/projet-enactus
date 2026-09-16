import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/types/project";

const STATUS_STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  IDEA: { label: "Idea", className: "bg-enactus-light-gray/30 text-enactus-dark-gray" },
  IN_PROGRESS: { label: "In Progress", className: "bg-enactus-yellow/25 text-enactus-navy" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-800" },
  COMPLETED: { label: "Completed", className: "bg-enactus-navy/10 text-enactus-navy" },
  ARCHIVED: { label: "Archived", className: "bg-enactus-light-gray/40 text-enactus-dark-gray" },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        style.className,
      )}
    >
      {style.label}
    </span>
  );
}
