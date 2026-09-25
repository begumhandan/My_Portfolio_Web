"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {/* Respect the OS "reduce motion" setting for every Framer Motion animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
