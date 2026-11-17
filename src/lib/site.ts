/** Site-wide constants. Update `url` once the final domain is known. */
export const site = {
  name: "David Domínguez Ruiz",
  // Default matches the Cloudflare Pages project name in wrangler.toml; override with NEXT_PUBLIC_SITE_URL for a custom domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://david-dominguez-portfolio.pages.dev",
  description:
    "Physicist and MSc Meteorology student. Climate data analysis, scientific computing, and the software and infrastructure I build along the way.",
};

export const nav = [
  { href: "/", label: "Index" },
  { href: "/about/", label: "About" },
  { href: "/projects/", label: "Projects" },
  { href: "/applications/", label: "Applications" },
  { href: "/contact/", label: "Contact" },
] as const;
