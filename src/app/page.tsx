import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "David Domínguez Ruiz",
  robots: { index: false },
  alternates: { canonical: "/en/" },
};

/**
 * Language picker for the bare root "/": uses the visitor's saved choice,
 * then the browser language, else English. Works without JS via the links.
 */
const pick = `(function(){try{var s=localStorage.getItem('lang');var L=['en','ca','es'];var l=L.indexOf(s)>-1?s:null;if(!l){var n=(navigator.languages||[navigator.language||'en']);for(var i=0;i<n.length&&!l;i++){var c=(n[i]||'').slice(0,2).toLowerCase();if(L.indexOf(c)>-1)l=c;}}location.replace('/'+(l||'en')+'/');}catch(e){location.replace('/en/');}})();`;

export default function RootRedirect() {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pick }} />
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/en/" />
        </noscript>
      </head>
      <body className="grid min-h-dvh place-items-center">
        <nav className="flex gap-3 text-sm" aria-label="Language">
          <a className="pill" href="/en/" hrefLang="en">English</a>
          <a className="pill" href="/ca/" hrefLang="ca">Català</a>
          <a className="pill" href="/es/" hrefLang="es">Español</a>
        </nav>
      </body>
    </html>
  );
}
