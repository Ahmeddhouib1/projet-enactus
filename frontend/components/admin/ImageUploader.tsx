"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { uploadFile, type UploadCategory } from "@/services/admin/upload";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  category: UploadCategory;
  label?: string;
}

export default function ImageUploader({ value, onChange, category, label = "Image" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file, category);
      onChange(result.url);
    } catch {
      setError("Upload failed. Check the file type (jpg, png, webp, gif, svg) and size (max 5MB).");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-start gap-4">
      <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-enactus-light-gray/40 bg-[#F7F7F8]">
        {value ? (
          <Image
            src={resolveMediaUrl(value)}
            alt={label}
            fill
            unoptimized={isUploadedMedia(value)}
            className="object-cover"
          />
        ) : (
          <Upload size={20} className="text-enactus-light-gray" />
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Loader2 size={20} className="animate-spin text-enactus-navy" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-full border border-enactus-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-enactus-navy transition-colors hover:bg-enactus-navy hover:text-white disabled:opacity-50"
          >
            {value ? "Replace" : "Upload"} {label}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
            >
              <X size={14} />
              Remove
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileChange}
        />
        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      </div>
    </div>
  );
}
