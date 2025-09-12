"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { projects } from "@/lib/data";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProjectCard = React.memo(function ProjectCard({
  project,
  onActivate,
}: {
  project: typeof projects[0];
  onActivate: (id: number) => void;
}) {
  const uniqueId = `project-${project.id}`;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onActivate(project.id);
    },
    [onActivate, project.id]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate(project.id);
      }
    },
    [onActivate, project.id]
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
      className={cn(
        "hover:shadow-primary/40 hover:shadow-xl transition-shadow duration-500",
        "group relative overflow-hidden rounded-xl",
        "bg-card/30 backdrop-blur-sm border border-border/50",
        "hover:border-primary transition-all duration-500",
        "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
      onClick={handleClick}
      data-aos="fade-up"
      role="button"
      tabIndex={0}
      aria-labelledby={`${uniqueId}-title`}
      onKeyDown={handleKeyDown}
    >
      {/* Project Image */}
      <div className="aspect-video overflow-hidden relative">
        <Image
          src={project.image}
          alt={`${project.title} - Project Preview`}
          width={640}
          height={360}
          className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={85}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </div>

      {/* Content Overlay */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6
        translate-y-0 group-hover:translate-y-0 transition-transform duration-500
        sm:translate-y-[60%] sm:group-hover:translate-y-0"
        aria-hidden={false}
      >
        <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-border/50 shadow-xl">
          <h3
            id={`${uniqueId}-title`}
            className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors"
          >
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4" aria-hidden>
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/50 text-xs sm:text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onActivate(project.id);
              }}
              aria-label={`View details for ${project.title}`}
            >
              View Details
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub Repository`}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title} live site`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Badge */}
      {project.featured && (
        <div
          className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-xs text-white font-medium py-1 px-3 rounded-full"
          aria-hidden="true"
        >
          Featured
        </div>
      )}
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // memoize projects to avoid reallocation
  const projectsList = useMemo(() => projects, []);

  const currentProject = projectsList.find((p) => p.id === selectedProject) ?? null;

  const handleActivate = useCallback((id: number) => {
    setSelectedProject(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 sm:py-20 bg-background relative overflow-hidden"
      aria-label="Projects Showcase"
    >
      {/* Background decorations (kept minimal animation hooks) */}
      <div
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full filter blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/10 rounded-full filter blur-[120px]"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>

          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto rounded-full mb-6"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            aria-hidden="true"
          />

          <p className="text-muted-foreground text-base sm:text-lg">
            Explore my latest work showcasing creative solutions and technical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" role="list">
          {projectsList.map((project, index) => (
            <div key={project.id}>
              <ProjectCard project={project} onActivate={handleActivate} />
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={selectedProject !== null} onOpenChange={handleClose}>
        <DialogContent
          className="w-[95vw] sm:w-[90vw] md:max-w-3xl p-0 border-primary h-auto overflow-hidden"
          aria-label="Project Details"
        >
          {currentProject && (
            <div className="relative p-2 xs:p-3 sm:p-4">
              <button
                onClick={handleClose}
                className="absolute top-1 right-1 xs:top-2 xs:right-2 sm:top-3 sm:right-3 z-20 bg-background/80 backdrop-blur-sm rounded-full p-1"
                aria-label="Close project details"
              >
                <X className="h-4 w-4 xs:h-5 xs:w-5" aria-hidden="true" />
              </button>

              <div className="w-full h-[28vh] xs:h-[30vh] sm:h-[35vh] md:h-[40vh] relative rounded overflow-hidden mb-2 xs:mb-3">
                <Image
                  src={currentProject.image}
                  alt={`${currentProject.title} - Detailed View`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 768px) 95vw, (max-width: 1024px) 90vw, 800px"
                  quality={85}
                />
              </div>

              <div className="space-y-1 xs:space-y-2 sm:space-y-3">
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold">
                  {currentProject.title}
                </h2>
                <p className="text-2xs xs:text-xs sm:text-sm md:text-base text-muted-foreground">
                  {currentProject.description}
                </p>

                <div>
                  <h3 className="font-semibold text-xs xs:text-sm sm:text-base mb-2">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProject.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 xs:px-2 sm:px-3 py-0.5 bg-secondary/50 text-2xs xs:text-xs sm:text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-row gap-2 xs:gap-3 sm:gap-4 mt-4">
                  <Button asChild size="sm" className="flex-1 h-7 xs:h-8 sm:h-9 text-2xs xs:text-xs sm:text-sm">
                    <a
                      href={currentProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${currentProject.title} live site`}
                    >
                      View Live
                      <ExternalLink className="ml-1 h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </a>
                  </Button>

                  <Button variant="outline" size="sm" asChild className="flex-1 h-7 xs:h-8 sm:h-9 text-2xs xs:text-xs sm:text-sm">
                    <a
                      href={currentProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${currentProject.title} source code on GitHub`}
                    >
                      Source Code
                      <Github className="ml-1 h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
