import { fontVars } from "@/lib/fonts";

/** Global 404 (outside any locale). Static export writes it to out/404.html. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVars}>
      <body className="grid min-h-dvh place-items-center px-6">
        <div className="max-w-xl">
          <p className="label">404 · no signal</p>
          <h1 className="display mt-4 text-[64px] text-fog-50 sm:text-[96px]">Not found</h1>
          <p className="mt-4 text-fog-300">This page doesn&apos;t exist · Aquesta pàgina no existeix · Esta página no existe</p>
          <nav className="mt-8 flex flex-wrap gap-3 text-sm" aria-label="Language">
            <a className="pill" href="/en/" hrefLang="en">Home</a>
            <a className="pill" href="/ca/" hrefLang="ca">Inici</a>
            <a className="pill" href="/es/" hrefLang="es">Inicio</a>
          </nav>
        </div>
      </body>
    </html>
  );
}
