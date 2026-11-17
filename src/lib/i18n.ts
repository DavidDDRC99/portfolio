import type { SiteContent } from "@/content/types";
import { en } from "@/content/en";

/**
 * Locale registry. English is the only published locale for now.
 * To add Catalan or Spanish: create src/content/ca/index.ts (same shape as en),
 * register it here, and move routes under app/[locale]/ with generateStaticParams.
 */
export const locales = ["en"] as const;
export const futureLocales = ["ca", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const registry: Record<Locale, SiteContent> = { en };

export function getContent(locale: Locale = defaultLocale): SiteContent {
  return registry[locale];
}
