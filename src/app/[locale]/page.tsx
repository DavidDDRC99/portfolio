import type { Metadata } from "next";
import Link from "next/link";
import { getContent, getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, SectionHeader, Tag } from "@/components/ui/Container";
import { HomeHero } from "@/components/home/HomeHero";
import { stationsData, mlResults } from "@/lib/meteo";
import { fmtSigned, fmtP } from "@/lib/format";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMeta(locale, "/");
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const c = getContent(locale);
  const t = getDict(locale);
  const r = t.home.readouts;
  const nord = stationsData["sbd-nord"];
  const tAvg = nord.variables.t_avg!;
  const tr = tAvg.trend!;
  const hot = nord.indices.hot_days!.trend!;
  const vac = stationsData.vacarisses.variables.t_avg!.trend!;
  const mlp = mlResults.models.find((m) => m.id === "mlp")!;
  const featured = c.projects.find((p) => p.featured)!;
  const others = c.projects.filter((p) => !p.featured);

  // Every value below is computed from the VO-evolution dataset.
  const readouts = [
    { v: fmtSigned(tr.sen_slope_per_decade, 2), u: r.perDecade, k: r.trend, s: `${tr.first_year}–${tr.last_year} · ${fmtP(tr.p_value)}` },
    { v: fmtSigned(hot.sen_slope_per_decade, 0), u: r.daysDecade, k: r.hot, s: `Mann-Kendall ${fmtP(hot.p_value)}` },
    { v: String(vac.n_years), u: r.years, k: r.record, s: `${vac.first_year}–${vac.last_year} · ${r.data30}` },
    { v: mlp.rmse.toFixed(2), u: r.rmse, k: r.ml, s: `R² ${mlp.r2.toFixed(3)} · test 2021–2026` },
  ];

  const work = [
    ...others.map((p) => ({ href: lp(locale, `/projects/${p.slug}/`), title: p.title, summary: p.summary, tags: p.tags })),
    ...c.applications.map((a) => ({ href: lp(locale, `/applications/${a.slug}/`), title: a.title, summary: a.summary, tags: a.tags })),
  ];

  return (
    <>
      <HomeHero
        name="David Domínguez Ruiz"
        tagline={c.profile.tagline}
        role={c.profile.role}
        labels={t.home.hub}
        links={{
          classes: lp(locale, "/classes/"),
          vo: lp(locale, `/projects/${featured.slug}/`),
          apps: lp(locale, "/applications/"),
          info: lp(locale, "/about/"),
        }}
        featured={{ title: `Sabadell Nord, ${tr.first_year}–${tr.last_year}`, annual: tAvg.annual, trend: tr }}
        apps={c.applications.map((a) => a.title)}
        contact={c.contact}
      />

      {/* ── Intro + figures ──────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div data-reveal>
            <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />{t.home.introKicker}</span>
          </div>
          <p className="text-[26px] font-medium leading-[1.2] tracking-[-0.025em] text-fog-50 sm:text-[34px]" data-reveal>
            {t.home.introStrong} <span className="text-fog-500">{t.home.introMuted}</span>
          </p>
        </div>

        <dl className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {readouts.map((x) => (
            <div key={x.k} className="flex flex-col justify-between gap-8 rounded-2xl bg-ink-850 p-5 shadow-[0_10px_40px_-25px_rgba(35,64,255,0.5)] sm:p-6">
              <dt className="text-[13px] leading-snug text-fog-300">{x.k}</dt>
              <dd>
                <span className="text-[44px] font-bold leading-none tracking-[-0.04em] text-fog-50">{x.v}</span>
                <span className="ml-1.5 text-sm font-medium text-signal">{x.u}</span>
                <span className="mt-3 block font-mono text-[11px] text-fog-500">{x.s}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[11px] text-fog-500">{t.home.readoutNote}</p>
      </Container>

      {/* ── Featured project ─────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="01" kicker={t.home.featuredKicker} title={t.home.featuredTitle} muted={t.home.featuredMuted}>
          <p>{featured.summary}</p>
        </SectionHeader>
        <Link href={lp(locale, `/projects/${featured.slug}/`)} className="group relative block overflow-hidden rounded-[28px] bg-fog-50 p-6 text-white sm:p-10" data-reveal>
          <div className="grid-bg absolute inset-0 opacity-[0.07]" aria-hidden />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-signal/40 blur-3xl" aria-hidden />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-warm/25 blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">{featured.kicker} · {featured.year}</p>
              <p className="display mt-6 text-[48px] text-white sm:text-[84px]">VO&#8209;evolution</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featured.tags.map((tag) => <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-[12px] text-white/80">{tag}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm">
              {[[t.home.featuredStats.stations, "3"], [t.home.featuredStats.record, "1996–2026"], [t.home.featuredStats.notebooks, "7"], [t.home.featuredStats.models, "4"]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-white/50">{k}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="relative mt-10 inline-flex items-center gap-3 rounded-full bg-signal px-5 py-3 text-sm font-medium transition-colors group-hover:bg-white group-hover:text-fog-50">
            {t.home.openAnalysis} <span aria-hidden>→</span>
          </span>
        </Link>
      </Container>

      {/* ── Selected work ───────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="02" kicker={t.home.workKicker} title={t.home.workTitle} muted={t.home.workMuted}>
          <p>{t.home.workLead}</p>
        </SectionHeader>
        <ul className="border-t border-ink-600">
          {work.map((item, i) => (
            <li key={item.href} data-reveal>
              <Link href={item.href} className="group grid gap-4 border-b border-ink-600 py-8 sm:grid-cols-[90px_1fr_auto] sm:items-start sm:gap-8 sm:py-10">
                <span className="flex items-center gap-2 font-mono text-[12px] text-fog-400"><span className="h-1.5 w-1.5 rounded-full bg-warm" aria-hidden />{String(i + 1).padStart(3, "0")}</span>
                <div>
                  <p className="text-[24px] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-fog-50 transition-colors group-hover:text-signal sm:text-[34px]">{item.title}</p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog-400">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{item.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                </div>
                <span className="hidden h-12 w-12 place-items-center rounded-full border border-ink-600 bg-white/50 text-lg text-fog-50 transition-all group-hover:border-signal group-hover:bg-signal group-hover:text-white sm:grid" aria-hidden>↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── Approach: gradient band ─────────────────────── */}
      <section className="px-2 pt-24 sm:px-4 sm:pt-32">
        <div className="band relative overflow-hidden rounded-[22px] py-16 text-white sm:rounded-[32px] sm:py-24">
          <Container>
            <div className="mb-12" data-reveal>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden /><span className="text-white/60">03</span>{t.home.approachKicker}
              </span>
              <h2 className="text-[32px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[44px] lg:text-[52px]">
                {t.home.approachTitle}<span className="block text-white/55">{t.home.approachMuted}</span>
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {c.principles.map((p, i) => (
                <div key={p.title} className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm" data-reveal>
                  <span className="font-mono text-[12px] text-white/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-10 text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{p.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ── Now + CTA ────────────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <div className="grid gap-10 rounded-[28px] bg-ink-850 p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-rain" aria-hidden />{t.home.exploringKicker}</span>
            <ul className="mt-8 space-y-4" data-reveal>
              {c.exploring.map((e) => (
                <li key={e} className="flex gap-4 text-lg text-fog-100"><span className="mt-[13px] h-px w-6 shrink-0 bg-signal" aria-hidden />{e}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-2xl bg-signal p-6 text-white sm:p-8">
            <p className="display whitespace-pre-line text-[52px] sm:text-[72px]">{t.home.ctaTitle}</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xs text-sm text-white/80">{t.home.ctaBody}</p>
              <Link href={lp(locale, "/contact/")} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-fog-50 transition-transform hover:-translate-y-0.5">{t.home.ctaButton} <span aria-hidden>↗</span></Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
