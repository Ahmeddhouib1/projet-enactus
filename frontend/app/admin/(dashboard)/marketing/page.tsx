"use client";

import { useState } from "react";
import PmPasswordGate from "@/components/admin/PmPasswordGate";
import DepartmentSpaceView from "@/components/admin/DepartmentSpaceView";
import { canAccessMarketingSpace } from "@/lib/space-access";
import type { Member } from "@/types/member";

export default function AdminMarketingSpacePage() {
  const [member, setMember] = useState<Member | null>(null);

  if (!member) {
    return (
      <PmPasswordGate
        onUnlock={setMember}
        filter={canAccessMarketingSpace}
        heading="Who are you?"
        subheading='Select your name to open the Marketing Space. Only the "Responsable Pole Marketing", the Team Leader or the Vice Team Leader appear here.'
        emptyMessage='No member is eligible yet - set the "Responsable Pole Marketing" role from the Members page.'
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
      <DepartmentSpaceView department="MARKETING" documentScope="MARKETING" />
    </div>
  );
}
