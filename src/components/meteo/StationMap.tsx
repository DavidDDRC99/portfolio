"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { stations, stationsData, variableById, type StationId, type VariableId } from "@/lib/meteo";

/** Interactive map of the three stations plus a details panel for the selected one. */
export function StationMap() {
  const mapEl = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<StationId>("sbd-nord");
  const markers = useRef<Record<string, import("leaflet").CircleMarker>>({});

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !mapEl.current) return;
      map = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([41.575, 2.0], 11);
      // OpenStreetMap standard tiles (no API key; attribution required), darkened with a CSS filter.
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 17,
        className: "osm-dark",
      }).addTo(map);

      for (const s of stations) {
        const mk = L.circleMarker([s.lat, s.lon], {
          radius: 8,
          color: s.color,
          weight: 2,
          fillColor: s.color,
          fillOpacity: 0.35,
          dashArray: s.exactLocation ? undefined : "3 3",
        })
          .addTo(map)
          .bindTooltip(`${s.short}${s.code ? ` · ${s.code}` : ""}`, { permanent: true, direction: s.id === "sbd-centre" ? "bottom" : "right", offset: s.id === "sbd-centre" ? [0, 10] : [10, 0], className: "station-tip" })
          .on("click", () => setSelected(s.id));
        markers.current[s.id] = mk;
      }
      map.fitBounds(L.latLngBounds(stations.map((s) => [s.lat, s.lon])).pad(0.6));
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  useEffect(() => {
    for (const [id, mk] of Object.entries(markers.current)) {
      mk.setStyle({ fillOpacity: id === selected ? 0.9 : 0.25 });
      mk.setRadius(id === selected ? 10 : 7);
    }
  }, [selected]);

  const s = stations.find((x) => x.id === selected)!;
  const d = stationsData[selected];
  const vars = Object.keys(d.variables) as VariableId[];

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-ink-600 bg-ink-850 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="relative h-[340px] border-b border-ink-600 sm:h-[440px] lg:h-auto lg:min-h-[460px] lg:border-b-0 lg:border-r">
        <div ref={mapEl} className="absolute inset-0" role="region" aria-label="Map of the three weather stations in the Vallès Occidental" />
      </div>
      <div className="flex flex-col">
        <div role="tablist" aria-label="Stations" className="grid grid-cols-3 border-b border-ink-600">
          {stations.map((st) => (
            <button
              key={st.id}
              role="tab"
              aria-selected={st.id === selected}
              onClick={() => setSelected(st.id)}
              className={`border-r border-ink-600 px-2 py-3 text-left font-mono text-[11px] transition-colors last:border-r-0 ${st.id === selected ? "bg-ink-800 text-fog-50" : "text-fog-400 hover:text-fog-100"}`}
            >
              <span className="mb-1 block h-[3px] w-4" style={{ background: st.color }} />
              {st.short}
            </button>
          ))}
        </div>
        <div className="flex-1 p-5" role="tabpanel">
          <h3 className="text-lg text-fog-50">{s.name}</h3>
          <dl className="mt-4 divide-y divide-ink-700 border-y border-ink-700 text-sm">
            {[
              ["Meteocat code", s.code ?? "—"],
              ["Record", `${d.period[0]} → ${d.period[1]}`],
              ["Resolution", s.resolution],
              ["Altitude", s.altitude ? `${s.altitude} m` : "—"],
              ["Position", s.exactLocation ? `${s.lat.toFixed(4)}° N, ${s.lon.toFixed(4)}° E` : s.note ?? "Approximate"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-fog-400">{k}</dt>
                <dd className="text-right font-mono text-[12px] text-fog-100">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="label mb-2 mt-5">Variables · daily-data coverage</p>
          <ul className="space-y-1.5">
            {vars.map((v) => (
              <li key={v} className="grid grid-cols-[1fr_90px_44px] items-center gap-3 text-[13px]">
                <span className="text-fog-300">{variableById[v].label}</span>
                <span className="h-1 bg-ink-700"><span className="block h-1" style={{ width: `${d.variables[v]!.coverage}%`, background: s.color }} /></span>
                <span className="text-right font-mono text-[11px] text-fog-400">{d.variables[v]!.coverage.toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
