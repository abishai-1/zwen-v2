export const NAV = [
  { href: "/", label: "ZERO", hint: "Home" },
  { href: "/archive", label: "ARCHIVE", hint: "Work" },
  { href: "/systems", label: "SYSTEMS", hint: "Services" },
  { href: "/origin", label: "ORIGIN", hint: "Studio" },
  { href: "/unit", label: "UNIT", hint: "Team" },
  { href: "/transmit", label: "TRANSMIT", hint: "Contact" },
  { href: "/thelab", label: "TheLab", hint: "Experiments" },
] as const;

/**
 * Official contact channels. Left empty on purpose: the blueprint forbids
 * inventing contact details. Fill these in once they are confirmed.
 */
export const CONTACT: { email: string | null; socials: { label: string; href: string }[] } = {
  email: null,
  socials: [],
};

export const SITE = {
  name: "ZWEN",
  tagline: "From idea to experience.",
  description:
    "ZWEN is a creative technology agency: web and mobile applications, infrastructure, 3D and motion, brand and content — from concept to launch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};
