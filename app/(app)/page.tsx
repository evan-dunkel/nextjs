import { ProjectsGrid } from "@/components/ProjectsGrid";
import { PayloadProject, PayloadMedia } from "@/types/payload-types";
import { Project } from "@/types/project";
import { getPayloadClient } from "@/app/_payload";

async function getProjects(): Promise<Project[]> {
  try {
    const payload = await getPayloadClient();

    // Use the Local API to fetch projects
    const { docs: payloadProjects } = await payload.find({
      collection: "projects",
      depth: 2, // This will populate the image relation
    });

    console.log("Fetched projects:", payloadProjects);

    // Transform PayloadProject to Project
    const transformedProjects = payloadProjects.map((project) => {
      if (!project.image || typeof project.image === "string") {
        console.error(`No valid image found for project ${project.title}`);
        return null;
      }

      const image = project.image as PayloadMedia;

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        imageUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/${image.filename}`,
        technologies: project.technologies.map((tech) => tech.name),
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        size: project.size || "small",
      };
    });

    const validProjects = transformedProjects.filter(Boolean) as Project[];
    console.log("Transformed projects:", validProjects);
    return validProjects;
  } catch (error) {
    console.error("Error in getProjects:", error);
    throw error;
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Projects</h1>
        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}
