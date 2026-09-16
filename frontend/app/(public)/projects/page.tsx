import type { Metadata } from "next";
import SectionHeading from "@/components/public/SectionHeading";
import ProjectCard from "@/components/public/ProjectCard";
import { getProjects } from "@/services/public/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore the social entrepreneurship projects led by Enactus ENSI students.",
};

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-content px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our work"
          title="Projects"
          align="center"
          className="mx-auto"
          description="Ventures designed by Enactus ENSI students to solve real problems with entrepreneurial thinking."
        />

        {projects.length > 0 ? (
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-enactus-dark-gray">No projects have been published yet.</p>
        )}
      </div>
    </section>
  );
}
