"use client";

import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "Vijñāna Bhairava Tantra",
    description: "Meditation App — Design, Illustration, React Native App",
    imageUrl: "/images/vbt-app.jpg",
    link: "/projects/vbt",
    year: "Coming Spring 2025",
  },
  {
    title: "Nuclear Connections",
    description: "Social word game",
    imageUrl: "/images/nuclear-connections.jpg",
    link: "/projects/nuclear-connections",
    year: "January 2024",
  },
  {
    title: "Retreat.technology",
    description: "Lock yourself out of social media",
    imageUrl: "/images/retreat-tech.jpg",
    link: "/projects/retreat-technology",
    year: "2024",
  },
  {
    title: "Utopia.app",
    description:
      "React Design Tool. Canvas and code update each other in real time.",
    imageUrl: "/images/utopia-app.jpg",
    link: "/projects/utopia",
    year: "2017-2020",
  },
  // Add more projects as needed
];

export function ProjectsSection() {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
