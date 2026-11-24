import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getContent, locales } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const c = getContent("en");
  const paths = [
    "/", "/classes/", "/about/", "/projects/", "/applications/", "/contact/",
    ...c.projects.map((p) => `/projects/${p.slug}/`),
    ...c.applications.map((a) => `/applications/${a.slug}/`),
  ];
  return paths.flatMap((p) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "/" ? 1 : p.includes("vo-evolution") ? 0.9 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((x) => [x, `${site.url}/${x}${p}`])) },
    })),
  );
}
