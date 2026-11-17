import Link from "next/link";
import { getContent } from "@/lib/i18n";
import { nav } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const { profile, contact } = getContent();
  return (
    <footer className="mt-32 border-t border-ink-700">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-fog-50">{profile.name}</p>
          <p className="mt-1 text-sm text-fog-400">{profile.role}</p>
          <p className="mt-6 max-w-sm text-sm text-fog-500">
            Built with Next.js and TypeScript. Charts are drawn from real station data processed with Python.
          </p>
        </div>
        <div>
          <p className="label mb-3">Sections</p>
          <ul className="space-y-1.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="text-fog-300 hover:text-signal" href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-3">Elsewhere</p>
          <ul className="space-y-1.5 text-sm">
            {contact.github && (
              <li><a className="text-fog-300 hover:text-signal" href={contact.github} rel="noopener noreferrer" target="_blank">GitHub ↗</a></li>
            )}
            {contact.linkedin && (
              <li><a className="text-fog-300 hover:text-signal" href={contact.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn ↗</a></li>
            )}
            {contact.email && (
              <li><a className="text-fog-300 hover:text-signal" href={`mailto:${contact.email}`}>Email</a></li>
            )}
          </ul>
        </div>
      </Container>
      <Container className="flex flex-wrap justify-between gap-2 border-t border-ink-800 py-5 font-mono text-[11px] text-fog-500">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Station data: Servei Meteorològic de Catalunya (Meteocat)</span>
      </Container>
    </footer>
  );
}
