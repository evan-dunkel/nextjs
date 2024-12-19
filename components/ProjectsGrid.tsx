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

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

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
      <div className="outline outline-1 outline-muted-foreground">
        <motion.div
          className="outline outline-1"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className={cn(
              "object-cover transition-transform duration-300 rounded-lg",
              project.size === "small" && "hover:scale-[1.0125]",
              project.size === "medium" && "hover:scale-[1.0075]",
              project.size === "large" && "hover:scale-[1.004]"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
      </div>
    );
  };

  const handleModalClose = () => {
    setTimeout(() => setHiddenImageId(null), 335);
    setSelectedProject(null);
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
                {hiddenImageId !== project.id ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
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
                ) : (
                  <div className="w-full h-full rounded-lg outline outline-1 outline-muted-foreground/25" />
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

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 backdrop-brightness-90 z-40"
              onClick={handleModalClose}
            />
            <motion.div
              className="fixed bg-background overflow-hidden z-50"
              initial={{
                position: "fixed",
                top: bounds.y,
                left: bounds.x,
                width: bounds.width,
                height: bounds.height,
                borderRadius: "0.5rem",
                boxShadow: "none",
              }}
              animate={{
                top:
                  window.innerWidth < 768
                    ? 0
                    : window.innerHeight / 2 - (window.innerHeight * 0.9) / 2,
                left:
                  window.innerWidth < 768
                    ? 0
                    : window.innerWidth / 2 -
                      (window.innerWidth *
                        (window.innerWidth < 1024 ? 0.65 : 0.45)) /
                        2,
                width:
                  window.innerWidth < 768
                    ? "100vw"
                    : window.innerWidth < 1024
                      ? "65vw"
                      : "45vw",
                height: window.innerWidth < 768 ? "100vh" : "90vh",
                borderRadius: window.innerWidth < 768 ? "0rem" : "0.75rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              exit={{
                top: bounds.y,
                left: bounds.x,
                width: bounds.width,
                height: bounds.height,
                borderRadius: "0.5rem",
                boxShadow: "none",
              }}
              transition={{
                type: "spring",
                damping: 44,
                stiffness: 500,
              }}
            >
              <div className="h-full overflow-y-auto">
                <div className="relative">
                  <button
                    onClick={handleModalClose}
                    className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                  <motion.div
                    initial={{
                      padding: 0,
                      // boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                    }}
                    animate={{
                      padding: ".75rem",
                      // boxShadow:
                      //   "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      transition: {
                        type: "spring",
                        damping: 50,
                        stiffness: 1000,
                      },
                    }}
                    exit={{
                      padding: 0,
                      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
                    }}
                  >
                    <div className="relative aspect-[4/3]">
                      <motion.div
                        initial={{ borderRadius: "0.5rem" }}
                        animate={{ borderRadius: "0.5rem" }}
                        exit={{ borderRadius: "0.5rem" }}
                        className="absolute inset-0 overflow-hidden"
                      >
                        <Image
                          src={selectedProject.imageUrl}
                          alt={selectedProject.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 75vw"
                          priority
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, padding: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
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
