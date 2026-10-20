"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type RefObject, type CSSProperties } from "react";
import { gsap, ScrollTrigger, SplitText } from "./gsap";
import { onPageVisible, reducedMotion, scrollVelocity } from "./store";

/** Builds GSAP animations scoped to `scope` once the page is revealed; reverts on unmount. */
export function useScene(scope: RefObject<HTMLElement | null>, build: (el: HTMLElement) => void, deps: unknown[] = []) {
  useEffect(() => {
    let ctx: gsap.Context | undefined;
    const off = onPageVisible(() => {
      if (!scope.current) return;
      const el = scope.current;
      ctx = gsap.context(() => build(el), el);
    });
    return () => {
      off();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

type Common = { className?: string; style?: CSSProperties; children?: ReactNode; as?: ElementType };

/**
 * Headline reveal: chars rise out of a mask with a scramble flicker, then the
 * line keeps drifting with scroll so it never sits still.
 */
export function SplitReveal({
  as = "h2",
  className,
  style,
  children,
  delay = 0,
  drift = 0,
  scramble = true,
}: Common & { delay?: number; drift?: number; scramble?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    const split = SplitText.create(el, { type: "lines,words,chars", mask: "lines" });
    // Give masks room for descenders/accents without changing the line rhythm.
    gsap.set(split.masks, { paddingBlock: "0.14em", marginBlock: "-0.14em" });
    gsap.set(el, { autoAlpha: 1 });
    if (reducedMotion()) return;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true }, delay });
    tl.from(split.chars, { yPercent: 110, duration: 1, ease: "expo.out", stagger: { each: 0.022, from: "start" } });
    const style = el.closest<HTMLElement>("[data-style]")?.dataset.style;
    if (scramble && (style === "ascii" || style === "cyber")) {
      split.chars.forEach((c, i) => {
        const original = c.textContent ?? "";
        if (!original.trim()) return;
        tl.to(c, { duration: 0.5, scrambleText: { text: original, chars: "ZWEN01#/<>*", speed: 0.6 } }, i * 0.018);
      });
    }
    if (drift)
      gsap.to(split.masks.length ? split.masks : split.lines, {
        x: (i) => (i % 2 ? -drift : drift),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
  });
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden", ...style }}>
      {children}
    </Tag>
  );
}

/** Fades/raises children in sequence, then gives each a gentle scroll parallax. */
export function Reveal({
  as = "div",
  className,
  style,
  children,
  stagger = 0.08,
  y = 24,
  selector = ":scope > *",
  parallax = true,
}: Common & { stagger?: number; y?: number; selector?: string; parallax?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    const items = el.querySelectorAll<HTMLElement>(selector);
    gsap.set(el, { autoAlpha: 1 });
    if (reducedMotion()) return;
    gsap.from(items, {
      y,
      autoAlpha: 0,
      duration: 1,
      ease: "power4.out",
      stagger,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
    if (parallax)
      items.forEach((it, i) =>
        gsap.to(it, {
          yPercent: -3 - (i % 3) * 2,
          ease: "none",
          scrollTrigger: { trigger: it, start: "top bottom", end: "bottom top", scrub: 1.2 },
        }),
      );
  });
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden", ...style }}>
      {children}
    </Tag>
  );
}

/** Scroll-scrubbed parallax on any wrapper. */
export function Parallax({ as = "div", className, style, children, speed = 0.2, rotate = 0, scale = 0 }: Common & { speed?: number; rotate?: number; scale?: number }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.fromTo(
      el,
      { yPercent: speed * 50, rotate: -rotate, scale: 1 - scale },
      { yPercent: -speed * 50, rotate, scale: 1 + scale, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } },
    );
  });
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** Decodes text when it enters view and again on hover. */
export function Scramble({ as = "span", className, style, text, chars = "ZWEN01#/<>*_", hover = true }: Common & { text: string; chars?: string; hover?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el, { duration: 1.2, scrambleText: { text: "", chars, speed: 0.5 }, scrollTrigger: { trigger: el, start: "top 95%", once: true } });
  }, [text]);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hover) return;
    const target = (el.closest("a,button") as HTMLElement) ?? el;
    const run = () => !reducedMotion() && gsap.to(el, { duration: 0.6, scrambleText: { text, chars, speed: 0.6 }, overwrite: true });
    target.addEventListener("pointerenter", run);
    return () => target.removeEventListener("pointerenter", run);
  }, [text, chars, hover]);
  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={style}>
      {text}
    </Tag>
  );
}

/** Infinite marquee whose speed and direction follow scroll velocity. */
export function Marquee({ className, children, speed = 40, reverse = false }: { className?: string; children: ReactNode; speed?: number; reverse?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || reducedMotion()) return;
    let x = 0;
    let dir = reverse ? 1 : -1;
    const tick = (_t: number, dt: number) => {
      const v = scrollVelocity.get();
      if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
      const w = el.scrollWidth / 2;
      x += dir * (speed + Math.abs(v) * 6) * (dt / 1000);
      if (x <= -w) x += w;
      if (x > 0) x -= w;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [speed, reverse]);
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <div ref={track} className="inline-flex will-change-transform">
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Draws every stroke inside (SVG) as you scroll through it. */
export function DrawOnScroll({ className, style, children, start = "top 85%", end = "bottom 40%", scrub = 1 }: Common & { start?: string; end?: string; scrub?: number | boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useScene(ref, (el) => {
    const paths = el.querySelectorAll("path, line, circle, polyline, rect, ellipse");
    if (reducedMotion()) return;
    gsap.from(paths, { drawSVG: 0, ease: "none", stagger: 0.04, scrollTrigger: { trigger: el, start, end, scrub } });
  });
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

/** Counts up to `to` when visible. */
export function Counter({ to, pad = 2, className }: { to: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useScene(ref, (el) => {
    const o = { v: 0 };
    gsap.to(o, {
      v: to,
      duration: reducedMotion() ? 0 : 1.6,
      ease: "power3.out",
      onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(pad, "0")),
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
  });
  return (
    <span ref={ref} className={className}>
      {String(0).padStart(pad, "0")}
    </span>
  );
}

/** Pins a section and scrubs its children horizontally (for galleries). */
export function HorizontalScroll({ className, children }: { className?: string; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useScene(outer, () => {
    const el = inner.current!;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const dist = () => el.scrollWidth - window.innerWidth + 64;
      gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: { trigger: outer.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
      });
    });
  });
  return (
    <div ref={outer} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={inner} className="flex w-max flex-col gap-6 md:flex-row md:gap-10 md:pr-16 max-md:w-full">
        {children}
      </div>
    </div>
  );
}

export { ScrollTrigger };
