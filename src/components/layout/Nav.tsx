"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href.replace(/\/$/, "")));

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || open ? "border-ink-700 bg-ink-900/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-baseline gap-2" aria-label="David Domínguez Ruiz, home">
          <span className="font-mono text-[13px] font-medium tracking-tight text-fog-50">DDR</span>
          <span className="hidden font-mono text-[11px] text-fog-500 transition-colors group-hover:text-signal sm:inline">
            / physics · atmosphere · code
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative px-3 py-2 text-[13px] transition-colors ${
                    isActive(item.href) ? "text-fog-50" : "text-fog-400 hover:text-fog-100"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && <span className="absolute inset-x-3 -bottom-[11px] h-px bg-signal" aria-hidden />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 font-mono text-[12px] text-fog-300 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main mobile" hidden={!open} className="border-t border-ink-700 md:hidden">
        <ul className="mx-auto max-w-[1240px] px-4 py-2">
          {nav.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-baseline gap-4 border-b border-ink-800 py-3 text-lg text-fog-100 last:border-0"
              >
                <span className="font-mono text-[11px] text-fog-500">{String(i).padStart(2, "0")}</span>
                <span className={isActive(item.href) ? "text-signal" : ""}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
