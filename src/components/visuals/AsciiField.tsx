"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/motion/gsap";
import { activeStyle, onPageVisible, pointer, reducedMotion } from "@/motion/store";
import { GLYPHS, type StyleKey } from "@/lib/styles";

type Source = { type: "image"; src: string } | { type: "text"; text: string; weight?: number };

type Props = {
  source: Source;
  className?: string;
  /** Cell size in CSS px. */
  cell?: number;
  /** Glyph set; follows the active page style when omitted. */
  glyphs?: StyleKey;
  /** Mouse repulsion radius in px. */
  radius?: number;
  /** Scatter the particles as the element scrolls out of view. */
  scrollScatter?: boolean;
  label?: string;
};

type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; v: number; seed: number };

/**
 * Renders an image mask or text as ASCII particles that assemble on reveal,
 * flee the cursor, spring back, and scatter with scroll.
 */
export function AsciiField({ source, className, cell = 9, glyphs, radius = 110, scrollScatter = true, label }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const srcKey = source.type === "image" ? `img:${source.src}` : `txt:${source.text}:${source.weight ?? ""}`;

  useEffect(() => {
    const el = host.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = reducedMotion();
    const dpr = Math.min(window.devicePixelRatio, 2);
    let particles: P[] = [];
    let W = 0;
    let H = 0;
    let set: StyleKey = glyphs ?? activeStyle.get();
    let assembled = 0;
    let scatter = 0;
    let visible = false;
    const css = getComputedStyle(document.documentElement);
    const mono = css.getPropertyValue("--nf-mono").trim() || "monospace";
    const fontFor = (s: StyleKey) =>
      s === "jp" ? css.getPropertyValue("--nf-jp").trim() : s === "med" ? css.getPropertyValue("--nf-fraktur").trim() : mono;

    let img: HTMLImageElement | null = null;
    const sample = () => {
      const r = el.getBoundingClientRect();
      W = r.width;
      H = r.height;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const cols = Math.floor(W / cell);
      const rows = Math.floor(H / cell);
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      o.clearRect(0, 0, cols, rows);
      o.fillStyle = "#fff";
      if (source.type === "image" && img) {
        const s = Math.min(cols / img.width, rows / img.height);
        const w = img.width * s;
        const h = img.height * s;
        o.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);
      } else if (source.type === "text") {
        o.textAlign = "center";
        o.textBaseline = "middle";
        let size = rows;
        o.font = `${source.weight ?? 800} ${size}px ${mono}`;
        const m = o.measureText(source.text).width;
        size = Math.min(size * 0.92, (size * cols * 0.9) / m);
        o.font = `${source.weight ?? 800} ${size}px ${mono}`;
        o.fillText(source.text, cols / 2, rows / 2 + size * 0.04);
      }
      const data = o.getImageData(0, 0, cols, rows).data;
      const prev = particles;
      particles = [];
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const a = data[(y * cols + x) * 4 + 3] / 255;
          if (a < 0.12) continue;
          const hx = x * cell + cell / 2;
          const hy = y * cell + cell / 2;
          const old = prev[particles.length];
          particles.push({
            hx,
            hy,
            x: old ? old.x : Math.random() * W,
            y: old ? old.y : Math.random() * H,
            vx: 0,
            vy: 0,
            v: a,
            seed: Math.random(),
          });
        }
    };

    const ro = new ResizeObserver(() => sample());
    if (source.type === "image") {
      img = new Image();
      img.src = source.src;
      img.onload = () => ro.observe(el);
    } else {
      void document.fonts.ready.then(() => ro.observe(el));
    }

    const offStyle = glyphs ? () => {} : activeStyle.subscribe((s) => (set = s));
    const offVisible = onPageVisible(() => {
      visible = true;
      const a = { v: 0 };
      gsap.to(a, { v: 1, duration: reduced ? 0 : 2.2, ease: "power3.out", onUpdate: () => void (assembled = a.v) });
    });

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { rootMargin: "100px" });
    let onScreen = true;
    io.observe(el);

    const tick = () => {
      if (!onScreen || !W) return;
      const r = el.getBoundingClientRect();
      if (scrollScatter) {
        const p = gsap.utils.clamp(0, 1, -r.top / (r.height * 0.9));
        scatter += (p - scatter) * 0.1;
      }
      const mx = pointer.px - r.left;
      const my = pointer.py - r.top;
      const ramp = GLYPHS[set];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${cell * 1.15}px ${fontFor(set)}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fg = css.getPropertyValue("--fg");
      const accent = css.getPropertyValue("--accent");
      const t = performance.now() / 1000;
      for (const p of particles) {
        const tx = p.hx + (scatter ? Math.sin(p.seed * 40 + t) * scatter * W * 0.25 * p.seed : 0);
        const ty = p.hy - scatter * H * (0.3 + p.seed * 0.9);
        const target = visible ? assembled : 0;
        let fx = (tx - p.x) * 0.06 * target;
        let fy = (ty - p.y) * 0.06 * target;
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        let near = 0;
        if (!reduced && d2 < radius * radius) {
          const d = Math.sqrt(d2) || 1;
          near = 1 - d / radius;
          fx += (dx / d) * near * 6;
          fy += (dy / d) * near * 6;
        }
        p.vx = (p.vx + fx) * 0.8;
        p.vy = (p.vy + fy) * 0.8;
        p.x += p.vx;
        p.y += p.vy;
        const flick = Math.random() < 0.02 + near * 0.3;
        const idx = flick ? 1 + Math.floor(Math.random() * 13) : Math.min(13, Math.max(3, Math.round(p.v * 11 + p.seed * 2)));
        ctx.fillStyle = near > 0.25 || p.seed > 0.985 ? accent : fg;
        ctx.globalAlpha = (0.35 + p.v * 0.65) * (visible ? 1 : 0) * (1 - scatter * 0.6);
        ctx.fillText(ramp[idx], p.x, p.y);
      }
      ctx.globalAlpha = 1;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
      offStyle();
      offVisible();
    };
    // `source` is keyed by srcKey so inline object literals don't re-run the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey, cell, glyphs, radius, scrollScatter]);

  return (
    <div ref={host} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
