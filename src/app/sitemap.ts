import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getContent } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const c = getContent();
  const paths = [
    "/", "/about/", "/projects/", "/applications/", "/contact/",
    ...c.projects.map((p) => `/projects/${p.slug}/`),
    ...c.applications.map((a) => `/applications/${a.slug}/`),
  ];
  return paths.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly", priority: p === "/" ? 1 : p.includes("vo-evolution") ? 0.9 : 0.7 }));
}
