"use client";

import { useState } from "react";

/**
 * Home-server architecture: devices → Tailscale → Debian server → storage → services.
 * Hovering/focusing a node highlights its connections and shows details.
 * Deliberately generic: no hostnames, addresses or URLs.
 */
type NodeId = "devices" | "tailscale" | "server" | "nvme" | "hdd" | "jellyfin" | "navidrome" | "files";

const NODES: Record<NodeId, { x: number; y: number; w: number; h: number; title: string; sub: string; detail: string; tone?: "signal" | "warm" | "rain" }> = {
  devices: { x: 20, y: 150, w: 150, h: 92, title: "Personal devices", sub: "laptop · phone · tablet · PC", detail: "Every device joins the same private network. Nothing on the server is exposed to the public internet." },
  tailscale: { x: 230, y: 150, w: 150, h: 92, title: "Tailscale", sub: "WireGuard mesh VPN", detail: "Encrypted point-to-point connections between my devices and the server, from home or anywhere else, with no port forwarding on the router.", tone: "signal" },
  server: { x: 440, y: 120, w: 190, h: 152, title: "Debian 13 server", sub: "Huawei MateBook D 15 (2020)", detail: "AMD Ryzen 7 3700U (4C/8T), Radeon Vega 10, 8 GB RAM. A 2020 laptop repurposed as an always-on, low-power machine." },
  nvme: { x: 440, y: 316, w: 190, h: 60, title: "512 GB NVMe SSD", sub: "system + services", detail: "Operating system, service configuration and application data live on the internal SSD." },
  hdd: { x: 440, y: 404, w: 190, h: 60, title: "4 TB external HDD", sub: "Toshiba Canvio Basics", detail: "Bulk storage for the media library, photos, videos and documents.", tone: "warm" },
  jellyfin: { x: 700, y: 60, w: 170, h: 70, title: "Jellyfin", sub: "films & series", detail: "Media server for films and TV series stored on the external drive.", tone: "rain" },
  navidrome: { x: 700, y: 160, w: 170, h: 70, title: "Navidrome", sub: "music streaming", detail: "Music server with a Subsonic-compatible API, so mobile clients such as Substreamer can connect to it.", tone: "rain" },
  files: { x: 700, y: 260, w: 170, h: 70, title: "Personal files", sub: "photos · videos · docs", detail: "A single place for personal files instead of scattering them across devices.", tone: "rain" },
};

const EDGES: [NodeId, NodeId][] = [
  ["devices", "tailscale"],
  ["tailscale", "server"],
  ["server", "nvme"],
  ["server", "hdd"],
  ["server", "jellyfin"],
  ["server", "navidrome"],
  ["server", "files"],
];

const toneColor = { signal: "var(--color-signal)", warm: "var(--color-warm)", rain: "var(--color-rain)" } as const;

function edgePath(a: NodeId, b: NodeId) {
  const A = NODES[a];
  const B = NODES[b];
  if (b === "nvme" || b === "hdd") {
    const x = A.x + 26;
    return `M${x},${A.y + A.h} L${x},${B.y + B.h / 2} L${B.x},${B.y + B.h / 2}`;
  }
  const x1 = A.x + A.w;
  const y1 = A.y + A.h / 2;
  const x2 = B.x;
  const y2 = B.y + B.h / 2;
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

export function ArchitectureDiagram() {
  const [active, setActive] = useState<NodeId>("server");
  const connected = new Set(EDGES.filter((e) => e.includes(active)).flat());

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-600 bg-ink-850">
      <p className="border-b border-ink-600 px-4 py-2 font-mono text-[10.5px] text-fog-500 md:hidden">Scroll sideways to see the full diagram →</p>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 890 490" className="block h-auto w-full min-w-[720px]" role="img" aria-label="Architecture: personal devices connect through Tailscale to a Debian server with internal SSD and external 4 TB HDD, which runs Jellyfin, Navidrome and file storage.">
          <defs>
            <pattern id="arch-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="var(--color-ink-700)" strokeWidth="0.5" />
            </pattern>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="var(--color-fog-400)" />
            </marker>
          </defs>
          <rect width="890" height="490" fill="url(#arch-grid)" opacity="0.6" />

          {/* Zones */}
          <rect x="210" y="40" width="440" height="440" rx="18" fill="none" stroke="var(--color-signal-dim)" strokeDasharray="4 5" />
          <text x="222" y="58" fontSize="10" fill="var(--color-signal)" fontFamily="var(--font-mono)" letterSpacing="1.5">PRIVATE TAILNET · ENCRYPTED</text>
          <text x="700" y="44" fontSize="10" fill="var(--color-fog-500)" fontFamily="var(--font-mono)" letterSpacing="1.5">SERVICES</text>

          {EDGES.map(([a, b]) => {
            const on = a === active || b === active;
            return (
              <path
                key={`${a}-${b}`}
                d={edgePath(a, b)}
                fill="none"
                stroke={on ? "var(--color-signal)" : "var(--color-ink-500)"}
                strokeWidth={on ? 1.6 : 1}
                markerEnd="url(#arch-arrow)"
                style={{ transition: "stroke .3s" }}
              />
            );
          })}

          {(Object.keys(NODES) as NodeId[]).map((id) => {
            const n = NODES[id];
            const on = id === active;
            const near = connected.has(id);
            const accent = n.tone ? toneColor[n.tone] : "var(--color-fog-300)";
            return (
              <g
                key={id}
                tabIndex={0}
                role="button"
                aria-pressed={on}
                aria-label={`${n.title}: ${n.detail}`}
                onPointerEnter={() => setActive(id)}
                onFocus={() => setActive(id)}
                onClick={() => setActive(id)}
                style={{ cursor: "pointer", outline: "none", opacity: on || near ? 1 : 0.55, transition: "opacity .3s" }}
              >
                <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={12} fill="var(--color-ink-850)" stroke={on ? "var(--color-fog-50)" : "var(--color-ink-500)"} strokeWidth={on ? 1.5 : 1} />
                <rect x={n.x + 10} y={n.y + 12} width={3} height={n.h - 24} rx={1.5} fill={accent} />
                <text x={n.x + 22} y={n.y + 28} fontSize="13.5" fill="var(--color-fog-50)" fontFamily="var(--font-sans)">{n.title}</text>
                <text x={n.x + 22} y={n.y + 46} fontSize="10" fill="var(--color-fog-400)" fontFamily="var(--font-mono)">{n.sub}</text>
                {id === "server" && (
                  <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-fog-300)">
                    <text x={n.x + 22} y={n.y + 76}>CPU  Ryzen 7 3700U · 4C/8T</text>
                    <text x={n.x + 22} y={n.y + 94}>GPU  Radeon Vega 10</text>
                    <text x={n.x + 22} y={n.y + 112}>RAM  8 GB</text>
                    <text x={n.x + 22} y={n.y + 130}>OS   Debian 13</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="grid gap-2 border-t border-ink-600 p-5 sm:grid-cols-[200px_1fr]" aria-live="polite">
        <p className="label">{NODES[active].title}</p>
        <p className="text-fog-200">{NODES[active].detail}</p>
      </div>
    </div>
  );
}
