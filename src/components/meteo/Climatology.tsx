"use client";

import { useState } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { stations, stationsData, type VariableId } from "@/lib/meteo";
import type { Dict } from "@/i18n/en";
import { useMeasure, Segmented } from "@/components/charts/useMeasure";

/** Mean seasonal cycle: monthly temperature lines or monthly precipitation bars. */
export function Climatology({ labels: L }: { labels: Dict["charts"] }) {
  const MONTHS = L.months;
  const C = L.climatology;
  const [mode, setMode] = useState<"temp" | "rain">("temp");
  const [ref, width] = useMeasure<HTMLDivElement>(560);
  const [hover, setHover] = useState<number | null>(null);
  const H = 240;
  const m = { t: 14, r: 10, b: 24, l: 36 };
  const x = scaleBand<number>().domain([...Array(12).keys()]).range([m.l, width - m.r]).padding(0.25);
  const vid: VariableId = mode === "temp" ? "t_avg" : "rain";
  const rows = stations.map((s) => ({ s, vals: stationsData[s.id].variables[vid]?.climatology ?? [] }));
  const all = rows.flatMap((r) => r.vals.filter((v): v is number => v !== null));
  const y = scaleLinear()
    .domain(mode === "rain" ? [0, Math.max(...all) * 1.1] : [Math.min(...all) - 2, Math.max(...all) + 2])
    .range([H - m.b, m.t])
    .nice();
  const bw = x.bandwidth() / rows.length;
  const cx = (i: number) => (x(i) ?? 0) + x.bandwidth() / 2;

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-850 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-fog-50">{C.title}</h3>
          <p className="text-sm text-fog-400">{mode === "temp" ? C.tempSub : C.rainSub} · {C.fullRecord}</p>
        </div>
        <Segmented label={C.title} size="sm" value={mode} onChange={setMode} options={[{ value: "temp", label: C.temp }, { value: "rain", label: C.rain }]} />
      </div>
      <div ref={ref} className="relative mt-4">
        <svg width={width} height={H} role="img" aria-label={`${C.title}: ${mode === "temp" ? C.temp : C.rain}`} className="block" onPointerLeave={() => setHover(null)}>
          {y.ticks(5).map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-ink-700)" />
              <text x={m.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t}</text>
            </g>
          ))}
          {MONTHS.map((mo, i) => (
            <g key={mo}>
              <rect x={cx(i) - x.step() / 2} y={m.t} width={x.step()} height={H - m.t - m.b} fill={hover === i ? "var(--color-ink-800)" : "transparent"} onPointerEnter={() => setHover(i)} />
              <text x={cx(i)} y={H - 7} textAnchor="middle" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{width < 480 ? mo[0] : mo}</text>
            </g>
          ))}
          {mode === "rain"
            ? rows.map((r, k) =>
                r.vals.map((v, i) =>
                  v === null ? null : (
                    <rect key={`${r.s.id}-${i}`} x={(x(i) ?? 0) + k * bw} y={y(v)} width={Math.max(1, bw - 1)} height={y(0) - y(v)} fill={r.s.color} fillOpacity={hover === null || hover === i ? 0.85 : 0.35} pointerEvents="none" />
                  ),
                ),
              )
            : rows.map((r) => (
                <g key={r.s.id} pointerEvents="none">
                  <path d={line<number | null>().defined((v) => v !== null).x((_, i) => cx(i)).y((v) => y(v as number)).curve(curveMonotoneX)(r.vals) ?? ""} fill="none" stroke={r.s.color} strokeWidth={2} />
                  {r.vals.map((v, i) => (v === null ? null : <circle key={i} cx={cx(i)} cy={y(v)} r={hover === i ? 4 : 2.5} fill={r.s.color} />))}
                </g>
              ))}
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute top-0 border border-ink-600 bg-ink-850 px-3 py-2 font-mono text-[11px]" style={{ left: Math.min(cx(hover) + 14, width - 170) }}>
            <p className="mb-1 text-fog-400">{MONTHS[hover]}</p>
            {rows.map((r) => {
              const v = r.vals[hover];
              return (
                <p key={r.s.id} className="flex justify-between gap-4">
                  <span style={{ color: r.s.color }}>{r.s.short}</span>
                  <span className="text-fog-50">{v === null || v === undefined ? "—" : `${v.toFixed(mode === "temp" ? 1 : 0)} ${mode === "temp" ? "°C" : "mm"}`}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
