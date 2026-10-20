"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "./gsap";
import { pointer } from "./store";

const TRAIL = 14;

/**
 * immersive-g style cursor: an eased ring, a fast dot, a velocity-driven dot trail,
 * contextual labels from [data-cursor] and magnetic pull on [data-magnetic].
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ring.current || !dot.current || !trail.current) return;
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" });
    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power2" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power2" });

    const canvas = trail.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: TRAIL }, () => ({ x: pointer.px, y: pointer.py }));
    let speed = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ring.current, dot.current], { autoAlpha: 1, duration: 0.3 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
    };
    const onLeave = () => {
      visible = false;
      gsap.to([ring.current, dot.current], { autoAlpha: 0, duration: 0.3 });
    };

    // Contextual labels + hover state
    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input, textarea, select");
      if (!t) {
        setLabel("");
        gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "power3" });
        return;
      }
      const text = t.dataset.cursor ?? "";
      setLabel(text);
      const isField = t.matches("input, textarea, select");
      gsap.to(ring.current, { scale: isField ? 0.4 : text ? 2.6 : 1.8, duration: 0.45, ease: "power3" });
    };

    // Magnetic elements
    const magnets = new Map<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
    const onMagnet = (e: PointerEvent) => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        let m = magnets.get(el);
        if (!m) {
          m = {
            x: gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" }),
            y: gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" }),
          };
          magnets.set(el, m);
        }
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = Math.max(r.width, r.height) * 0.9 + 40;
        if (Math.hypot(dx, dy) < reach) {
          m.x(dx * 0.3);
          m.y(dy * 0.3);
        } else {
          m.x(0);
          m.y(0);
        }
      });
    };

    const tick = () => {
      const v = Math.hypot(pointer.vx, pointer.vy);
      speed += (v - speed) * 0.15;
      pointer.vx *= 0.8;
      pointer.vy *= 0.8;
      pts[0].x += (pointer.px - pts[0].x) * 0.5;
      pts[0].y += (pointer.py - pts[0].y) * 0.5;
      for (let i = 1; i < TRAIL; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.42;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.42;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!visible) return;
      const intensity = Math.min(speed / 30, 1);
      if (intensity < 0.02) return;
      ctx.fillStyle = "#fff";
      for (let i = 1; i < TRAIL; i++) {
        const t = 1 - i / TRAIL;
        ctx.globalAlpha = t * intensity * 0.8;
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1 + t * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointermove", onMagnet, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointermove", onMagnet);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <canvas ref={trail} className="absolute inset-0 h-full w-full" />
      <div
        ref={ring}
        className="invisible absolute left-0 top-0 -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-white opacity-0"
      >
        <span className="font-mono text-[4px] uppercase tracking-[0.2em] text-white">{label}</span>
      </div>
      <div ref={dot} className="invisible absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-white opacity-0" />
    </div>
  );
}
