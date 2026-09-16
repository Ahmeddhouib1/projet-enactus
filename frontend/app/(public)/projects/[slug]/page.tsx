import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AxiosError } from "axios";
import { CheckCircle2, Target, Lightbulb, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/public/SectionHeading";
import StatusBadge from "@/components/public/StatusBadge";
import ImageGallery from "@/components/public/ImageGallery";
import CTASection from "@/components/public/CTASection";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { getProjectBySlug } from "@/services/public/projects";
import type { ProjectDetail } from "@/types/project";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchProject(slug: string): Promise<ProjectDetail> {
  try {
    return await getProjectBySlug(slug);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    return {
      title: project.name,
      description: project.shortDescription ?? undefined,
      openGraph: {
        title: project.name,
        description: project.shortDescription ?? undefined,
        images: project.coverImage ? [{ url: resolveMediaUrl(project.coverImage) }] : undefined,
      },
    };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await fetchProject(slug);

  const infoBlocks = [
    { icon: Target, label: "Context & Problem", value: project.context },
    { icon: Lightbulb, label: "Solution", value: project.solution },
    { icon: TrendingUp, label: "Impact", value: project.impact },
    { icon: CheckCircle2, label: "Objectives", value: project.objectives },
  ].filter((block) => block.value);

  return (
    <>
      <section className="relative overflow-hidden bg-enactus-navy">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={resolveMediaUrl(project.coverImage) || "/images/projects/placeholder.svg"}
            alt={project.name}
            fill
            priority
            unoptimized={isUploadedMedia(project.coverImage)}
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-enactus-navy via-enactus-navy/40 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-content px-6 pb-12 lg:px-8">
          {project.category && (
            <p className="text-sm font-bold uppercase tracking-widest text-enactus-yellow">{project.category}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold text-white sm:text-5xl">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          {project.shortDescription && (
            <p className="max-w-3xl text-xl leading-relaxed text-enactus-dark-gray">{project.shortDescription}</p>
          )}
          {project.fullDescription && (
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-enactus-dark-gray">
              {project.fullDescription}
            </p>
          )}
        </div>
      </section>

      {infoBlocks.length > 0 && (
        <section className="bg-[#F7F7F8] py-20">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2">
              {infoBlocks.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-enactus-navy text-enactus-yellow">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-enactus-navy">{label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-enactus-dark-gray">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.images.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-content px-6 lg:px-8">
            <SectionHeading eyebrow="Gallery" title="See the project in action" />
            <div className="mt-10">
              <ImageGallery images={project.images} />
            </div>
          </div>
        </section>
      )}

      <CTASection
        eyebrow="Explore more"
        title="Discover our other projects"
        ctaLabel="Back to projects"
        ctaHref="/projects"
      />
    </>
  );
}
