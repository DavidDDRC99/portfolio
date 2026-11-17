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
  app/                      routes (one folder per page)
    projects/vo-evolution/  hand-built interactive page for the climate project
    projects/[slug]/        generic template for other projects (driven by content)
    applications/…          one page per application
  components/
    layout/  ui/            nav, footer, containers, tags, placeholders
    charts/                 shared chart helpers (useMeasure, Segmented, sparkline)
    meteo/                  map, time-series explorer, trend matrix, ML panels
    apps/                   home-server architecture diagram
    home/                   isobar hero canvas
  content/
    types.ts                content model shared by all languages
    en/index.ts             all English text — edit here to update the site
  lib/
    i18n.ts                 locale registry (ca / es can be added later)
    meteo.ts                station metadata + typed access to the generated data
scripts/build_meteo_data.py regenerates public/data/meteo/*.json from the repo CSVs
public/data/meteo/          generated data (do not edit by hand)
```

### Adding content
- **New standard project:** add a summary to `projects` and a detail entry to `projectDetails` in `src/content/en/index.ts`. The page is generated automatically.
- **New application:** add it to `applications` and create `src/app/applications/<slug>/page.tsx`.
- **Contact details:** fill `contact.email` / `contact.linkedin` in `src/content/en/index.ts`.
- **Catalan / Spanish:** copy `src/content/en` to `src/content/ca`, translate, register it in `src/lib/i18n.ts`, then move routes under `app/[locale]/`.

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
