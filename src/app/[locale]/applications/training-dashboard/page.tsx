import type { Metadata } from "next";
import Link from "next/link";
import { getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, SectionHeader, Tag, Placeholder } from "@/components/ui/Container";

/**
 * Content comes from David's own description of the app.
 * TODO: once the source code is available in projects/training-app/source-code,
 * verify modules/parameters, add the real stack and screenshots.
 */
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).training;
  return pageMeta(locale, "/applications/training-dashboard/", t.metaTitle, t.metaDescription);
}

export default async function TrainingDashboardPage({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);
  const t = d.training;
  return (
    <article>
      <Container as="header" className="pb-14 pt-16 sm:pt-24">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
          <Link href={lp(locale, "/applications/")} className="hover:text-signal">{d.nav.applications}</Link> <span aria-hidden>/</span> <span className="text-fog-300">training-dashboard</span>
        </nav>
        <p className="label mb-4" data-reveal>{t.kicker}</p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.0] tracking-[-0.045em] text-fog-50 sm:text-6xl" data-reveal>{t.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300" data-reveal>{t.lead}</p>
        <div className="mt-6 flex flex-wrap gap-2" data-reveal>{t.tags.map((x) => <Tag key={x}>{x}</Tag>)}</div>
      </Container>

      <Container as="section" className="pt-12">
        <SectionHeader index="01" kicker={t.shotsKicker} title={t.shotsTitle}>
          <p>{t.shotsLead}</p>
        </SectionHeader>
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]" data-reveal>
          <div className="flex aspect-[16/10] items-center justify-center rounded-2xl border border-dashed border-ink-500 bg-white/40 p-4 text-center">
            <Placeholder>{t.shotDesktop}</Placeholder>
          </div>
          <div className="flex aspect-[9/16] max-h-[420px] items-center justify-center rounded-2xl border border-dashed border-ink-500 bg-white/40 p-4 md:max-h-none">
            <Placeholder>{t.shotMobile}</Placeholder>
          </div>
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="02" kicker={t.modulesKicker} title={t.modulesTitle}>
          <p>{t.modulesLead}</p>
        </SectionHeader>
        <div className="grid gap-3 md:grid-cols-2" data-reveal>
          <div className="rounded-2xl bg-ink-850 p-6">
            <p className="label mb-3">{t.modulesLabel}</p>
            <ul className="divide-y divide-ink-700 border-y border-ink-700">
              {t.modules.map((m, i) => (
                <li key={m} className="flex items-baseline gap-4 py-2.5 text-fog-100"><span className="font-mono text-[11px] text-fog-500">{String(i + 1).padStart(2, "0")}</span>{m}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-ink-850 p-6">
            <p className="label mb-3">{t.paramsLabel}</p>
            <div className="flex flex-wrap gap-2">{t.params.map((p) => <Tag key={p}>{p}</Tag>)}</div>
            <p className="mt-4 text-sm text-fog-400">{t.paramsNote}</p>
          </div>
        </div>
        <div className="mt-4"><Placeholder>{t.paramsPending}</Placeholder></div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="03" kicker={t.featKicker} title={t.featTitle} />
        <div className="grid gap-3 md:grid-cols-3">
          {t.features.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <h3 className="text-lg font-semibold tracking-tight text-fog-50">{k}</h3>
              <p className="mt-2 text-sm text-fog-400">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="04" kicker={t.stackKicker} title={t.stackTitle} />
        <Placeholder>{t.stackPending}</Placeholder>
      </Container>

      <Container className="pt-20">
        <Link href={lp(locale, "/applications/")} className="font-mono text-[12px] text-fog-400 hover:text-signal">{d.common.allApplications}</Link>
      </Container>
    </article>
  );
}
