"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { locales, localeNames, localeFromPathname, lp, switchLocalePath, type Locale } from "@/lib/i18n";
import type { Dict } from "@/i18n/en";

function LanguageSwitch({ locale, pathname, label, className = "" }: { locale: Locale; pathname: string; label: string; className?: string }) {
  const remember = (l: Locale) => {
    try {
      localStorage.setItem("lang", l);
    } catch {
      /* storage unavailable: the URL still carries the language */
    }
  };
  return (
    <nav aria-label={label} className={`flex items-center rounded-full border border-ink-600 bg-white/60 p-0.5 ${className}`}>
      {locales.map((l) => (
        // Plain <a>: each language has its own root layout (<html lang>), so a full load is correct.
        <a
          key={l}
          href={switchLocalePath(pathname, l)}
          hrefLang={l}
          lang={l}
          onClick={() => remember(l)}
          aria-current={l === locale ? "true" : undefined}
          title={localeNames[l].long}
          className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${l === locale ? "bg-fog-50 text-white" : "text-fog-400 hover:text-fog-50"}`}
        >
          {localeNames[l].short}
        </a>
      ))}
    </nav>
  );
}

export function Nav({ labels }: { labels: Dict["nav"] }) {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPathname(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  // Remember the language of any page the visitor lands on.
  useEffect(() => {
    try {
      localStorage.setItem("lang", locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const isActive = (path: string) => {
    const href = lp(locale, path);
    return path === "/" ? pathname === href || pathname === href.slice(0, -1) : pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || open ? "border-white/60 bg-white/55 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href={lp(locale, "/")} className="group flex items-baseline gap-1" aria-label={labels.homeAria}>
          <span className="text-[17px] font-bold tracking-[-0.03em] text-fog-50">David Domínguez</span>
          <span className="text-[11px] font-semibold text-signal">®</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.key}>
                  <Link
                    href={lp(locale, item.path)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-1.5 text-[14px] transition-colors ${
                      isActive(item.path) ? "bg-fog-50 text-white" : "text-fog-300 hover:text-fog-50"
                    }`}
                  >
                    {labels[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <LanguageSwitch locale={locale} pathname={pathname} label={labels.language} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch locale={locale} pathname={pathname} label={labels.language} />
          <button
            type="button"
            className="rounded-full border border-ink-600 bg-white/60 px-3.5 py-1.5 text-[13px] text-fog-100"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>

      <nav id="mobile-nav" aria-label="Main mobile" hidden={!open} className="border-t border-white/60 md:hidden">
        <ul className="mx-auto max-w-[1280px] px-4 py-2">
          {nav.map((item, i) => (
            <li key={item.key}>
              <Link
                href={lp(locale, item.path)}
                aria-current={isActive(item.path) ? "page" : undefined}
                className="flex items-baseline gap-4 border-b border-ink-700 py-3 text-2xl font-semibold tracking-tight text-fog-50 last:border-0"
              >
                <span className="font-mono text-[11px] text-fog-500">{String(i).padStart(2, "0")}</span>
                <span className={isActive(item.path) ? "text-signal" : ""}>{labels[item.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
