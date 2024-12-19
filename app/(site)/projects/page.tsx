import { ProjectsGrid } from "@/components/ProjectsGrid";
import { PayloadProject } from "@/types/payload-types";
import { Project } from "@/types/project";

async function getProjects(): Promise<Project[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/projects?depth=1`,
    {
      next: { revalidate: 60 }, // Revalidate every minute
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await res.json();
  const payloadProjects: PayloadProject[] = data.docs;

  // Transform PayloadProject to Project
  return payloadProjects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.image.url,
    technologies: project.technologies.map((tech) => tech.name),
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    size: project.size || "small",
  }));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container py-8">
      <ProjectsGrid projects={projects} />
    </div>
  );
}
