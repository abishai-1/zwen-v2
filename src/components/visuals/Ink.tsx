"use client";

import { useId, useRef } from "react";
import { gsap } from "@/motion/gsap";
import { useScene } from "@/motion/primitives";
import { reducedMotion } from "@/motion/store";

/** Rough-edged ink filter shared by the brush pieces. */
function InkFilter({ id, scale = 6 }: { id: string; scale?: number }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="7">
        <animate attributeName="seed" values="7;9;12;7" dur="1.2s" repeatCount="indefinite" calcMode="discrete" />
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
}

/** Ensō circle that is painted as you scroll and breathes afterwards. */
export function Enso({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  useScene(ref, (el) => {
    const path = el.querySelector("path")!;
    if (reducedMotion()) return;
    gsap.fromTo(path, { drawSVG: "0%" }, { drawSVG: "0% 92%", ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "center 40%", scrub: 1 } });
    gsap.to(el.querySelector("svg"), { rotate: 25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
  });
  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <InkFilter id={id} scale={8} />
        </defs>
        <path
          d="M150 30 C 230 28 278 90 272 160 C 266 232 206 276 140 270 C 74 264 26 208 32 140 C 38 80 84 40 138 34"
          fill="none"
          stroke="currentColor"
          strokeWidth="22"
          strokeLinecap="round"
          filter={`url(#${id})`}
        />
      </svg>
    </div>
  );
}

/** A single horizontal brush stroke that sweeps in. */
export function BrushStroke({ className, color = "currentColor" }: { className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el.querySelector("path"), { drawSVG: "0%", ease: "none", scrollTrigger: { trigger: el, start: "top 90%", end: "top 50%", scrub: 1 } });
  });
  return (
    <div ref={ref} className={className} aria-hidden>
      <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <InkFilter id={id} scale={10} />
        </defs>
        <path d="M8 34 C 120 22 240 40 360 28 S 540 30 592 26" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** Red hanko seal that stamps down when it enters view. */
export function Hanko({ text = "創", className }: { text?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el, { scale: 1.8, rotate: -18, autoAlpha: 0, duration: 0.5, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    gsap.to(el, { rotate: 8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className={`grid aspect-square place-items-center rounded-[6px] border-[3px] border-red font-jp text-red ${className ?? "w-14 text-2xl"}`}
      style={{ filter: "url(#hanko-rough)" }}
    >
      {text}
    </div>
  );
}
