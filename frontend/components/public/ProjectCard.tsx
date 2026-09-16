import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import StatusBadge from "@/components/public/StatusBadge";
import type { ProjectSummary } from "@/types/project";

export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-enactus-navy">
        <Image
          src={resolveMediaUrl(project.coverImage) || "/images/projects/placeholder.svg"}
          alt={project.name}
          fill
          unoptimized={isUploadedMedia(project.coverImage)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <StatusBadge status={project.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {project.category && (
          <p className="text-xs font-bold uppercase tracking-widest text-enactus-yellow">{project.category}</p>
        )}
        <h3 className="mt-2 text-xl font-bold text-enactus-navy">{project.name}</h3>
        {project.shortDescription && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-enactus-dark-gray">
            {project.shortDescription}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-enactus-navy">
          Discover the project
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
