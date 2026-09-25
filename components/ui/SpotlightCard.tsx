"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** RGB triplet for the glow, e.g. "59 130 246". */
  glow?: string;
}

/**
 * Glass card that lifts on hover and renders a soft radial glow following the cursor.
 * The cursor position is written straight to CSS variables, so moving the mouse never
 * triggers a React re-render.
 */
export function SpotlightCard({ children, className, glow = "59 130 246" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md",
        "transition duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]",
        "hover:shadow-[0_20px_40px_-24px_rgb(0_0_0/0.8)]",
        className,
      )}
    >
      {/* Cursor-following spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
        style={{
          background: `radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(${glow} / 0.12), transparent 45%)`,
        }}
      />
      {/* Top highlight line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
