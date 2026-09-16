"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";

interface GalleryImage {
  id: number | string;
  imageUrl: string;
  caption?: string | null;
}

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, showPrev, showNext]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative block w-full overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-enactus-yellow"
            aria-label={image.caption ? `View photo: ${image.caption}` : "View photo"}
          >
            <Image
              src={resolveMediaUrl(image.imageUrl)}
              alt={image.caption ?? "Gallery photo"}
              width={600}
              height={450}
              unoptimized={isUploadedMedia(image.imageUrl)}
              className="w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-enactus-navy/95 p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="relative max-h-[80vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={resolveMediaUrl(images[activeIndex].imageUrl)}
              alt={images[activeIndex].caption ?? "Gallery photo"}
              width={1200}
              height={900}
              unoptimized={isUploadedMedia(images[activeIndex].imageUrl)}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {images[activeIndex].caption && (
              <p className="mt-3 text-center text-sm text-enactus-light-gray">{images[activeIndex].caption}</p>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}
