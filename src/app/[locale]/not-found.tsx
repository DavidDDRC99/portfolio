"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { getDict, localeFromPathname, lp } from "@/lib/i18n";

export default function NotFound() {
  const locale = localeFromPathname(usePathname());
  const d = getDict(locale).notFound;
  return (
    <Container className="py-32">
      <p className="label">{d.label}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-fog-50">{d.title}</h1>
      <Link href={lp(locale, "/")} className="mt-8 inline-block text-signal hover:underline">{d.back}</Link>
    </Container>
  );
}
