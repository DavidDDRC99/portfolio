import type { SiteContent } from "../types";

/**
 * English content. Keep wording factual: every claim here should be backed by
 * a repository, a document or something David has confirmed.
 */
export const en: SiteContent = {
  profile: {
    name: "David Domínguez Ruiz",
    role: "Physicist · MSc Meteorology student",
    tagline: "I study how the atmosphere behaves, and I build the tools I need to look at it.",
    intro: [
      "I graduated in Physics at the Universitat Autònoma de Barcelona and I'm now doing the Master's in Meteorology at the Universitat de Barcelona.",
      "Most of what I do sits between physical reasoning and code: taking a real dataset, cleaning it until it can be trusted, testing whether a signal is actually there, and turning the result into something other people can explore.",
      "Outside coursework I build things for myself, from a long-term climate analysis of the Vallès Occidental to a training tracker and a Linux server that runs in my home.",
    ],
    location: "Barcelona area, Catalonia",
    portrait: null, // TODO(David): add photo to public/images/portrait.png and set "/images/portrait.png"
  },

  contact: {
    email: "davidddrc99@gmail.com",
    linkedin: "https://www.linkedin.com/in/david-dominguez-ruiz-8720961a3",
    github: "https://github.com/DavidDDRC99",
  },

  interests: [
    "Physics & applied mathematics",
    "Atmospheric sciences",
    "Climate modelling",
    "Numerical weather prediction",
    "Scientific computing",
    "Remote sensing",
    "Renewable energy",
    "Interactive data visualisation",
  ],

  directions: [
    { title: "Atmospheric modelling & NWP", body: "How numerical models represent the atmosphere, and how their output is verified against observations." },
    { title: "Climate data & prediction", body: "Long observational records, trend detection and the statistics needed to say something defensible about change." },
    { title: "Meteorological applications", body: "Turning environmental data into products people actually use." },
    { title: "Remote sensing & Earth Observation", body: "Satellite meteorology and gridded observational products." },
    { title: "Data science & predictive modelling", body: "Statistical analysis and machine learning applied to physical systems, evaluated honestly." },
    { title: "Wind & solar energy", body: "Resource assessment and forecasting, where meteorology meets engineering decisions." },
  ],

  principles: [
    { title: "Curiosity first", body: "Most projects start with a question I wanted answered, not a tool I wanted to use." },
    { title: "Real systems, real data", body: "I prefer messy observations with gaps and sensor changes over clean toy problems." },
    { title: "Build it to understand it", body: "From a dashboard to a home server, I learn a system by setting it up and keeping it running." },
    { title: "Report what the data supports", body: "A non-significant trend is a result too. I try not to over-read the numbers." },
  ],

  exploring: [
    "Atmospheric dynamics and NWP in the MSc programme",
    "Drought indices (SPI / SPEI) on local station records",
    "Statistical downscaling of daily temperature to 30-minute curves",
    "Self-hosting: storage, media services and secure remote access",
  ],

  education: [
    {
      degree: "MSc in Meteorology",
      institution: "Universitat de Barcelona (UB)",
      period: "2025 — present",
      status: "in-progress",
      focus: ["Atmospheric dynamics", "Synoptic meteorology", "Numerical weather prediction", "Atmospheric thermodynamics", "Satellite meteorology & remote sensing", "Climate science"],
    },
    {
      degree: "BSc in Physics",
      institution: "Universitat Autònoma de Barcelona (UAB)",
      period: "Completed July 2025",
      status: "completed",
      focus: ["Classical & modern physics", "Mathematical modelling", "Numerical methods", "Statistical analysis", "Scientific programming", "Data processing & visualisation"],
      note: "Bachelor's thesis carried out at ICE-CSIC (Institute of Space Sciences).",
    },
    {
      degree: "IBM Data Science Professional Certificate",
      institution: "IBM",
      period: "Certificate",
      status: "completed",
      focus: ["Python", "Data analysis", "Machine learning"],
    },
    {
      degree: "Industrial Engineering (2 years)",
      institution: "Prior studies",
      period: "Before Physics",
      status: "completed",
      focus: ["Engineering fundamentals", "Applied technical disciplines"],
    },
  ],

  skills: [
    {
      id: "data",
      title: "Programming & data",
      description: "Day-to-day tooling for analysis work.",
      items: [
        { name: "Python", evidence: "All projects" },
        { name: "NumPy · Pandas", evidence: "VO-evolution, thesis" },
        { name: "SciPy", evidence: "VO-evolution trend tests" },
        { name: "Matplotlib", evidence: "VO-evolution, thesis" },
        { name: "Plotly · Dash", evidence: "VO-evolution dashboard" },
        { name: "Jupyter", evidence: "VO-evolution notebooks" },
        { name: "Astropy", evidence: "Thesis (FITS)" },
      ],
    },
    {
      id: "science",
      title: "Scientific computing",
      description: "Methods I have applied to real datasets.",
      items: [
        { name: "Time-series analysis" },
        { name: "Trend tests (Mann-Kendall, Sen, Pettitt)" },
        { name: "LOESS smoothing" },
        { name: "Drought indices (SPI / SPEI)" },
        { name: "Data cleaning & QC" },
        { name: "Image fitting (GALFIT)" },
        { name: "Reproducible workflows · pytest" },
      ],
    },
    {
      id: "ml",
      title: "Machine learning",
      description: "Used for predictive modelling and evaluated against a physical baseline.",
      items: [
        { name: "scikit-learn" },
        { name: "Multilayer Perceptron" },
        { name: "Random Forest" },
        { name: "K-Nearest Neighbours" },
        { name: "XGBoost", evidence: "Coded in the pipeline; not in the final executed comparison" },
        { name: "Cross-validated grid search" },
      ],
    },
    {
      id: "infra",
      title: "Development & infrastructure",
      description: "What keeps my own projects running.",
      items: [
        { name: "Linux (Debian)" },
        { name: "Git · GitHub" },
        { name: "Command line" },
        { name: "Self-hosted services" },
        { name: "Storage management" },
        { name: "Web development" },
      ],
    },
  ],

  projects: [
    {
      slug: "vo-evolution",
      title: "Three decades of weather in the Vallès Occidental",
      kicker: "Featured · Climate data analysis",
      summary:
        "Long-term analysis of three Meteocat stations (1996–2026): data collection, quality control, trend detection with Mann-Kendall and Sen's slope, drought indices, and a machine-learning model that reconstructs 30-minute temperature curves from daily values.",
      year: "2025 — 2026",
      tags: ["Python", "Pandas", "SciPy", "scikit-learn", "Dash"],
      featured: true,
      repo: "https://github.com/DavidDDRC99/VO-evolution",
      kind: "rich",
    },
    {
      slug: "red-nuggets-desi",
      title: "Active Galactic Nuclei in Red Nugget Galaxies from DESI DR1",
      kicker: "Bachelor's thesis · ICE-CSIC",
      summary:
        "Improving size measurements of compact massive galaxies from the DESI DR1 survey, and comparing GALFIT fits against the Tractor catalogue.",
      year: "2025",
      tags: ["Astropy", "FITS", "GALFIT", "NumPy", "Pandas"],
      kind: "standard",
    },
  ],

  projectDetails: {
    "red-nuggets-desi": {
      slug: "red-nuggets-desi",
      title: "Active Galactic Nuclei in Red Nugget Galaxies from DESI DR1",
      kicker: "Bachelor's thesis · ICE-CSIC",
      summary:
        "Improving size measurements of compact massive galaxies from the DESI DR1 survey, and comparing GALFIT fits against the Tractor catalogue.",
      year: "2025",
      tags: ["Astropy", "FITS", "GALFIT", "NumPy", "Pandas", "Matplotlib"],
      kind: "standard",
      context: [
        "Red nuggets are compact, massive, quiescent galaxies. Because they are so small on the sky, their measured sizes are sensitive to how the light profile is modelled, and that directly affects any conclusion drawn from them.",
        "My Bachelor's thesis, carried out at the Institute of Space Sciences (ICE-CSIC), focused on getting more reliable radii for a sample of these galaxies using data from the first DESI data release (DR1).",
      ],
      sections: [
        {
          title: "What I did",
          body: ["The work was mostly about building a careful pipeline around images and catalogues:"],
          bullets: [
            "Selecting and filtering candidate galaxies from DESI DR1 data.",
            "Reading and processing FITS images and tables with Astropy.",
            "Fitting galaxy light profiles with GALFIT.",
            "Quality assessment of the fits and removal of unreliable cases.",
            "Statistical comparison against the sizes reported by Tractor.",
          ],
        },
        {
          title: "Tractor vs GALFIT",
          body: [
            "In the analysed sample, Tractor radii were generally about 1.5–2 times larger than the radii obtained with GALFIT. For objects this compact, a systematic difference of that size is large enough to change which galaxies would be classified as red nuggets at all.",
          ],
        },
        {
          title: "Why it matters for what I do now",
          body: [
            "Astrophysics is not my current direction, but the skills transfer directly: working with large survey datasets, image analysis, filtering and quality control, and comparing two measurement methods without assuming either one is right.",
          ],
        },
      ],
      stack: ["Python", "Astropy", "NumPy", "Pandas", "Matplotlib", "GALFIT", "FITS"],
      outcome: [{ label: "Tractor / GALFIT radius", value: "≈ 1.5–2×", note: "Typical ratio in the analysed sample" }],
    },
  },

  applications: [
    {
      slug: "training-dashboard",
      title: "Personal Training Dashboard",
      kicker: "Application · Personal tool",
      summary:
        "A responsive dashboard to log and follow physical training across very different disciplines, from elliptical sessions to front lever progressions, with history and charts per exercise.",
      status: "In use",
      tags: ["Dashboard", "Forms", "Charts"],
      pendingVerification: true,
    },
    {
      slug: "home-server",
      title: "Home Server & Personal Data Centre",
      kicker: "Infrastructure · Self-hosted",
      summary:
        "An old laptop turned into a Debian server that centralises files, photos and media, with 4 TB of external storage, Jellyfin and Navidrome, and secure remote access through Tailscale.",
      status: "Running",
      tags: ["Debian 13", "Tailscale", "Jellyfin", "Navidrome"],
    },
  ],
};
