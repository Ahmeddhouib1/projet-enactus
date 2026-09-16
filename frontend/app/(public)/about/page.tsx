import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import ValueCard from "@/components/public/ValueCard";
import CTASection from "@/components/public/CTASection";
import { getSiteContent, getValues } from "@/services/public/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "Discover Enactus ENSI's identity, mission, vision and the values driving our projects.",
};

export default async function AboutPage() {
  const [content, values] = await Promise.all([
    getSiteContent().catch(() => null),
    getValues().catch(() => []),
  ]);

  return (
    <>
      <section className="bg-enactus-navy py-24">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <SectionHeading
            eyebrow="About us"
            title="Entrepreneurial Action for a Better World"
            light
            description="Enactus ENSI is part of a global movement of student entrepreneurs turning bold ideas into measurable social impact."
          />
        </div>
      </section>

      {/* What is Enactus */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-content gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <SectionHeading eyebrow="The movement" title="What is Enactus?" />
          <p className="text-lg leading-relaxed text-enactus-dark-gray">
            {content?.enactusDescription ??
              "Enactus is an international community of student, academic and business leaders committed to using the power of entrepreneurial action to transform lives and shape a better, more sustainable world."}
          </p>
        </div>
      </section>

      {/* Enactus ENSI */}
      <section className="bg-[#F7F7F8] py-24">
        <div className="mx-auto grid max-w-content gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <p className="order-2 text-lg leading-relaxed text-enactus-dark-gray lg:order-1">
            {content?.enactusEnsiDescription ??
              "Enactus ENSI is the local chapter bringing together students who design and run social entrepreneurship projects with real impact."}
          </p>
          <SectionHeading eyebrow="Our chapter" title="Enactus ENSI" className="order-1 lg:order-2" />
        </div>
      </section>

      {/* Mission & Vision - editorial layout */}
      <section className="bg-enactus-navy py-24">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/15 p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-enactus-yellow">Mission</p>
              <p className="mt-6 text-2xl font-semibold leading-snug text-white">{content?.mission}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-enactus-yellow">Vision</p>
              <p className="mt-6 text-2xl font-semibold leading-snug text-white">{content?.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main concept */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Social entrepreneurship, in practice"
            align="center"
            className="mx-auto"
            description={content?.mainConcept ?? undefined}
          />
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className="bg-[#F7F7F8] py-24">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <SectionHeading eyebrow="What drives us" title="Our Values" align="center" className="mx-auto" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <ValueCard key={value.id} value={value} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Meet the team"
        title="The people behind Enactus ENSI"
        description="Get to know the executive board driving our projects forward."
        ctaLabel="Meet our team"
        ctaHref="/team"
      />
    </>
  );
}
