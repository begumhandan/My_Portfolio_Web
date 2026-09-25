/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "h-11 px-6 text-white bg-linear-to-r from-accent-blue to-accent-green shadow-[0_0_0_1px_rgb(255_255_255/0.1)_inset,0_8px_24px_-8px_rgb(59_130_246/0.6)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2)_inset,0_10px_32px_-6px_rgb(16_185_129/0.55)] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "h-11 px-6 border border-white/15 bg-white/[0.03] text-zinc-100 backdrop-blur hover:border-white/30 hover:bg-white/[0.06] active:scale-[0.98]",
  icon: "size-11 border border-white/10 bg-white/[0.03] text-zinc-400 backdrop-blur hover:border-white/25 hover:text-white hover:bg-white/[0.06]",
};

export function buttonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}
