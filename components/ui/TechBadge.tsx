import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TechBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] leading-none text-zinc-300",
        "transition-colors duration-200 hover:border-accent-blue/40 hover:bg-accent-blue/10 hover:text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
