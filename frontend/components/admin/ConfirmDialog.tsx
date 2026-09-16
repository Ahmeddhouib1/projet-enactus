"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-enactus-navy/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            danger ? "bg-red-100 text-red-600" : "bg-enactus-yellow/20 text-enactus-navy"
          }`}
        >
          <AlertTriangle size={20} />
        </div>
        <h2 id="confirm-dialog-title" className="mt-4 text-lg font-bold text-enactus-navy">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-enactus-dark-gray">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-semibold text-enactus-dark-gray hover:bg-enactus-light-gray/15"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-full px-5 py-2 text-sm font-semibold text-white ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-enactus-navy hover:bg-enactus-navy/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
