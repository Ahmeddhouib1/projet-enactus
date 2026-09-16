import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { formatDate, isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import type { EventSummary } from "@/types/event";

export default function EventCard({ event }: { event: EventSummary }) {
  const latestEdition = event.editions[0];

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-enactus-dark-gray">
        <Image
          src={resolveMediaUrl(event.coverImage) || "/images/events/placeholder.svg"}
          alt={event.name}
          fill
          unoptimized={isUploadedMedia(event.coverImage)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-enactus-navy">{event.name}</h3>
        {event.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-enactus-dark-gray">
            {event.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-enactus-dark-gray">
          {latestEdition && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-enactus-light-gray/20 px-3 py-1">
              <CalendarDays size={14} />
              {latestEdition.startDate ? formatDate(latestEdition.startDate) : latestEdition.year}
            </span>
          )}
          {event.editions.length > 0 && (
            <span className="text-enactus-navy/70">
              {event.editions.length} edition{event.editions.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-enactus-navy">
          View editions
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
}
