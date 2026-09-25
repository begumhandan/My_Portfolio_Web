"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CodeXml, Sparkles } from "lucide-react";
import { siteConfig } from "@/data/site";
import { signatureFont } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * Lightweight HTML/CSS version of the lanyard ID card — used on mobile/tablet and for
 * visitors who prefer reduced motion. No WebGL, no physics; just a drop-in + gentle sway.
 */
export function StaticIdCard({ alt, className }: { alt: string; className?: string }) {
  return (
    <div className={cn("flex justify-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 11, delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="flex origin-top animate-sway flex-col items-center">
          {/* Clip */}
          <div className="h-3 w-12 rounded-md border border-white/20 bg-linear-to-b from-zinc-200 to-zinc-500" />
          {/* Band */}
          <div className="h-16 w-5 bg-linear-to-b from-accent-blue to-accent-green opacity-90 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.15)]" />
          <div className="-mt-1 h-3 w-8 rounded-sm bg-linear-to-b from-zinc-300 to-zinc-500" />

          {/* Card */}
          <div className="relative -mt-0.5 w-56 overflow-hidden rounded-2xl border border-white/15 bg-[#0b111f] p-4 shadow-[0_30px_60px_-20px_rgb(59_130_246/0.45)] sm:w-60">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgb(59_130_246/0.35),transparent_60%),radial-gradient(circle_at_100%_100%,rgb(16_185_129/0.28),transparent_55%)]"
            />
            <div className="relative">
              <div className="mx-auto h-2 w-12 rounded-full border border-white/15 bg-black/60" />
              <div className="mt-2 flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-full border border-accent-blue/50 bg-white/5 text-blue-200">
                  <CodeXml className="size-3.5" aria-hidden />
                </span>
                <span className="text-center font-mono leading-tight">
                  <span className="block text-sm font-bold text-white">BHD.</span>
                  <span className="block text-[8px] tracking-[0.25em] text-zinc-400">
                    SOFTWARE ENGINEER
                  </span>
                </span>
                <span className="flex size-8 items-center justify-center rounded-full border border-accent-green/50 bg-white/5 text-emerald-200">
                  <Sparkles className="size-3.5" aria-hidden />
                </span>
              </div>

              <div className="relative mt-3 aspect-square overflow-hidden rounded-xl border border-white/15">
                <Image
                  src={siteConfig.photo}
                  alt={alt}
                  fill
                  priority
                  sizes="240px"
                  className="object-cover"
                />
              </div>

              <p className="mt-3 text-center text-sm font-semibold text-white">{siteConfig.name}</p>
              <p
                className={cn(
                  signatureFont.className,
                  "-mt-0.5 -rotate-3 text-gradient text-center text-4xl leading-tight",
                )}
              >
                Begüm
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
