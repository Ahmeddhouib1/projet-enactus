import type { MetadataRoute } from "next";
import { getProjects } from "@/services/public/projects";
import { getEvents } from "@/services/public/events";

export const dynamic = "force-dynamic";

const STATIC_ROUTES = ["", "/about", "/team", "/projects", "/events", "/partners"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [projects, events] = await Promise.all([
    getProjects().catch(() => []),
    getEvents().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...projectEntries, ...eventEntries];
}
