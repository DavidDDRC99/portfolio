import type { Metadata } from "next";
import Link from "next/link";
import { getContent, getDict, lp, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, Tag, Placeholder, PageTitle } from "@/components/ui/Container";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).applications;
  return pageMeta(locale, "/applications/", t.eyebrow, t.metaDescription);
}

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  const { applications } = getContent(locale);
  const d = getDict(locale);
  const t = d.applications;
  return (
    <>
      <PageTitle eyebrow={t.eyebrow} title={t.title} muted={t.muted}>
        <p>{t.lead}</p>
      </PageTitle>
      <Container as="section">
        <ul className="grid gap-3">
          {applications.map((a, i) => (
            <li key={a.slug} data-reveal>
              <Link href={lp(locale, `/applications/${a.slug}/`)} className="group grid gap-6 rounded-[28px] bg-ink-850 p-6 transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(35,64,255,0.6)] sm:p-10 md:grid-cols-[80px_1fr_auto]">
                <span className="font-mono text-[12px] text-fog-500">A.{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="label">{a.kicker}</p>
                  <h2 className="mt-3 text-3xl font-bold leading-[1.02] tracking-[-0.04em] text-fog-50 transition-colors group-hover:text-signal sm:text-[44px]">{a.title}</h2>
                  <p className="mt-4 max-w-2xl text-fog-300">{a.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">{a.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                  {a.pendingVerification && <div className="mt-4"><Placeholder>{t.pending}</Placeholder></div>}
                </div>
                <div className="flex items-start justify-between gap-4 md:flex-col md:items-end">
                  <span className="flex items-center gap-2 rounded-full bg-rain/10 px-3 py-1 font-mono text-[11px] text-rain"><span className="h-1.5 w-1.5 rounded-full bg-rain" aria-hidden />{a.status}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-ink-600 text-lg text-fog-50 transition-all group-hover:border-signal group-hover:bg-signal group-hover:text-white" aria-label={d.common.details}>↗</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
