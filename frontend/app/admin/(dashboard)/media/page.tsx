"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import type { UploadCategory } from "@/services/admin/upload";

const CATEGORIES: { value: UploadCategory; label: string }[] = [
  { value: "team", label: "Team" },
  { value: "projects", label: "Projects" },
  { value: "events", label: "Events" },
  { value: "partners", label: "Partners" },
  { value: "misc", label: "Other" },
];

export default function AdminMediaPage() {
  const [category, setCategory] = useState<UploadCategory>("misc");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(uploadedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm text-enactus-dark-gray">
        Upload an image and copy its URL to use anywhere in the CMS - team portraits, project covers,
        event photos or partner logos are typically added directly from their own forms, but this page
        is handy for one-off uploads.
      </p>

      <div className="mt-6 rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <label className="text-sm font-semibold text-enactus-navy" htmlFor="media-category">
          Category
        </label>
        <select
          id="media-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as UploadCategory);
            setUploadedUrl("");
          }}
          className="mt-2 w-full rounded-lg border border-enactus-light-gray/50 px-4 py-2.5 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <div className="mt-6">
          <ImageUploader category={category} value={uploadedUrl} onChange={setUploadedUrl} label="File" />
        </div>

        {uploadedUrl && (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-[#F7F7F8] px-4 py-3">
            <code className="flex-1 truncate text-xs text-enactus-navy">{uploadedUrl}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full bg-enactus-navy px-3 py-1.5 text-xs font-semibold text-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
