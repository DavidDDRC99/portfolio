import type { Metadata } from "next";
import { getContent, getDict, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { Container, Placeholder, PageTitle } from "@/components/ui/Container";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(locale).contact;
  return pageMeta(locale, "/contact/", t.eyebrow, t.metaDescription);
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const { contact } = getContent(locale);
  const t = getDict(locale).contact;
  const rows: { k: string; mail?: boolean; v: string | null; href: (v: string) => string; display: (v: string) => string; missing: string }[] = [
    { k: t.email, mail: true, v: contact.email, href: (v) => `mailto:${v}`, display: (v) => v, missing: t.missingEmail },
    { k: "LinkedIn", v: contact.linkedin, href: (v) => v, display: (v) => v.replace(/^https?:\/\/(www\.)?/, ""), missing: t.missingLinkedin },
    { k: "GitHub", v: contact.github, href: (v) => v, display: (v) => v.replace(/^https?:\/\//, ""), missing: t.missingGithub },
  ];
  return (
    <>
      <PageTitle eyebrow={t.eyebrow} title={t.title} muted={t.muted}>
        <p>{t.lead}</p>
      </PageTitle>
      <Container className="pb-10">
        <ul className="grid gap-3" data-reveal>
          {rows.map((r) => (
            <li key={r.k} className="grid gap-2 rounded-2xl bg-ink-850 p-6 sm:grid-cols-[200px_1fr] sm:items-baseline sm:p-8">
              <span className="label">{r.k}</span>
              {r.v ? (
                <a href={r.href(r.v)} target={r.mail ? undefined : "_blank"} rel="noopener noreferrer" className="group break-all text-2xl font-semibold tracking-[-0.03em] text-fog-50 hover:text-signal sm:text-4xl">
                  {r.display(r.v)} <span aria-hidden className="text-signal opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                </a>
              ) : (
                <span><Placeholder>{r.missing}</Placeholder></span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
