"use client";

import { motion } from "framer-motion";
import { locales } from "@/lib/i18n/config";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

/** Segmented TR/EN switch. `layoutId` must be unique per rendered instance. */
export function LanguageToggle({ layoutId, className }: { layoutId: string; className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn(
        "relative inline-flex h-9 items-center rounded-full border border-white/10 bg-white/[0.03] p-1 font-mono text-xs",
        className,
      )}
    >
      {locales.map((locale) => {
        const active = locale === lang;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => setLang(locale)}
            aria-pressed={active}
            lang={locale}
            className={cn(
              "relative h-7 rounded-full px-2.5 uppercase transition-colors",
              active ? "text-white" : "text-zinc-500 hover:text-zinc-200",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full border border-white/10 bg-white/10"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{locale}</span>
          </button>
        );
      })}
    </div>
  );
}
