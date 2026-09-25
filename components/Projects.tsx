"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Brain, CodeXml, FolderOpen, Smartphone } from "lucide-react";
import {
  projectFilters,
  projects,
  type Project,
  type ProjectCategory,
  type ProjectFilter,
} from "@/data/projects";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Container } from "./ui/Container";
import { GithubIcon } from "./ui/BrandIcons";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { SpotlightCard } from "./ui/SpotlightCard";
import { TechBadge } from "./ui/TechBadge";

const categoryIcon: Record<ProjectCategory, typeof Brain> = {
  ai: Brain,
  mobile: Smartphone,
  fullstack: CodeXml,
};

function ProjectCard({ project }: { project: Project }) {
  const { t, l } = useLanguage();
  const PrimaryIcon = categoryIcon[project.categories[0]];

  return (
    <SpotlightCard className="flex h-full flex-col">
      {/* Window-style header strip */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="size-2.5 rounded-full bg-white/10" />
        </div>
        <span className="min-w-0 truncate font-mono text-[11px] text-zinc-500">
          ~/projects/{project.id}
          {project.period && <span className="text-zinc-600"> · {project.period}</span>}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br from-accent-blue/20 to-accent-green/10 text-white">
            <PrimaryIcon className="size-5" aria-hidden />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.categories.map((c) => (
              <span
                key={c}
                className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 font-mono text-[10px] tracking-wider text-zinc-400 uppercase"
              >
                {l(projectFilters.find((f) => f.id === c)!.label)}
              </span>
            ))}
          </div>
        </div>

        {project.badge && (
          <span className="mt-6 inline-flex w-fit items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[11px] text-amber-200 shadow-[0_0_20px_-6px_rgb(251_191_36/0.5)]">
            {l(project.badge)}
          </span>
        )}
        <h3
          className={cn(
            "text-xl font-semibold tracking-tight text-white",
            project.badge ? "mt-3" : "mt-6",
          )}
        >
          {l(project.title)}
          {project.tagline && (
            <span className="ml-2 font-mono text-xs font-normal text-zinc-500">
              {project.tagline}
            </span>
          )}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-pretty text-zinc-400">
          {l(project.description)}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tags.map((tag) => (
            <li key={tag}>
              <TechBadge>{tag}</TechBadge>
            </li>
          ))}
        </ul>

        {(project.github || project.demo) && (
          <div className="mt-auto flex items-center gap-5 pt-7 text-sm">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l(project.title)} — ${t.projects.source}`}
                className="inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
              >
                <GithubIcon className="size-4" />
                <span>GitHub</span>
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-1 text-zinc-300 transition-colors hover:text-white"
              >
                {t.projects.demo}
                <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </SpotlightCard>
  );
}

export function Projects() {
  const { t, l } = useLanguage();
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );

  const countFor = (id: ProjectFilter) =>
    id === "all" ? projects.length : projects.filter((p) => p.categories.includes(id)).length;

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="projects-title"
          index="02"
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          description={t.projects.description}
        />

        <Reveal delay={0.1} className="mt-10">
          <div
            role="group"
            aria-label={t.projects.filterLabel}
            className="inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-1 sm:rounded-full"
          >
            <LayoutGroup id="project-filters">
              {projectFilters.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative flex h-9 items-center gap-2 rounded-full px-4 text-sm transition-colors",
                      active ? "text-white" : "text-zinc-400 hover:text-zinc-100",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-filter-pill"
                        className="absolute inset-0 rounded-full border border-white/10 bg-linear-to-r from-accent-blue/25 to-accent-green/20 shadow-[0_0_20px_-6px_rgb(59_130_246/0.6)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{l(f.label)}</span>
                    <span className="relative font-mono text-[10px] text-zinc-500">
                      {countFor(f.id)}
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </Reveal>

        {/* Bento grid — 2 columns from tablet up; `featured` projects span both. */}
        <motion.ul layout className="mt-8 grid auto-rows-fr gap-5 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={cn("min-w-0", project.featured && "md:col-span-2")}
              >
                <ProjectCard project={project} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>
          {visible.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center"
            >
              <FolderOpen className="size-6 text-zinc-500" aria-hidden />
              <p className="mt-4 text-sm text-zinc-300">{t.projects.empty}</p>
              <p className="mt-1 font-mono text-xs text-zinc-500">{t.projects.emptyHint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
