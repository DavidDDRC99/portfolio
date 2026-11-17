/** Shared content model. Every locale (en, later ca/es) implements `SiteContent`. */

export type Link = { label: string; href: string | null };

export type Profile = {
  name: string;
  role: string;
  tagline: string;
  intro: string[];
  location: string;
};

export type Contact = {
  /** null = not provided yet; rendered as a visible placeholder. */
  email: string | null;
  linkedin: string | null;
  github: string | null;
};

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
  status: "completed" | "in-progress";
  focus: string[];
  note?: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  description: string;
  items: { name: string; evidence?: string }[];
};

export type ProjectSummary = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  year: string;
  tags: string[];
  featured?: boolean;
  repo?: string;
  /** "rich" projects have their own hand-built page; others use the generic template. */
  kind: "rich" | "standard";
};

export type ProjectDetail = ProjectSummary & {
  context: string[];
  sections: { title: string; body: string[]; bullets?: string[] }[];
  stack: string[];
  outcome?: { label: string; value: string; note?: string }[];
};

export type ApplicationSummary = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  status: string;
  tags: string[];
  /** true until the source code/screenshots have been inspected. */
  pendingVerification?: boolean;
};

export type SiteContent = {
  profile: Profile;
  contact: Contact;
  interests: string[];
  directions: { title: string; body: string }[];
  principles: { title: string; body: string }[];
  exploring: string[];
  education: EducationItem[];
  skills: SkillGroup[];
  projects: ProjectSummary[];
  projectDetails: Record<string, ProjectDetail>;
  applications: ApplicationSummary[];
};
