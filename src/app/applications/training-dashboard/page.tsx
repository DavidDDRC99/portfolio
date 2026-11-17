import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeader, Tag, Placeholder } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Personal Training Dashboard",
  description: "A responsive dashboard for logging and tracking training across different disciplines, with history and charts per exercise.",
  alternates: { canonical: "/applications/training-dashboard/" },
};

/**
 * Content below comes from David's own description of the app.
 * TODO: once the source code is available in projects/training-app/source-code,
 * verify modules/parameters, add the real stack and screenshots.
 */
const MODULES = ["Elliptical training", "Long jump", "Front lever", "Back lever", "Abdominal routines"];
const PARAMETERS = ["Training level", "Duration", "Number of sets", "Progression", "Distance", "Training blocks"];

export default function TrainingDashboardPage() {
  return (
    <article>
      <Container as="header" className="border-b border-ink-700 pb-14 pt-16 sm:pt-24">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
          <Link href="/applications/" className="hover:text-signal">Applications</Link> <span aria-hidden>/</span> <span className="text-fog-300">training-dashboard</span>
        </nav>
        <p className="label mb-4" data-reveal>Application · Personal tool</p>
        <h1 className="max-w-4xl text-4xl font-bold leading-[1.0] tracking-[-0.045em] text-fog-50 sm:text-5xl" data-reveal>One place for very different kinds of training</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300" data-reveal>
          Elliptical sessions, long jump and calisthenics progressions are measured in completely different ways. This dashboard records all of them in one place, with parameters specific to each exercise, a history of every session and charts to follow progress.
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5" data-reveal>{["Responsive dashboard", "Forms", "Charts", "History"].map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </Container>

      <Container as="section" className="pt-20">
        <SectionHeader index="01" kicker="Interface" title="Screenshots">
          <p>Real captures of the interface will go here.</p>
        </SectionHeader>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]" data-reveal>
          <div className="flex aspect-[16/10] items-center justify-center border border-dashed border-ink-500 bg-ink-850">
            <Placeholder>Desktop screenshot · add to projects/training-app/screenshots</Placeholder>
          </div>
          <div className="flex aspect-[9/16] max-h-[420px] items-center justify-center border border-dashed border-ink-500 bg-ink-850 md:max-h-none">
            <Placeholder>Mobile screenshot</Placeholder>
          </div>
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="02" kicker="Modules" title="Each discipline tracks what matters for it">
          <p>Exercise-specific parameters instead of one generic form.</p>
        </SectionHeader>
        <div className="grid gap-3 md:grid-cols-2" data-reveal>
          <div className="rounded-2xl bg-ink-850 p-6">
            <p className="label mb-3">Training modules</p>
            <ul className="divide-y divide-ink-700 border-y border-ink-700">
              {MODULES.map((m, i) => (
                <li key={m} className="flex items-baseline gap-4 py-2.5 text-fog-100"><span className="font-mono text-[11px] text-fog-500">{String(i + 1).padStart(2, "0")}</span>{m}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-ink-850 p-6">
            <p className="label mb-3">Exercise-specific parameters</p>
            <div className="flex flex-wrap gap-1.5">{PARAMETERS.map((p) => <Tag key={p}>{p}</Tag>)}</div>
            <p className="mt-4 text-sm text-fog-400">Each module uses the subset of parameters that makes sense for it.</p>
          </div>
        </div>
        <div className="mt-4"><Placeholder>Which parameters each module uses: to be documented from the source code</Placeholder></div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="03" kicker="Features" title="What it does" />
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Log", "Forms for data entry adapted to each exercise."],
            ["Review", "Historical records per module to see every past session."],
            ["Visualise", "Interactive charts showing progression over time, with visual feedback on each entry."],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-ink-850 p-6" data-reveal>
              <h3 className="text-fog-50">{k}</h3>
              <p className="mt-2 text-sm text-fog-400">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="04" kicker="Stack" title="Technologies" />
        <div className="md:ml-[220px]"><Placeholder>To be filled in after inspecting the source code</Placeholder></div>
      </Container>

      <Container className="pt-20">
        <Link href="/applications/" className="font-mono text-[12px] text-fog-400 hover:text-signal">← All applications</Link>
      </Container>
    </article>
  );
}
