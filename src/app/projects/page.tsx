import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/i18n";
import { Container, Tag } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Projects",
  description: "Scientific and data projects: climate analysis of the Vallès Occidental and a Bachelor's thesis on red nugget galaxies at ICE-CSIC.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const { projects } = getContent();
  const [featured, ...rest] = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <>
      <Container as="header" className="pb-14 pt-20 sm:pt-28">
        <p className="label mb-4" data-reveal>Projects</p>
        <h1 className="max-w-3xl text-4xl font-light tracking-[-0.02em] text-fog-50 sm:text-5xl" data-reveal>Scientific work, built on real data</h1>
        <p className="mt-5 max-w-2xl text-lg text-fog-300" data-reveal>Each project has its own page with the methods, the results and what they don&apos;t show.</p>
      </Container>

      <Container as="section">
        <Link href={`/projects/${featured.slug}/`} className="group relative block overflow-hidden border border-ink-600 p-6 transition-colors hover:border-signal-dim sm:p-10" data-reveal>
          <div className="grid-bg absolute inset-0 -z-10 opacity-30" />
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="label text-signal">{featured.kicker}</p>
            <span className="font-mono text-[11px] text-fog-500">{featured.year}</span>
          </div>
          <h2 className="mt-6 max-w-3xl text-2xl text-fog-50 transition-colors group-hover:text-signal sm:text-4xl sm:leading-tight">{featured.title}</h2>
          <p className="mt-4 max-w-2xl text-fog-300">{featured.summary}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">{featured.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          <span className="mt-8 inline-block text-sm text-signal">Open interactive analysis →</span>
        </Link>

        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((p) => (
            <li key={p.slug} data-reveal>
              <Link href={`/projects/${p.slug}/`} className="group flex h-full flex-col border border-ink-600 p-6 transition-colors hover:border-signal-dim">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="label">{p.kicker}</p>
                  <span className="font-mono text-[11px] text-fog-500">{p.year}</span>
                </div>
                <h2 className="mt-4 text-xl text-fog-50 transition-colors group-hover:text-signal">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fog-400">{p.summary}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
              </Link>
            </li>
          ))}
          <li className="flex min-h-[200px] flex-col justify-center border border-dashed border-ink-600 p-6 text-fog-500" data-reveal>
            <p className="label">Next</p>
            <p className="mt-3 text-sm">More projects will be added here as they are documented.</p>
          </li>
        </ul>
      </Container>
    </>
  );
}
