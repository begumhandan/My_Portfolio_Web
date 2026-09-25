"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLocale, type Locale, type MaybeLocalized } from "./config";
import { translations, type Dictionary } from "./translations";

const STORAGE_KEY = "bhd-lang";

interface LanguageContextValue {
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggleLang: () => void;
  /** UI dictionary for the active language. */
  t: Dictionary;
  /** Resolves a data-layer value (plain or localized string) to the active language. */
  l: (value: MaybeLocalized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(defaultLocale);

  // Restore the visitor's previous choice after hydration.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "tr" || stored === "en") setLangState(stored);
    } catch {
      // Storage may be unavailable (private mode) — keep the default.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Locale) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === "tr" ? "en" : "tr"),
      t: translations[lang],
      l: (v) => (typeof v === "string" ? v : v[lang]),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}
