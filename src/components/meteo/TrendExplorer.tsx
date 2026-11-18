"use client";

import { useState } from "react";
import { scaleLinear } from "d3-scale";
import { line, area, curveMonotoneX } from "d3-shape";
import { stations, stationsData, type StationId, type Trend } from "@/lib/meteo";
import type { Dict } from "@/i18n/en";

type TL = Dict["charts"]["trend"];
import { fmtSigned, fmtP } from "@/lib/format";
import { useMeasure } from "@/components/charts/useMeasure";

type MetricId = "t_avg" | "t_max" | "t_min" | "rain" | "hot_days" | "tropical_nights" | "frost_days";

const METRICS: { id: MetricId; label: string; unit: string; kind: "var" | "index"; decimals: number }[] = [
  { id: "t_avg", label: "T mean", unit: "°C", kind: "var", decimals: 2 },
  { id: "t_max", label: "T max", unit: "°C", kind: "var", decimals: 2 },
  { id: "t_min", label: "T min", unit: "°C", kind: "var", decimals: 2 },
  { id: "rain", label: "Rain", unit: "mm", kind: "var", decimals: 0 },
  { id: "hot_days", label: "Hot days", unit: "days", kind: "index", decimals: 1 },
  { id: "tropical_nights", label: "Trop. nights", unit: "days", kind: "index", decimals: 1 },
  { id: "frost_days", label: "Frost days", unit: "days", kind: "index", decimals: 1 },
];

function get(sid: StationId, mid: MetricId): { annual: [number, number | null][]; trend: Trend | null } | null {
  const st = stationsData[sid];
  const metric = METRICS.find((m) => m.id === mid)!;
  if (metric.kind === "var") return (st.variables as Record<string, { annual: [number, number | null][]; trend: Trend | null }>)[mid] ?? null;
  return (st.indices as Record<string, { annual: [number, number | null][]; trend: Trend | null }>)[mid] ?? null;
}

/** Colour encodes direction (warm = increase, cool = decrease); opacity encodes significance. */
function cellStyle(t: Trend | null) {
  if (!t) return { background: "transparent" };
  const up = t.sen_slope_per_decade > 0;
  const zero = t.sen_slope_per_decade === 0;
  const color = zero ? "var(--color-fog-500)" : up ? "var(--color-warm)" : "var(--color-cool)";
  const strength = t.significant_05 ? 0.28 : 0.07;
  return { background: `color-mix(in oklab, ${color} ${strength * 100}%, transparent)`, color: t.significant_05 ? "var(--color-fog-50)" : "var(--color-fog-300)", "--dot": color } as React.CSSProperties;
}

