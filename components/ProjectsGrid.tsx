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
              initial={{
                opacity: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
              }}
              animate={{
                opacity: 1,
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
              exit={{
                opacity: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
              }}
              transition={{
                duration: 0.3,
              }}
              className="fixed inset-0 z-40 overflow-y-scroll"
              onClick={handleModalClose}
            >
              <div className="min-h-full w-full flex items-start overflow-y-scroll justify-center py-10 md:py-10">
                <motion.div
                  className="bg-background z-50 my-auto overflow-hidden"
                  initial={{
                    position: "fixed",
                    top: bounds.y,
                    left: bounds.x,
                    width: bounds.width,
                    height: bounds.height,
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    opacity: 1,
                    outlineStyle: "solid",
                    outlineWidth: "1px",
                    outlineColor: "hsl(var(--muted-foreground) / 0.0)",
                  }}
                  animate={{
                    top: window.innerWidth < 768 ? 0 : "auto",
                    left: window.innerWidth < 768 ? 0 : "50%",
                    transform:
                      window.innerWidth < 768 ? "none" : "translateX(-50%)",
                    width:
                      window.innerWidth < 768
                        ? "100vw"
                        : window.innerWidth < 1024
                          ? "65vw"
                          : "45vw",
                    height: window.innerWidth < 768 ? "100vh" : "auto",
                    borderRadius: window.innerWidth < 768 ? "0" : "0.75rem",
                    boxShadow:
                      window.innerWidth < 768
                        ? "none"
                        : "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    opacity: 1,
                    outlineStyle: "solid",
                    outlineColor: "hsl(var(--muted-foreground) / 0.25)",
                    maxHeight: window.innerWidth < 768 ? "100vh" : "85vh",
                  }}
                  exit={{
                    top: bounds.y,
                    left: bounds.x,
                    transform: "none",
                    width: bounds.width,
                    height: bounds.height,
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    opacity: 1,
                    outlineStyle: "solid",
                    outlineColor: "hsl(var(--muted-foreground) / 0.0)",
                  }}
                  transition={{
                    type: "spring",
                    damping: 44,
                    stiffness: 500,
                  }}
                >
                  <motion.button
                    onClick={handleModalClose}
                    className="fixed md:absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground bg-background/80 backdrop-blur-sm p-2 rounded-full w-8 h-8 flex items-center justify-center hover:bg-background/90 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✕
                  </motion.button>
                  <div className="relative overflow-y-auto h-full md:max-h-[85vh]">
                    <motion.div
                      initial={{
                        padding: 0,
                      }}
                      animate={{
                        padding: ".75rem",
                        transition: {
                          type: "spring",
                          damping: 50,
                          stiffness: 1000,
                        },
                      }}
                      exit={{
                        padding: 0,
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
                      initial={{ height: 0 }}
                      animate={{
                        height: "auto",
                        transition: {
                          duration: 0.3,
                        },
                      }}
                      exit={{
                        height: 0,
                        transition: {
                          duration: 0.2,
                        },
                      }}
                      className="h-full"
                    >
                      <div className="px-6 pb-6">
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
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
