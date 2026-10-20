"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "./gsap";
import { pointer } from "./store";

const TRAIL = 14;

/**
 * Cursor effects on top of the native cursor: a velocity-driven dot trail,
 * contextual labels from [data-cursor] and magnetic pull on [data-magnetic].
 */
export function Cursor() {
  const tag = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(
    () => () => {},
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );

  useEffect(() => {
    if (!enabled || !tag.current || !trail.current) return;
    const tagX = gsap.quickTo(tag.current, "x", { duration: 0.35, ease: "power3" });
    const tagY = gsap.quickTo(tag.current, "y", { duration: 0.35, ease: "power3" });

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
      visible = true;
      tagX(e.clientX);
      tagY(e.clientY);
    };
    const onLeave = () => {
      visible = false;
      setLabel("");
    };

    // Contextual labels
    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      setLabel(t?.dataset.cursor ?? "");
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
      <div ref={tag} className="absolute left-0 top-0">
        <span
          className={`ml-5 mt-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-opacity duration-300 ${label ? "opacity-100" : "opacity-0"}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
