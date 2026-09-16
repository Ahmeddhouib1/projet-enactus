"use client";

import { useEffect, useState } from "react";
import CollectiveAttendanceTable from "@/components/admin/CollectiveAttendanceTable";
import DocumentManager from "@/components/admin/DocumentManager";
import { getCollectiveAttendance } from "@/services/admin/activities";
import type { Attendance } from "@/types/activity";

export default function AdminSgSpacePage() {
  const [rows, setRows] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCollectiveAttendance()
      .then(setRows)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-base font-bold text-enactus-navy">Collective presence sheet</h2>
        <p className="mt-1 text-sm text-enactus-dark-gray">
          Every member&apos;s attendance across every activity, for every team - the SG&apos;s full overview.
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
        <p className="mt-1 text-sm text-enactus-dark-gray">Shared documents for all responsables.</p>
        <div className="mt-5">
          <DocumentManager scope="GENERAL" emptyDescription="Upload the first shared document for all responsables." />
        </div>
      </section>
    </div>
  );
}
