"use client";

import { useMemo, useState } from "react";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string | number;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  pageSize = 10,
  emptyTitle = "No records yet",
  emptyDescription = "Items you create will show up here.",
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageRows = useMemo(
    () => rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [rows, currentPage, pageSize],
  );

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-enactus-light-gray/30 bg-[#F7F7F8]">
            <tr>
              {columns.map((col) => (
                <th key={col.header} className="px-5 py-3 font-semibold text-enactus-dark-gray">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-enactus-light-gray/20">
            {pageRows.map((row) => (
              <tr key={keyExtractor(row)} className="transition-colors hover:bg-[#F7F7F8]">
                {columns.map((col) => (
                  <td key={col.header} className={col.className ?? "px-5 py-4 text-enactus-navy"}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
