import Link from "next/link";
import { getContent } from "@/lib/i18n";
import { Container, SectionHeader, Tag } from "@/components/ui/Container";
import { HomeHero } from "@/components/home/HomeHero";
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

  // Every value below is computed from the VO-evolution dataset.
  const readouts = [
    { v: fmtSigned(tr.sen_slope_per_decade, 2), u: "°C / decade", k: "Mean temperature trend, Sabadell Nord", s: `${tr.first_year}–${tr.last_year} · ${fmtP(tr.p_value)}` },
    { v: fmtSigned(hot.sen_slope_per_decade, 0), u: "days / decade", k: "Hot days (T max ≥ 30 °C), Sabadell Nord", s: `Mann-Kendall ${fmtP(hot.p_value)}` },
    { v: String(vac.n_years), u: "years", k: "Complete record at Vacarisses", s: `${vac.first_year}–${vac.last_year} · 30-min data` },
    { v: mlp.rmse.toFixed(2), u: "°C RMSE", k: "Neural network, daily → 30-min curve", s: `R² ${mlp.r2.toFixed(3)} · test 2021–2026` },
  ];

  const work = [
    ...others.map((p) => ({ href: `/projects/${p.slug}/`, kicker: p.kicker, title: p.title, summary: p.summary, tags: p.tags })),
    ...c.applications.map((a) => ({ href: `/applications/${a.slug}/`, kicker: a.kicker, title: a.title, summary: a.summary, tags: a.tags })),
  ];

  return (
    <>
      <HomeHero
        firstName="David"
        lastName="Domínguez Ruiz"
        tagline={c.profile.tagline}
        role={c.profile.role}
        portrait={c.profile.portrait}
        featured={{ href: `/projects/${featured.slug}/`, title: `Annual mean temperature at Sabadell Nord, ${tr.first_year}–${tr.last_year}`, annual: tAvg.annual, trend: tr }}
      />

      {/* ── Intro + figures ──────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div data-reveal>
            <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />Introduction</span>
          </div>
          <p className="text-[26px] font-medium leading-[1.2] tracking-[-0.025em] text-fog-50 sm:text-[34px]" data-reveal>
            Physicist and meteorology student. I work with real atmospheric data,{" "}
            <span className="text-fog-500">test whether a signal is really there, and turn the result into tools other people can explore.</span>
          </p>
        </div>

        <dl className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {readouts.map((r) => (
            <div key={r.k} className="flex flex-col justify-between gap-8 rounded-2xl bg-ink-850 p-5 sm:p-6">
              <dt className="text-[13px] leading-snug text-fog-300">{r.k}</dt>
              <dd>
                <span className="text-[44px] font-bold leading-none tracking-[-0.04em] text-fog-50">{r.v}</span>
                <span className="ml-1.5 text-sm font-medium text-signal">{r.u}</span>
                <span className="mt-3 block font-mono text-[11px] text-fog-500">{r.s}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-[11px] text-fog-500">Live figures from the VO-evolution dataset (Meteocat stations). Trend: Sen&apos;s slope, Mann-Kendall test.</p>
      </Container>

      {/* ── Featured project ─────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="01" kicker="Featured project" title="Three decades of" muted="local weather">
          <p>{featured.summary}</p>
        </SectionHeader>
        <Link href={`/projects/${featured.slug}/`} className="group relative block overflow-hidden rounded-[28px] bg-fog-50 p-6 text-white sm:p-10" data-reveal>
          <div className="grid-bg absolute inset-0 opacity-[0.07]" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">{featured.kicker} · {featured.year}</p>
              <p className="display mt-6 text-[48px] text-white sm:text-[84px]">VO&#8209;evolution</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {featured.tags.map((t) => <span key={t} className="rounded-full border border-white/20 px-3 py-1 text-[12px] text-white/80">{t}</span>)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm">
              {[["Stations", "3"], ["Longest record", "1996–2026"], ["Notebooks", "7"], ["Models compared", "4"]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-white/50">{k}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <span className="relative mt-10 inline-flex items-center gap-3 rounded-full bg-signal px-5 py-3 text-sm font-medium transition-colors group-hover:bg-white group-hover:text-fog-50">
            Open the interactive analysis <span aria-hidden>→</span>
          </span>
        </Link>
      </Container>

      {/* ── Selected work ───────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="02" kicker="Selected work" title="Research, applications" muted="and infrastructure">
          <p>I analyse data, but I also build the tools and systems around it.</p>
        </SectionHeader>
        <ul className="border-t border-ink-600">
          {work.map((item, i) => (
            <li key={item.href} data-reveal>
              <Link href={item.href} className="group grid gap-4 border-b border-ink-600 py-8 sm:grid-cols-[90px_1fr_auto] sm:items-start sm:gap-8 sm:py-10">
                <span className="flex items-center gap-2 font-mono text-[12px] text-fog-400"><span className="h-1.5 w-1.5 rounded-full bg-warm" aria-hidden />{String(i + 1).padStart(3, "0")}</span>
                <div>
                  <p className="text-[24px] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-fog-50 transition-colors group-hover:text-signal sm:text-[34px]">{item.title}</p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog-400">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{item.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
                </div>
                <span className="hidden h-12 w-12 place-items-center rounded-full border border-ink-600 text-lg text-fog-50 transition-all group-hover:border-signal group-hover:bg-signal group-hover:text-white sm:grid" aria-hidden>↗</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── Approach ─────────────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <SectionHeader index="03" kicker="How I work" title="Questions first," muted="then the tools" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {c.principles.map((p, i) => (
            <div key={p.title} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <span className="font-mono text-[12px] text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-10 text-xl font-semibold tracking-tight text-fog-50">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog-400">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* ── Now + CTA ────────────────────────────────────── */}
      <Container as="section" className="pt-24 sm:pt-32">
        <div className="grid gap-10 rounded-[28px] bg-ink-850 p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="pill"><span className="h-1.5 w-1.5 rounded-full bg-rain" aria-hidden />Currently exploring</span>
            <ul className="mt-8 space-y-4" data-reveal>
              {c.exploring.map((e) => (
                <li key={e} className="flex gap-4 text-lg text-fog-100"><span className="mt-[13px] h-px w-6 shrink-0 bg-signal" aria-hidden />{e}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-8 rounded-2xl bg-signal p-6 text-white sm:p-8">
            <p className="display text-[52px] sm:text-[72px]">Let&apos;s<br />talk</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-xs text-sm text-white/80">Open to roles and collaborations in meteorology, climate data, Earth observation and renewable energy.</p>
              <Link href="/contact/" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-fog-50 transition-transform hover:-translate-y-0.5">Contact <span aria-hidden>↗</span></Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
