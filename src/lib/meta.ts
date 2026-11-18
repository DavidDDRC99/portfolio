import type { Metadata } from "next";
import { locales, localeNames, getDict, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Per-page metadata with canonical + hreflang alternates for every locale. */
export function pageMeta(locale: Locale, path: string, title?: string, description?: string): Metadata {
  const d = getDict(locale);
  const desc = description ?? d.meta.description;
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<string, string>;
  languages["x-default"] = `/en${path}`;
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: { type: "website", siteName: site.name, title: title ?? site.name, description: desc, locale: localeNames[locale].og, url: `/${locale}${path}` },
  };
}
