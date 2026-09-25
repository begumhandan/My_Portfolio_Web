"use client";

import type { MouseEvent, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { buttonStyles } from "@/lib/utils";
import { Container } from "./ui/Container";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { LANYARD_ANCHOR_ATTR, LanyardStage } from "./lanyard/LanyardStage";
import { StaticIdCard } from "./lanyard/StaticIdCard";
import { useLanyardMode } from "./lanyard/useLanyardMode";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const titleWord: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
};

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease },
  };
}

// Title gradient: white → light blue → electric blue → emerald.
const GRADIENT_STOPS: Array<[number, [number, number, number]]> = [
  [0, [255, 255, 255]],
  [0.35, [191, 219, 254]],
  [0.65, [59, 130, 246]],
  [1, [16, 185, 129]],
];

function colorAt(t: number) {
  for (let i = 1; i < GRADIENT_STOPS.length; i++) {
    const [p1, c1] = GRADIENT_STOPS[i];
    const [p0, c0] = GRADIENT_STOPS[i - 1];
    if (t <= p1) {
      const k = (t - p0) / (p1 - p0);
      const [r, g, b] = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${r} ${g} ${b})`;
    }
  }
  return "rgb(16 185 129)";
}

/**
 * Each word animates independently (its own transform), which breaks a single
 * `background-clip: text` on the parent. Instead every word gets its own slice of the
 * overall gradient, so the heading still reads as one continuous white → blue → green sweep.
 */
function wordGradient(index: number, total: number) {
  return `linear-gradient(90deg, ${colorAt(index / total)}, ${colorAt((index + 1) / total)})`;
}

/** Subtle mouse-driven 3D tilt. Transform-only, spring-smoothed, disabled for reduced motion. */
function TiltTitle({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), spring);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div className="mt-7 [perspective:1000px]" onMouseMove={handleMove} onMouseLeave={reset}>
      <motion.div style={{ rotateX, rotateY }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

/** Pure-CSS animated backdrop: drifting grid + two slow gradient blobs (GPU transforms only). */
function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black_30%,transparent_75%)]">
        <div className="absolute -inset-[56px] animate-grid-drift bg-grid will-change-transform" />
      </div>
      <div className="absolute -top-40 left-[-10%] size-[36rem] animate-blob-a rounded-full bg-accent-blue/20 blur-[120px] will-change-transform" />
      <div className="absolute top-10 right-[-15%] size-[30rem] animate-blob-b rounded-full bg-accent-green/15 blur-[120px] will-change-transform" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-ink" />
    </div>
  );
}

export function Hero() {
  const { t, lang } = useLanguage();
  const lanyardMode = useLanyardMode();
  const words = [...t.hero.greeting.split(" "), ...`${siteConfig.name}.`.split(" ")];

  return (
    <section
      id="about"
      aria-label={t.nav.about}
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-32"
    >
      <HeroBackground />
      {lanyardMode === "3d" && <LanyardStage />}

      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pr-3.5 pl-3 text-xs text-zinc-300 backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent-green" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-green" />
            </span>
            <span className="font-mono">{t.hero.badge}</span>
          </motion.div>

          <TiltTitle>
            {/* Keyed by language so the word-by-word entrance replays on switch. */}
            <motion.h1
              key={lang}
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              aria-label={`${t.hero.greeting} ${siteConfig.name}.`}
              className="text-4xl leading-[1.1] font-semibold tracking-tight title-depth sm:text-6xl lg:text-[3.75rem] xl:text-7xl"
            >
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  variants={titleWord}
                  aria-hidden
                  className="mr-[0.25em] inline-block bg-clip-text pb-[0.08em] text-transparent last:mr-0"
                  style={{ backgroundImage: wordGradient(i, words.length) }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h1>
          </TiltTitle>

          <motion.p
            {...fadeUp(0.55)}
            className="mt-6 text-lg font-medium text-balance text-zinc-200 sm:text-xl"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.p
            {...fadeUp(0.65)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-pretty text-zinc-400 sm:text-lg"
          >
            {t.hero.description}
          </motion.p>

          <motion.div {...fadeUp(0.75)} className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" className={buttonStyles("primary", "group")}>
              {t.hero.ctaProjects}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={siteConfig.cvPath}
              download={siteConfig.cvFileName}
              className={buttonStyles("secondary")}
            >
              <Download className="size-4" />
              {t.hero.ctaCv}
            </a>
            <div className="flex items-center gap-3 sm:ml-2">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.hero.github}
                className={buttonStyles("icon")}
              >
                <GithubIcon className="size-[18px]" />
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.hero.linkedin}
                className={buttonStyles("icon")}
              >
                <LinkedinIcon className="size-[18px]" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Mobile/tablet (and desktop with reduced motion / no WebGL) get the lightweight card.
            On desktop the right column stays empty to leave room for the 3D stage. */}
        <div {...{ [LANYARD_ANCHOR_ATTR]: "" }}>
          <StaticIdCard
            alt={t.hero.photoAlt}
            className={lanyardMode === "static" ? "" : "lg:invisible"}
          />
        </div>
      </Container>
    </section>
  );
}
