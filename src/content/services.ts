export const PILLARS = [
  {
    no: "01",
    title: "Engineering & Digital Products",
    short: "Complete web and mobile applications — frontend, backend, data, infrastructure, release.",
    anchor: "engineering",
    kanji: "工",
  },
  {
    no: "02",
    title: "3D, Motion & Visual Experiences",
    short: "Product visualisation, animation, motion graphics, VFX and interactive worlds.",
    anchor: "visual",
    kanji: "動",
  },
  {
    no: "03",
    title: "Brand, Content & Creative",
    short: "Identity, creative direction, social content, video and digital storytelling.",
    anchor: "brand",
    kanji: "創",
  },
] as const;

export const ENGINEERING = [
  {
    id: "A",
    title: "Websites & web platforms",
    items: [
      "Website strategy and planning",
      "UI/UX design and responsive implementation",
      "Frontend development",
      "Content management and integrations where required",
      "Performance, accessibility and cross-device testing",
    ],
  },
  {
    id: "B",
    title: "Complete web applications",
    lead: "Full applications — not only visual interfaces.",
    items: [
      "Requirements gathering and product planning",
      "Software architecture and data modelling",
      "Frontend and backend development",
      "Database design and implementation",
      "API design and integration",
      "Authentication and authorisation",
      "Admin dashboards and operational interfaces",
      "Third-party service integrations",
      "Testing, debugging and performance optimisation",
      "Production deployment and release documentation",
    ],
    note: "Security-sensitive features, regulatory requirements and specialised audits are scoped and agreed separately when needed.",
  },
  {
    id: "C",
    title: "Mobile applications",
    items: [
      "Product planning and app requirements",
      "UI/UX and interaction design",
      "Native or cross-platform development, depending on project needs",
      "Backend, database, API and authentication integration",
      "Device and compatibility testing",
      "Release builds, signing, store assets and submission preparation",
      "Google Play Store and Apple App Store submission and deployment",
      "Post-release fixes and updates where included in the engagement",
    ],
    note: "Store acceptance and timing depend on each platform's review process, policies and account requirements. ZWEN manages the technical release within the agreed scope but cannot guarantee platform approval.",
  },
  {
    id: "D",
    title: "Backend, infrastructure & operations",
    items: [
      "Server and hosting setup",
      "Cloud or platform infrastructure configuration",
      "Domain and DNS configuration",
      "Development, staging and production environments",
      "Database deployment and configuration",
      "Environment variables and secrets handling",
      "CI/CD and automated deployment workflows",
      "Logging, monitoring, backups and recovery planning where included",
      "SSL/TLS and production configuration",
      "Performance and reliability improvements",
      "Maintenance, dependency updates and operational support under an agreed plan",
    ],
    note: "Initial setup and ongoing server management are separate. Monitoring, incident response, backups, hosting bills and maintenance are defined in the project agreement.",
  },
  {
    id: "E",
    title: "Integrations & delivery",
    items: [
      "Payment and third-party API integrations where appropriate",
      "Email, notification, analytics and other service integrations",
      "Deployment and launch support",
      "Technical documentation and handover",
      "Maintenance and iterative improvements",
    ],
  },
] as const;

export const VISUAL = [
  "3D modelling and asset creation",
  "Product visualisation and advertising renders",
  "Product and brand animation",
  "Motion graphics and animated explainers",
  "VFX and compositing",
  "Environment and architectural visualisation",
  "Creative visual development and interactive experiences",
] as const;

export const BRAND = [
  "Brand identity and visual systems",
  "Graphic design and marketing collateral",
  "Social media strategy and management",
  "Content calendars and social creatives",
  "Video editing and promotional production",
  "Campaign concepts and digital storytelling",
] as const;

export const ENGAGEMENTS = [
  { title: "Project-based", body: "Defined scope, milestones and deliverables." },
  { title: "End-to-end delivery", body: "Coordinated work from discovery through launch." },
  { title: "Ongoing support", body: "Agreed maintenance, updates or content services." },
  { title: "Individual services", body: "A focused engagement for one specific need." },
] as const;

/** Short journey used on ZERO. */
export const JOURNEY = [
  { k: "Discover", body: "Understand the goal and the requirements." },
  { k: "Define", body: "Set the scope and plan the solution." },
  { k: "Design & build", body: "Shape the experience, then make it real." },
  { k: "Refine", body: "Test, refine and prepare for release." },
  { k: "Deliver", body: "Deploy the product or hand over the work." },
  { k: "Support", body: "Agreed maintenance and support." },
] as const;

/** Full process used on SYSTEMS. */
export const PROCESS = [
  { k: "Discover", body: "Understand the objective, audience and constraints." },
  { k: "Define", body: "Establish scope, deliverables and milestones." },
  { k: "Design", body: "Plan the experience and the solution." },
  { k: "Build", body: "Implement the product or creative work." },
  { k: "Validate", body: "Test, review and refine." },
  { k: "Launch", body: "Deploy or deliver the agreed outputs." },
  { k: "Support", body: "Continue only as agreed in the engagement." },
] as const;

export const ENQUIRY_TYPES = [
  "Web application",
  "Website / web platform",
  "Mobile app",
  "Infrastructure / deployment",
  "3D / motion",
  "Branding / content",
  "Combined project",
] as const;

export const BUDGETS = ["Not sure yet", "Under $5k", "$5k – $15k", "$15k – $50k", "$50k +"] as const;
export const TIMELINES = ["Flexible", "Under 1 month", "1 – 3 months", "3 – 6 months", "6 months +"] as const;
