"use client";

import { siteConfig } from "@/data/site";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Container } from "./ui/Container";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08]">
      <Container className="flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm text-zinc-400">
            © {year} {siteConfig.name}. {t.footer.rights}
          </p>
          <p className="mt-1 font-mono text-xs text-zinc-600">{t.footer.built}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.hero.github}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-white"
          >
            <GithubIcon className="size-5" />
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.hero.linkedin}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-white"
          >
            <LinkedinIcon className="size-5" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
