import "./globals.css";

/**
 * Pass-through root layout. The real <html> lives in app/[locale]/layout.tsx
 * so each language gets the right `lang` attribute.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
