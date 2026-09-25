"use client";

import { Brain, CodeXml, Server } from "lucide-react";
import { skillGroups, type SkillIcon } from "@/data/skills";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";
import { Container } from "./ui/Container";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { SpotlightCard } from "./ui/SpotlightCard";

const iconConfig: Record<
  SkillIcon,
  { icon: typeof Brain; tint: string; glow: string; pill: string }
> = {
  frontend: {
    icon: CodeXml,
    tint: "from-accent-blue/25 to-accent-blue/5 text-blue-300",
    glow: "59 130 246",
    pill: "hover:border-accent-blue/50 hover:bg-accent-blue/10",
  },
  backend: {
    icon: Server,
    tint: "from-sky-400/20 to-accent-green/10 text-sky-300",
    glow: "56 189 248",
    pill: "hover:border-sky-400/50 hover:bg-sky-400/10",
  },
  ai: {
    icon: Brain,
    tint: "from-accent-green/25 to-accent-green/5 text-emerald-300",
    glow: "16 185 129",
    pill: "hover:border-accent-green/50 hover:bg-accent-green/10",
  },
};

export function Skills() {
  const { t, l } = useLanguage();

  return (
    <section id="skills" aria-labelledby="skills-title" className="py-24 sm:py-28 lg:py-32">
      <Container>
        <SectionHeading
          id="skills-title"
          index="03"
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          description={t.skills.description}
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => {
            const { icon: Icon, tint, glow, pill } = iconConfig[group.icon];
            // On tablet the odd last card spans both columns so the bento stays balanced.
            const spanLast =
              skillGroups.length % 2 === 1 && i === skillGroups.length - 1
                ? "md:col-span-2 lg:col-span-1"
                : "";
            return (
              <Reveal key={group.id} delay={i * 0.08} className={cn("h-full", spanLast)}>
                <SpotlightCard glow={glow} className="h-full p-6 sm:p-7">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl border border-white/10 bg-linear-to-br",
                      tint,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{l(group.title)}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400">{l(group.description)}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={l(item)}>
                        <span
                          className={cn(
                            "inline-flex cursor-default items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-zinc-300",
                            "transition-colors duration-200 hover:text-white",
                            pill,
                          )}
                        >
                          {l(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
