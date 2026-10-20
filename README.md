# ZWEN — Studio Website

Fully animated site for ZWEN. Each page owns one of four visual styles (ASCII, Japanese ink, medieval codex, cyber HUD); the home page travels through all four.

## Run

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional in dev
npm run dev
```

## How it's built

| Piece | Where |
|---|---|
| Style tokens per page (`html[data-style]`) | `src/app/globals.css`, `src/lib/styles.ts` |
| Persistent WebGL glyph field (morphs per style) | `src/gl/GlyphField.tsx` |
| Page transitions + boot preloader | `src/motion/Transition.tsx` (`TLink` for internal links) |
| Smooth scroll (Lenis) / ruler scrollbar / cursor | `src/motion/` |
| Scroll-reveal primitives | `src/motion/primitives.tsx` |
| Content (services, FAQs, projects, team) | `src/content/` |
| Enquiry form → Postgres + email | `src/app/transmit/`, `src/db/` |

- Any `<section data-style="…">` switches the site style while it's centred on screen.
- Use `TLink` instead of `next/link` for internal links so navigation runs through the transition.
- `prefers-reduced-motion` turns off idle loops, parallax and long transitions.

## Before launch

- Fill `CONTACT` in `src/lib/site.ts` (email/socials are intentionally empty).
- Add approved team roles/bios in `src/content/team.ts` and real projects in `src/content/projects.ts`.
- Review the FAQ answers in `src/content/faqs.ts` against real contracts.
- Database: set `DATABASE_URL`, then `npx drizzle-kit push` to create the `enquiries` table.
- Email: set `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL` (verified domain), `ENQUIRY_TO_EMAIL`.
- Spam: optionally set the Turnstile keys (a honeypot and rate limit are always on).
