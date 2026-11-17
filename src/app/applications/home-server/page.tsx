import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeader, Tag, Placeholder } from "@/components/ui/Container";
import { ArchitectureDiagram } from "@/components/apps/ArchitectureDiagram";

export const metadata: Metadata = {
  title: "Home Server & Personal Data Centre",
  description: "A 2020 laptop turned into a Debian 13 home server with 4 TB of storage, Jellyfin, Navidrome and secure remote access through Tailscale.",
  alternates: { canonical: "/applications/home-server/" },
};

const SPECS = [
  ["Machine", "Huawei MateBook D 15 (2020)"],
  ["CPU", "AMD Ryzen 7 3700U · 4 cores / 8 threads"],
  ["Graphics", "Radeon Vega 10 (integrated)"],
  ["Memory", "8 GB RAM"],
  ["System disk", "512 GB NVMe SSD"],
  ["Data disk", "Toshiba Canvio Basics 4 TB (external HDD)"],
  ["OS", "Debian 13"],
];

export default function HomeServerPage() {
  return (
    <article>
      <Container as="header" className="border-b border-ink-700 pb-14 pt-16 sm:pt-24">
        <nav aria-label="Breadcrumb" className="mb-8 font-mono text-[11px] text-fog-500">
          <Link href="/applications/" className="hover:text-signal">Applications</Link> <span aria-hidden>/</span> <span className="text-fog-300">home-server</span>
        </nav>
        <p className="label mb-4" data-reveal>Infrastructure · Self-hosted</p>
        <h1 className="max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.02em] text-fog-50 sm:text-5xl" data-reveal>A laptop that became a small data centre</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fog-300" data-reveal>
          I turned an old laptop into a Debian server that centralises my files, photos and media on one machine I control, reachable from any of my devices through a private network.
        </p>
        <div className="mt-6 flex flex-wrap gap-1.5" data-reveal>{["Debian 13", "Linux administration", "Tailscale", "Jellyfin", "Navidrome", "Storage"].map((t) => <Tag key={t}>{t}</Tag>)}</div>
      </Container>

      <Container as="section" className="pt-20">
        <SectionHeader index="01" kicker="Architecture" title="From any device to the right service">
          <p>Hover or tab through the nodes. Addresses, hostnames and credentials are intentionally left out.</p>
        </SectionHeader>
        <div data-reveal><ArchitectureDiagram /></div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="02" kicker="Hardware" title="Modest hardware, used deliberately">
          <p>A mobile CPU and 8 GB of RAM are enough for file serving and media streaming, while drawing far less power than a desktop running all day.</p>
        </SectionHeader>
        <dl className="divide-y divide-ink-700 border-y border-ink-700 md:ml-[220px]" data-reveal>
          {SPECS.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-3 sm:grid-cols-[180px_1fr]">
              <dt className="label pt-0.5">{k}</dt>
              <dd className="font-mono text-[13px] text-fog-100">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="03" kicker="System" title="Storage, services and access" />
        <div className="grid gap-px bg-ink-600 md:grid-cols-3">
          {[
            ["Storage architecture", "The internal NVMe holds the operating system and service data. The 4 TB external drive holds the bulk of the library: photos, videos, films, series, music and documents. Separating the two keeps the system disk small and the media easy to move or back up."],
            ["Services", "Jellyfin organises and streams films and series. Navidrome streams the music library and speaks the Subsonic API, so it works with mobile clients such as Substreamer. Personal files live alongside them on the same drive."],
            ["Remote access", "Tailscale creates an encrypted WireGuard network between my devices and the server. Services are reachable from outside home without opening router ports or exposing anything publicly."],
          ].map(([k, v]) => (
            <div key={k} className="bg-ink-900 p-6" data-reveal>
              <h3 className="text-fog-50">{k}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fog-400">{v}</p>
            </div>
          ))}
        </div>
      </Container>

      <Container as="section" className="pt-24">
        <SectionHeader index="04" kicker="Challenges" title="What it takes to keep it running">
          <p>Design constraints that come with the setup itself:</p>
        </SectionHeader>
        <ul className="divide-y divide-ink-700 border-y border-ink-700 md:ml-[220px]" data-reveal>
          {[
            "A laptop is not designed to run 24/7: power management, lid behaviour and heat have to be configured for an always-on role.",
            "Bulk data on an external USB drive needs reliable mounting at boot so services never start against an empty path.",
            "8 GB of RAM sets a budget: services have to coexist without competing for memory.",
            "Remote access has to be convenient enough to use daily without weakening security.",
          ].map((c) => <li key={c} className="flex gap-4 py-3 text-fog-200"><span className="mt-[11px] h-px w-4 shrink-0 bg-warm" aria-hidden />{c}</li>)}
        </ul>
        <div className="mt-6 md:ml-[220px]"><Placeholder>David: add the specific problems you hit and how you solved them</Placeholder></div>
      </Container>

      <Container className="pt-20">
        <Link href="/applications/" className="font-mono text-[12px] text-fog-400 hover:text-signal">← All applications</Link>
      </Container>
    </article>
  );
}
