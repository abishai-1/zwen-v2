import { TLink } from "@/motion/Transition";
import { Marquee, Scramble } from "@/motion/primitives";
import { CONTACT, NAV, SITE } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t hairline pb-24 pt-10 md:pb-16">
      <Marquee className="py-6" speed={60}>
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="font-display px-6 text-[13vw] leading-none md:text-[9vw]">
            From idea to experience <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>

      <div className="mx-auto mt-14 grid max-w-[1400px] gap-12 px-4 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Logo className="h-12" />
          <p className="muted mt-6 max-w-sm text-sm leading-relaxed">{SITE.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="label muted mb-4">{"// Index"}</p>
          <ul className="space-y-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <TLink href={n.href} className="label inline-flex gap-3 hover:text-accent">
                  <span className="muted">{n.hint}</span>
                  <Scramble text={n.label} />
                </TLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="label muted mb-4">{"// Signal"}</p>
          {CONTACT.email ? (
            <a href={`mailto:${CONTACT.email}`} className="font-display text-2xl hover:text-accent">
              {CONTACT.email}
            </a>
          ) : (
            <TLink href="/transmit" data-cursor="WRITE" className="font-display text-2xl hover:text-accent">
              Open a transmission →
            </TLink>
          )}
          {CONTACT.socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-4">
              {CONTACT.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="label hover:text-accent" target="_blank" rel="noreferrer">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="label muted mx-auto mt-16 flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 md:px-8">
        <span>© {SITE.name} — All rights reserved</span>
        <span>Engineering · 3D & Motion · Brand & Content</span>
      </div>
    </footer>
  );
}
