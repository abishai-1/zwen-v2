"use client";

import { useRef } from "react";
import { gsap } from "@/motion/gsap";
import { useScene } from "@/motion/primitives";
import { reducedMotion, scrollVelocity } from "@/motion/store";

/** Four-point star sigil inside runic rings; drawn on scroll, then slowly turning. */
export function Sigil({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, (el) => {
    const svg = el.querySelector("svg")!;
    if (reducedMotion()) return;
    gsap.from(el.querySelectorAll("[data-draw]"), { drawSVG: 0, duration: 2.4, ease: "power2.inOut", stagger: 0.12, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    const spin = gsap.to(el.querySelector("[data-spin]"), { rotate: 360, duration: 60, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
    gsap.to(svg, { rotate: -30, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
    const off = scrollVelocity.subscribe((v) => spin.timeScale(1 + Math.abs(v) * 0.5));
    return () => off();
  });
  const runes = "✦ ZWEN ✦ CODEX ✦ FROM IDEA TO EXPERIENCE ✦ MMXXVI ";
  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 400 400" className="h-full w-full" fill="none" stroke="currentColor">
        <circle data-draw cx="200" cy="200" r="180" strokeOpacity=".5" />
        <circle data-draw cx="200" cy="200" r="150" strokeOpacity=".8" />
        <g data-spin>
          {runes.split("").map((r, i) => (
            <text
              key={i}
              x="200"
              y="38"
              fontSize="13"
              fontFamily="var(--nf-cinzel)"
              fill="currentColor"
              stroke="none"
              textAnchor="middle"
              transform={`rotate(${(i * 360) / runes.length} 200 200)`}
              opacity=".7"
            >
              {r}
            </text>
          ))}
        </g>
        <path data-draw d="M200 40 C 210 160 240 190 360 200 C 240 210 210 240 200 360 C 190 240 160 210 40 200 C 160 190 190 160 200 40 Z" strokeWidth="1.5" />
        <path data-draw d="M200 120 L 220 200 L 200 280 L 180 200 Z" stroke="var(--accent)" />
        <circle data-draw cx="200" cy="200" r="40" />
        <circle cx="200" cy="200" r="5" fill="var(--accent)" stroke="none" />
      </svg>
    </div>
  );
}

/** Ornamental divider drawn on scroll. */
export function Ornament({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el.querySelectorAll("path,circle"), { drawSVG: "50% 50%", ease: "none", scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 1 } });
  });
  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 600 40" className="h-full w-full" fill="none" stroke="currentColor">
        <path d="M0 20 H 250" strokeOpacity=".5" />
        <path d="M350 20 H 600" strokeOpacity=".5" />
        <path d="M250 20 C 265 5 280 5 290 20 C 280 35 265 35 250 20 Z" />
        <path d="M350 20 C 335 5 320 5 310 20 C 320 35 335 35 350 20 Z" />
        <circle cx="300" cy="20" r="6" stroke="var(--accent)" />
        <path d="M300 4 V 12 M300 28 V 36" />
      </svg>
    </div>
  );
}

/** Red wax seal pressed into the page on reveal. */
export function WaxSeal({ letter = "Z", className }: { letter?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el, { scale: 2.2, autoAlpha: 0, rotate: 40, duration: 0.6, ease: "back.out(2.5)", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className={`relative grid aspect-square place-items-center rounded-full font-fraktur text-bone ${className ?? "w-16 text-3xl"}`}
      style={{
        background: "radial-gradient(circle at 35% 30%, #e0464c, #8e1a1f 60%, #5c0f13)",
        boxShadow: "inset 0 0 0 4px rgba(0,0,0,.18), inset 0 0 0 7px rgba(255,255,255,.08), 0 6px 18px rgba(0,0,0,.5)",
        borderRadius: "47% 53% 50% 50% / 52% 48% 52% 48%",
      }}
    >
      {letter}
    </div>
  );
}
