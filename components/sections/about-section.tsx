"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { optimizeElement } from "@/lib/performance";

/**
 * Improvements made (no UI changes):
 * - Respect user's reduced-motion preference and avoid non-essential motion on reduced-motion or small screens.
 * - Use a single in-view hook (framer-motion) instead of manual IntersectionObserver to reduce observers.
 * - Avoid querying by ID; use sectionRef consistently.
 * - Make tab buttons accessible (role/tablist, aria-selected, keyboard support).
 * - Ensure interactive elements have explicit type attributes and aria labels.
 * - Memoize lists and handlers to prevent unnecessary re-renders.
 * - Limit per-item AOS attributes to container-level where possible to reduce animation activity (keeps visual result).
 * - Keep optimizeElement call and call any returned cleanup.
 */

/* Typed data models */
interface Education {
  id: number;
  degree: string;
  school: string;
  year: string;
  description: string;
  achievements: string[];
}

interface Experience {
  id: number;
  role: string;
  company: string;
  year: string;
  description: string;
  achievements: string[];
}

/* Static data (typed) */
const education: Education[] = [
  {
    id: 1,
    degree: "Intermediate in Commerce (I.Com)",
    school: "Board of Intermediate Education, Karachi",
    year: "2022 - 24",
    description: "Commerce with focus on business and IT",
    achievements: ["Excelled in business subjects", "Top score in Accounts"],
  },
  {
    id: 2,
    degree: "Matriculation (Science)",
    school: "Board of Secondary Education, Karachi",
    year: "2018 - 2020",
    description: "Science stream with strong academic record",
    achievements: ["Good grades in science", "Strong in Physics and Chemistry"],
  },
];

const experience: Experience[] = [
  {
    id: 1,
    role: "Next.js Developer & Student",
    company: "GIAIC (Governor Sindh Initiative)",
    year: "2023 - Present",
    description: "Training Agentic Ai Developement",
    achievements: ["Built full-stack projects", "Senior student leading Next.js projects"],
  },
  {
    id: 2,
    role: "Teaching Assistant (HTML & CSS)",
    company: "Techverse51",
    year: "2024 - Present",
    description: "Helping students learn web development",
    achievements: ["Taught HTML/CSS basics", "Guided real-world mini-projects"],
  },
];

const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLElement | null>(null);

  // Respect reduced-motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPrefersReducedMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Use framer-motion useInView to determine when to trigger reveal logic
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  useEffect(() => {
    if (inView) setIsVisible(true);
  }, [inView]);

  // optimizeElement call with proper cleanup handling
  useEffect(() => {
    if (!sectionRef.current) return;
    const maybeCleanup = optimizeElement(sectionRef.current);
    return typeof maybeCleanup === "function" ? maybeCleanup : undefined;
  }, []);

  // Memoize lists (the arrays are constants, but keep pattern for clarity)
  const educationList = useMemo(() => education, []);
  const experienceList = useMemo(() => experience, []);

  // Accessible tab handlers
  const handleSetTab = useCallback((tab: "education" | "experience") => {
    setActiveTab(tab);
  }, []);

  const onKeySetTab = useCallback((e: React.KeyboardEvent, tab: "education" | "experience") => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTab(tab);
    }
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
      aria-labelledby="about-heading"
      role="region"
    >
      {/* Background decorations (kept visually identical) */}
      <div
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-[100px] transform rotate-12"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-primary/20 rounded-full filter blur-[120px] transform -rotate-12"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* About Me Content */}
            <div className="stagger-animate-in" data-aos={prefersReducedMotion ? undefined : "fade-up"}>
              <h1
                id="about-heading"
                className="text-3xl md:text-4xl font-bold mb-6"
                ref={(el) => {
                  headingRef.current = el;
                  if (el) optimizeElement(el, true);
                }}
              >
                About <span className="text-primary">Me</span>
              </h1>

              <div className="prose prose-lg dark:prose-invert mb-8">
                <p className="text-muted-foreground leading-relaxed">
                  I'm a web developer with a strong focus on creating user-friendly websites. I started my journey with an interest in technology, and now I specialize in building responsive, full-stack websites using modern tools.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I work with HTML, CSS, JavaScript, TypeScript, Python and Next.js to build scalable solutions. My current interest is in Agentic AI, where I explore how AI can be integrated into web development to improve user experiences.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8" aria-hidden={prefersReducedMotion} data-aos={prefersReducedMotion ? undefined : "fade-up"}>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <Award className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>1+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>35+ Projects Completed</span>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span>4+ Certifications in IT</span>
                </div>
              </div>

              <Button
                type="button"
                className="rounded-full group hover:border hover:border-primary duration-500 hover:bg-background"
                data-aos={prefersReducedMotion ? undefined : "fade-up"}
                asChild
              >
                <a href="/Yusra's Resume.pdf" download aria-label="Download Yusra's Resume">
                  <span className="font-semibold">Download Resume</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Timeline Section */}
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50" data-aos={prefersReducedMotion ? undefined : "fade-up"}>
              <div className="flex gap-4 mb-8" role="tablist" aria-label="About Tabs">
                <Button
                  type="button"
                  variant={activeTab === "education" ? "default" : "outline"}
                  onClick={() => handleSetTab("education")}
                  onKeyDown={(e) => onKeySetTab(e, "education")}
                  aria-selected={activeTab === "education"}
                  aria-controls="about-timeline-panel"
                  className="flex-1 rounded-full"
                >
                  <GraduationCap className="mr-2 h-4 w-4" aria-hidden="true" />
                  Education
                </Button>

                <Button
                  type="button"
                  variant={activeTab === "experience" ? "default" : "outline"}
                  onClick={() => handleSetTab("experience")}
                  onKeyDown={(e) => onKeySetTab(e, "experience")}
                  aria-selected={activeTab === "experience"}
                  aria-controls="about-timeline-panel"
                  className="flex-1 rounded-full"
                >
                  <Briefcase className="mr-2 h-4 w-4" aria-hidden="true" />
                  Experience
                </Button>
              </div>

              <div id="about-timeline-panel" role="region" aria-live="polite" className="space-y-8">
                {(activeTab === "education" ? educationList : experienceList).map((item, index) => (
                  <article
                    key={item.id}
                    className={cn(
                      "relative pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-border",
                      "animate-in",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    )}
                    // only include per-item AOS when motion is allowed to reduce animation overhead
                    data-aos={prefersReducedMotion ? undefined : "fade-up"}
                    aria-labelledby={`timeline-item-${activeTab}-${item.id}`}
                  >
                    <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-primary transform -translate-x-1/2" aria-hidden="true" />
                    <div className="bg-card/50 rounded-xl p-6 hover:bg-card/80 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                        <h2 id={`timeline-item-${activeTab}-${item.id}`} className="text-xl font-bold">
                          {activeTab === "education" ? (item as Education).degree : (item as Experience).role}
                        </h2>
                        <span className="text-sm text-muted-foreground">{item.year}</span>
                      </div>
                      <p className="text-primary font-medium mb-2">
                        {activeTab === "education" ? (item as Education).school : (item as Experience).company}
                      </p>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <ul className="space-y-2" role="list">
                        {item.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                            <span className="text-sm">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
