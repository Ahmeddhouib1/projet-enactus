import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import TeamMemberCard from "@/components/public/TeamMemberCard";
import { getTeamMembers } from "@/services/public/team";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the executive board of Enactus ENSI.",
};

export default async function TeamPage() {
  const members = await getTeamMembers().catch(() => []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our people"
          title="Executive Board"
          align="center"
          className="mx-auto"
          description="The students leading Enactus ENSI's projects, operations and partnerships this year."
        />

        {members.length > 0 ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-enactus-dark-gray">Team information will be available soon.</p>
        )}
      </div>
    </section>
  );
}
