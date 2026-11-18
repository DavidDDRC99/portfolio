import type { Metadata } from "next";
import Link from "next/link";
import { getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, SectionHeader, Tag, Placeholder } from "@/components/ui/Container";
import { ArchitectureDiagram } from "@/components/apps/ArchitectureDiagram";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).server;
  return pageMeta(locale, "/applications/home-server/", t.metaTitle, t.metaDescription);
}

export default async function HomeServerPage({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);
  const t = d.server;
  return (
    <article>
      <Container as="header" className="pb-14 pt-16 sm:pt-24">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
          <Link href={lp(locale, "/applications/")} className="hover:text-signal">{d.nav.applications}</Link> <span aria-hidden>/</span> <span className="text-fog-300">home-server</span>
        </nav>
        <p className="label mb-4" data-reveal>{t.kicker}</p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.0] tracking-[-0.045em] text-fog-50 sm:text-6xl" data-reveal>{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300" data-reveal>{t.lead}</p>
        <div className="mt-6 flex flex-wrap gap-2" data-reveal>{t.tags.map((x) => <Tag key={x}>{x}</Tag>)}</div>
      </Container>

      <Container as="section" className="pt-12">
        <SectionHeader index="01" kicker={t.archKicker} title={t.archTitle}>
          <p>{t.archLead}</p>
        </SectionHeader>
        <div data-reveal><ArchitectureDiagram labels={d.charts.diagram} /></div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="02" kicker={t.hwKicker} title={t.hwTitle}>
          <p>{t.hwLead}</p>
        </SectionHeader>
        <dl className="divide-y divide-ink-700 rounded-2xl bg-ink-850 px-6" data-reveal>
          {t.specs.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-4 sm:grid-cols-[200px_1fr]">
              <dt className="label pt-0.5">{k}</dt>
              <dd className="font-mono text-[13px] text-fog-100">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="03" kicker={t.sysKicker} title={t.sysTitle} />
        <div className="grid gap-3 md:grid-cols-3">
          {t.sys.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <h3 className="text-lg font-semibold tracking-tight text-fog-50">{k}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fog-400">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="04" kicker={t.chKicker} title={t.chTitle}>
          <p>{t.chLead}</p>
        </SectionHeader>
        <ul className="grid gap-3 md:grid-cols-2" data-reveal>
          {t.challenges.map((c) => <li key={c} className="flex gap-4 rounded-2xl bg-ink-850 p-6 text-fog-200"><span className="mt-[11px] h-px w-4 shrink-0 bg-warm" aria-hidden />{c}</li>)}
        </ul>
        <div className="mt-6"><Placeholder>{t.chPending}</Placeholder></div>
      </Container>

      <Container className="pt-20">
        <Link href={lp(locale, "/applications/")} className="font-mono text-[12px] text-fog-400 hover:text-signal">{d.common.allApplications}</Link>
      </Container>
    </article>
  );
}
