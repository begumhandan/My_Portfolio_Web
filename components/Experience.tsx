"use client";

import { Briefcase, FlaskConical, Trophy } from "lucide-react";
import { experience, type ExperienceKind } from "@/data/experience";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { SpotlightCard } from "./ui/SpotlightCard";
import { TechBadge } from "./ui/TechBadge";

const kindStyles: Record<ExperienceKind, { icon: typeof Briefcase; accent: string; glow: string }> =
  {
    work: {
      icon: Briefcase,
      accent: "text-accent-blue border-accent-blue/30 bg-accent-blue/10",
      glow: "59 130 246",
    },
    achievement: {
      icon: Trophy,
      accent: "text-accent-green border-accent-green/30 bg-accent-green/10",
      glow: "16 185 129",
    },
    research: {
      icon: FlaskConical,
      accent: "text-amber-300 border-amber-400/30 bg-amber-400/10",
      glow: "251 191 36",
    },
  };

export function Experience() {
  const { t, l } = useLanguage();

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="experience-title"
          index="01"
          eyebrow={t.experience.eyebrow}
          title={t.experience.title}
          description={t.experience.description}
        />

        <div className="relative mt-14">
          {/* Vertical timeline line */}
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-4 w-px bg-linear-to-b from-accent-blue/60 via-white/10 to-transparent lg:left-44"
          />
          <ol className="space-y-8 sm:space-y-10">
            {experience.map((item, i) => {
              const { icon: Icon, accent, glow } = kindStyles[item.kind];
              return (
                <li key={item.id} className="relative pl-12 sm:pl-14 lg:pl-56">
                  {/* Date column (desktop) */}
                  <p className="absolute top-6 left-0 hidden w-36 text-right font-mono text-sm text-zinc-400 lg:block">
                    {l(item.period)}
                  </p>

                  {/* Timeline marker */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-5 left-0 flex size-8 items-center justify-center rounded-full border bg-ink lg:left-40",
                      accent,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>

                  <Reveal x={-32} y={0} delay={i * 0.1}>
                    <SpotlightCard glow={glow} className="p-6 sm:p-7">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {l(item.organization)}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-300">{l(item.role)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none",
                              accent,
                            )}
                          >
                            {t.experience.kinds[item.kind]}
                          </span>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] leading-none text-zinc-400 lg:hidden">
                            {l(item.period)}
                          </span>
                        </div>
                      </div>

                      <ul className="mt-5 space-y-2.5">
                        {item.highlights.map((h, hi) => (
                          <li key={hi} className="flex gap-3 text-sm leading-relaxed text-zinc-400">
                            <span
                              aria-hidden
                              className="mt-2 size-1 shrink-0 rounded-full bg-zinc-500"
                            />
                            {l(h)}
                          </li>
                        ))}
                      </ul>

                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech stack">
                        {item.tech.map((tech) => (
                          <li key={l(tech)}>
                            <TechBadge>{l(tech)}</TechBadge>
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
