import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/i18n";
import { Container, Tag } from "@/components/ui/Container";

/** Generic template for "standard" projects. Rich projects have their own route. */
export function generateStaticParams() {
  return Object.keys(getContent().projectDetails).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getContent().projectDetails[slug];
  if (!p) return {};
  return { title: p.title, description: p.summary, alternates: { canonical: `/projects/${slug}/` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getContent().projectDetails[slug];
  if (!p) notFound();

  return (
    <article>
      <Container as="header" className="border-b border-ink-700 pb-14 pt-16 sm:pt-24">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
          <Link href="/projects/" className="hover:text-signal">Projects</Link> <span aria-hidden>/</span> <span className="text-fog-300">{p.slug}</span>
        </nav>
        <p className="label mb-4" data-reveal>{p.kicker} · {p.year}</p>
        <h1 className="max-w-4xl text-3xl font-light leading-tight tracking-[-0.02em] text-fog-50 sm:text-5xl" data-reveal>{p.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-fog-300" data-reveal>{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-1.5" data-reveal>{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </Container>

      <Container className="grid gap-14 pt-16 lg:grid-cols-[1fr_300px]">
        <div className="max-w-2xl">
          <div className="space-y-4 text-[17px] leading-relaxed text-fog-200" data-reveal>
            {p.context.map((c) => <p key={c}>{c}</p>)}
          </div>
          {p.sections.map((s, i) => (
            <section key={s.title} className="mt-14" data-reveal>
              <h2 className="flex items-baseline gap-3 text-xl text-fog-50">
                <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-fog-300">{s.body.map((b) => <p key={b}>{b}</p>)}</div>
              {s.bullets && (
                <ul className="mt-4 divide-y divide-ink-700 border-y border-ink-700">
                  {s.bullets.map((b) => <li key={b} className="flex gap-4 py-2.5 text-fog-200"><span className="mt-[11px] h-px w-4 shrink-0 bg-signal" aria-hidden />{b}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
          {p.outcome?.map((o) => (
            <div key={o.label} className="border border-ink-600 p-5" data-reveal>
              <p className="label">{o.label}</p>
              <p className="mt-2 font-mono text-3xl text-fog-50">{o.value}</p>
              {o.note && <p className="mt-2 text-sm text-fog-400">{o.note}</p>}
            </div>
          ))}
          <div data-reveal>
            <p className="label mb-3">Stack</p>
            <ul className="divide-y divide-ink-700 border-y border-ink-700 text-sm text-fog-200">
              {p.stack.map((s) => <li key={s} className="py-2">{s}</li>)}
            </ul>
          </div>
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="block text-sm text-signal hover:underline">Repository ↗</a>
          )}
        </aside>
      </Container>

      <Container className="pt-20">
        <Link href="/projects/" className="font-mono text-[12px] text-fog-400 hover:text-signal">← All projects</Link>
      </Container>
    </article>
  );
}
