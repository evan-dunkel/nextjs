"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Project } from "@/types/project";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGridImages, setShowGridImages] = useState(true);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleProjectClick = (project: Project, event: React.MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    setBounds({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setShowGridImages(false);
    setSelectedProject(project);
  };

  const getProjectStyles = (size: Project["size"]) => {
    const baseStyles =
      "cursor-pointer flex-shrink-0 relative select-none h-fit";

    switch (size) {
      case "large":
        return `${baseStyles} col-span-full lg:col-span-9`;
      case "medium":
        return `${baseStyles} col-span-full lg:col-span-6`;
      case "small":
        return `${baseStyles} col-span-full sm:col-span-6 lg:col-span-3`;
      default:
        return baseStyles;
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 auto-rows-min grid-flow-dense">
        {projects.map((project) => (
          <div className={`relative w-full ${getProjectStyles(project.size)}`}>
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => handleProjectClick(project, e)}
            >
              <div className="relative aspect-[3/2]">
                {(!selectedProject ||
                  selectedProject.title !== project.title ||
                  (selectedProject.title === project.title &&
                    showGridImages &&
                    !isAnimating)) && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-[1.01] rounded-lg outline outline-1 outline-muted-foreground"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-2 pt-2"
            >
              <p className="min-h-[4rem] line-clamp-2 text-lg leading-8">
                <span className="font-bold">{project.title}</span>
                {" — "}
                <span className="text-muted-foreground">
                  {project.description}
                </span>
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence
        onExitComplete={() => {
          setIsAnimating(false);
          setShowGridImages(true);
        }}
      >
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              className="fixed bg-background rounded-lg overflow-hidden z-50"
              initial={{
                top: bounds.y,
                left: bounds.x,
                width: bounds.width,
                height: bounds.height,
              }}
              animate={{
                top: "50%",
                left: "50%",
                x: "-50%",
                y: "-50%",
                width: "90vw",
                height: "90vh",
                transition: {
                  type: "spring",
                  damping: 34,
                  stiffness: 500,
                },
              }}
              exit={{
                top: bounds.y,
                left: bounds.x,
                width: bounds.width,
                height: bounds.height,
                x: 0,
                y: 0,
                transition: {
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
              onAnimationStart={() => setIsAnimating(true)}
            >
              <div className="h-full overflow-y-auto">
                <div className="relative">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 75vw"
                    />
                  </div>
                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { delay: 0 },
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: {
                        duration: 0.2,
                        opacity: { duration: 0.1 },
                      },
                    }}
                  >
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedProject.title}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {selectedProject.description}
                    </p>
                    {selectedProject.content && (
                      <div className="prose max-w-none dark:prose-invert">
                        {selectedProject.content}
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
