import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/public/HeroSection";
import SplashIntro from "@/components/public/SplashIntro";
import SectionHeading from "@/components/public/SectionHeading";
import ValueCard from "@/components/public/ValueCard";
import ProjectCard from "@/components/public/ProjectCard";
import EventCard from "@/components/public/EventCard";
import PartnerLogo from "@/components/public/PartnerLogo";
import CTASection from "@/components/public/CTASection";
import { getSiteContent, getValues } from "@/services/public/content";
import { getProjects } from "@/services/public/projects";
import { getEvents } from "@/services/public/events";
import { getPartners } from "@/services/public/partners";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [content, values, projects, events, partners] = await Promise.all([
    getSiteContent().catch(() => null),
    getValues().catch(() => []),
    getProjects(true).catch(() => []),
    getEvents().catch(() => []),
    getPartners().catch(() => []),
  ]);

  const featuredProjects = projects.slice(0, 3);
  const latestEvents = events.slice(0, 3);

  return (
    <>
      <SplashIntro />
      <HeroSection />

      {/* About preview */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <SectionHeading
              eyebrow="Who we are"
              title="Turning entrepreneurial ideas into social impact"
              description={
                content?.enactusEnsiDescription ??
                "Enactus ENSI brings together students who design and run social entrepreneurship projects with real, measurable impact on communities in Tunisia."
              }
            />
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-full w-full rounded-2xl border-2 border-enactus-yellow/40" />
              <div className="relative rounded-2xl bg-enactus-navy p-10 text-white">
                <p className="text-lg leading-relaxed text-enactus-light-gray">
                  {content?.enactusDescription ??
                    "Enactus is an international community of student, academic and business leaders using entrepreneurial action to transform lives."}
                </p>
                <Link
                  href="/about"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-enactus-yellow"
                >
                  Learn more
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      {values.length > 0 && (
        <section className="bg-[#F7F7F8] py-24">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <SectionHeading
              eyebrow="What drives us"
              title="Mission, Vision & Values"
              align="center"
              className="mx-auto"
              description="The principles that shape every project, every decision and every member of Enactus ENSI."
            />

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              <div className="rounded-2xl bg-enactus-navy p-8 text-white">
                <h3 className="text-sm font-bold uppercase tracking-widest text-enactus-yellow">Mission</h3>
                <p className="mt-4 text-lg leading-relaxed text-enactus-light-gray">{content?.mission}</p>
              </div>
              <div className="rounded-2xl border-2 border-enactus-navy p-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-enactus-yellow">Vision</h3>
                <p className="mt-4 text-lg leading-relaxed text-enactus-dark-gray">{content?.vision}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value) => (
                <ValueCard key={value.id} value={value} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Our work"
                title="Featured Projects"
                description="Real ventures designed and run by Enactus ENSI students."
              />
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-enactus-navy"
              >
                View all projects
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest events */}
      {latestEvents.length > 0 && (
        <section className="bg-[#F7F7F8] py-24">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow="What's happening"
                title="Latest Events"
                description="Workshops, competitions and gatherings that bring our community together."
              />
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-enactus-navy"
              >
                View all events
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latestEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners preview */}
      {partners.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <SectionHeading
              eyebrow="Our network"
              title="Trusted by our Partners"
              align="center"
              className="mx-auto"
              description="Organizations that support Enactus ENSI's mission and projects."
            />
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => (
                <PartnerLogo key={partner.id} partner={partner} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Join the movement"
        title="Ready to create impact with us?"
        description="Discover our projects, meet the team and see how entrepreneurial action is changing communities."
        ctaLabel="Discover Enactus ENSI"
        ctaHref="/about"
      />
    </>
  );
}
