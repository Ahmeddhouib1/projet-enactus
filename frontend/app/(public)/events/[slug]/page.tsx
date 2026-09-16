import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AxiosError } from "axios";
import SectionHeading from "@/components/public/SectionHeading";
import EditionSelector from "@/components/public/EditionSelector";
import { isUploadedMedia, resolveMediaUrl } from "@/lib/utils";
import { getEventBySlug } from "@/services/public/events";
import type { EventSummary } from "@/types/event";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchEvent(slug: string): Promise<EventSummary> {
  try {
    return await getEventBySlug(slug);
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
    const event = await getEventBySlug(slug);
    return {
      title: event.name,
      description: event.description ?? undefined,
      openGraph: {
        title: event.name,
        description: event.description ?? undefined,
        images: event.coverImage ? [{ url: resolveMediaUrl(event.coverImage) }] : undefined,
      },
    };
  } catch {
    return { title: "Event" };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await fetchEvent(slug);

  return (
    <>
      <section className="relative overflow-hidden bg-enactus-dark-gray">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={resolveMediaUrl(event.coverImage) || "/images/events/placeholder.svg"}
            alt={event.name}
            fill
            priority
            unoptimized={isUploadedMedia(event.coverImage)}
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-enactus-dark-gray via-enactus-dark-gray/40 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-content px-6 pb-12 lg:px-8">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">{event.name}</h1>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          {event.description && (
            <p className="max-w-3xl text-xl leading-relaxed text-enactus-dark-gray">{event.description}</p>
          )}
        </div>
      </section>

      <section className="bg-[#F7F7F8] py-20">
        <div className="mx-auto max-w-content px-6 lg:px-8">
          <SectionHeading eyebrow="Editions" title="Explore each edition" />
          <div className="mt-10">
            <EditionSelector editions={event.editions} />
          </div>
        </div>
      </section>
    </>
  );
}
