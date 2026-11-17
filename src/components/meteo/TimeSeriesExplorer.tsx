"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { scaleLinear, scaleUtc } from "d3-scale";
import { line, area, curveMonotoneX } from "d3-shape";
import { bisector, extent } from "d3-array";
import { stations, stationsData, variables, variableById, type StationId, type VariableId } from "@/lib/meteo";
import { MONTHS, fmtNum } from "@/lib/format";
import { useMeasure, Segmented } from "@/components/charts/useMeasure";

type Resolution = "monthly" | "annual";
type Point = { t: number; v: number | null };

const MS_YEAR = 365.25 * 24 * 3600 * 1000;

function parse(resolution: Resolution, sid: StationId, vid: VariableId): Point[] {
  const v = stationsData[sid].variables[vid];
  if (!v) return [];
  if (resolution === "monthly") {
    return v.monthly.map(([d, val]) => {
      const [y, m] = d.split("-").map(Number);
      return { t: Date.UTC(y, m - 1, 15), v: val };
    });
  }
  return v.annual.map(([y, val]) => ({ t: Date.UTC(y, 6, 1), v: val }));
}

/** Split a series at nulls so gaps in the record are drawn as gaps, not interpolated. */
function segments(points: Point[]) {
  const out: { t: number; v: number }[][] = [];
  let cur: { t: number; v: number }[] = [];
  for (const p of points) {
    if (p.v === null) {
      if (cur.length) out.push(cur);
      cur = [];
    } else cur.push({ t: p.t, v: p.v });
  }
  if (cur.length) out.push(cur);
  return out;
}

const bisectT = bisector<Point, number>((d) => d.t).center;

