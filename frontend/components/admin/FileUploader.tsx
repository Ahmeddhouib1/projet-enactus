"use client";

import { useRef, useState } from "react";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { uploadFile } from "@/services/admin/upload";

interface FileUploaderProps {
  value?: string;
  onChange: (url: string, originalFilename: string) => void;
  label?: string;
}

/**
 * Generic document uploader (PDF/Word/Excel/PowerPoint) for the
 * project/marketing/sponsoring/general document spaces - unlike
 * ImageUploader, it has no image preview, just a filename chip.
 */
export default function FileUploader({ value, onChange, label = "File" }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file, "documents");
      onChange(result.url, result.originalFilename);
    } catch {
      setError("Upload failed. Check the file type (pdf, doc, docx, xls, xlsx, ppt, pptx) and size (max 5MB).");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <span className="inline-flex items-center gap-2 rounded-lg border border-enactus-light-gray/40 bg-[#F7F7F8] px-3 py-2 text-xs text-enactus-navy">
          <FileText size={16} className="shrink-0 text-enactus-navy" />
          <span className="max-w-[180px] truncate">{value.split("/").pop()}</span>
          <button type="button" onClick={() => onChange("", "")} aria-label="Remove file">
            <X size={14} className="text-red-600" />
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full border border-enactus-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-enactus-navy transition-colors hover:bg-enactus-navy hover:text-white disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : `Upload ${label}`}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
