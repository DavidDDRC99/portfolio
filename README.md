# Portfolio — David Domínguez Ruiz

Static site built with **Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS 4**.
Charts are custom SVG (d3-scale / d3-shape); the station map uses Leaflet + OpenStreetMap tiles.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # writes the static site to out/
```

## Structure

```
src/
  app/
    layout.tsx              pass-through root layout (imports globals.css)
    page.tsx                "/" → picks a language (saved choice, then browser) → /en/ /ca/ /es/
    not-found.tsx           global 404 (out/404.html)
    [locale]/               every page, once per language
      layout.tsx            <html lang>, nav with language switcher, footer
      projects/vo-evolution/  hand-built interactive page for the climate project
      projects/[slug]/        generic template for other projects (driven by content)
      applications/…          one page per application
  components/               layout, ui, charts, meteo, apps, home
  content/{en,ca,es}/       profile, education, skills, projects, applications (facts)
  i18n/{en,ca,es}.ts        all interface and page copy; ca/es must match en's shape
  lib/i18n.ts               locales, getContent / getDict, lp() for localized links
  lib/meta.ts               per-page metadata with hreflang alternates
scripts/build_meteo_data.py regenerates public/data/meteo/*.json from the repo CSVs
public/_redirects           old language-less URLs → /en/…
```

### Editing text
- **Facts about David** (bio, education, skills, projects): `src/content/<lang>/index.ts`.
- **Page and interface copy**: `src/i18n/<lang>.ts`. TypeScript fails the build if a translation is missing a key.
- **New standard project**: add it to `projects` + `projectDetails` in all three content files.
- **New application**: add it to `applications` and create `src/app/[locale]/applications/<slug>/page.tsx`.
- **Portrait photo**: put it in `public/images/portrait.png` and set `profile.portrait` to `"/images/portrait.png"` in each content file.

### Regenerating the meteorological data
Requires Python with pandas, scipy and statsmodels:
```bash
python scripts/build_meteo_data.py ../projects/meteorological-project/source-code public/data/meteo
```

## Deploy (free) — Cloudflare Pages

Config is already in place: `wrangler.toml` (output dir `out`), `.node-version` (Node 22),
`public/_headers` (security + caching headers). The 404 page is `out/404.html`, picked up automatically.

### Option A — connect GitHub (recommended: redeploys on every push)
1. Create an empty repository on GitHub (e.g. `portfolio`), then from this folder:
   ```bash
   git remote add origin https://github.com/DavidDDRC99/portfolio.git
   git push -u origin main
   ```
2. Cloudflare dashboard → Workers & Pages → Create → Pages → **Connect to Git** → pick the repo.
3. Framework preset: *None*. Build command `npm run build`. Output directory `out`.
4. Environment variable `NEXT_PUBLIC_SITE_URL` = the final URL (e.g. `https://david-dominguez-portfolio.pages.dev`), used for the sitemap and canonical links.

### Option B — upload from this computer (no GitHub needed)
```bash
npx wrangler@4 login     # opens the browser to sign in to Cloudflare
npm run deploy           # builds and uploads out/
```

A custom domain can be added later under the project's *Custom domains* tab.
