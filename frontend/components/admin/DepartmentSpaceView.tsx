"use client";

import { useEffect, useState } from "react";
import CollectiveAttendanceTable from "@/components/admin/CollectiveAttendanceTable";
import DocumentManager from "@/components/admin/DocumentManager";
import { getCollectiveAttendance } from "@/services/admin/activities";
import type { Attendance } from "@/types/activity";
import type { DocumentScope } from "@/types/document";

interface DepartmentSpaceViewProps {
  department: "MARKETING" | "SPONSORING";
  documentScope: DocumentScope;
}

export default function DepartmentSpaceView({ department, documentScope }: DepartmentSpaceViewProps) {
  const [rows, setRows] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollectiveAttendance(department)
      .then(setRows)
      .finally(() => setLoading(false));
  }, [department]);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-base font-bold text-enactus-navy">Collective presence sheet</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          Every member&apos;s attendance across every {department.toLowerCase()} activity, in one table.
        </p>
        <div className="mt-5">
          {loading ? (
            <p className="text-sm text-enactus-dark-gray">Loading attendance...</p>
          ) : (
            <CollectiveAttendanceTable rows={rows} />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-enactus-light-gray/30 bg-white p-6 sm:p-8">
        <h2 className="text-base font-bold text-enactus-navy">Document space</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          Shared files for the {department.toLowerCase()} team.
        </p>
        <div className="mt-5">
          <DocumentManager scope={documentScope} />
        </div>
      </section>
    </div>
  );
}