export function TrendExplorer({ labels: L }: { labels: Dict["charts"] }) {
  const T = L.trend;
  const mLabel = (id: MetricId) => T.metrics[id];
  const [sel, setSel] = useState<{ sid: StationId; mid: MetricId }>({ sid: "sbd-nord", mid: "t_avg" });
  const data = get(sel.sid, sel.mid);
  const metric = METRICS.find((m) => m.id === sel.mid)!;
  const station = stations.find((s) => s.id === sel.sid)!;

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink-600 bg-ink-850 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      {/* Matrix */}
      <div className="border-b border-ink-600 p-4 sm:p-5 xl:border-b-0 xl:border-r">
        <p className="label mb-4">{T.matrixLabel}</p>
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[520px] border-collapse font-mono text-[11.5px]">
            <thead>
              <tr>
                <th className="pb-2 pr-2 text-left font-normal text-fog-500" scope="col"><span className="sr-only">{T.station}</span></th>
                {METRICS.map((mm) => (
                  <th key={mm.id} scope="col" className="pb-2 text-center font-normal leading-tight text-fog-400">{mLabel(mm.id)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stations.map((s) => (
                <tr key={s.id}>
                  <th scope="row" className="whitespace-nowrap py-0.5 pr-3 text-left font-normal text-fog-300">
                    <span className="mr-2 inline-block h-2 w-2" style={{ background: s.color }} aria-hidden />
                    {s.short}
                  </th>
                  {METRICS.map((mm) => {
                    const d = get(s.id, mm.id);
                    const t = d?.trend ?? null;
                    const selected = sel.sid === s.id && sel.mid === mm.id;
                    return (
                      <td key={mm.id} className="p-0.5">
                        <button
                          type="button"
                          disabled={!t}
                          onClick={() => setSel({ sid: s.id, mid: mm.id })}
                          aria-pressed={selected}
                          aria-label={t ? `${s.short}, ${mLabel(mm.id)}: ${fmtSigned(t.sen_slope_per_decade, mm.decimals)} ${mm.unit === "days" ? T.days : mm.unit} ${T.perDecade}, ${fmtP(t.p_value)}` : `${s.short}, ${mLabel(mm.id)}: ${T.notMeasured}`}
                          className={`relative flex h-11 w-full items-center justify-center border transition-colors disabled:cursor-default ${selected ? "border-fog-50" : "border-ink-700 hover:border-fog-400"}`}
                          style={cellStyle(t)}
                        >
                          {t ? fmtSigned(t.sen_slope_per_decade, mm.kind === "index" ? 1 : mm.id === "rain" ? 0 : 2) : <span className="text-fog-500">—</span>}
                          {t?.significant_05 && <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full" style={{ background: "var(--dot)" }} aria-hidden />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10.5px] text-fog-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warm/40" /> {T.increase}</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-cool/40" /> {T.decrease}</span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-fog-100" /> {T.sig}</span>
        </div>
      </div>

      {/* Detail */}
      <div className="p-4 sm:p-5">
        {data?.trend ? (
          <TrendDetail
            key={`${sel.sid}-${sel.mid}`}
            annual={data.annual}
            trend={data.trend}
            color={station.color}
            title={`${station.short} · ${metric.kind === "var" ? L.variables[sel.mid][0] : T.indices[sel.mid][0]}`}
            subtitle={metric.kind === "index" ? T.indices[sel.mid][1] : metric.id === "rain" ? T.rainSub : T.meanSub}
            labels={T}
            unit={metric.unit}
            decimals={metric.decimals}
          />
        ) : (
          <p className="text-fog-400">{T.noTrend}</p>
        )}
      </div>
    </div>
  );
}

function TrendDetail({ annual, trend, color, title, subtitle, unit, decimals, labels: T }: { annual: [number, number | null][]; trend: Trend; color: string; title: string; subtitle: string; unit: string; decimals: number; labels: TL }) {
  const u = unit === "days" ? T.days : unit;
  const [ref, width] = useMeasure<HTMLDivElement>(520);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const H = 240;
  const m = { t: 14, r: 12, b: 26, l: 40 };
  const pts = annual.filter((d): d is [number, number] => d[1] !== null && d[0] >= trend.first_year && d[0] <= trend.last_year);
  const x = scaleLinear().domain([trend.first_year - 0.5, trend.last_year + 0.5]).range([m.l, width - m.r]);
  const vals = pts.map((p) => p[1]);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo) * 0.15 || 1;
  const y = scaleLinear().domain([unit === "days" || unit === "mm" ? Math.max(0, lo - pad) : lo - pad, hi + pad]).range([H - m.b, m.t]).nice();

  // Sen's line and its CI fan, anchored at the median point (Theil-Sen convention for the band).
  const slope = trend.sen_slope_per_decade / 10;
  const senAt = (yr: number) => trend.sen_intercept + slope * (yr - trend.first_year);
  const midYr = (trend.first_year + trend.last_year) / 2;
  const [cl, cu] = trend.sen_ci_per_decade.map((v) => v / 10);
  const band = [trend.first_year, trend.last_year].flatMap((yr) => [yr]).map((yr) => yr);
  const bandArea = area<number>()
    .x((yr) => x(yr))
    .y0((yr) => y(senAt(midYr) + Math.min(cl * (yr - midYr), cu * (yr - midYr))))
    .y1((yr) => y(senAt(midYr) + Math.max(cl * (yr - midYr), cu * (yr - midYr))));
  const bandYears = Array.from({ length: 21 }, (_, i) => band[0] + ((band[1] - band[0]) * i) / 20);

  const loessPath = line<[number, number]>().x((d) => x(d[0])).y((d) => y(d[1])).curve(curveMonotoneX)(trend.loess) ?? "";
  const total = slope * (trend.last_year - trend.first_year);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="font-semibold text-fog-50">{title}</h3>
          <p className="text-sm text-fog-400">{subtitle} · {trend.first_year}–{trend.last_year}</p>
        </div>
        <span className={`font-mono text-[11px] ${trend.significant_05 ? "text-signal" : "text-fog-400"}`}>
          {trend.significant_05 ? T.significant : T.notSignificant}
        </span>
      </div>

      <div ref={ref} className="relative mt-4">
        <svg width={width} height={H} role="img" aria-label={`${title}: annual values with LOESS curve and Sen's slope`} className="block">
          {y.ticks(5).map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-ink-700)" />
              <text x={m.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t}</text>
            </g>
          ))}
          {x.ticks(width < 500 ? 4 : 7).filter((t) => Number.isInteger(t)).map((t) => (
            <text key={t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t}</text>
          ))}
          <path d={bandArea(bandYears) ?? ""} fill="var(--color-fog-400)" fillOpacity={0.07} />
          <line x1={x(trend.first_year)} x2={x(trend.last_year)} y1={y(senAt(trend.first_year))} y2={y(senAt(trend.last_year))} stroke="var(--color-fog-300)" strokeDasharray="4 4" />
          <path d={loessPath} fill="none" stroke={color} strokeWidth={2} />
          {pts.map(([yr, v]) => (
            <circle
              key={yr}
              cx={x(yr)}
              cy={y(v)}
              r={hover?.[0] === yr ? 5 : 3}
              fill={hover?.[0] === yr ? color : "var(--color-ink-900)"}
              stroke={color}
              strokeWidth={1.4}
              onPointerEnter={() => setHover([yr, v])}
              onPointerLeave={() => setHover(null)}
              tabIndex={0}
              onFocus={() => setHover([yr, v])}
              onBlur={() => setHover(null)}
              aria-label={`${yr}: ${v.toFixed(decimals)} ${u}`}
              style={{ transition: "r .15s" }}
            />
          ))}
        </svg>
        {hover && (
          <div className="pointer-events-none absolute top-0 border border-ink-600 bg-ink-850 px-2 py-1 font-mono text-[11px]" style={{ left: Math.min(x(hover[0]) + 10, width - 120) }}>
            <span className="text-fog-400">{hover[0]}</span> <span className="text-fog-50">{hover[1].toFixed(decimals)} {u}</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] text-fog-400">
        <span><span style={{ color }}>●</span> {T.annualValue}</span>
        <span><span style={{ color }}>━</span> {T.loess}</span>
        <span>┄ {T.senLegend}</span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { k: T.senSlope, v: `${fmtSigned(trend.sen_slope_per_decade, decimals)}`, u: `${u} ${T.perDecade}` },
          { k: T.ci, v: `${fmtSigned(trend.sen_ci_per_decade[0], decimals)} … ${fmtSigned(trend.sen_ci_per_decade[1], decimals)}`, u: `${u} ${T.perDecade}` },
          { k: T.tau, v: trend.tau.toFixed(3), u: fmtP(trend.p_value) },
          { k: T.change, v: fmtSigned(total, decimals), u: `${u} · n = ${trend.n_years} ${T.yrs}` },
        ].map((s) => (
          <div key={s.k} className="rounded-xl bg-ink-900 p-3">
            <dt className="label">{s.k}</dt>
            <dd className="mt-1.5 font-mono text-[15px] text-fog-50">{s.v}<span className="block text-[10.5px] text-fog-500">{s.u}</span></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
