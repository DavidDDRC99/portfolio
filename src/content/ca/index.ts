import type { SiteContent } from "../types";
import { en } from "../en";

/** Contingut en català. Mateixa estructura i mateixos fets que la versió anglesa. */
export const ca: SiteContent = {
  profile: {
    name: "David Domínguez Ruiz",
    role: "Físic · Estudiant del Màster en Meteorologia",
    tagline: "Estudio com es comporta l'atmosfera i construeixo les eines que necessito per observar-la.",
    intro: [
      "Em vaig graduar en Física a la Universitat Autònoma de Barcelona i ara curso el Màster en Meteorologia a la Universitat de Barcelona.",
      "La major part del que faig se situa entre el raonament físic i el codi: agafar un conjunt de dades real, netejar-lo fins que sigui fiable, comprovar si un senyal hi és de debò i convertir el resultat en alguna cosa que altres persones puguin explorar.",
      "Fora de les classes construeixo coses per a mi mateix: des d'una anàlisi climàtica de llarg termini del Vallès Occidental fins a una aplicació per seguir l'entrenament i un servidor Linux que funciona a casa.",
    ],
    location: "Àrea de Barcelona, Catalunya",
    portrait: en.profile.portrait,
  },

  contact: en.contact,

  interests: [
    "Física i matemàtica aplicada",
    "Ciències de l'atmosfera",
    "Modelització climàtica",
    "Predicció numèrica del temps",
    "Computació científica",
    "Teledetecció",
    "Energies renovables",
    "Visualització interactiva de dades",
  ],

  directions: [
    { title: "Modelització atmosfèrica i NWP", body: "Com els models numèrics representen l'atmosfera i com es verifiquen els seus resultats amb observacions." },
    { title: "Dades climàtiques i predicció", body: "Sèries d'observació llargues, detecció de tendències i l'estadística necessària per afirmar alguna cosa defensable sobre el canvi." },
    { title: "Aplicacions meteorològiques", body: "Convertir dades ambientals en productes que la gent faci servir de veritat." },
    { title: "Teledetecció i observació de la Terra", body: "Meteorologia per satèl·lit i productes d'observació en malla." },
    { title: "Ciència de dades i modelització predictiva", body: "Anàlisi estadística i aprenentatge automàtic aplicats a sistemes físics, avaluats amb honestedat." },
    { title: "Energia eòlica i solar", body: "Avaluació i predicció del recurs, on la meteorologia es troba amb les decisions d'enginyeria." },
  ],

  principles: [
    { title: "Primer, la curiositat", body: "La majoria de projectes comencen amb una pregunta que volia respondre, no amb una eina que volia fer servir." },
    { title: "Sistemes reals, dades reals", body: "Prefereixo observacions imperfectes, amb buits i canvis de sensor, a problemes de joguina nets." },
    { title: "Construir-ho per entendre-ho", body: "D'un dashboard a un servidor a casa: aprenc un sistema muntant-lo i mantenint-lo en marxa." },
    { title: "Explicar el que diuen les dades", body: "Una tendència no significativa també és un resultat. Intento no llegir els números més enllà del que permeten." },
  ],

  exploring: [
    "Dinàmica atmosfèrica i NWP al màster",
    "Índexs de sequera (SPI / SPEI) amb sèries d'estacions locals",
    "Downscaling estadístic de la temperatura diària a corbes de 30 minuts",
    "Autoallotjament: emmagatzematge, serveis multimèdia i accés remot segur",
  ],

  education: [
    {
      degree: "Màster en Meteorologia",
      institution: "Universitat de Barcelona (UB)",
      period: "2025 — actualitat",
      status: "in-progress",
      focus: ["Dinàmica atmosfèrica", "Meteorologia sinòptica", "Predicció numèrica del temps", "Termodinàmica atmosfèrica", "Meteorologia per satèl·lit i teledetecció", "Ciència del clima"],
    },
    {
      degree: "Grau en Física",
      institution: "Universitat Autònoma de Barcelona (UAB)",
      period: "Finalitzat el juliol de 2025",
      status: "completed",
      focus: ["Física clàssica i moderna", "Modelització matemàtica", "Mètodes numèrics", "Anàlisi estadística", "Programació científica", "Processament i visualització de dades"],
      note: "Treball de Fi de Grau realitzat a l'ICE-CSIC (Institut de Ciències de l'Espai).",
    },
    {
      degree: "IBM Data Science Professional Certificate",
      institution: "IBM",
      period: "Certificat",
      status: "completed",
      focus: ["Python", "Anàlisi de dades", "Aprenentatge automàtic"],
    },
    {
      degree: "Enginyeria Industrial (2 cursos)",
      institution: "Estudis previs",
      period: "Abans de Física",
      status: "completed",
      focus: ["Fonaments d'enginyeria", "Disciplines tècniques aplicades"],
    },
  ],

  skills: [
    {
      id: "data",
      title: "Programació i dades",
      description: "Les eines del dia a dia per analitzar dades.",
      items: [
        { name: "Python", evidence: "Tots els projectes" },
        { name: "NumPy · Pandas", evidence: "VO-evolution, TFG" },
        { name: "SciPy", evidence: "Tests de tendència de VO-evolution" },
        { name: "Matplotlib", evidence: "VO-evolution, TFG" },
        { name: "Plotly · Dash", evidence: "Dashboard de VO-evolution" },
        { name: "Jupyter", evidence: "Notebooks de VO-evolution" },
        { name: "Astropy", evidence: "TFG (FITS)" },
      ],
    },
    {
      id: "science",
      title: "Computació científica",
      description: "Mètodes que he aplicat a dades reals.",
      items: [
        { name: "Anàlisi de sèries temporals" },
        { name: "Tests de tendència (Mann-Kendall, Sen, Pettitt)" },
        { name: "Suavitzat LOESS" },
        { name: "Índexs de sequera (SPI / SPEI)" },
        { name: "Neteja i control de qualitat de dades" },
        { name: "Ajust d'imatges (GALFIT)" },
        { name: "Fluxos reproduïbles · pytest" },
      ],
    },
    {
      id: "ml",
      title: "Aprenentatge automàtic",
      description: "Per a modelització predictiva, sempre comparat amb una referència física.",
      items: [
        { name: "scikit-learn" },
        { name: "Perceptró multicapa" },
        { name: "Random Forest" },
        { name: "K veïns més propers" },
        { name: "XGBoost", evidence: "Al codi del pipeline; no a la comparació final executada" },
        { name: "Cerca d'hiperparàmetres amb validació creuada" },
      ],
    },
    {
      id: "infra",
      title: "Desenvolupament i infraestructura",
      description: "El que fa funcionar els meus projectes.",
      items: [
        { name: "Linux (Debian)" },
        { name: "Git · GitHub" },
        { name: "Línia d'ordres" },
        { name: "Serveis autoallotjats" },
        { name: "Gestió d'emmagatzematge" },
        { name: "Desenvolupament web" },
      ],
    },
  ],

  projects: [
    {
      ...en.projects[0],
      title: "Tres dècades de temps al Vallès Occidental",
      kicker: "Destacat · Anàlisi de dades climàtiques",
      summary:
        "Anàlisi de llarg termini de tres estacions de Meteocat (1996–2026): recollida de dades, control de qualitat, detecció de tendències amb Mann-Kendall i el pendent de Sen, índexs de sequera i un model d'aprenentatge automàtic que reconstrueix corbes de temperatura de 30 minuts a partir de valors diaris.",
    },
    {
      ...en.projects[1],
      kicker: "Treball de Fi de Grau · ICE-CSIC",
      summary: "Millorar les mesures de mida de galàxies compactes i massives del cens DESI DR1 i comparar els ajustos de GALFIT amb el catàleg de Tractor.",
    },
  ],

  projectDetails: {
    "red-nuggets-desi": {
      ...en.projectDetails["red-nuggets-desi"],
      kicker: "Treball de Fi de Grau · ICE-CSIC",
      summary: "Millorar les mesures de mida de galàxies compactes i massives del cens DESI DR1 i comparar els ajustos de GALFIT amb el catàleg de Tractor.",
      context: [
        "Les red nuggets són galàxies compactes, massives i quiescents. Com que al cel són tan petites, la mida que se'ls mesura depèn molt de com es modelitza el perfil de llum, i això condiciona qualsevol conclusió que se'n tregui.",
        "El meu Treball de Fi de Grau, fet a l'Institut de Ciències de l'Espai (ICE-CSIC), es va centrar a obtenir radis més fiables per a una mostra d'aquestes galàxies amb dades de la primera publicació de DESI (DR1).",
      ],
      sections: [
        {
          title: "Què vaig fer",
          body: ["La feina va consistir sobretot a construir un procés acurat al voltant d'imatges i catàlegs:"],
          bullets: [
            "Seleccionar i filtrar galàxies candidates a partir de dades de DESI DR1.",
            "Llegir i processar imatges i taules FITS amb Astropy.",
            "Ajustar perfils de llum de galàxies amb GALFIT.",
            "Avaluar la qualitat dels ajustos i descartar els casos poc fiables.",
            "Comparar estadísticament els resultats amb les mides que dona Tractor.",
          ],
        },
        {
          title: "Tractor vs GALFIT",
          body: [
            "A la mostra analitzada, els radis de Tractor eren en general entre 1,5 i 2 vegades més grans que els obtinguts amb GALFIT. Per a objectes tan compactes, una diferència sistemàtica d'aquesta mida és prou gran per canviar quines galàxies es classificarien com a red nuggets.",
          ],
        },
        {
          title: "Per què és rellevant per al que faig ara",
          body: [
            "L'astrofísica no és la meva orientació actual, però les habilitats es traslladen directament: treballar amb grans censos de dades, analitzar imatges, filtrar i controlar la qualitat, i comparar dos mètodes de mesura sense donar per fet que un dels dos és el correcte.",
          ],
        },
      ],
      outcome: [{ label: "Radi Tractor / GALFIT", value: "≈ 1,5–2×", note: "Ràtio típica a la mostra analitzada" }],
    },
  },

  applications: [
    {
      ...en.applications[0],
      title: "Dashboard d'entrenament personal",
      kicker: "Aplicació · Eina personal",
      summary:
        "Un dashboard adaptable per registrar i seguir l'entrenament en disciplines molt diferents, de sessions d'el·líptica a progressions de front lever, amb historial i gràfics per exercici.",
      status: "En ús",
      tags: ["Dashboard", "Formularis", "Gràfics"],
    },
    {
      ...en.applications[1],
      title: "Servidor domèstic i centre de dades personal",
      kicker: "Infraestructura · Autoallotjat",
      summary:
        "Un portàtil antic convertit en un servidor Debian que centralitza fitxers, fotos i multimèdia, amb 4 TB d'emmagatzematge extern, Jellyfin i Navidrome, i accés remot segur amb Tailscale.",
      status: "En funcionament",
    },
  ],
};
