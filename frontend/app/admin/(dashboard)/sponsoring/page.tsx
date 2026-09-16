"use client";

import { useState } from "react";
import PmPasswordGate from "@/components/admin/PmPasswordGate";
import DepartmentSpaceView from "@/components/admin/DepartmentSpaceView";
import { canAccessSponsoringSpace } from "@/lib/space-access";
import type { Member } from "@/types/member";

export default function AdminSponsoringSpacePage() {
  const [member, setMember] = useState<Member | null>(null);

  if (!member) {
    return (
      <PmPasswordGate
        onUnlock={setMember}
        filter={canAccessSponsoringSpace}
        heading="Who are you?"
        subheading='Select your name to open the Sponsoring Space. Only the "Responsable Sponsoring", the Team Leader or the Vice Team Leader appear here.'
        emptyMessage='No member is eligible yet - set the "Responsable Sponsoring" role from the Members page.'
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-enactus-dark-gray">
          Signed in as <span className="font-semibold text-enactus-navy">{member.fullName}</span>
        </p>
        <button
          type="button"
          onClick={() => setMember(null)}
          className="text-xs font-semibold text-enactus-dark-gray hover:underline"
        >
          Switch
        </button>
      </div>
      <DepartmentSpaceView department="SPONSORING" documentScope="SPONSORING" />
    </div>
  );
}
