export type Member = {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  skills: string[];
  links: { label: string; href: string }[];
};

/**
 * Core team. Roles, bios and links are pending each person's approval —
 * nothing personal is published until they confirm it.
 */
export const TEAM: Member[] = [
  { id: "A-01", name: "Abishai", role: null, bio: null, skills: [], links: [] },
  { id: "A-02", name: "Bavana Sruthi", role: null, bio: null, skills: [], links: [] },
  { id: "A-03", name: "Shazia Sadaf", role: null, bio: null, skills: [], links: [] },
];
