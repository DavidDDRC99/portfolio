import type { Metadata } from "next";
import Link from "next/link";
import { getContent } from "@/lib/i18n";
import { Container, Tag, Placeholder } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Applications",
  description: "Things I've built: a personal training dashboard and a self-hosted Linux home server.",
  alternates: { canonical: "/applications/" },
};

export default function ApplicationsPage() {
  const { applications } = getContent();
  return (
    <>
      <Container as="header" className="pb-14 pt-20 sm:pt-28">
        <p className="label mb-4" data-reveal>Applications</p>
        <h1 className="max-w-3xl text-4xl font-light tracking-[-0.02em] text-fog-50 sm:text-5xl" data-reveal>Things I&apos;ve built</h1>
        <p className="mt-5 max-w-2xl text-lg text-fog-300" data-reveal>
          Analysis is half of it. These are tools and systems I designed for my own use and keep running.
        </p>
      </Container>
      <Container as="section">
        <ul className="border-t border-ink-600">
          {applications.map((a, i) => (
            <li key={a.slug} data-reveal>
              <Link href={`/applications/${a.slug}/`} className="group grid gap-4 border-b border-ink-600 py-10 transition-colors hover:bg-ink-850 md:grid-cols-[80px_1fr_200px] md:px-4">
                <span className="font-mono text-[11px] text-fog-500">A.{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="label">{a.kicker}</p>
                  <h2 className="mt-3 text-2xl text-fog-50 transition-colors group-hover:text-signal sm:text-3xl">{a.title}</h2>
                  <p className="mt-3 max-w-2xl text-fog-300">{a.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">{a.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                  {a.pendingVerification && <div className="mt-4"><Placeholder>Screenshots and stack pending source review</Placeholder></div>}
                </div>
                <div className="flex items-start justify-between gap-4 md:flex-col md:items-end">
                  <span className="flex items-center gap-2 font-mono text-[11px] text-fog-300"><span className="h-1.5 w-1.5 rounded-full bg-rain" aria-hidden />{a.status}</span>
                  <span className="text-sm text-signal">Details <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
