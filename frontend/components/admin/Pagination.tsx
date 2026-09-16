"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-enactus-light-gray/30 px-4 py-3">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-enactus-navy disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      <span className="text-sm text-enactus-dark-gray">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-enactus-navy disabled:opacity-40"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
