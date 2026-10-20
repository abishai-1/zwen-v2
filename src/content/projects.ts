export type ProjectStatus = "Completed" | "In Progress" | "Concept" | "Experiment";

export type Project = {
  slug: string;
  title: string;
  category: "Digital Products" | "Mobile Applications" | "Web Platforms" | "3D & Motion" | "Brand & Content" | "Experiments";
  status: ProjectStatus;
  year: string;
  summary: string;
  role: string[];
  context?: string;
  challenge?: string;
  objectives?: string[];
  approach?: string;
  scope?: string[];
  build?: string;
  stack?: string[];
  release?: string;
  /** Verified outcomes only. Never invent metrics. */
  results?: string[];
  credits?: string[];
  liveUrl?: string;
};

/**
 * Real work only. Add projects here as case studies are approved for publication.
 * The studio site itself is listed because it is genuine, ongoing ZWEN work.
 */
export const PROJECTS: Project[] = [
  {
    slug: "zwen-studio-site",
    title: "ZWEN — Studio Website",
    category: "Web Platforms",
    status: "In Progress",
    year: "2026",
    summary: "The studio's own site: a fully animated web experience that moves between four visual languages.",
    role: ["Creative direction", "UI/UX", "Frontend engineering", "Motion & WebGL", "Backend & infrastructure"],
    context: "ZWEN needed a home that demonstrates its range — engineering, motion and creative direction — rather than simply listing services.",
    challenge: "Make every element move and let four distinct styles (ASCII, Japanese ink, medieval codex, cyber HUD) coexist without losing clarity, accessibility or performance.",
    objectives: [
      "Explain the complete scope of the studio",
      "Demonstrate craft through the site itself",
      "Provide a low-friction route to start a project",
    ],
    approach:
      "One persistent WebGL glyph field morphs its character set between styles; a glyph-cascade overlay carries visitors between pages; a shared motion system drives scroll, cursor and reveal effects.",
    scope: ["Information architecture", "Visual system", "Motion system", "Frontend", "Enquiry backend", "Deployment"],
    build: "Each page owns a style; the home page travels through all four. Motion respects reduced-motion preferences and adapts quality to the device.",
    stack: ["Next.js", "TypeScript", "Three.js / GLSL", "GSAP", "Lenis", "Tailwind CSS", "PostgreSQL", "Drizzle ORM"],
    release: "Deployed on Vercel; planned migration to AWS.",
    credits: ["ZWEN"],
  },
];

export const CATEGORIES = Array.from(new Set(PROJECTS.map((p) => p.category)));
