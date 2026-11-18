import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { site } from "@/lib/site";
import { fontVars } from "@/lib/fonts";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${d.meta.siteTitle}`, template: `%s — ${site.name}` },
    authors: [{ name: site.name }],
    icons: { icon: "/icon.svg" },
    twitter: { card: "summary_large_image", title: site.name, description: d.meta.description },
    ...pageMeta(locale, "/"),
  };
}

export const viewport: Viewport = { themeColor: "#e2e7fd", colorScheme: "light" };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale as Locale);
  return (
    <html lang={locale} className={fontVars} suppressHydrationWarning>
      <head>
        {/* Marks JS as available before paint so reveal animations never hide content without JS. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          {d.nav.skip}
        </a>
        <Nav labels={d.nav} />
        <main id="main" className="flex-1">{children}</main>
        <Footer locale={locale as Locale} />
        <RevealObserver />
      </body>
    </html>
  );
}
