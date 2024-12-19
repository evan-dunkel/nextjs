"use client";

import { motion, AnimatePresence, usePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Project } from "@/types/project";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [hiddenImageId, setHiddenImageId] = useState<string | null>(null);

  const handleProjectClick = (project: Project, event: React.MouseEvent) => {
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    setBounds({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setHiddenImageId(project.id);
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

  const GridImage = ({ project }: { project: Project }) => {
    const [isPresent, safeToRemove] = usePresence();

    useEffect(() => {
      !isPresent && setTimeout(safeToRemove, 300);
    }, [isPresent, safeToRemove]);

    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className={cn(
            "object-cover transition-transform duration-300 rounded-lg outline outline-1 outline-muted-foreground",
            project.size === "small" && "hover:scale-[1.0125]",
            project.size === "medium" && "hover:scale-[1.0075]",
            project.size === "large" && "hover:scale-[1.004]"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </motion.div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 auto-rows-min grid-flow-dense">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`relative w-full ${getProjectStyles(project.size)}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => handleProjectClick(project, e)}
            >
              <div className="relative aspect-[4/3]">
                {hiddenImageId !== project.id && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300 rounded-lg outline outline-1 outline-muted-foreground",
                      project.size === "small" && "hover:scale-[1.0125]",
                      project.size === "medium" && "hover:scale-[1.0075]",
                      project.size === "large" && "hover:scale-[1.004]"
                    )}
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
        mode="wait"
        onExitComplete={() => setHiddenImageId(null)}
      >
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 backdrop-brightness-90 z-40"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              className="fixed bg-background rounded-lg overflow-hidden outline outline-1 outline-muted-foreground shadow-xl z-50"
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
                width: "45vw",
                height: "90vh",
              }}
              exit={{
                top: bounds.y,
                left: bounds.x,
                width: bounds.width,
                height: bounds.height,
                x: 0,
                y: 0,
              }}
            >
              <div className="h-full overflow-y-auto">
                <div className="relative">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                  <motion.div
                    initial={{ padding: 0 }}
                    animate={{
                      padding: ".75rem",
                      transition: {
                        type: "spring",
                        damping: 34,
                        stiffness: 500,
                      },
                    }}
                    exit={{ padding: 0 }}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 1024px) 100vw, 75vw"
                        priority
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, padding: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        delay: 0.25,
                        duration: 0.4,
                      },
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
                    <div className="px-6">
                      <h2 className="text-2xl font-bold">
                        {selectedProject.title}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedProject.description}
                      </p>
                      {selectedProject.content && (
                        <div className="prose max-w-none dark:prose-invert">
                          {selectedProject.content}
                        </div>
                      )}
                    </div>
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
