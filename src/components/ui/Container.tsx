import type { ReactNode } from "react";

export function Container({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "header" | "article" }) {
  return <Tag className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</Tag>;
}

/**
 * Section heading in the editorial style: a pill eyebrow, a heavy title
 * (optionally with a muted second line) and a short lead on the right.
 */
export function SectionHeader({
  index,
  title,
  muted,
  kicker,
  children,
}: {
  index?: string;
  title: string;
  muted?: string;
  kicker?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16" data-reveal>
      <div>
        {(index || kicker) && (
          <span className="pill mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            {index && <span className="text-fog-500">{index}</span>}
            {kicker}
          </span>
        )}
        <h2 className="max-w-4xl text-[32px] font-bold leading-[1.02] tracking-[-0.035em] text-fog-50 sm:text-[44px] lg:text-[52px]">
          {title}
          {muted && <span className="block text-fog-500">{muted}</span>}
        </h2>
      </div>
      {children && <div className="max-w-md text-[15px] leading-relaxed text-fog-300 lg:justify-self-end lg:pb-2">{children}</div>}
    </div>
  );
}

export function Tag({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "signal" | "warm" }) {
  const tones = {
    default: "border-ink-600 bg-ink-850 text-fog-300",
    signal: "border-signal/30 bg-signal/5 text-signal",
    warm: "border-warm/40 bg-warm/5 text-warm",
  } as const;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] leading-none ${tones[tone]}`}>{children}</span>;
}

/** Visible placeholder for content David still has to provide. */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-warm/60 bg-warm/5 px-3 py-1 font-mono text-[12px] text-warm">
      <span aria-hidden>◌</span>
      {children}
    </span>
  );
}

/** Large page title used at the top of each page: "ABOUT" / muted second word. */
export function PageTitle({ eyebrow, title, muted, children }: { eyebrow: string; title: string; muted?: string; children?: ReactNode }) {
  return (
    <Container as="header" className="pb-14 pt-16 sm:pt-24">
      <p className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.1em] text-fog-400" data-reveal>
        <span className="font-semibold text-fog-50">David Domínguez®</span>
        <span className="h-px w-8 bg-fog-500" aria-hidden />
        {eyebrow}
      </p>
      <h1 className="display text-[min(56px,12.5vw)] text-fog-50 sm:text-[96px] lg:text-[136px]" data-reveal>
        {title}
        {muted && <span className="block text-fog-500">{muted}</span>}
      </h1>
      {children && <div className="mt-8 max-w-2xl text-lg leading-relaxed text-fog-300 sm:text-xl" data-reveal>{children}</div>}
    </Container>
  );
}
