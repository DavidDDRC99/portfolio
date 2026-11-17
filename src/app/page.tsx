import Link from "next/link";
import { getContent } from "@/lib/i18n";
import { Container, SectionHeader, Tag } from "@/components/ui/Container";
import { IsobarField } from "@/components/home/IsobarField";
import { TrendSparkline } from "@/components/charts/TrendSparkline";
import { stationsData, mlResults } from "@/lib/meteo";
import { fmtSigned, fmtP } from "@/lib/format";

export default function Home() {
  const c = getContent();
  const nord = stationsData["sbd-nord"];
  const tAvg = nord.variables.t_avg!;
  const tr = tAvg.trend!;
  const hot = nord.indices.hot_days!.trend!;
  const vac = stationsData.vacarisses.variables.t_avg!.trend!;
  const mlp = mlResults.models.find((m) => m.id === "mlp")!;
  const featured = c.projects.find((p) => p.featured)!;
  const others = c.projects.filter((p) => !p.featured);

  const readouts = [
    { k: "Sbd Nord · T mean", v: `${fmtSigned(tr.sen_slope_per_decade, 2)} °C`, u: "per decade", s: `${tr.first_year}–${tr.last_year} · MK ${fmtP(tr.p_value)}` },
    { k: "Sbd Nord · Hot days", v: `${fmtSigned(hot.sen_slope_per_decade, 0)}`, u: "days / decade", s: `T max ≥ 30 °C · MK ${fmtP(hot.p_value)}` },
    { k: "Vacarisses record", v: `${vac.n_years}`, u: "complete years", s: `${vac.first_year}–${vac.last_year} · 30-min data` },
    { k: "Downscaling MLP", v: `${mlp.rmse.toFixed(2)} °C`, u: "RMSE", s: `R² ${mlp.r2.toFixed(3)} · test 2021–2026` },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-ink-700">
        <div className="absolute inset-0 -z-10 opacity-90 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <IsobarField />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_40%,var(--color-ink-900)_10%,transparent_65%)]" />
        <Container className="pb-16 pt-20 sm:pt-28 lg:pb-24 lg:pt-36">
          <p className="label mb-6 flex items-center gap-3" data-reveal>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            {c.profile.role}
          </p>
          <h1 className="max-w-4xl text-[40px] font-light leading-[1.05] tracking-[-0.02em] text-fog-50 sm:text-6xl lg:text-[76px]" data-reveal>
            {c.profile.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300 sm:text-xl" data-reveal>
            {c.profile.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Link href={`/projects/${featured.slug}/`} className="group inline-flex items-center gap-3 bg-fog-50 px-5 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-signal">
              Explore the climate project <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/about/" className="inline-flex items-center gap-3 border border-ink-500 px-5 py-3 text-sm text-fog-100 transition-colors hover:border-fog-300">
              About me
            </Link>
          </div>

          {/* Instrument readout: every value is computed from the repository data. */}
          <dl className="mt-16 grid grid-cols-2 border-l border-t border-ink-600 bg-ink-900/70 backdrop-blur-[2px] lg:mt-24 lg:grid-cols-4" data-reveal>
            {readouts.map((r) => (
              <div key={r.k} className="border-b border-r border-ink-600 p-4 sm:p-5">
                <dt className="label">{r.k}</dt>
                <dd className="mt-3">
                  <span className="whitespace-nowrap font-mono text-xl text-fog-50 sm:text-[28px]">{r.v}</span>
                  <span className="block text-xs text-fog-400 sm:ml-2 sm:inline">{r.u}</span>
                  <span className="mt-2 block font-mono text-[10.5px] text-fog-500">{r.s}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-[10.5px] text-fog-500">
            Live figures from the VO-evolution dataset (Meteocat stations). Trend: Sen&apos;s slope, Mann-Kendall test.
          </p>
        </Container>
      </section>

      {/* ── Featured project ─────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="01" kicker="Featured project" title={featured.title}>
          <p>{featured.summary}</p>
        </SectionHeader>
        <Link
          href={`/projects/${featured.slug}/`}
          className="group grid gap-0 border border-ink-600 transition-colors hover:border-signal-dim md:grid-cols-[1fr_340px]"
          data-reveal
        >
          <div className="border-b border-ink-600 p-5 sm:p-8 md:border-b-0 md:border-r">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <p className="label">Sabadell Nord · annual mean temperature</p>
              <p className="font-mono text-[11px] text-fog-500">
                <span className="text-warm">━</span> LOESS &nbsp; <span className="text-fog-400">┄</span> Sen&apos;s slope
              </p>
            </div>
            <TrendSparkline annual={tAvg.annual} trend={tr} label={`Annual mean temperature at Sabadell Nord, ${tr.first_year} to ${tr.last_year}`} />
          </div>
          <div className="flex flex-col justify-between gap-8 p-5 sm:p-8">
            <ul className="space-y-3 text-sm text-fog-300">
              <li className="flex justify-between gap-4 border-b border-ink-700 pb-3"><span>Stations</span><span className="font-mono text-fog-100">3</span></li>
              <li className="flex justify-between gap-4 border-b border-ink-700 pb-3"><span>Longest record</span><span className="font-mono text-fog-100">1996 → 2026</span></li>
              <li className="flex justify-between gap-4 border-b border-ink-700 pb-3"><span>Analysis notebooks</span><span className="font-mono text-fog-100">7</span></li>
              <li className="flex justify-between gap-4"><span>Models compared</span><span className="font-mono text-fog-100">4</span></li>
            </ul>
            <span className="inline-flex items-center gap-2 text-sm text-signal">
              Open the interactive analysis <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </Container>

      {/* ── Selected work ───────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="02" kicker="Selected work" title="Research, applications and infrastructure">
          <p>I analyse data, but I also build the tools and systems around it.</p>
        </SectionHeader>
        <ul className="border-t border-ink-600">
          {[
            ...others.map((p) => ({ href: `/projects/${p.slug}/`, kicker: p.kicker, title: p.title, tags: p.tags, meta: p.year })),
            ...c.applications.map((a) => ({ href: `/applications/${a.slug}/`, kicker: a.kicker, title: a.title, tags: a.tags, meta: a.status })),
          ].map((item, i) => (
            <li key={item.href} data-reveal>
              <Link href={item.href} className="group grid gap-3 border-b border-ink-600 py-6 transition-colors hover:bg-ink-850 sm:grid-cols-[60px_1fr_auto] sm:items-baseline sm:gap-6 sm:px-3">
                <span className="font-mono text-[11px] text-fog-500">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="label mb-2">{item.kicker}</p>
                  <p className="text-lg text-fog-50 transition-colors group-hover:text-signal sm:text-xl">{item.title}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{item.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                </div>
                <span className="font-mono text-[11px] text-fog-400">{item.meta} <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── Approach ─────────────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="03" kicker="How I work" title="Questions first, then the tools to answer them" />
        <div className="grid border-l border-t border-ink-600 sm:grid-cols-2 lg:grid-cols-4">
          {c.principles.map((p, i) => (
            <div key={p.title} className="border-b border-r border-ink-600 p-6" data-reveal>
              <span className="font-mono text-[11px] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-fog-50">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* ── Now ──────────────────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <div className="grid gap-10 md:grid-cols-[180px_1fr] md:gap-10">
          <div>
            <span className="font-mono text-[11px] text-signal">04</span>
            <p className="label mt-2">Currently</p>
          </div>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <ul className="space-y-3" data-reveal>
              {c.exploring.map((e) => (
                <li key={e} className="flex gap-4 text-lg text-fog-100"><span className="mt-[13px] h-px w-6 shrink-0 bg-signal" aria-hidden />{e}</li>
              ))}
            </ul>
            <Link href="/contact/" className="text-sm text-signal hover:underline" data-reveal>Get in touch →</Link>
          </div>
        </div>
      </Container>
    </>
  );
}
