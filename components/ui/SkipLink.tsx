"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

/** First tab stop on the page — lets keyboard users jump past the navbar. */
export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main-content"
      className="fixed top-4 left-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition focus:translate-y-0"
    >
      {t.nav.skipToContent}
    </a>
  );
}
