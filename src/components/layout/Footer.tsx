import Link from "next/link";
import { getContent, getDict, lp, type Locale } from "@/lib/i18n";
import { nav } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export function Footer({ locale }: { locale: Locale }) {
  const { profile, contact } = getContent(locale);
  const d = getDict(locale);
  return (
    <footer className="mt-32 border-t border-ink-600/70 bg-white/40 backdrop-blur-sm">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold tracking-tight text-fog-50">{profile.name}</p>
          <p className="mt-1 text-sm text-fog-400">{profile.role}</p>
          <p className="mt-6 max-w-sm text-sm text-fog-500">{d.footer.builtWith}</p>
        </div>
        <div>
          <p className="label mb-3">{d.footer.sections}</p>
          <ul className="space-y-1.5 text-sm">
            {nav.map((n) => (
              <li key={n.key}>
                <Link className="text-fog-300 hover:text-signal" href={lp(locale, n.path)}>{d.nav[n.key]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-3">{d.footer.elsewhere}</p>
          <ul className="space-y-1.5 text-sm">
            {contact.github && (
              <li><a className="text-fog-300 hover:text-signal" href={contact.github} rel="noopener noreferrer" target="_blank">GitHub ↗</a></li>
            )}
            {contact.linkedin && (
              <li><a className="text-fog-300 hover:text-signal" href={contact.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn ↗</a></li>
            )}
            {contact.email && (
              <li><a className="text-fog-300 hover:text-signal" href={`mailto:${contact.email}`}>{d.contact.email}</a></li>
            )}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-2 border-t border-ink-600/70 py-5 font-mono text-[11px] text-fog-500">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{d.footer.data}</span>
      </Container>
    </footer>
  );
}
