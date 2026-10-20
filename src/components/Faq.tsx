"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "@/motion/gsap";
import { reducedMotion } from "@/motion/store";

/** Terminal-style accordion: answers type themselves out when opened. */
export function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const quick = reducedMotion() ? 0 : 1;
    if (open !== null && panels.current[open]) gsap.to(panels.current[open], { height: 0, duration: 0.5 * quick, ease: "expo.inOut" });
    if (next !== null && panels.current[next]) {
      const p = panels.current[next]!;
      gsap.fromTo(p, { height: 0 }, { height: "auto", duration: 0.6 * quick, ease: "expo.inOut" });
      const text = p.querySelector("[data-a]")!;
      gsap.fromTo(text, { scrambleText: { text: "" } }, { duration: 1.2 * quick, scrambleText: { text: items[next].a, chars: "01<>/_", speed: 1, revealDelay: 0.1 } });
    }
    setOpen(next);
  };

  return (
    <ul className="border-t hairline font-mono">
      {items.map((it, i) => {
        const id = `${base}-${i}`;
        const isOpen = open === i;
        return (
          <li key={it.q} className="border-b hairline">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => toggle(i)}
              className="group flex w-full items-start gap-4 py-5 text-left"
            >
              <span className="text-accent">{isOpen ? "[-]" : "[+]"}</span>
              <span className="flex-1 text-sm uppercase tracking-wide transition-colors group-hover:text-accent md:text-base">&gt; {it.q}</span>
            </button>
            <div id={id} ref={(n) => void (panels.current[i] = n)} className="h-0 overflow-hidden" role="region">
              <p className="pb-6 pl-10 font-sans text-sm leading-relaxed md:text-base">
                <span data-a>{it.a}</span>
                <span className="idle-blink ml-1 text-accent">▌</span>
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
