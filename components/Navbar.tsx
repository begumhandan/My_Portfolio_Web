"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { buttonStyles, cn } from "@/lib/utils";
import { Container } from "./ui/Container";
import { LanguageToggle } from "./LanguageToggle";

const NAV_ITEMS = ["about", "experience", "projects", "skills"] as const;
type NavItem = (typeof NAV_ITEMS)[number];

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<NavItem | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Darken + blur the bar once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section currently in the middle of the viewport.
  useEffect(() => {
    const sections = NAV_ITEMS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavItem);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock scroll, close on Escape, manage focus.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  // Close the drawer if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const logo = (
    <>
      {siteConfig.logo.slice(0, -1)}
      <span className="text-accent-green">.</span>
    </>
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled
            ? "border-white/10 bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between">
          <a
            href="#about"
            aria-label={`${siteConfig.name} — ${t.nav.home}`}
            className="font-mono text-lg font-bold tracking-tight text-white"
          >
            {logo}
          </a>

          {/* Desktop navigation (> 1024px) */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                  active === id ? "text-white" : "text-zinc-400 hover:text-white",
                )}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{t.nav[id]}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle layoutId="lang-desktop" className="hidden sm:inline-flex" />
            {/* CTA visible on tablet and desktop */}
            <a
              href="#contact"
              className={buttonStyles("primary", "hidden h-9 px-4 sm:inline-flex")}
            >
              {t.nav.contact}
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.nav.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={buttonStyles("icon", "size-9 lg:hidden")}
            >
              <Menu className="size-4" />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile / tablet slide-in panel — rendered outside <header> because the header's
          backdrop-filter would otherwise become the containing block for fixed children. */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-50 h-dvh bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden
            />
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.openMenu}
              className="fixed top-0 right-0 z-50 flex h-dvh w-[82%] max-w-sm flex-col border-l border-white/10 bg-[#0c0c10]/95 p-6 backdrop-blur-xl lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-white">{logo}</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t.nav.closeMenu}
                  className={buttonStyles("icon", "size-9")}
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1">
                {NAV_ITEMS.map((id, i) => (
                  <motion.a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-lg transition-colors",
                      active === id
                        ? "bg-white/[0.06] text-white"
                        : "text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                    )}
                  >
                    {t.nav[id]}
                    <span className="font-mono text-xs text-zinc-600">0{i + 1}</span>
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                <LanguageToggle layoutId="lang-mobile" className="self-start" />
                <a
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className={buttonStyles("primary", "w-full")}
                >
                  {t.nav.contact}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
