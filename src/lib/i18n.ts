import type { SiteContent } from "@/content/types";
import { en as contentEn } from "@/content/en";
import { ca as contentCa } from "@/content/ca";
import { es as contentEs } from "@/content/es";
import { en as dictEn, type Dict } from "@/i18n/en";
import { ca as dictCa } from "@/i18n/ca";
import { es as dictEs } from "@/i18n/es";

/**
 * Locales. Every page lives under /{locale}/… (e.g. /ca/projects/vo-evolution/).
 * The root "/" picks a language from the visitor's saved choice or browser.
 * To add a language: create src/content/<xx> and src/i18n/<xx>, then register it here.
 */
export const locales = ["en", "ca", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { short: string; long: string; og: string }> = {
  en: { short: "EN", long: "English", og: "en_GB" },
  ca: { short: "CA", long: "Català", og: "ca_ES" },
  es: { short: "ES", long: "Español", og: "es_ES" },
};

export function isLocale(x: string | undefined): x is Locale {
  return !!x && (locales as readonly string[]).includes(x);
}

const contents: Record<Locale, SiteContent> = { en: contentEn, ca: contentCa, es: contentEs };
const dicts: Record<Locale, Dict> = { en: dictEn, ca: dictCa, es: dictEs };

export function getContent(locale: Locale = defaultLocale): SiteContent {
  return contents[locale];
}

export function getDict(locale: Locale = defaultLocale): Dict {
  return dicts[locale];
}

/** Prefix an internal path ("/about/") with the locale ("/ca/about/"). */
export function lp(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
}

/** Swap the locale segment of a pathname ("/ca/about/" → "/es/about/"). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  const out = parts.join("/") || `/${to}/`;
  return out.endsWith("/") ? out : `${out}/`;
}

export function localeFromPathname(pathname: string | null | undefined): Locale {
  const seg = pathname?.split("/")[1];
  return isLocale(seg) ? seg : defaultLocale;
}
