import Link from "next/link";
import type { ReactNode } from "react";
import { IsobarField } from "@/components/home/IsobarField";
import { TrendSparkline } from "@/components/charts/TrendSparkline";
import type { Trend } from "@/lib/meteo";

type TileCopy = { kicker: string; title: string; body: string };

export type HubLabels = {
  navLabel: string;
  classes: TileCopy & { badge: string };
  vo: TileCopy;
  apps: TileCopy;
  info: TileCopy;
};

/**
 * Landing hub: a compact cobalt panel with who I am in one line, followed by
 * four large tiles that take the visitor straight to the main sections
 * (private lessons, the VO-evolution project, applications, about/contact).
 */
export function HomeHero({
  name,
  tagline,
  role,
  labels,
  links,
  featured,
  apps,
  contact,
}: {
  name: string;
  tagline: string;
  role: string;
  labels: HubLabels;
  links: { classes: string; vo: string; apps: string; info: string };
  featured: { title: string; annual: [number, number | null][]; trend: Trend };
  apps: string[];
  contact: { email: string | null; linkedin: string | null; github: string | null };
}) {
  const contactLinks = [
    contact.email && { label: "Email", href: `mailto:${contact.email}`, external: false },
    contact.linkedin && { label: "LinkedIn", href: contact.linkedin, external: true },
    contact.github && { label: "GitHub", href: contact.github, external: true },
  ].filter(Boolean) as { label: string; href: string; external: boolean }[];

  return (
    <section className="px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[22px] bg-signal text-white sm:rounded-[32px]">
        <div className="absolute inset-0 -z-10">
          <IsobarField />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_10%,transparent_30%,rgba(10,20,120,0.45))]" />

        <div className="mx-auto max-w-[1280px] px-3 pb-3 pt-7 sm:px-8 sm:pb-8 sm:pt-9 lg:px-10">
          {/* Who */}
          <div className="grid gap-3 px-1 sm:px-0 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/75 sm:text-[12px]">{role}</p>
              <h1 className="display mt-3 text-[34px] text-white sm:text-[56px] lg:text-[60px] xl:text-[72px]">{name}</h1>
            </div>
            <p className="max-w-[340px] text-[14px] leading-snug text-white/85 sm:text-[16px] lg:pb-2">{tagline}</p>
          </div>

          {/* Hub */}
          <nav aria-label={labels.navLabel} className="mt-6 sm:mt-8">
            <ul className="grid grid-cols-2 gap-2 sm:gap-3">
              <Tile n="01" href={links.classes} copy={labels.classes} badge={labels.classes.badge}>
                <div className="flex flex-wrap gap-1.5" aria-hidden>
                  {["∫", "∑", "√", "π", "Δ", "λ"].map((s) => (
                    <span key={s} className="grid h-9 w-9 place-items-center rounded-lg bg-ink-900 font-mono text-[15px] text-fog-300">{s}</span>
                  ))}
                </div>
              </Tile>

              <Tile n="02" href={links.vo} copy={labels.vo}>
                <div className="hidden rounded-xl bg-ink-900 px-3 pt-2 sm:block">
                  <TrendSparkline annual={featured.annual} trend={featured.trend} color="var(--color-signal)" height={90} label={featured.title} />
                </div>
              </Tile>

              <Tile n="03" href={links.apps} copy={labels.apps}>
                <ul className="flex flex-wrap gap-1.5">
                  {apps.map((a) => (
                    <li key={a} className="rounded-full border border-ink-600 px-3 py-1 text-[12px] text-fog-300">{a}</li>
                  ))}
                </ul>
              </Tile>

              <Tile n="04" href={links.info} copy={labels.info}>
                <ul className="relative z-10 flex flex-wrap gap-1.5">
                  {contactLinks.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.external ? "_blank" : undefined}
                        rel={l.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 rounded-full bg-fog-50 px-3 py-1 text-[12px] font-medium text-white transition-colors hover:bg-signal"
                      >
                        {l.label} <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Tile>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}

/**
 * One hub tile. The whole card is clickable through a stretched link
 * (an ::after overlay on the title link), so tiles can still contain their
 * own secondary links (raised with `relative z-10`) without nesting <a> tags.
 */
function Tile({ n, href, copy, badge, children }: { n: string; href: string; copy: TileCopy; badge?: string; children?: ReactNode }) {
  return (
    <li className="group relative flex min-h-[132px] flex-col justify-between gap-3 rounded-2xl bg-white p-4 text-fog-50 shadow-[0_20px_60px_-25px_rgba(5,10,60,0.6)] transition-transform duration-200 focus-within:-translate-y-1 hover:-translate-y-1 sm:min-h-[200px] sm:gap-5 sm:p-6">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-fog-400">
            <span className="text-signal">{n}</span>
            <span className="hidden sm:inline">{copy.kicker}</span>
          </span>
          {badge && (
            <span className="rounded-full bg-warm/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-warm">{badge}</span>
          )}
        </div>
        <h2 className="mt-2 text-[19px] font-bold leading-[1.05] tracking-[-0.03em] sm:mt-3 sm:text-[28px] lg:text-[32px]">
          <Link href={href} className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-white">
            {copy.title}
          </Link>
        </h2>
        <p className="mt-2 hidden max-w-md text-[14px] leading-relaxed text-fog-400 sm:block">{copy.body}</p>
      </div>
      <div className="flex items-end justify-between gap-4">
        <div className="hidden min-w-0 flex-1 sm:block">{children}</div>
        <span className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-full border sm:h-10 sm:w-10 border-ink-600 text-fog-50 transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-white" aria-hidden>
          ↗
        </span>
      </div>
    </li>
  );
}
