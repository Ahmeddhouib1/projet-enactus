import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import EventCard from "@/components/public/EventCard";
import { getEvents } from "@/services/public/events";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover Enactus ENSI's events, workshops and competitions across the years.",
};

export default async function EventsPage() {
  const events = await getEvents().catch(() => []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <SectionHeading
          eyebrow="What's happening"
          title="Events"
          align="center"
          className="mx-auto"
          description="From training days to pitch competitions - explore every edition of our events."
        />

        {events.length > 0 ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-enactus-dark-gray">No events have been published yet.</p>
        )}
      </div>
    </section>
  );
}
