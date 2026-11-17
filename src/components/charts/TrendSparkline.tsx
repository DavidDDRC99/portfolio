import { scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import type { Trend } from "@/lib/meteo";

/** Static (server-rendered) annual series + LOESS + Sen's slope. */
export function TrendSparkline({
  annual,
  trend,
  color = "var(--color-warm)",
  height = 160,
  unit = "°C",
  label,
}: {
  annual: [number, number | null][];
  trend: Trend;
  color?: string;
  height?: number;
  unit?: string;
  label: string;
}) {
  const W = 640;
  const H = height;
  const m = { t: 12, r: 44, b: 22, l: 8 };
  const pts = annual.filter((d): d is [number, number] => d[1] !== null);
  const x = scaleLinear().domain([trend.first_year, trend.last_year]).range([m.l, W - m.r]);
  const vals = pts.map((p) => p[1]);
  const pad = (Math.max(...vals) - Math.min(...vals)) * 0.2;
  const y = scaleLinear().domain([Math.min(...vals) - pad, Math.max(...vals) + pad]).range([H - m.b, m.t]);
  const loessPath = line<[number, number]>().x((d) => x(d[0])).y((d) => y(d[1])).curve(curveMonotoneX)(trend.loess) ?? "";
  // Sen's line: intercept is at index 0 of the gap-free series starting at first_year.
  const senAt = (yr: number) => trend.sen_intercept + (trend.sen_slope_per_decade / 10) * (yr - trend.first_year);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {y.ticks(4).map((t) => (
        <g key={t}>
          <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--color-ink-700)" strokeWidth={1} />
          <text x={W - m.r + 6} y={y(t) + 3} fill="var(--color-fog-500)" fontSize={10} fontFamily="var(--font-mono)">
            {t.toFixed(1)}{unit === "°C" ? "°" : ""}
          </text>
        </g>
      ))}
      {[trend.first_year, Math.round((trend.first_year + trend.last_year) / 2), trend.last_year].map((yr) => (
        <text key={yr} x={x(yr)} y={H - 6} fill="var(--color-fog-500)" fontSize={10} fontFamily="var(--font-mono)" textAnchor="middle">{yr}</text>
      ))}
      <line x1={x(trend.first_year)} x2={x(trend.last_year)} y1={y(senAt(trend.first_year))} y2={y(senAt(trend.last_year))} stroke="var(--color-fog-400)" strokeDasharray="3 4" strokeWidth={1} />
      <path d={loessPath} fill="none" stroke={color} strokeWidth={2} />
      {pts.map(([yr, v]) => (
        <circle key={yr} cx={x(yr)} cy={y(v)} r={2.6} fill="var(--color-ink-900)" stroke={color} strokeWidth={1.2} />
      ))}
    </svg>
  );
}
