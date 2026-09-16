import { Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import EmptyState from "@/components/admin/EmptyState";
import type { Attendance } from "@/types/activity";

/**
 * Read-only "fiche de presence collectif": one combined table across many
 * activities and members. To edit a specific member's status, use the
 * activity's take-attendance screen or the member's own presence sheet.
 */
export default function CollectiveAttendanceTable({ rows }: { rows: Attendance[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title="No attendance recorded yet"
        description="Create an activity for this audience to start tracking presence."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-enactus-light-gray/30 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-enactus-light-gray/30 bg-[#F7F7F8]">
            <tr>
              <th className="px-5 py-3 font-semibold text-enactus-dark-gray">Member</th>
              <th className="px-5 py-3 font-semibold text-enactus-dark-gray">Activity</th>
              <th className="px-5 py-3 font-semibold text-enactus-dark-gray">Date</th>
              <th className="px-5 py-3 font-semibold text-enactus-dark-gray">Present</th>
              <th className="px-5 py-3 font-semibold text-enactus-dark-gray">Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-enactus-light-gray/20">
            {rows.map((row) => (
              <tr key={`${row.activityId}-${row.memberId}`} className="hover:bg-[#F7F7F8]">
                <td className="px-5 py-3 font-medium text-enactus-navy">{row.memberFullName}</td>
                <td className="px-5 py-3 text-enactus-navy">{row.activityTitle}</td>
                <td className="px-5 py-3 text-enactus-dark-gray">{formatDate(row.activityDate)}</td>
                <td className="px-5 py-3">
                  {row.present ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                      <Check size={14} /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                      <X size={14} /> Absent
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-enactus-dark-gray">{row.remark || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
