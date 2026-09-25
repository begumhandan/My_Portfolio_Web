export const locales = ["tr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

/** A string that has a version for every supported locale. */
export type Localized = Record<Locale, string>;

/** Plain strings are language-neutral (e.g. technology names). */
export type MaybeLocalized = string | Localized;
