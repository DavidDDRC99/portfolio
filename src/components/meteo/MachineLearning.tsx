"use client";

import { useState } from "react";
import { scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { diurnalData, mlResults } from "@/lib/meteo";
import { useMeasure, Segmented } from "@/components/charts/useMeasure";

type Season = keyof typeof diurnalData;

/** The ML problem made visible: daily aggregates in, a 48-slot curve out. */
export function DiurnalProblem() {
  const [season, setSeason] = useState<Season>("summer");
  const [ref, width] = useMeasure<HTMLDivElement>(560);
  const [hover, setHover] = useState<number | null>(null);
  const d = diurnalData[season];
  const H = 250;
  const m = { t: 14, r: 46, b: 26, l: 34 };
  const x = scaleLinear().domain([0, 47]).range([m.l, width - m.r]);
  const all = Object.values(diurnalData).flatMap((s) => s.curve);
  const y = scaleLinear().domain([Math.min(...all) - 1, Math.max(...all) + 1]).range([H - m.b, m.t]).nice();
  const path = line<number>().x((_, i) => x(i)).y((v) => y(v)).curve(curveMonotoneX)(d.curve) ?? "";
  const slotLabel = (i: number) => `${String(Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`;

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-850 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-fog-50">Input → target</h3>
          <p className="text-sm text-fog-400">Real 30-min observations at Sabadell Nord · {d.date} (UTC)</p>
        </div>
        <Segmented label="Example day" size="sm" value={season} onChange={(v) => { setSeason(v); setHover(null); }} options={(["winter", "spring", "summer", "autumn"] as Season[]).map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))} />
      </div>
      <div ref={ref} className="relative mt-4">
        <svg
          width={width}
          height={H}
          className="block"
          role="img"
          aria-label={`Temperature through the day on ${d.date}: minimum ${d.t_min} °C, maximum ${d.t_max} °C`}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const i = Math.round(x.invert(e.clientX - r.left));
            setHover(i >= 0 && i < 48 ? i : null);
          }}
          onPointerLeave={() => setHover(null)}
        >
          {y.ticks(5).map((t) => (
            <g key={t}>
              <line x1={m.l} x2={width - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-ink-700)" />
              <text x={m.l - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{t}°</text>
            </g>
          ))}
          {[0, 12, 24, 36, 47].map((i) => (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={10} fill="var(--color-fog-500)" fontFamily="var(--font-mono)">{slotLabel(i)}</text>
          ))}
          {/* Daily aggregates = model inputs */}
          {([["T max", d.t_max, "var(--color-warm)"], ["T mean", d.t_avg, "var(--color-fog-300)"], ["T min", d.t_min, "var(--color-cool)"]] as const).map(([lab, v, col]) => (
            <g key={lab}>
              <line x1={m.l} x2={width - m.r} y1={y(v)} y2={y(v)} stroke={col} strokeDasharray="3 4" strokeOpacity={0.7} style={{ transition: "all .5s" }} />
              <text x={width - m.r + 4} y={y(v) + 3} fontSize={9.5} fill={col} fontFamily="var(--font-mono)">{lab}</text>
            </g>
          ))}
          {/* Observed curve = model target */}
          <path className="chart-path" d={path} fill="none" stroke="var(--color-signal)" strokeWidth={2} />
          {d.curve.map((v, i) => <circle key={i} className="chart-dot" cx={x(i)} cy={y(v)} r={hover === i ? 4 : 1.6} fill="var(--color-signal)" />)}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={m.t} y2={H - m.b} stroke="var(--color-fog-500)" strokeDasharray="2 3" pointerEvents="none" />}
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute top-0 border border-ink-600 bg-ink-850 px-2 py-1 font-mono text-[11px]" style={{ left: Math.min(x(hover) + 10, width - 120) }}>
            <span className="text-fog-400">{slotLabel(hover)}</span> <span className="text-fog-50">{d.curve[hover].toFixed(1)} °C</span>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-fog-400">
        Dashed lines are what the model sees (daily aggregates, plus humidity, rain, pressure and calendar features). The cyan curve, 48 values per day, is what it has to reconstruct.
      </p>
    </div>
  );
}

export function ModelComparison() {
  const [metric, setMetric] = useState<"rmse" | "r2">("rmse");
  const models = mlResults.models;
  const vals = models.map((mm) => (metric === "rmse" ? mm.rmse : mm.r2));
  const lo = metric === "rmse" ? 1.0 : 0.95;
  const hi = metric === "rmse" ? 1.5 : 0.975;
  const pct = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const best = metric === "rmse" ? Math.min(...vals) : Math.max(...vals);

  return (
    <div className="rounded-2xl border border-ink-600 bg-ink-850 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-fog-50">Model comparison</h3>
          <p className="text-sm text-fog-400">Held-out test set · {mlResults.split.test}</p>
        </div>
        <Segmented label="Metric" size="sm" value={metric} onChange={setMetric} options={[{ value: "rmse", label: "RMSE °C" }, { value: "r2", label: "R²" }]} />
      </div>
      <ul className="mt-6 space-y-4">
        {models.map((mm) => {
          const v = metric === "rmse" ? mm.rmse : mm.r2;
          const isBest = v === best;
          return (
            <li key={mm.id}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4">
                <span className={isBest ? "text-fog-50" : "text-fog-300"}>
                  {mm.name}
                  {mm.id === "sin" && <span className="ml-2 font-mono text-[10px] text-fog-500">baseline</span>}
                </span>
                <span className={`font-mono text-[13px] ${isBest ? "text-signal" : "text-fog-200"}`}>{metric === "rmse" ? `${v.toFixed(3)} °C` : v.toFixed(4)}</span>
              </div>
              <div className="h-2 bg-ink-800">
                <div className="h-2 transition-[width] duration-700 ease-out" style={{ width: `${Math.max(2, pct(v))}%`, background: isBest ? "var(--color-signal)" : mm.id === "sin" ? "var(--color-fog-500)" : "var(--color-ink-500)" }} />
              </div>
              <p className="mt-1 font-mono text-[10.5px] text-fog-500">{mm.note}</p>
            </li>
          );
        })}
        {mlResults.skipped.map((s) => (
          <li key={s.name} className="border-t border-dashed border-ink-600 pt-3">
            <div className="flex justify-between gap-4"><span className="text-fog-400">{s.name}</span><span className="font-mono text-[12px] text-fog-500">not scored</span></div>
            <p className="mt-1 font-mono text-[10.5px] text-fog-500">{s.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 font-mono text-[10.5px] text-fog-500">
        Axis truncated to {metric === "rmse" ? "1.0–1.5 °C" : "0.950–0.975"} to make differences visible. {metric === "rmse" ? "Lower is better." : "Higher is better."}
      </p>
    </div>
  );
}
