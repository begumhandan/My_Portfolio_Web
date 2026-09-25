"use client";

import { useCallback, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, LoaderCircle, Mail, Send } from "lucide-react";
import { siteConfig } from "@/data/site";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Dictionary } from "@/lib/i18n/translations";
import { buttonStyles, cn } from "@/lib/utils";
import { Container } from "./ui/Container";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { Toast } from "./ui/Toast";

type Field = "name" | "email" | "message";
type FormValues = Record<Field, string>;
type ErrorKey = keyof Dictionary["contact"]["errors"];
type FormErrors = Partial<Record<Field, ErrorKey>>;

const FIELDS: Field[] = ["name", "email", "message"];
const EMPTY: FormValues = { name: "", email: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Errors are stored as keys (not strings) so messages re-translate on language switch.
function validateField(field: Field, raw: string): ErrorKey | undefined {
  const value = raw.trim();
  switch (field) {
    case "name":
      if (!value) return "nameRequired";
      if (value.length < 2) return "nameShort";
      return;
    case "email":
      if (!value) return "emailRequired";
      if (!EMAIL_RE.test(value)) return "emailInvalid";
      return;
    case "message":
      if (!value) return "messageRequired";
      if (value.length < 10) return "messageShort";
      return;
  }
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const f of FIELDS) {
    const err = validateField(f, values[f]);
    if (err) errors[f] = err;
  }
  return errors;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for browsers/contexts without the async Clipboard API.
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

const inputBase =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 transition-[border-color,box-shadow,background-color] duration-200 focus:bg-white/[0.05] focus:outline-none focus-visible:outline-none";

export function Contact() {
  const { t } = useLanguage();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | undefined>(undefined);
  const fieldRefs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>(
    {},
  );

  const closeToast = useCallback(() => setToastOpen(false), []);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.name as Field;
    const value = e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate live only after the user has left the field once.
    if (touched[field]) setErrors((errs) => ({ ...errs, [field]: validateField(field, value) }));
  }

  function handleBlur(field: Field) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((errs) => ({ ...errs, [field]: validateField(field, values[field]) }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });

    const firstInvalid = FIELDS.find((f) => nextErrors[f]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setSubmitting(true);
    // TODO: Replace with a real backend call (API route, Resend, Formspree, ...).
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log("[contact] Form submitted:", {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });
    setSubmitting(false);
    setValues(EMPTY);
    setTouched({});
    setErrors({});
    setToastOpen(true);
  }

  async function handleCopy() {
    await copyToClipboard(siteConfig.email);
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  function fieldProps(field: Field) {
    const error = errors[field];
    return {
      id: `contact-${field}`,
      name: field,
      value: values[field],
      onChange: handleChange,
      onBlur: () => handleBlur(field),
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${field}-error` : undefined,
      className: cn(
        inputBase,
        error
          ? "border-red-400/50 focus:border-red-400/70 focus:ring-2 focus:ring-red-400/20"
          : "border-white/10 hover:border-white/20 focus:border-accent-blue/60 focus:ring-2 focus:ring-accent-blue/20",
      ),
    };
  }

  function renderError(field: Field) {
    const error = errors[field];
    return (
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`contact-${field}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1.5 text-xs text-red-400"
          >
            {t.contact.errors[error]}
          </motion.p>
        )}
      </AnimatePresence>
    );
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              id="contact-title"
              index="04"
              eyebrow={t.contact.eyebrow}
              title={t.contact.title}
              description={t.contact.description}
            />

            <Reveal delay={0.1} className="mt-10 space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl glass p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] tracking-wider text-zinc-500 uppercase">
                      {t.contact.emailLabel}
                    </p>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="block truncate text-sm text-zinc-200 transition-colors hover:text-white"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-live="polite"
                  className={buttonStyles(
                    "secondary",
                    cn("h-10 shrink-0 px-4", copied && "border-accent-green/40 text-emerald-300"),
                  )}
                >
                  {copied ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <Copy className="size-4" aria-hidden />
                  )}
                  {copied ? t.contact.copied : t.contact.copyEmail}
                </button>
              </div>

              <div role="group" className="flex items-center gap-3" aria-label={t.contact.socials}>
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.hero.github}
                  className={buttonStyles("icon")}
                >
                  <GithubIcon className="size-[18px]" />
                </a>
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.hero.linkedin}
                  className={buttonStyles("icon")}
                >
                  <LinkedinIcon className="size-[18px]" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="relative rounded-2xl glass p-6 sm:p-8"
              aria-labelledby="contact-title"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-accent-blue/50 to-transparent"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm text-zinc-300">
                    {t.contact.form.name}
                  </label>
                  <input
                    ref={(el) => {
                      fieldRefs.current.name = el;
                    }}
                    type="text"
                    autoComplete="name"
                    placeholder={t.contact.form.namePlaceholder}
                    {...fieldProps("name")}
                  />
                  {renderError("name")}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm text-zinc-300">
                    {t.contact.form.email}
                  </label>
                  <input
                    ref={(el) => {
                      fieldRefs.current.email = el;
                    }}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={t.contact.form.emailPlaceholder}
                    {...fieldProps("email")}
                  />
                  {renderError("email")}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className="mb-2 block text-sm text-zinc-300">
                    {t.contact.form.message}
                  </label>
                  <textarea
                    ref={(el) => {
                      fieldRefs.current.message = el;
                    }}
                    rows={6}
                    placeholder={t.contact.form.messagePlaceholder}
                    {...fieldProps("message")}
                    className={cn(fieldProps("message").className, "resize-y")}
                  />
                  {renderError("message")}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={buttonStyles("primary", "group mt-6 w-full sm:w-auto")}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    {t.contact.form.submitting}
                  </>
                ) : (
                  <>
                    {t.contact.form.submit}
                    <Send
                      className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </Container>

      <Toast
        open={toastOpen}
        onClose={closeToast}
        title={t.contact.toast.title}
        description={t.contact.toast.body}
        dismissLabel={t.contact.toast.dismiss}
      />
    </section>
  );
}
