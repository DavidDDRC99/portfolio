import type { Metadata } from "next";
import { getContent, getDict, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, SectionHeader, Tag, PageTitle } from "@/components/ui/Container";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).about;
  return pageMeta(locale, "/about/", t.eyebrow, t.metaDescription);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const c = getContent(locale);
  const t = getDict(locale).about;
  return (
    <>
      <PageTitle eyebrow={t.eyebrow} title={t.title} muted={t.muted} />
      <Container as="section" className="pb-16">
        <div className="grid gap-12 border-t border-ink-600 pt-12 lg:grid-cols-[1fr_320px]">
          <div className="prose-body max-w-2xl text-xl leading-relaxed tracking-[-0.01em] text-fog-200 sm:text-2xl" data-reveal>
            {c.profile.intro.map((p) => <p key={p} className="text-fog-100">{p}</p>)}
          </div>
          <aside className="border-l border-ink-600 pl-6 text-sm" data-reveal>
            <dl className="space-y-5">
              <div><dt className="label">{t.basedIn}</dt><dd className="mt-1 text-fog-100">{c.profile.location}</dd></div>
              <div><dt className="label">{t.now}</dt><dd className="mt-1 text-fog-100">{t.nowValue}</dd></div>
              <div><dt className="label">{t.background}</dt><dd className="mt-1 text-fog-100">{t.backgroundValue}</dd></div>
              <div>
                <dt className="label">{t.interestedIn}</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">{c.interests.map((i) => <Tag key={i}>{i}</Tag>)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Container>

      {/* Trajectory as a vertical timeline */}
      <Container as="section" className="pt-16">
        <SectionHeader index="01" kicker={t.trajectoryKicker} title={t.trajectoryTitle} />
        <ol className="relative ml-1 border-l border-ink-600 lg:ml-[200px]">
          {c.education.map((e) => (
            <li key={e.degree} className="relative pb-12 pl-8 last:pb-0" data-reveal>
              <span
                className={`absolute -left-[5px] top-1.5 h-[9px] w-[9px] rounded-full border ${e.status === "in-progress" ? "border-signal bg-signal" : "border-fog-400 bg-ink-900"}`}
                aria-hidden
              />
              <p className="font-mono text-[11px] text-fog-500">{e.period}{e.status === "in-progress" && <span className="ml-2 text-signal">{t.inProgress}</span>}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-fog-50">{e.degree}</h3>
              <p className="text-fog-400">{e.institution}</p>
              <div className="mt-4 flex max-w-2xl flex-wrap gap-1.5">{e.focus.map((f) => <Tag key={f}>{f}</Tag>)}</div>
              {e.note && <p className="mt-4 max-w-xl text-sm text-fog-400">{e.note}</p>}
            </li>
          ))}
        </ol>
      </Container>

      {/* Direction */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="02" kicker={t.directionKicker} title={t.directionTitle}>
          <p>{t.directionLead}</p>
        </SectionHeader>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.directions.map((d, i) => (
            <li key={d.title} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-fog-50">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog-400">{d.body}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* Skills */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="03" kicker={t.toolkitKicker} title={t.toolkitTitle}>
          <p>{t.toolkitLead}</p>
        </SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.skills.map((g) => (
            <div key={g.id} className="rounded-2xl bg-ink-850 p-6 sm:p-8" data-reveal>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-lg text-fog-50">{g.title}</h3>
                <span className="font-mono text-[11px] text-fog-500">{String(g.items.length).padStart(2, "0")}</span>
              </div>
              <p className="mt-1 text-sm text-fog-400">{g.description}</p>
              <ul className="mt-6 divide-y divide-ink-700 border-y border-ink-700">
                {g.items.map((s) => (
                  <li key={s.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5">
                    <span className="text-[15px] text-fog-100">{s.name}</span>
                    {s.evidence && <span className="font-mono text-[11px] text-fog-500">{s.evidence}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      {/* Philosophy */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="04" kicker={t.approachKicker} title={t.approachTitle} />
        <div className="grid gap-3 sm:grid-cols-2">
          {c.principles.map((p) => (
            <div key={p.title} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <h3 className="text-lg font-semibold tracking-tight text-fog-50">{p.title}</h3>
              <p className="mt-2 text-fog-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
