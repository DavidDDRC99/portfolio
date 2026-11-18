import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeader, Tag } from "@/components/ui/Container";
import { IsobarField } from "@/components/home/IsobarField";
import { StationMap } from "@/components/meteo/StationMap";
import { TimeSeriesExplorer } from "@/components/meteo/TimeSeriesExplorer";
import { Climatology } from "@/components/meteo/Climatology";
import { TrendExplorer } from "@/components/meteo/TrendExplorer";
import { DiurnalProblem, ModelComparison } from "@/components/meteo/MachineLearning";
import { stationsData, stationById, mlResults } from "@/lib/meteo";
import { fmtSigned, fmtP } from "@/lib/format";
import { getContent, getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).vo;
  return pageMeta(locale, "/projects/vo-evolution/", t.metaTitle, t.metaDescription);
}

const SECTION_IDS = ["overview", "stations", "data", "trends", "ml", "method", "stack"] as const;

export default async function VOEvolutionPage({ params }: Props) {
  const { locale } = await params;
  const d = getDict(locale);
  const t = d.vo;
  const project = getContent(locale).projects.find((p) => p.slug === "vo-evolution")!;
  const nord = stationsData["sbd-nord"];
  const centre = stationsData["sbd-centre"];
  const vac = stationsData.vacarisses;
  const tN = nord.variables.t_avg!.trend!;
  const tC = centre.variables.t_avg!.trend!;
  const tVmin = vac.variables.t_min!.trend!;
  const tVavg = vac.variables.t_avg!.trend!;
  const tVmax = vac.variables.t_max!.trend!;
  const rainSig = (["sbd-nord", "sbd-centre", "vacarisses"] as const).filter((s) => stationsData[s].variables.rain?.trend?.significant_05);
  const tnC = centre.indices.tropical_nights!.trend!;
  const tnN = nord.indices.tropical_nights!.trend!;
  const mlp = mlResults.models.find((m) => m.id === "mlp")!;
  const sin = mlResults.models.find((m) => m.id === "sin")!;

  return (
    <article>
      {/* ── Header: cobalt panel in the hero style ─────── */}
      <header className="px-2 pt-2 sm:px-4 sm:pt-3">
        <div className="relative isolate overflow-hidden rounded-[22px] bg-signal text-white sm:rounded-[32px]">
          <div className="absolute inset-0 -z-10"><IsobarField /></div>
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_10%,transparent_30%,rgba(10,20,120,0.45))]" />
          <Container className="pb-8 pt-10 sm:pb-10 sm:pt-14">
            <nav aria-label="Breadcrumb" className="mb-10 font-mono text-[11px] text-white/60">
              <Link href={lp(locale, "/projects/")} className="hover:text-white">{d.nav.projects}</Link> <span aria-hidden>/</span> <span className="text-white">VO-evolution</span>
            </nav>
            <p className="mb-5 font-mono text-[12px] uppercase tracking-[0.1em] text-white/80" data-reveal>{project.kicker} · {project.year}</p>
            <h1 className="display text-[15vw] text-white sm:text-[12vw] lg:text-[150px]" data-reveal>
              VO&#8209;evolution
              <span className="sr-only">{t.srTitle}</span>
            </h1>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl" data-reveal>
                {t.lead}
              </p>
              <div className="flex flex-wrap items-center gap-2" data-reveal>
                <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-fog-50 transition-transform hover:-translate-y-0.5">
                  {d.common.viewRepository}
                </a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2" data-reveal>
              {project.tags.map((t) => <span key={t} className="rounded-full border border-white/30 px-3 py-1 text-[12px] text-white/90">{t}</span>)}
            </div>
            <dl className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4" data-reveal>
              {[
                [t.stats[0][0], "3", t.stats[0][1]],
                [t.stats[1][0], `${vac.period[0].slice(0, 4)}–${vac.period[1].slice(0, 4)}`, t.stats[1][1]],
                [t.stats[2][0], (nord.n_days_calendar + centre.n_days_calendar + vac.n_days_calendar).toLocaleString(locale === "en" ? "en-GB" : "es-ES"), t.stats[2][1]],
                [t.stats[3][0], `${mlp.rmse.toFixed(2)} °C`, t.stats[3][1]],
              ].map(([k, v, s]) => (
                <div key={k} className="rounded-2xl bg-white p-4 text-fog-50 sm:p-5">
                  <dt className="text-[12px] text-fog-400">{k}</dt>
                  <dd className="mt-6 text-2xl font-bold tracking-[-0.03em] sm:text-[32px]">{v}<span className="mt-1 block text-xs font-normal tracking-normal text-fog-500">{s}</span></dd>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </header>

      {/* Sticky in-page navigation */}
      <nav aria-label="Sections" className="sticky top-16 z-30 mt-3 border-b border-white/60 bg-white/55 backdrop-blur-xl">
        <Container className="flex gap-1 overflow-x-auto py-2 font-mono text-[11.5px] [scrollbar-width:none]">
          {SECTION_IDS.map((id, i) => [id, t.subnav[i]] as const).map(([id, label], i) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-3 py-1.5 text-fog-400 transition-colors hover:bg-ink-850 hover:text-fog-50">
              <span className="text-fog-500">{String(i + 1).padStart(2, "0")}</span> {label}
            </a>
          ))}
        </Container>
      </nav>

      {/* ── 01 Overview ──────────────────────────────────── */}
      <Container as="section" className="scroll-mt-28 pt-20" >
        <div id="overview" className="scroll-mt-28" />
        <SectionHeader index="01" kicker={t.overviewKicker} title={t.overviewTitle}>
          <p>{t.overviewLead}</p>
        </SectionHeader>
        <div className="grid gap-3 md:grid-cols-3">
          {t.overviewCards.map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-ink-850 p-5" data-reveal>
              <p className="label">{k}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-fog-200">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* ── 02 Stations ──────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="stations" className="scroll-mt-28" />
        <SectionHeader index="02" kicker={t.stationsKicker} title={t.stationsTitle}>
          <p>{t.stationsLead}</p>
        </SectionHeader>
        <div data-reveal><StationMap labels={d.charts} /></div>
      </Container>

      {/* ── 03 Data ──────────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="data" className="scroll-mt-28" />
        <SectionHeader index="03" kicker={t.dataKicker} title={t.dataTitle}>
          <p>{t.dataLead}</p>
        </SectionHeader>
        <div className="space-y-6">
          <div data-reveal><TimeSeriesExplorer labels={d.charts} /></div>
          <div data-reveal><Climatology labels={d.charts} /></div>
        </div>
      </Container>

      {/* ── 04 Trends ────────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="trends" className="scroll-mt-28" />
        <SectionHeader index="04" kicker={t.trendsKicker} title={t.trendsTitle}>
          <p>{t.trendsLead}</p>
        </SectionHeader>
        <div data-reveal><TrendExplorer labels={d.charts} /></div>

        <div className="mt-10 grid gap-3 md:grid-cols-2" data-reveal>
          <div className="rounded-2xl bg-ink-850 p-6 sm:p-8">
            <p className="label mb-3">{t.readingLabel}</p>
            <ul className="space-y-3 text-[15px] leading-relaxed text-fog-200">
              <li>{t.reading.sabadell(fmtSigned(tN.sen_slope_per_decade, 1), fmtP(tN.p_value), fmtSigned(tC.sen_slope_per_decade, 1), fmtP(tC.p_value), tN.first_year, tN.last_year)}</li>
              <li>{t.reading.vacarisses(tVmin.first_year, tVmin.last_year, fmtSigned(tVmin.sen_slope_per_decade, 2), fmtP(tVmin.p_value), fmtP(tVavg.p_value), fmtP(tVmax.p_value))}</li>
              <li>{t.reading.tropical(fmtSigned(tnC.sen_slope_per_decade, 1), fmtP(tnC.p_value), fmtP(tnN.p_value))}</li>
              <li>{rainSig.length === 0 ? t.reading.rainNone : t.reading.rainSome(rainSig.map((x) => stationById[x].short).join(", "))}</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-ink-850 p-6 sm:p-8">
            <p className="label mb-3">{t.limitationsLabel}</p>
            <ul className="space-y-3 text-[15px] leading-relaxed text-fog-400">
              {t.limitations.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>
      </Container>

      {/* ── 05 Machine learning ──────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="ml" className="scroll-mt-28" />
        <SectionHeader index="05" kicker={t.mlKicker} title={t.mlTitle}>
          <p>{t.mlLead}</p>
        </SectionHeader>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div data-reveal><DiurnalProblem labels={d.charts} /></div>
          <div data-reveal><ModelComparison labels={d.charts} /></div>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-2" data-reveal>
          <div className="rounded-2xl bg-ink-850 p-6 text-[15px] leading-relaxed text-fog-200 sm:p-8">
            <p>{t.mlBody(sin.rmse.toFixed(2), mlp.rmse.toFixed(2))}</p>
            <p className="mt-4 text-fog-400">{t.mlTransfer}</p>
          </div>
          <div className="rounded-2xl bg-ink-850 p-6 sm:p-8">
            <p className="label mb-3">{t.features} ({mlResults.features.length})</p>
            <div className="flex flex-wrap gap-1.5">{mlResults.features.map((f) => <Tag key={f}>{f}</Tag>)}</div>
            <p className="mt-4 font-mono text-[10.5px] text-fog-500">{t.splitNote(mlResults.split.train, mlResults.split.test)}</p>
          </div>
        </div>
      </Container>

      {/* ── 06 Methodology ───────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="method" className="scroll-mt-28" />
        <SectionHeader index="06" kicker={t.methodKicker} title={t.methodTitle} />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.method.map(([k, v], i) => (
            <li key={k} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold tracking-tight text-fog-50">{k}</h3>
                <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fog-400">{v}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* ── 07 Stack & repository ────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="stack" className="scroll-mt-28" />
        <SectionHeader index="07" kicker={t.stackKicker} title={t.stackTitle} />
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.2fr]">
          {t.stackGroups.map(([k, items]) => (
            <div key={k as string} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <p className="label mb-3">{k as string}</p>
              <ul className="space-y-1.5 text-fog-200">{(items as string[]).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-ink-600 bg-ink-850 p-6 transition-colors hover:border-signal-dim sm:flex-row sm:items-center"
          data-reveal
        >
          <div>
            <p className="label">{d.common.repository}</p>
            <p className="mt-2 font-mono text-fog-50">github.com/DavidDDRC99/VO-evolution</p>
            <p className="mt-1 text-sm text-fog-400">{t.repoNote}</p>
          </div>
          <span className="text-signal transition-transform group-hover:translate-x-1">{d.common.openOnGithub}</span>
        </a>
        <p className="mt-6 font-mono text-[10.5px] text-fog-500">{t.dataCredit}</p>
      </Container>
    </article>
  );
}
