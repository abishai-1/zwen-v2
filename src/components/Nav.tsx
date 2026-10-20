"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/motion/gsap";
import { TLink } from "@/motion/Transition";
import { Scramble } from "@/motion/primitives";
import { lenisRef, onPageVisible, reducedMotion, scrollVelocity } from "@/motion/store";
import { NAV } from "@/lib/site";
import { Logo } from "./Logo";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Intro + hide on fast downward scroll, show on upward.
  useEffect(() => {
    const el = bar.current!;
    gsap.set(el, { yPercent: -120 });
    const off = onPageVisible(() => gsap.to(el, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.3 }));
    let hidden = false;
    const offV = scrollVelocity.subscribe((v) => {
      const top = (lenisRef.current?.scroll ?? 0) < 80;
      const hide = !top && v > 2;
      const show = top || v < -2;
      if (hide && !hidden) {
        hidden = true;
        gsap.to(el, { yPercent: -120, duration: 0.6, ease: "power3.out" });
      } else if (show && hidden) {
        hidden = false;
        gsap.to(el, { yPercent: 0, duration: 0.6, ease: "power3.out" });
      }
    });
    return () => {
      off();
      offV();
    };
  }, []);

  // Mobile menu
  useEffect(() => {
    const m = menu.current!;
    const items = m.querySelectorAll("[data-item]");
    if (open) {
      lenisRef.current?.stop();
      gsap.set(m, { display: "flex" });
      gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reducedMotion() ? 0 : 0.7, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.25 });
    } else {
      lenisRef.current?.start();
      gsap.to(m, { clipPath: "inset(100% 0 0% 0)", duration: reducedMotion() ? 0 : 0.6, ease: "expo.inOut", onComplete: () => void gsap.set(m, { display: "none" }) });
    }
  }, [open]);

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-[75] px-4 pt-4 md:px-8 md:pt-5">
        <nav aria-label="Primary" className="flex items-center justify-between gap-6">
          <TLink href="/" aria-label="ZWEN — home" data-magnetic className="text-fg">
            <Logo className="h-7 md:h-8" />
          </TLink>
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <TLink
                  href={n.href}
                  aria-current={isActive(n.href) ? "page" : undefined}
                  className={`label group relative inline-flex items-center px-3 py-2 transition-colors ${isActive(n.href) ? "text-accent" : "text-fg hover:text-accent"}`}
                >
                  <span className={`mr-1 transition-opacity ${isActive(n.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>[</span>
                  <Scramble text={n.label} />
                  <span className={`ml-1 transition-opacity ${isActive(n.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>]</span>
                </TLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <TLink href="/transmit" data-magnetic data-cursor="GO" className="label hidden border border-fg/40 px-4 py-2 transition-colors hover:border-accent hover:bg-accent hover:text-bone md:inline-flex">
              Start a project
            </TLink>
            <button
              type="button"
              className="label inline-flex items-center gap-2 px-2 py-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-6">
                <span className={`absolute left-0 top-0 h-px w-full bg-fg transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-fg transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <div ref={menu} id="mobile-menu" className="fixed inset-0 z-[74] hidden flex-col justify-end bg-bg px-4 pb-10 pt-24" style={{ clipPath: "inset(0 0 100% 0)" }}>
        <ul className="space-y-1">
          {NAV.map((n, i) => (
            <li key={n.href} className="overflow-hidden border-b hairline">
              <TLink href={n.href} data-item onClick={() => setOpen(false)} className="flex items-baseline justify-between py-3" aria-current={isActive(n.href) ? "page" : undefined}>
                <span className={`font-display text-4xl ${isActive(n.href) ? "text-accent" : ""}`}>{n.label}</span>
                <span className="label muted">
                  {String(i).padStart(2, "0")} / {n.hint}
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
