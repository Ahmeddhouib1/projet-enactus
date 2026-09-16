import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import PartnerLogo from "@/components/public/PartnerLogo";
import { getPartners } from "@/services/public/partners";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Partners",
  description: "Organizations and institutions supporting Enactus ENSI's mission and projects.",
};

export default async function PartnersPage() {
  const partners = await getPartners().catch(() => []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our network"
          title="Partners"
          align="center"
          className="mx-auto"
          description="Enactus ENSI's projects and events are made possible thanks to the trust of our partners."
        />

        {partners.length > 0 ? (
          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <PartnerLogo key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-enactus-dark-gray">No partners have been published yet.</p>
        )}
      </div>
    </section>
  );
}
