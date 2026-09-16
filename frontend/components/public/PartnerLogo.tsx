import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import type { Partner } from "@/types/partner";

export default function PartnerLogo({ partner }: { partner: Partner }) {
  const content = (
    <div className="group relative flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-enactus-light-gray/30 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-enactus-yellow hover:shadow-lg">
      <div className="relative h-14 w-full">
        <Image
          src={resolveMediaUrl(partner.logo)}
          alt={partner.name}
          fill
          unoptimized={isUploadedMedia(partner.logo)}
          sizes="200px"
          className="object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-1 rounded-xl bg-enactus-navy/90 p-4 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-sm font-semibold text-white">{partner.name}</span>
        {partner.websiteUrl && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-enactus-yellow">
            Visit website <ExternalLink size={12} />
          </span>
        )}
      </div>
    </div>
  );

  if (partner.websiteUrl) {
    return (
      <a href={partner.websiteUrl} target="_blank" rel="noreferrer noopener" aria-label={partner.name}>
        {content}
      </a>
    );
  }

  return content;
}
