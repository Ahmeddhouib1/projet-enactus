"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import ImageUploader from "@/components/admin/ImageUploader";
import type { UploadCategory } from "@/services/admin/upload";

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption?: string | null;
  displayOrder: number;
}

interface GalleryManagerProps {
  images: GalleryImage[];
  category: UploadCategory;
  onAdd: (imageUrl: string, caption: string) => Promise<void>;
  onDelete: (imageId: number) => Promise<void>;
  onReorder: (orderedIds: number[]) => Promise<void>;
}

export default function GalleryManager({ images, category, onAdd, onDelete, onReorder }: GalleryManagerProps) {
  const [pendingUrl, setPendingUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleAdd() {
    if (!pendingUrl) return;
    setBusy(true);
    try {
      await onAdd(pendingUrl, caption);
      setPendingUrl("");
      setCaption("");
    } finally {
      setBusy(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    await onReorder(reordered.map((img) => img.id));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-enactus-light-gray/60 p-5">
        <p className="text-sm font-semibold text-enactus-navy">Add a photo</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
          <ImageUploader category={category} value={pendingUrl} onChange={setPendingUrl} label="Photo" />
          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-lg border border-enactus-light-gray/50 px-4 py-2.5 text-sm sm:max-w-xs"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!pendingUrl || busy}
            className="shrink-0 rounded-full bg-enactus-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            Add to gallery
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div key={image.id} className="overflow-hidden rounded-xl border border-enactus-light-gray/30">
              <div className="relative aspect-video bg-enactus-light-gray/20">
                <Image
                  src={resolveMediaUrl(image.imageUrl)}
                  alt={image.caption ?? ""}
                  fill
                  unoptimized={isUploadedMedia(image.imageUrl)}
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-xs text-enactus-dark-gray">{image.caption || "No caption"}</span>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-1.5 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className="rounded p-1.5 text-enactus-navy hover:bg-enactus-light-gray/15 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete photo"
                    onClick={() => onDelete(image.id)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
