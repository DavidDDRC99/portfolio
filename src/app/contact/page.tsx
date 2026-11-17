import type { Metadata } from "next";
import { getContent } from "@/lib/i18n";
import { Container, Placeholder, PageTitle } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact",
  description: "How to get in touch with David Domínguez Ruiz.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const { contact } = getContent();
  const rows: { k: string; v: string | null; href: (v: string) => string; display: (v: string) => string; missing: string }[] = [
    { k: "Email", v: contact.email, href: (v) => `mailto:${v}`, display: (v) => v, missing: "Professional email" },
    { k: "LinkedIn", v: contact.linkedin, href: (v) => v, display: (v) => v.replace(/^https?:\/\/(www\.)?/, ""), missing: "LinkedIn profile URL" },
    { k: "GitHub", v: contact.github, href: (v) => v, display: (v) => v.replace(/^https?:\/\//, ""), missing: "GitHub profile URL" },
  ];
  return (
    <>
    <PageTitle eyebrow="Contact" title="Let's" muted="talk">
      <p>
        I&apos;m interested in roles and collaborations in meteorology, climate data, Earth observation, data science and renewable energy. Questions about any of the projects are welcome too.
      </p>
    </PageTitle>
    <Container className="pb-10">
      <ul className="border-t border-ink-600" data-reveal>
        {rows.map((r) => (
          <li key={r.k} className="grid gap-2 border-b border-ink-600 py-6 sm:grid-cols-[200px_1fr] sm:items-baseline">
            <span className="label">{r.k}</span>
            {r.v ? (
              <a href={r.href(r.v)} target={r.k === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className="group break-all text-2xl font-semibold tracking-[-0.03em] text-fog-50 hover:text-signal sm:text-4xl">
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
