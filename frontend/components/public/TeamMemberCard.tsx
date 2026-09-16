import Image from "next/image";
import { Crown } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import type { TeamMember } from "@/types/team";

const LEADERSHIP_ROLES = ["Team Leader", "Vice Team Leader"];

export default function TeamMemberCard({ member }: { member: TeamMember }) {
  const isLeadership = LEADERSHIP_ROLES.includes(member.role);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-enactus-light-gray/20">
        <Image
          src={resolveMediaUrl(member.photoUrl) || "/images/team/placeholder.svg"}
          alt={member.fullName}
          fill
          unoptimized={isUploadedMedia(member.photoUrl)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isLeadership && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-enactus-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-enactus-navy shadow">
            <Crown size={14} />
            Leadership
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-enactus-navy/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-enactus-navy">{member.fullName}</h3>
        <div className="mt-2 h-0.5 w-10 bg-enactus-yellow" />
        <p className="mt-2 text-sm font-medium text-enactus-dark-gray">{member.role}</p>
      </div>
    </article>
  );
}
