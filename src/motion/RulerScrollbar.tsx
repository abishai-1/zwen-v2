"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";
import { lenisRef, onPageVisible, pageVisible, pointer } from "./store";

/*
 * artcraft-style ruler.
 * - A 0–100 tick ruler drifts up as you scroll; the needle points at the current %.
 * - Section names ([data-rail] in <main>) queue at the bottom, detach letter by letter
 *   onto the rail, ride vertically with their section, then flip (staggered per letter)
 *   into the heading slot; earlier headings shrink into a stack above it.
 * - Hovering the rail compresses the whole page into a map: every heading sits at its
 *   position, a band shows the visible window, a line follows the pointer; click to jump.
 */

const RAIL_W = 56;
const RIGHT = RAIL_W + 10;
const RULER_TOP = 76;
const RULER_BOTTOM = 28;
const UNIT = 56; // px per 1% while not zoomed
const BASE = 40; // heading font size; every pose scales from it
const TOP = 84;
const P_LINE = 20;
const P_SIZE = 15;
const Q_LINE = 22;
const Q_SIZE = 17;
const Q_PAD = 40;
const RIDE_SIZE = 22;
const MAP_SIZE = 15;
const FLIP = 200;
const DETACH = 240;
const STAGGER = 0.5; // share of a transition used to stagger letters
const SNAP_DELAY = 320;

type Pose = { x: number; y: number; r: number; s: number; a: number }; // x,y = label's top-right anchor
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Pose, b: Pose, t: number): Pose => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), r: lerp(a.r, b.r, t), s: lerp(a.s, b.s, t), a: lerp(a.a, b.a, t) });
/** Per-letter progress: letter with `order` 0 moves first, 1 moves last. */
const stag = (t: number, order: number) => ease(clamp01((t - order * STAGGER) / (1 - STAGGER)));

