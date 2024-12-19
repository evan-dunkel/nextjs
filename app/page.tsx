import { ProjectsGrid } from "@/components/ProjectsGrid";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Projects</h1>
        <ProjectsGrid projects={projects} />
      </div>
    </main>
  );
}
