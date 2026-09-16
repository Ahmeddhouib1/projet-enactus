import type { Member } from "@/types/member";

function normalizedRole(member: Member): string {
  return member.role?.trim().toLowerCase() ?? "";
}

/** Team Leader and Vice Team Leader oversee every team, so they can open every responsable space. */
export function isTeamLeadership(member: Member): boolean {
  const role = normalizedRole(member);
  return role === "team leader" || role === "vice team leader";
}

export function canAccessProjectSpace(member: Member): boolean {
  return isTeamLeadership(member) || (normalizedRole(member) === "project manager" && member.projects.length > 0);
}

export function canAccessMarketingSpace(member: Member): boolean {
  return isTeamLeadership(member) || normalizedRole(member) === "responsable pole marketing";
}

export function canAccessSponsoringSpace(member: Member): boolean {
  return isTeamLeadership(member) || normalizedRole(member) === "responsable sponsoring";
}