export function RulerScrollbar() {
  const pathname = usePathname();
  const [names, setNames] = useState<string[]>([]);
  const sections = useRef<HTMLElement[]>([]);
  const letters = useRef<HTMLSpanElement[][]>([]);
  const measures = useRef<HTMLSpanElement[][]>([]);
  const measureBox = useRef<HTMLDivElement[]>([]);
  const ticks = useRef<HTMLSpanElement[]>([]);
  const secTicks = useRef<HTMLSpanElement[]>([]);
  const needle = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const hoverLine = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const cols = useRef<HTMLSpanElement[]>([]);
  const hovered = useRef(-1);
  const dragging = useRef(false);

  useEffect(() => {
    const off = onPageVisible(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main [data-rail]"));
      sections.current = els;
      letters.current = [];
      measures.current = [];
      setNames(els.map((e) => (e.dataset.rail ?? "").toUpperCase()));
    });
    const offHide = pageVisible.subscribe((v) => {
      if (!v) {
        sections.current = [];
        setNames([]);
      }
    });
    return () => {
      off();
      offHide();
    };
  }, [pathname]);

  useEffect(() => {
    let shown = -1;
    let zoom = 0;
    let zoomTarget = 0;
    let snapSince: number | null = null;
    let snapping = false;

    const onMove = (e: PointerEvent) => {
      const reach = zoom > 0.3 ? 300 : RAIL_W;
      zoomTarget = e.pointerType === "mouse" && e.clientX >= window.innerWidth - reach ? 1 : 0;
    };
    const onLeave = () => (zoomTarget = dragging.current ? 1 : 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    const tick = () => {
      const lenis = lenisRef.current;
      if (!lenis || !needle.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const limit = Math.max(1, lenis.limit);
      const R = clamp01(lenis.scroll / limit);
      zoom += (zoomTarget - zoom) * 0.14;
      if (Math.abs(zoomTarget - zoom) < 0.001) zoom = zoomTarget;
      const z = ease(zoom);
      const span = vh - RULER_TOP - RULER_BOTTOM;
      const drift = R * (100 * UNIT - span);
      const yOf = (v: number) => lerp(RULER_TOP + v * UNIT - drift, RULER_TOP + (v / 100) * span, z);

      // Ticks + needle + readout
      ticks.current.forEach((t, v) => (t.style.transform = `translate3d(0,${yOf(v).toFixed(1)}px,0)`));
      needle.current.style.transform = `translate3d(0,${(RULER_TOP + R * span).toFixed(1)}px,0)`;
      const pct = Math.round(R * 100);
      if (pct !== shown) {
        shown = pct;
        const digits = String(pct).padStart(3, "0");
        cols.current.forEach((c, i) => (c.style.transform = `translateY(-${digits[i]}em)`));
      }

      // Map extras (visible only while zoomed)
      if (band.current) {
        const v0 = R * 100;
        const v1 = Math.min(100, ((lenis.scroll + vh) / limit) * 100);
        band.current.style.opacity = z.toFixed(3);
        band.current.style.transform = `translate3d(0,${yOf(v0).toFixed(1)}px,0)`;
        band.current.style.height = `${Math.max(6, yOf(v1) - yOf(v0)).toFixed(1)}px`;
      }
      if (hoverLine.current) {
        hoverLine.current.style.opacity = z.toFixed(3);
        hoverLine.current.style.transform = `translate3d(0,${pointer.py.toFixed(1)}px,0)`;
      }
      if (backdrop.current) backdrop.current.style.opacity = (z * 0.9).toFixed(3);

      // Headings
      const els = sections.current;
      const n = els.length;
      if (!n) return;
      const tops = els.map((el) => el.getBoundingClientRect().top);
      const flipRaw = tops.map((t, i) => (i === 0 ? 1 : clamp01((TOP + FLIP - t) / FLIP)));
      const detRaw = tops.map((t) => clamp01((vh - 40 - t) / DETACH));
      const suffix: number[] = new Array(n).fill(0);
      for (let i = n - 1, acc = 0; i >= 0; i--) {
        acc += flipRaw[i] > 0 ? 0 : 1 - ease(detRaw[i]);
        suffix[i] = acc;
      }
      const heroA = clamp01(lenis.scroll / 220);
      const current = flipRaw.reduce((c, f, i) => (f >= 0.5 ? i : c), 0);

      els.forEach((_, i) => {
        const ls = letters.current[i];
        const ms = measures.current[i];
        const box = measureBox.current[i];
        if (!ls || !ms || !box) return;
        const w = box.offsetWidth;
        const h = box.offsetHeight;
        const count = ls.length;
        const isHover = hovered.current === i;

        const rs = RIDE_SIZE / BASE;
        const queue: Pose = { x: vw - RIGHT, y: vh - Q_PAD - Math.max(suffix[i], 1 - ease(detRaw[i])) * Q_LINE, r: 0, s: Q_SIZE / BASE, a: isHover ? 1 : 0.42 };
        const ride: Pose = { x: vw - RAIL_W - 8 - h * rs, y: tops[i] + 10, r: -90, s: rs, a: isHover ? 1 : 0.5 };
        const head: Pose = { x: vw - RIGHT, y: TOP + i * P_LINE + 4, r: 0, s: 1, a: 1 };
        const past: Pose = { x: vw - RIGHT, y: TOP + i * P_LINE, r: 0, s: P_SIZE / BASE, a: isHover ? 1 : 0.5 };
        const docV = clamp01((tops[i] + lenis.scroll) / limit) * 100;
        const map: Pose = { x: vw - RIGHT, y: yOf(docV) - (MAP_SIZE * 0.55), r: 0, s: MAP_SIZE / BASE, a: isHover || i === current ? 1 : 0.7 };
        const next = i + 1 < n ? flipRaw[i + 1] : 0;

        const st = secTicks.current[i];
        if (st) st.style.transform = `translate3d(0,${yOf(docV).toFixed(1)}px,0)`;

        for (let j = 0; j < count; j++) {
          const first = count > 1 ? j / (count - 1) : 0;
          const last = 1 - first;
          // queue → rail (first letters lead), rail → heading (last letters lead, as in a vertical read)
          let p = flipRaw[i] > 0 ? mix(ride, head, stag(flipRaw[i], last)) : mix(queue, ride, stag(detRaw[i], first));
          if (next > 0) p = mix(p, past, stag(next, first));
          if (z > 0) p = mix(p, map, z);
          let a = p.a;
          if (i === 0) a *= Math.max(heroA, z);

          const th = (p.r * Math.PI) / 180;
          const lx = (ms[j].offsetLeft - w) * p.s;
          const x = p.x + lx * Math.cos(th);
          const y = p.y + lx * Math.sin(th);
          const el = ls[j];
          el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${p.r.toFixed(2)}deg) scale(${p.s.toFixed(4)})`;
          el.style.opacity = a.toFixed(3);
          el.style.pointerEvents = a > 0.2 ? "auto" : "none";
        }
      });

      // Snap so a heading never rests mid-flip.
      const mid = flipRaw.findIndex((v, i) => i > 0 && v > 0.04 && v < 0.96);
      if (snapping) {
        if (mid < 0) snapping = false;
      } else if (mid >= 0 && Math.abs(lenis.velocity) < 0.05 && !dragging.current && zoom < 0.05) {
        const now = performance.now();
        if (snapSince === null) snapSince = now;
        else if (now - snapSince > SNAP_DELAY) {
          const t = tops[mid];
          snapping = true;
          snapSince = null;
          lenis.scrollTo(lenis.scroll + (flipRaw[mid] >= 0.5 ? t - TOP : t - (TOP + FLIP)), { duration: 0.7 });
        }
      } else snapSince = null;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Rail drag / click scrubs the page (positions map 1:1 onto the compact map).
  const scrubTo = (clientY: number, immediate: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const span = window.innerHeight - RULER_TOP - RULER_BOTTOM;
    lenis.scrollTo(clamp01((clientY - RULER_TOP) / span) * lenis.limit, { immediate, lerp: immediate ? undefined : 0.08 });
  };

  const goTo = (i: number) => {
    const el = sections.current[i];
    if (el) lenisRef.current?.scrollTo(el, { offset: -TOP, duration: 1.2 });
  };

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden select-none md:block">
      <div ref={backdrop} className="absolute inset-y-0 right-0 w-[340px] opacity-0" style={{ background: "linear-gradient(to left, var(--bg) 35%, transparent)" }} />

      {/* rail */}
      <div
        className="pointer-events-auto absolute right-0 top-0 h-full touch-none overflow-hidden"
        style={{ width: RAIL_W }}
        data-cursor="JUMP"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          scrubTo(e.clientY, false);
        }}
        onPointerMove={(e) => dragging.current && scrubTo(e.clientY, true)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <div ref={band} className="absolute right-0 top-0 w-full border-y border-accent/70 bg-fg/10 opacity-0" />
        {Array.from({ length: 101 }, (_, v) => {
          const major = v % 5 === 0;
          return (
            <span
              key={v}
              ref={(n) => {
                if (n) ticks.current[v] = n;
              }}
              className="absolute right-0 top-0 flex -translate-y-1/2 items-center gap-2 will-change-transform"
            >
              {major && <span className="font-mono text-[9px] leading-none text-fg opacity-60">{v}</span>}
              <span className="block h-px bg-fg" style={{ width: major ? 16 : 8, opacity: major ? 0.8 : 0.4 }} />
            </span>
          );
        })}
        {names.map((_, i) => (
          <span
            key={`t${i}`}
            ref={(n) => {
              if (n) secTicks.current[i] = n;
            }}
            className="absolute right-0 top-0 block h-px w-6 bg-accent will-change-transform"
          />
        ))}
      </div>

      <div ref={hoverLine} className="absolute right-0 top-0 h-px bg-fg opacity-0" style={{ width: RAIL_W + 4 }} />

      {/* needle + readout */}
      <div ref={needle} className="absolute right-0 top-0 will-change-transform">
        <span className="block h-px bg-accent" style={{ width: RAIL_W + 4 }} />
        <span className="mt-1 flex justify-end pr-1 font-mono text-[10px] leading-none text-accent">
          <span className="ruler-digits">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                ref={(n) => {
                  if (n) cols.current[i] = n;
                }}
                className="ruler-digit-col"
              >
                {Array.from({ length: 10 }, (_, d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            ))}
          </span>
          %
        </span>
      </div>

      {/* headings: hidden measuring copy + one absolutely-placed span per letter */}
      {names.map((name, i) => (
        <div key={`${pathname}-${i}`}>
          <div
            ref={(n) => {
              if (n) measureBox.current[i] = n;
            }}
            className="font-display invisible absolute left-0 top-0 whitespace-pre font-bold leading-none"
            style={{ fontSize: BASE }}
          >
            {name.split("").map((ch, j) => (
              <span
                key={j}
                ref={(n) => {
                  if (!n) return;
                  (measures.current[i] ??= [])[j] = n;
                }}
              >
                {ch}
              </span>
            ))}
          </div>
          {name.split("").map((ch, j) => (
            <span
              key={j}
              ref={(n) => {
                if (!n) return;
                (letters.current[i] ??= [])[j] = n;
              }}
              onPointerEnter={() => (hovered.current = i)}
              onPointerLeave={() => (hovered.current = -1)}
              onClick={() => goTo(i)}
              data-cursor="GO"
              className="font-display absolute left-0 top-0 cursor-pointer whitespace-pre font-bold leading-none text-fg opacity-0 will-change-transform"
              style={{ fontSize: BASE, transformOrigin: "0 0" }}
            >
              {ch}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
