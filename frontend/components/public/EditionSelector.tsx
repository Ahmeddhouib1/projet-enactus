"use client";

import { useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import ImageGallery from "@/components/public/ImageGallery";
import type { EventEdition } from "@/types/event";

export default function EditionSelector({ editions }: { editions: EventEdition[] }) {
  const [selectedId, setSelectedId] = useState(editions[0]?.id);
  const selected = editions.find((e) => e.id === selectedId) ?? editions[0];

  if (editions.length === 0) {
    return (
      <p className="text-sm text-enactus-dark-gray">No editions have been published for this event yet.</p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-enactus-light-gray/30 pb-4">
        {editions.map((edition) => (
          <button
            key={edition.id}
            type="button"
            onClick={() => setSelectedId(edition.id)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-all",
              selected?.id === edition.id
                ? "bg-enactus-navy text-white shadow-md"
                : "bg-enactus-light-gray/15 text-enactus-navy hover:bg-enactus-light-gray/30",
            )}
          >
            {edition.editionName || edition.year}
          </button>
        ))}
      </div>

      {selected && (
        <div className="animate-fade-in mt-8 space-y-8">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-enactus-dark-gray">
            {(selected.startDate || selected.endDate) && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-enactus-yellow" />
                {formatDate(selected.startDate)}
                {selected.endDate && selected.endDate !== selected.startDate
                  ? ` - ${formatDate(selected.endDate)}`
                  : ""}
              </span>
            )}
            {selected.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-enactus-yellow" />
                {selected.location}
              </span>
            )}
          </div>

          {selected.description && (
            <p className="max-w-3xl text-base leading-relaxed text-enactus-dark-gray">{selected.description}</p>
          )}

          {selected.images.length > 0 && <ImageGallery images={selected.images} />}
        </div>
      )}
    </div>
  );
}
