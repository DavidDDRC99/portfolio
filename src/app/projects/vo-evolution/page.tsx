import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeader, Tag } from "@/components/ui/Container";
import { StationMap } from "@/components/meteo/StationMap";
import { TimeSeriesExplorer } from "@/components/meteo/TimeSeriesExplorer";
import { Climatology } from "@/components/meteo/Climatology";
import { TrendExplorer } from "@/components/meteo/TrendExplorer";
import { DiurnalProblem, ModelComparison } from "@/components/meteo/MachineLearning";
import { stationsData, stationById, mlResults } from "@/lib/meteo";
import { fmtSigned, fmtP } from "@/lib/format";
import { getContent } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Vallès Occidental climate analysis",
  description:
    "Interactive analysis of three Meteocat weather stations in the Vallès Occidental (1996–2026): trends with Mann-Kendall and Sen's slope, LOESS, seasonal cycles and an ML model that downscales daily temperature to 30-minute curves.",
  alternates: { canonical: "/projects/vo-evolution/" },
};

const SUBNAV = [
  ["overview", "Overview"],
  ["stations", "Stations"],
  ["data", "Data"],
  ["trends", "Trends"],
  ["ml", "Machine learning"],
  ["method", "Method"],
  ["stack", "Stack"],
] as const;

export default function VOEvolutionPage() {
  const project = getContent().projects.find((p) => p.slug === "vo-evolution")!;
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
      {/* ── Header ───────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-ink-700">
        <div className="grid-bg absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_20%,black,transparent_70%)]" />
        <Container className="pb-14 pt-16 sm:pt-24">
          <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
            <Link href="/projects/" className="hover:text-signal">Projects</Link> <span aria-hidden>/</span> <span className="text-fog-300">VO-evolution</span>
          </nav>
          <p className="label mb-4" data-reveal>{project.kicker}</p>
          <h1 className="max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.02em] text-fog-50 sm:text-5xl lg:text-6xl" data-reveal>
            Three decades of weather in the Vallès Occidental
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300" data-reveal>
            What has actually changed in the local climate around Sabadell and Vacarisses? An end-to-end analysis of Meteocat observations, from raw downloads to trend tests and a neural network that reconstructs the daily temperature curve.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3" data-reveal>
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-fog-50 px-4 py-2.5 text-sm font-medium text-ink-900 hover:bg-signal">
              View repository ↗
            </a>
            <div className="flex flex-wrap gap-1.5">{project.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
          </div>
          <dl className="mt-12 grid grid-cols-2 border-l border-t border-ink-600 md:grid-cols-4" data-reveal>
            {[
              ["Stations", "3", "Sabadell ×2, Vacarisses"],
              ["Longest record", `${vac.period[0].slice(0, 4)}–${vac.period[1].slice(0, 4)}`, "Vacarisses · 30-min"],
              ["Daily observations", (nord.n_days_calendar + centre.n_days_calendar + vac.n_days_calendar).toLocaleString("en-GB"), "calendar days, all stations"],
              ["Best ML RMSE", `${mlp.rmse.toFixed(2)} °C`, "30-min curve from daily data"],
            ].map(([k, v, s]) => (
              <div key={k} className="border-b border-r border-ink-600 p-4">
                <dt className="label">{k}</dt>
                <dd className="mt-2 font-mono text-xl text-fog-50 sm:text-2xl">{v}<span className="mt-1 block font-sans text-xs text-fog-500">{s}</span></dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>

      {/* Sticky in-page navigation */}
      <nav aria-label="Sections" className="sticky top-14 z-30 border-b border-ink-700 bg-ink-900/90 backdrop-blur-md">
        <Container className="flex gap-1 overflow-x-auto py-2 font-mono text-[11.5px] [scrollbar-width:none]">
          {SUBNAV.map(([id, label], i) => (
            <a key={id} href={`#${id}`} className="shrink-0 px-2.5 py-1.5 text-fog-400 transition-colors hover:text-fog-50">
              <span className="text-fog-500">{String(i + 1).padStart(2, "0")}</span> {label}
            </a>
          ))}
        </Container>
      </nav>

      {/* ── 01 Overview ──────────────────────────────────── */}
      <Container as="section" className="scroll-mt-28 pt-20" >
        <div id="overview" className="scroll-mt-28" />
        <SectionHeader index="01" kicker="Overview" title="A local climate record, analysed from scratch">
          <p>
            The project downloads observations from three stations of the Servei Meteorològic de Catalunya, cleans and merges them, and studies them from several angles: precipitation regimes, day and night temperatures, drought (SPEI), correlations between variables, and statistical downscaling with machine learning.
          </p>
        </SectionHeader>
        <div className="grid gap-px bg-ink-600 md:ml-[220px] md:grid-cols-3">
          {[
            ["Question", "Is there a detectable trend in temperature, heat extremes and rainfall at station level over the last 15–30 years?"],
            ["Approach", "Quality-controlled daily and 30-min series, non-parametric trend tests, LOESS smoothing, and a comparison of ML models against a physical baseline."],
            ["Output", "Seven analysis notebooks, a reusable statistics module with unit tests, a Dash dashboard, and this interactive page."],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink-900 p-5" data-reveal>
              <p className="label">{k}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-fog-200">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* ── 02 Stations ──────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="stations" className="scroll-mt-28" />
        <SectionHeader index="02" kicker="Geographical context" title="Two towns, three stations, different records">
          <p>
            Sabadell Nord sits at the agricultural park on the edge of the city; Sabadell Centre is an urban site with daily data only; Vacarisses, 343 m up on the western side of the comarca, has the longest record. Select a station to see its record and how complete each variable is.
          </p>
        </SectionHeader>
        <div data-reveal><StationMap /></div>
      </Container>

      {/* ── 03 Data ──────────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="data" className="scroll-mt-28" />
        <SectionHeader index="03" kicker="Data exploration" title="Explore the series">
          <p>Choose a variable, compare stations and zoom into any period. Values are aggregated from the cleaned daily files in the repository.</p>
        </SectionHeader>
        <div className="space-y-6">
          <div data-reveal><TimeSeriesExplorer /></div>
          <div data-reveal><Climatology /></div>
        </div>
      </Container>

      {/* ── 04 Trends ────────────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="trends" className="scroll-mt-28" />
        <SectionHeader index="04" kicker="Trend analysis" title="What the trend tests say, and what they don't">
          <p>
            Each cell is a Theil–Sen slope on the annual series; the dot marks a Mann-Kendall p-value below 0.05. Select one to see the series, its LOESS curve and the slope confidence interval.
          </p>
        </SectionHeader>
        <div data-reveal><TrendExplorer /></div>

        <div className="mt-10 grid gap-8 md:ml-[220px] md:grid-cols-2" data-reveal>
          <div>
            <p className="label mb-3">Reading the results</p>
            <ul className="space-y-3 text-[15px] leading-relaxed text-fog-200">
              <li>
                Both Sabadell stations show a warming of mean temperature of about {fmtSigned(tN.sen_slope_per_decade, 1)} °C per decade ({stationById["sbd-nord"].short}, {fmtP(tN.p_value)}) and {fmtSigned(tC.sen_slope_per_decade, 1)} °C ({stationById["sbd-centre"].short}, {fmtP(tC.p_value)}) over {tN.first_year}–{tN.last_year}.
              </li>
              <li>
                At Vacarisses, over a longer {tVmin.first_year}–{tVmin.last_year} window, only the minimum temperature trend is significant ({fmtSigned(tVmin.sen_slope_per_decade, 2)} °C/decade, {fmtP(tVmin.p_value)}); mean ({fmtP(tVavg.p_value)}) and maximum ({fmtP(tVmax.p_value)}) are not.
              </li>
              <li>
                Tropical nights increase at the urban Sabadell Centre site ({fmtSigned(tnC.sen_slope_per_decade, 1)} per decade, {fmtP(tnC.p_value)}) but the trend at Sabadell Nord does not reach significance ({fmtP(tnN.p_value)}).
              </li>
              <li>
                {rainSig.length === 0 ? "No station shows a significant trend in annual precipitation: year-to-year variability is far larger than any drift over these record lengths." : `A significant precipitation trend appears at ${rainSig.join(", ")}.`}
              </li>
            </ul>
          </div>
          <div>
            <p className="label mb-3">Limitations</p>
            <ul className="space-y-3 text-[15px] leading-relaxed text-fog-400">
              <li>The Sabadell records cover 15–17 complete years, so slopes are sensitive to the first and last years. They describe this period, not a long-term climate trend.</li>
              <li>The Mann-Kendall test used here does not correct for serial autocorrelation, which can overstate significance.</li>
              <li>Station siting matters: an urban site and a peri-urban site in the same town are not directly comparable.</li>
              <li>Figures on this page are recomputed from annual aggregates (years with ≥ 90 % daily coverage). The notebooks also include seasonal Mann-Kendall, Pettitt change-point tests and SPEI drought indices.</li>
            </ul>
          </div>
        </div>
      </Container>

      {/* ── 05 Machine learning ──────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="ml" className="scroll-mt-28" />
        <SectionHeader index="05" kicker="Machine learning" title="Reconstructing a day's temperature curve from daily data">
          <p>
            Sabadell Centre only reports daily values. The aim was to estimate its 30-minute temperature curve using a model trained where both resolutions exist. The task: {mlResults.task.toLowerCase()}.
          </p>
        </SectionHeader>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div data-reveal><DiurnalProblem /></div>
          <div data-reveal><ModelComparison /></div>
        </div>
        <div className="mt-8 grid gap-8 md:ml-[220px] md:grid-cols-2" data-reveal>
          <div className="text-[15px] leading-relaxed text-fog-200">
            <p>
              The baseline is physical: a sinusoid whose amplitude and phase are fitted to each real day, which is already an optimistic reference. The MLP improves on it from {sin.rmse.toFixed(2)} to {mlp.rmse.toFixed(2)} °C RMSE without seeing the day&apos;s curve, using a strictly temporal split so no future information leaks into training.
            </p>
            <p className="mt-4 text-fog-400">{mlResults.transfer}</p>
          </div>
          <div>
            <p className="label mb-3">Features ({mlResults.features.length})</p>
            <div className="flex flex-wrap gap-1.5">{mlResults.features.map((f) => <Tag key={f}>{f}</Tag>)}</div>
            <p className="mt-4 font-mono text-[10.5px] text-fog-500">Train {mlResults.split.train} · Test {mlResults.split.test} · 5-fold GridSearchCV on the training set.</p>
          </div>
        </div>
      </Container>

      {/* ── 06 Methodology ───────────────────────────────── */}
      <Container as="section" className="pt-24">
        <div id="method" className="scroll-mt-28" />
        <SectionHeader index="06" kicker="Methodology" title="From API calls to conclusions" />
        <ol className="grid border-l border-t border-ink-600 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Collect", "Download 30-min and daily observations from the Meteocat API, logging failed dates so gaps are known rather than silent."],
            ["Clean", "Merge, deduplicate and type the series; build daily aggregates; keep gaps explicit instead of interpolating."],
            ["Explore", "Seasonal cycles, hourly rainfall patterns, intensity distributions, and Pearson/Spearman correlations between variables."],
            ["Test", "Mann-Kendall, Sen's slope, Pettitt change-point and seasonal Mann-Kendall, implemented in a reusable module with pytest tests."],
            ["Model", "Feature engineering, temporal train/test split, grid-searched KNN, Random Forest and MLP against a sinusoidal baseline."],
            ["Communicate", "A Dash dashboard for rain, temperature and wind, and this page for a public overview."],
          ].map(([k, v], i) => (
            <li key={k} className="border-b border-r border-ink-600 p-6" data-reveal>
              <div className="flex items-baseline justify-between">
                <h3 className="text-fog-50">{k}</h3>
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
        <SectionHeader index="07" kicker="Technical implementation" title="Tools and repository" />
        <div className="grid gap-px bg-ink-600 md:grid-cols-[1fr_1fr_1.2fr]">
          {[
            ["Analysis", ["Python 3.10+", "Pandas · NumPy", "SciPy", "Matplotlib", "Jupyter"]],
            ["Modelling & testing", ["scikit-learn", "GridSearchCV", "spei (drought indices)", "pytest"]],
            ["Delivery", ["Dash · Plotly dashboard", "This page: Next.js, D3 scales, Leaflet", "Data build script: Pandas + statsmodels LOESS"]],
          ].map(([k, items]) => (
            <div key={k as string} className="bg-ink-900 p-6" data-reveal>
              <p className="label mb-3">{k as string}</p>
              <ul className="space-y-1.5 text-fog-200">{(items as string[]).map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 flex flex-col justify-between gap-4 border border-ink-600 p-6 transition-colors hover:border-signal-dim sm:flex-row sm:items-center"
          data-reveal
        >
          <div>
            <p className="label">Repository</p>
            <p className="mt-2 font-mono text-fog-50">github.com/DavidDDRC99/VO-evolution</p>
            <p className="mt-1 text-sm text-fog-400">Notebooks, scripts, dashboard and tests. Documentation in Catalan.</p>
          </div>
          <span className="text-signal transition-transform group-hover:translate-x-1">Open on GitHub ↗</span>
        </a>
        <p className="mt-6 font-mono text-[10.5px] text-fog-500">Data: Servei Meteorològic de Catalunya (Meteocat), open data. Station coordinates for XF and D2 from Meteocat station metadata.</p>
      </Container>
    </article>
  );
}
