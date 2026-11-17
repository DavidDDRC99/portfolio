"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Tracks an element's content width so SVG charts render at true pixel size. */
export function useMeasure<T extends HTMLElement>(initial = 720) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Measure before first paint so charts never animate from the default width.
    setWidth(Math.max(280, Math.floor(el.getBoundingClientRect().width)));
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.floor(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Segmented control used across the explorer panels. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  options: { value: T; label: string; disabled?: boolean; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap border border-ink-600">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={o.disabled}
            title={o.title}
            onClick={() => onChange(o.value)}
            className={`border-r border-ink-600 font-mono transition-colors last:border-r-0 disabled:cursor-not-allowed disabled:opacity-30 ${
              size === "sm" ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-[12px]"
            } ${active ? "bg-fog-50 text-ink-900" : "text-fog-300 hover:bg-ink-800 hover:text-fog-50"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
