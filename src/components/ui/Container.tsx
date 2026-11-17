import type { ReactNode } from "react";

export function Container({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "header" | "article" }) {
  return <Tag className={`mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</Tag>;
}

/** Numbered section heading in the "instrument panel" style. */
export function SectionHeader({ index, title, kicker, children }: { index?: string; title: string; kicker?: string; children?: ReactNode }) {
  return (
    <div className="mb-10 grid gap-4 md:grid-cols-[180px_1fr] md:gap-10" data-reveal>
      <div className="flex items-baseline gap-3 md:block">
        {index && <span className="font-mono text-[11px] text-signal">{index}</span>}
        {kicker && <p className="label md:mt-2">{kicker}</p>}
      </div>
      <div>
        <h2 className="max-w-3xl text-2xl font-medium tracking-tight text-fog-50 sm:text-[28px] sm:leading-tight">{title}</h2>
        {children && <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fog-300">{children}</div>}
      </div>
    </div>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "signal" | "warm" }) {
  const tones = {
    default: "border-ink-600 text-fog-300",
    signal: "border-signal-dim text-signal",
    warm: "border-warm/40 text-warm",
  } as const;
  return <span className={`inline-flex items-center border px-2 py-0.5 font-mono text-[11px] ${tones[tone]}`}>{children}</span>;
}

/** Visible placeholder for content David still has to provide. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 border border-dashed border-warm/50 px-2 py-0.5 font-mono text-[12px] text-warm">
      <span aria-hidden>◌</span>
      {children}
    </span>
  );
}
