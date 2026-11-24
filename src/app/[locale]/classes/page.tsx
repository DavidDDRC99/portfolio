import type { Metadata } from "next";
import { getContent, getDict, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, PageTitle } from "@/components/ui/Container";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).classes;
  return pageMeta(locale, "/classes/", t.eyebrow, t.metaDescription);
}

/**
 * Placeholder for the private-lessons offer. It will grow into the full
 * section (subjects, method, format, rates, FAQ) once those are decided.
 */
export default async function ClassesPage({ params }: Props) {
  const { locale } = await params;
  const { contact } = getContent(locale);
  const t = getDict(locale).classes;
  const mail = contact.email ? `mailto:${contact.email}?subject=${encodeURIComponent(t.mailSubject)}` : null;

  return (
    <>
      <PageTitle eyebrow={t.eyebrow} title={t.title} muted={t.muted}>
        <p>{t.lead}</p>
        <p className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-warm/10 px-3 py-1 font-mono text-[12px] uppercase tracking-[0.08em] text-warm">
            <span className="h-1.5 w-1.5 rounded-full bg-warm" aria-hidden />
            {t.status}
          </span>
        </p>
      </PageTitle>

      <Container as="section" className="pb-10">
        <h2 className="label mb-5">{t.plannedKicker}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {t.planned.map(([title, body], i) => (
            <li key={title} className="rounded-2xl border border-dashed border-ink-500 bg-white/40 p-6">
              <span className="font-mono text-[12px] text-fog-500">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-fog-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fog-400">{body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col justify-between gap-8 rounded-[28px] bg-signal p-6 text-white sm:flex-row sm:items-end sm:p-10" data-reveal>
          <div>
            <p className="display text-[40px] sm:text-[56px]">{t.ctaTitle}</p>
            <p className="mt-4 max-w-md text-white/80">{t.ctaBody}</p>
          </div>
          {mail && (
            <a href={mail} className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-medium text-fog-50 transition-transform hover:-translate-y-0.5 sm:self-auto">
              {t.ctaButton} <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </Container>
    </>
  );
}
