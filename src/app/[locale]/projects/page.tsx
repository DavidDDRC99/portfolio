import type { Metadata } from "next";
import Link from "next/link";
import { getContent, getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, Tag, PageTitle } from "@/components/ui/Container";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).projects;
  return pageMeta(locale, "/projects/", t.eyebrow, t.metaDescription);
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const { projects } = getContent(locale);
  const d = getDict(locale);
  const t = d.projects;
  const [featured, ...rest] = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <>
      <PageTitle eyebrow={t.eyebrow} title={t.title} muted={t.muted}>
        <p>{t.lead}</p>
      </PageTitle>

      <Container as="section">
        <Link href={lp(locale, `/projects/${featured.slug}/`)} className="group relative block overflow-hidden rounded-[28px] bg-signal p-6 text-white sm:p-10" data-reveal>
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-warm/40 blur-3xl" aria-hidden />
          <div className="relative flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/80">{featured.kicker}</p>
            <span className="font-mono text-[11px] text-white/70">{featured.year}</span>
          </div>
          <h2 className="relative mt-8 max-w-3xl text-3xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl">{featured.title}</h2>
          <p className="relative mt-5 max-w-2xl text-white/85">{featured.summary}</p>
          <div className="relative mt-6 flex flex-wrap gap-2">{featured.tags.map((tag) => <span key={tag} className="rounded-full border border-white/30 px-3 py-1 text-[12px] text-white/90">{tag}</span>)}</div>
          <span className="relative mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-fog-50 transition-transform group-hover:-translate-y-0.5">{t.openInteractive}</span>
        </Link>

        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {rest.map((p) => (
            <li key={p.slug} data-reveal>
              <Link href={lp(locale, `/projects/${p.slug}/`)} className="group flex h-full flex-col rounded-[28px] bg-ink-850 p-6 transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(35,64,255,0.6)] sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="label">{p.kicker}</p>
                  <span className="font-mono text-[11px] text-fog-500">{p.year}</span>
                </div>
                <h2 className="mt-6 text-2xl font-bold leading-tight tracking-[-0.03em] text-fog-50 transition-colors group-hover:text-signal">{p.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-fog-400">{p.summary}</p>
                <div className="mt-6 flex flex-wrap gap-2">{p.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
              </Link>
            </li>
          ))}
          <li className="flex min-h-[200px] flex-col justify-center rounded-[28px] border border-dashed border-ink-500 p-6 text-fog-500 sm:p-8" data-reveal>
            <p className="label">{d.common.next}</p>
            <p className="mt-3 text-sm">{d.common.moreSoon}</p>
          </li>
        </ul>
      </Container>
    </>
  );
}
