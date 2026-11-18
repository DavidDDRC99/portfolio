import type { SiteContent } from "../types";
import { en } from "../en";

/** Contenido en castellano. Misma estructura y mismos hechos que la versión inglesa. */
export const es: SiteContent = {
  profile: {
    name: "David Domínguez Ruiz",
    role: "Físico · Estudiante del Máster en Meteorología",
    tagline: "Estudio cómo se comporta la atmósfera y construyo las herramientas que necesito para observarla.",
    intro: [
      "Me gradué en Física en la Universitat Autònoma de Barcelona y ahora curso el Máster en Meteorología en la Universitat de Barcelona.",
      "Casi todo lo que hago está entre el razonamiento físico y el código: tomar un conjunto de datos real, limpiarlo hasta que sea fiable, comprobar si una señal existe de verdad y convertir el resultado en algo que otras personas puedan explorar.",
      "Fuera de las clases construyo cosas para mí: desde un análisis climático a largo plazo del Vallès Occidental hasta una aplicación para seguir mi entrenamiento y un servidor Linux que funciona en casa.",
    ],
    location: "Área de Barcelona, Cataluña",
    portrait: en.profile.portrait,
  },

  contact: en.contact,

  interests: [
    "Física y matemática aplicada",
    "Ciencias de la atmósfera",
    "Modelización climática",
    "Predicción numérica del tiempo",
    "Computación científica",
    "Teledetección",
    "Energías renovables",
    "Visualización interactiva de datos",
  ],

  directions: [
    { title: "Modelización atmosférica y NWP", body: "Cómo los modelos numéricos representan la atmósfera y cómo se verifican sus resultados con observaciones." },
    { title: "Datos climáticos y predicción", body: "Series de observación largas, detección de tendencias y la estadística necesaria para afirmar algo defendible sobre el cambio." },
    { title: "Aplicaciones meteorológicas", body: "Convertir datos ambientales en productos que la gente use de verdad." },
    { title: "Teledetección y observación de la Tierra", body: "Meteorología por satélite y productos de observación en malla." },
    { title: "Ciencia de datos y modelización predictiva", body: "Análisis estadístico y aprendizaje automático aplicados a sistemas físicos, evaluados con honestidad." },
    { title: "Energía eólica y solar", body: "Evaluación y predicción del recurso, donde la meteorología se encuentra con las decisiones de ingeniería." },
  ],

  principles: [
    { title: "Primero, la curiosidad", body: "La mayoría de proyectos empiezan con una pregunta que quería responder, no con una herramienta que quería usar." },
    { title: "Sistemas reales, datos reales", body: "Prefiero observaciones imperfectas, con huecos y cambios de sensor, a problemas de juguete limpios." },
    { title: "Construirlo para entenderlo", body: "De un dashboard a un servidor en casa: aprendo un sistema montándolo y manteniéndolo en marcha." },
    { title: "Contar lo que dicen los datos", body: "Una tendencia no significativa también es un resultado. Intento no leer los números más allá de lo que permiten." },
  ],

  exploring: [
    "Dinámica atmosférica y NWP en el máster",
    "Índices de sequía (SPI / SPEI) con series de estaciones locales",
    "Downscaling estadístico de la temperatura diaria a curvas de 30 minutos",
    "Autoalojamiento: almacenamiento, servicios multimedia y acceso remoto seguro",
  ],

  education: [
    {
      degree: "Máster en Meteorología",
      institution: "Universitat de Barcelona (UB)",
      period: "2025 — actualidad",
      status: "in-progress",
      focus: ["Dinámica atmosférica", "Meteorología sinóptica", "Predicción numérica del tiempo", "Termodinámica atmosférica", "Meteorología por satélite y teledetección", "Ciencia del clima"],
    },
    {
      degree: "Grado en Física",
      institution: "Universitat Autònoma de Barcelona (UAB)",
      period: "Finalizado en julio de 2025",
      status: "completed",
      focus: ["Física clásica y moderna", "Modelización matemática", "Métodos numéricos", "Análisis estadístico", "Programación científica", "Procesamiento y visualización de datos"],
      note: "Trabajo de Fin de Grado realizado en el ICE-CSIC (Instituto de Ciencias del Espacio).",
    },
    {
      degree: "IBM Data Science Professional Certificate",
      institution: "IBM",
      period: "Certificado",
      status: "completed",
      focus: ["Python", "Análisis de datos", "Aprendizaje automático"],
    },
    {
      degree: "Ingeniería Industrial (2 cursos)",
      institution: "Estudios previos",
      period: "Antes de Física",
      status: "completed",
      focus: ["Fundamentos de ingeniería", "Disciplinas técnicas aplicadas"],
    },
  ],

  skills: [
    {
      id: "data",
      title: "Programación y datos",
      description: "Las herramientas del día a día para analizar datos.",
      items: [
        { name: "Python", evidence: "Todos los proyectos" },
        { name: "NumPy · Pandas", evidence: "VO-evolution, TFG" },
        { name: "SciPy", evidence: "Tests de tendencia de VO-evolution" },
        { name: "Matplotlib", evidence: "VO-evolution, TFG" },
        { name: "Plotly · Dash", evidence: "Dashboard de VO-evolution" },
        { name: "Jupyter", evidence: "Notebooks de VO-evolution" },
        { name: "Astropy", evidence: "TFG (FITS)" },
      ],
    },
    {
      id: "science",
      title: "Computación científica",
      description: "Métodos que he aplicado a datos reales.",
      items: [
        { name: "Análisis de series temporales" },
        { name: "Tests de tendencia (Mann-Kendall, Sen, Pettitt)" },
        { name: "Suavizado LOESS" },
        { name: "Índices de sequía (SPI / SPEI)" },
        { name: "Limpieza y control de calidad de datos" },
        { name: "Ajuste de imágenes (GALFIT)" },
        { name: "Flujos reproducibles · pytest" },
      ],
    },
    {
      id: "ml",
      title: "Aprendizaje automático",
      description: "Para modelización predictiva, siempre comparado con una referencia física.",
      items: [
        { name: "scikit-learn" },
        { name: "Perceptrón multicapa" },
        { name: "Random Forest" },
        { name: "K vecinos más cercanos" },
        { name: "XGBoost", evidence: "En el código del pipeline; no en la comparación final ejecutada" },
        { name: "Búsqueda de hiperparámetros con validación cruzada" },
      ],
    },
    {
      id: "infra",
      title: "Desarrollo e infraestructura",
      description: "Lo que hace funcionar mis proyectos.",
      items: [
        { name: "Linux (Debian)" },
        { name: "Git · GitHub" },
        { name: "Línea de comandos" },
        { name: "Servicios autoalojados" },
        { name: "Gestión de almacenamiento" },
        { name: "Desarrollo web" },
      ],
    },
  ],

  projects: [
    {
      ...en.projects[0],
      title: "Tres décadas de tiempo en el Vallès Occidental",
      kicker: "Destacado · Análisis de datos climáticos",
      summary:
        "Análisis a largo plazo de tres estaciones de Meteocat (1996–2026): recogida de datos, control de calidad, detección de tendencias con Mann-Kendall y la pendiente de Sen, índices de sequía y un modelo de aprendizaje automático que reconstruye curvas de temperatura de 30 minutos a partir de valores diarios.",
    },
    {
      ...en.projects[1],
      kicker: "Trabajo de Fin de Grado · ICE-CSIC",
      summary: "Mejorar las medidas de tamaño de galaxias compactas y masivas del censo DESI DR1 y comparar los ajustes de GALFIT con el catálogo de Tractor.",
    },
  ],

  projectDetails: {
    "red-nuggets-desi": {
      ...en.projectDetails["red-nuggets-desi"],
      kicker: "Trabajo de Fin de Grado · ICE-CSIC",
      summary: "Mejorar las medidas de tamaño de galaxias compactas y masivas del censo DESI DR1 y comparar los ajustes de GALFIT con el catálogo de Tractor.",
      context: [
        "Las red nuggets son galaxias compactas, masivas y quiescentes. Como en el cielo son tan pequeñas, el tamaño que se les mide depende mucho de cómo se modeliza el perfil de luz, y eso condiciona cualquier conclusión que se saque de ellas.",
        "Mi Trabajo de Fin de Grado, realizado en el Instituto de Ciencias del Espacio (ICE-CSIC), se centró en obtener radios más fiables para una muestra de estas galaxias con datos de la primera publicación de DESI (DR1).",
      ],
      sections: [
        {
          title: "Qué hice",
          body: ["El trabajo consistió sobre todo en construir un proceso cuidadoso alrededor de imágenes y catálogos:"],
          bullets: [
            "Seleccionar y filtrar galaxias candidatas a partir de datos de DESI DR1.",
            "Leer y procesar imágenes y tablas FITS con Astropy.",
            "Ajustar perfiles de luz de galaxias con GALFIT.",
            "Evaluar la calidad de los ajustes y descartar los casos poco fiables.",
            "Comparar estadísticamente los resultados con los tamaños que da Tractor.",
          ],
        },
        {
          title: "Tractor vs GALFIT",
          body: [
            "En la muestra analizada, los radios de Tractor eran en general entre 1,5 y 2 veces mayores que los obtenidos con GALFIT. Para objetos tan compactos, una diferencia sistemática de ese tamaño basta para cambiar qué galaxias se clasificarían como red nuggets.",
          ],
        },
        {
          title: "Por qué es relevante para lo que hago ahora",
          body: [
            "La astrofísica no es mi orientación actual, pero las habilidades se trasladan directamente: trabajar con grandes censos de datos, analizar imágenes, filtrar y controlar la calidad, y comparar dos métodos de medida sin dar por hecho que uno de los dos es el correcto.",
          ],
        },
      ],
      outcome: [{ label: "Radio Tractor / GALFIT", value: "≈ 1,5–2×", note: "Ratio típica en la muestra analizada" }],
    },
  },

  applications: [
    {
      ...en.applications[0],
      title: "Dashboard de entrenamiento personal",
      kicker: "Aplicación · Herramienta personal",
      summary:
        "Un dashboard adaptable para registrar y seguir el entrenamiento en disciplinas muy distintas, de sesiones de elíptica a progresiones de front lever, con historial y gráficos por ejercicio.",
      status: "En uso",
      tags: ["Dashboard", "Formularios", "Gráficos"],
    },
    {
      ...en.applications[1],
      title: "Servidor doméstico y centro de datos personal",
      kicker: "Infraestructura · Autoalojado",
      summary:
        "Un portátil antiguo convertido en un servidor Debian que centraliza archivos, fotos y multimedia, con 4 TB de almacenamiento externo, Jellyfin y Navidrome, y acceso remoto seguro con Tailscale.",
      status: "En funcionamiento",
    },
  ],
};