export function TimeSeriesExplorer() {
  const [variable, setVariable] = useState<VariableId>("t_avg");
  const [resolution, setResolution] = useState<Resolution>("monthly");
  const [active, setActive] = useState<StationId[]>(["sbd-nord", "vacarisses"]);
  const [hoverT, setHoverT] = useState<number | null>(null);
  const [wrapRef, width] = useMeasure<HTMLDivElement>();

  const meta = variableById[variable];
  const available = stations.filter((s) => stationsData[s.id].variables[variable]);
  const shown = active.filter((id) => stationsData[id].variables[variable]);

  const series = useMemo(
    () => shown.map((id) => ({ id, meta: stations.find((s) => s.id === id)!, points: parse(resolution, id, variable) })),
    [shown.join(","), resolution, variable], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Full extent across every station for this variable (stable brush domain).
  const fullDomain = useMemo(() => {
    const all = available.flatMap((s) => parse("monthly", s.id, variable).filter((p) => p.v !== null).map((p) => p.t));
    return extent(all) as [number, number];
  }, [variable]); // eslint-disable-line react-hooks/exhaustive-deps

  const [range, setRange] = useState<[number, number] | null>(null);
  const domain: [number, number] = range
    ? [Math.max(range[0], fullDomain[0]), Math.min(range[1], fullDomain[1])]
    : fullDomain;

  // ── Layout
  const H = width < 640 ? 260 : 340;
  const m = { t: 16, r: 16, b: 28, l: 44 };
  const x = scaleUtc().domain(domain).range([m.l, width - m.r]);

  const visibleVals = series.flatMap((s) => s.points.filter((p) => p.v !== null && p.t >= domain[0] && p.t <= domain[1]).map((p) => p.v as number));
  const [vmin, vmax] = visibleVals.length ? (extent(visibleVals) as [number, number]) : [0, 1];
  const pad = (vmax - vmin) * 0.08 || 1;
  const yMin = meta.agg === "sum" ? 0 : vmin - pad;
  const y = scaleLinear().domain([yMin, vmax + pad]).range([H - m.b, m.t]).nice();

  const lineGen = line<{ t: number; v: number }>().x((d) => x(d.t)).y((d) => y(d.v)).curve(curveMonotoneX);

  const onMove = useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const t = x.invert(e.clientX - rect.left + m.l).getTime();
      const ref = series[0]?.points;
      if (!ref?.length) return;
      setHoverT(ref[bisectT(ref, t)].t);
    },
    [series, x, m.l],
  );

  const hoverRows =
    hoverT !== null
      ? series.map((s) => {
          const p = s.points[bisectT(s.points, hoverT)];
          return { s, v: p && Math.abs(p.t - hoverT) < 40 * 864e5 ? p.v : null };
        })
      : [];
  const hoverLabel =
    hoverT !== null
      ? resolution === "monthly"
        ? `${MONTHS[new Date(hoverT).getUTCMonth()]} ${new Date(hoverT).getUTCFullYear()}`
        : `${new Date(hoverT).getUTCFullYear()}`
      : "";

  const toggle = (id: StationId) => setActive((cur) => (cur.includes(id) ? (cur.length > 1 ? cur.filter((c) => c !== id) : cur) : [...cur, id]));

  const years = useMemo(() => {
    const a = new Date(fullDomain[0]).getUTCFullYear();
    const b = new Date(fullDomain[1]).getUTCFullYear();
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }, [fullDomain]);
  const fromYear = new Date(domain[0]).getUTCFullYear();
  const toYear = new Date(domain[1]).getUTCFullYear();

  const xTicks = x.ticks(width < 640 ? 4 : 8);

  return (
    <div className="border border-ink-600">
      {/* Controls */}
      <div className="flex flex-col gap-4 border-b border-ink-600 p-4 sm:p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="label">Variable</span>
          <Segmented
            label="Variable"
            size="sm"
            value={variable}
            onChange={(v) => { setVariable(v); setHoverT(null); }}
            options={variables.map((v) => ({ value: v.id, label: v.short }))}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col gap-2">
            <span className="label">Resolution</span>
            <Segmented label="Resolution" size="sm" value={resolution} onChange={(r) => { setResolution(r); setHoverT(null); }} options={[{ value: "monthly", label: "Monthly" }, { value: "annual", label: "Annual" }]} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="label">Period</span>
            <div className="flex items-center gap-2 font-mono text-[12px]">
              <label className="sr-only" htmlFor="ts-from">From year</label>
              <select id="ts-from" value={fromYear} onChange={(e) => { const a = Date.UTC(+e.target.value, 0, 1); setRange([a, Math.max(domain[1], a + MS_YEAR)]); }} className="border border-ink-600 bg-ink-900 px-2 py-1.5 text-fog-100">
                {years.filter((yr) => yr < toYear).map((yr) => <option key={yr}>{yr}</option>)}
              </select>
              <span className="text-fog-500">→</span>
              <label className="sr-only" htmlFor="ts-to">To year</label>
              <select id="ts-to" value={toYear} onChange={(e) => { const b = Date.UTC(+e.target.value, 11, 31); setRange([Math.min(domain[0], b - MS_YEAR), b]); }} className="border border-ink-600 bg-ink-900 px-2 py-1.5 text-fog-100">
                {years.filter((yr) => yr > fromYear).map((yr) => <option key={yr}>{yr}</option>)}
              </select>
              <button type="button" onClick={() => setRange(null)} className="px-2 py-1.5 text-fog-400 hover:text-signal" disabled={!range}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Station legend / toggles */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-ink-600 px-4 py-3 sm:px-5">
        {stations.map((s) => {
          const has = !!stationsData[s.id].variables[variable];
          const on = shown.includes(s.id);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              disabled={!has}
              onClick={() => toggle(s.id)}
              title={has ? undefined : `${s.short} does not measure ${meta.label.toLowerCase()}`}
              className="flex items-center gap-2 text-[13px] text-fog-300 transition-opacity hover:text-fog-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <span className="inline-block h-[3px] w-5 transition-opacity" style={{ background: s.color, opacity: on ? 1 : 0.2 }} aria-hidden />
              <span className={on ? "text-fog-100" : "text-fog-500"}>{s.short}</span>
              {!has && <span className="font-mono text-[10px]">n/a</span>}
            </button>
          );
        })}
      </div>

      {/* Main chart */}
      <div ref={wrapRef} className="relative px-1 pt-3 sm:px-3">
        <svg width={width} height={H} role="img" aria-label={`${meta.label}, ${resolution} values, ${fromYear} to ${toYear}, for ${series.map((s) => s.meta.short).join(", ")}`} className="block">
          <defs>
            <clipPath id="ts-clip"><rect x={m.l} y={0} width={width - m.l - m.r} height={H} /></clipPath>
          </defs>
          {y.ticks(5).map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-ink-700)" />
              <text x={m.l - 8} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t}</text>
            </g>
          ))}
          <text x={m.l} y={10} fontSize={10} fill="var(--color-fog-400)" fontFamily="var(--font-mono)">{meta.unit}{resolution === "monthly" && meta.agg === "sum" ? " / month" : resolution === "annual" && meta.agg === "sum" ? " / year" : ""}</text>
          {xTicks.map((t) => (
            <text key={+t} x={x(t)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t.getUTCFullYear()}</text>
          ))}
          <g clipPath="url(#ts-clip)">
            {series.map((s) => (
              <g key={s.id}>
                {segments(s.points).map((seg, i) =>
                  seg.length === 1 ? (
                    <circle key={i} cx={x(seg[0].t)} cy={y(seg[0].v)} r={2} fill={s.meta.color} />
                  ) : (
                    <path key={i} className="chart-path" d={lineGen(seg) ?? ""} fill="none" stroke={s.meta.color} strokeWidth={resolution === "annual" ? 2 : 1.25} strokeOpacity={0.95} />
                  ),
                )}
                {resolution === "annual" &&
                  s.points.filter((p) => p.v !== null).map((p) => (
                    <circle key={p.t} className="chart-dot" cx={x(p.t)} cy={y(p.v as number)} r={2.5} fill="var(--color-ink-900)" stroke={s.meta.color} strokeWidth={1.2} />
                  ))}
              </g>
            ))}
            {hoverT !== null && (
              <g pointerEvents="none">
                <line x1={x(hoverT)} x2={x(hoverT)} y1={m.t} y2={H - m.b} stroke="var(--color-fog-400)" strokeDasharray="2 3" />
                {hoverRows.map(({ s, v }) => v !== null && <circle key={s.id} cx={x(hoverT)} cy={y(v)} r={4} fill={s.meta.color} stroke="var(--color-ink-900)" strokeWidth={2} />)}
              </g>
            )}
          </g>
          <rect
            x={m.l}
            y={m.t}
            width={Math.max(0, width - m.l - m.r)}
            height={H - m.t - m.b}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHoverT(null)}
            style={{ touchAction: "pan-y" }}
          />
        </svg>

        {hoverT !== null && (
          <div
            className="pointer-events-none absolute top-3 z-10 min-w-[150px] border border-ink-600 bg-ink-850/95 px-3 py-2 font-mono text-[11px] shadow-lg"
            style={{ left: Math.min(Math.max(x(hoverT) + 14, 8), width - 170) }}
            role="status"
          >
            <p className="mb-1 text-fog-400">{hoverLabel}</p>
            {hoverRows.map(({ s, v }) => (
              <p key={s.id} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2" style={{ background: s.meta.color }} />{s.meta.short}</span>
                <span className="text-fog-50">{v === null ? "no data" : `${fmtNum(v, meta.decimals)} ${meta.unit}`}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Overview + brush */}
      <Brush width={width} fullDomain={fullDomain} domain={domain} onChange={setRange} series={series.map((s) => ({ color: s.meta.color, points: parse("annual", s.id, variable) }))} />

      <p className="border-t border-ink-600 px-4 py-3 font-mono text-[10.5px] leading-relaxed text-fog-500 sm:px-5">
        Monthly values require ≥ 80 % of days, annual values ≥ 90 % of the calendar year; gaps in the record are shown as gaps.
        {meta.agg === "sum" ? " Precipitation is accumulated." : " Temperatures are means of daily values."} Drag on the overview to zoom.
      </p>
    </div>
  );
}

/* ───────────────────────── Brush ───────────────────────── */

function Brush({
  width,
  fullDomain,
  domain,
  onChange,
  series,
}: {
  width: number;
  fullDomain: [number, number];
  domain: [number, number];
  onChange: (r: [number, number] | null) => void;
  series: { color: string; points: Point[] }[];
}) {
  const H = 56;
  const m = { l: 44, r: 16, t: 6, b: 6 };
  const x = scaleUtc().domain(fullDomain).range([m.l, width - m.r]);
  const all = series.flatMap((s) => s.points.map((p) => p.v).filter((v): v is number => v !== null));
  const [a, b] = all.length ? (extent(all) as [number, number]) : [0, 1];
  const y = scaleLinear().domain([a, b]).range([H - m.b, m.t]);
  const drag = useRef<{ mode: "new" | "move"; start: number; d0: [number, number] } | null>(null);

  const toT = (clientX: number, el: Element) => {
    const rect = el.getBoundingClientRect();
    return Math.min(Math.max(x.invert(clientX - rect.left).getTime(), fullDomain[0]), fullDomain[1]);
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const t = toT(e.clientX, e.currentTarget);
    const inside = t > domain[0] && t < domain[1] && !(domain[0] === fullDomain[0] && domain[1] === fullDomain[1]);
    drag.current = { mode: inside ? "move" : "new", start: t, d0: domain };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMoveB = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const t = toT(e.clientX, e.currentTarget);
    const { mode, start, d0 } = drag.current;
    if (mode === "new") {
      if (Math.abs(t - start) < 864e5 * 60) return;
      onChange([Math.min(start, t), Math.max(start, t)]);
    } else {
      const span = d0[1] - d0[0];
      let n0 = d0[0] + (t - start);
      n0 = Math.min(Math.max(n0, fullDomain[0]), fullDomain[1] - span);
      onChange([n0, n0 + span]);
    }
  };
  const onUp = () => (drag.current = null);

  const areaGen = area<{ t: number; v: number }>().x((d) => x(d.t)).y0(H - m.b).y1((d) => y(d.v)).curve(curveMonotoneX);
  const full = domain[0] <= fullDomain[0] && domain[1] >= fullDomain[1];

  return (
    <div className="border-t border-ink-600 px-1 sm:px-3">
      <svg
        width={width}
        height={H}
        className="block cursor-crosshair select-none"
        onPointerDown={onDown}
        onPointerMove={onMoveB}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ touchAction: "none" }}
        aria-label="Overview of the full record. Drag to select a period."
        role="img"
      >
        {series.map((s, i) => (
          <g key={i}>
            {segments(s.points).map((seg, j) => (
              <path key={j} d={areaGen(seg) ?? ""} fill={s.color} fillOpacity={0.08} stroke={s.color} strokeOpacity={0.5} strokeWidth={1} />
            ))}
          </g>
        ))}
        {!full && (
          <>
            <rect x={m.l} y={0} width={Math.max(0, x(domain[0]) - m.l)} height={H} fill="var(--color-ink-900)" fillOpacity={0.75} />
            <rect x={x(domain[1])} y={0} width={Math.max(0, width - m.r - x(domain[1]))} height={H} fill="var(--color-ink-900)" fillOpacity={0.75} />
            <rect x={x(domain[0])} y={0.5} width={Math.max(1, x(domain[1]) - x(domain[0]))} height={H - 1} fill="none" stroke="var(--color-signal)" strokeWidth={1} className="cursor-grab" />
          </>
        )}
      </svg>
    </div>
  );
}
