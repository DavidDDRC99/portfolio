import Link from "next/link";
import { IsobarField } from "@/components/home/IsobarField";
import { TrendSparkline } from "@/components/charts/TrendSparkline";
import type { Trend } from "@/lib/meteo";

/**
 * Editorial hero: a bright cobalt panel with a ghosted surname, a giant first
 * name, crosshair registration marks, the portrait (when provided) and two
 * floating cards — the featured project and a contact prompt.
 */
export function HomeHero({
  firstName,
  lastName,
  tagline,
  role,
  portrait,
  featured,
}: {
  firstName: string;
  lastName: string;
  tagline: string;
  role: string;
  portrait: string | null;
  featured: { href: string; title: string; annual: [number, number | null][]; trend: Trend };
}) {
  const marks = [
    [8, 14], [33, 14], [58, 14], [83, 14],
    [8, 52], [83, 52],
    [8, 88], [33, 88], [58, 88], [83, 88],
  ];

  return (
    <section className="px-2 pt-2 sm:px-4 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-[22px] bg-signal text-white sm:rounded-[32px]">
        {/* Background field + depth */}
        <div className="absolute inset-0 -z-10">
          <IsobarField />
        </div>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_70%_10%,transparent_30%,rgba(10,20,120,0.45))]" />

        {/* Crosshair registration marks */}
        {marks.map(([x, y]) => (
          <span key={`${x}-${y}`} aria-hidden className="crosshairs absolute -z-10 hidden h-[9px] w-[9px] text-white/50 sm:block" style={{ left: `${x}%`, top: `${y}%`, backgroundPosition: "0 4px, 4px 0" }} />
        ))}

        {/* Ghost surname */}
        <p aria-hidden className="display pointer-events-none absolute inset-x-0 top-[5%] -z-10 select-none text-center text-[16.5vw] text-white/[0.09] lg:text-[15vw]">
          {lastName.split(" ")[0]}
        </p>

        <div className="relative mx-auto grid min-h-[calc(100svh-6rem)] max-w-[1280px] grid-cols-1 px-5 pb-6 pt-10 sm:px-10 sm:pb-10 lg:grid-cols-[1fr_auto] lg:pt-14">
          {/* Portrait */}
          {portrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portrait}
              alt={`Portrait of ${firstName} ${lastName}`}
              className="pointer-events-none absolute bottom-0 left-1/2 -z-[5] h-[78%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom sm:h-[88%]"
            />
          )}

          <div className="flex flex-col justify-between gap-12">
            <p className="max-w-[300px] pt-[12vh] text-[13px] font-medium uppercase leading-snug tracking-[0.02em] text-white/90 lg:pt-[18vh]" data-reveal>
              <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-white" aria-hidden />
              {tagline}
            </p>

            <div data-reveal>
              <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.12em] text-white/80">©{new Date().getFullYear()} · {role}</p>
              <h1 className="display text-[27vw] text-white sm:text-[22vw] lg:text-[200px] xl:text-[232px]">
                {firstName}
                <span className="sr-only"> {lastName}</span>
              </h1>
            </div>
          </div>

          {/* Floating cards */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0 lg:w-[300px] lg:flex-col lg:justify-between lg:pt-[10vh]">
            <Link href={featured.href} className="float-a group block rounded-2xl bg-white p-3 text-fog-50 shadow-[0_20px_60px_-20px_rgba(5,10,60,0.6)] transition-transform hover:-translate-y-1 sm:flex-1 lg:flex-none" data-reveal>
              <div className="rounded-xl bg-ink-900 p-3">
                <TrendSparkline annual={featured.annual} trend={featured.trend} color="var(--color-signal)" height={330} label={featured.title} />
              </div>
              <div className="flex items-center justify-between px-1 pb-1 pt-3 text-[12px]">
                <span className="flex items-center gap-1.5 font-semibold"><span className="text-signal">✳</span> VO-evolution</span>
                <span className="text-fog-400">/ Climate data</span>
              </div>
            </Link>

            <Link href="/contact/" className="float-b group flex items-center gap-3 rounded-2xl bg-fog-50 p-3 text-white shadow-[0_20px_60px_-20px_rgba(5,10,60,0.7)] sm:flex-1 lg:flex-none" data-reveal>
              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-signal text-lg font-bold">
                {portrait ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portrait} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <>DD</>
                )}
              </span>
              <span className="flex-1">
                <span className="block text-[11px] text-white/60">Let&apos;s talk</span>
                <span className="block text-[15px] font-semibold">{firstName} {lastName.split(" ")[0]}</span>
                <span className="block text-[11px] text-white/60">Physics · Meteorology · Data</span>
              </span>
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-fog-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
