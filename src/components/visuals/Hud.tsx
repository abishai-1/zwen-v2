"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/motion/gsap";
import { scrollVelocity } from "@/motion/store";

/** Concentric HUD rings, each spinning at its own rate; tilts with scroll velocity. */
export function HudRing({ className, label = "ZW-00" }: { className?: string; label?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rings = el.querySelectorAll<SVGGElement>("[data-ring]");
    const tweens = Array.from(rings).map((r, i) =>
      gsap.to(r, { rotate: i % 2 ? -360 : 360, duration: 18 + i * 9, repeat: -1, ease: "none", transformOrigin: "50% 50%" }),
    );
    const off = scrollVelocity.subscribe((v) => tweens.forEach((t) => t.timeScale(1 + Math.min(Math.abs(v) * 0.25, 8))));
    return () => {
      off();
      tweens.forEach((t) => t.kill());
    };
  }, []);
  return (
    <svg ref={ref} viewBox="0 0 400 400" className={className} aria-hidden fill="none" stroke="currentColor">
      <g data-ring>
        <circle cx="200" cy="200" r="190" strokeOpacity=".25" />
        {Array.from({ length: 72 }, (_, i) => (
          <line key={i} x1="200" y1="10" x2="200" y2={i % 6 ? 16 : 24} transform={`rotate(${i * 5} 200 200)`} strokeOpacity=".6" />
        ))}
      </g>
      <g data-ring>
        <circle cx="200" cy="200" r="150" strokeDasharray="2 10" className="text-accent" stroke="currentColor" />
        <path d="M200 50 A150 150 0 0 1 350 200" stroke="var(--accent)" strokeWidth="2" />
      </g>
      <g data-ring>
        <circle cx="200" cy="200" r="112" strokeOpacity=".4" strokeDasharray="60 14 4 14" />
        <text x="200" y="80" fill="currentColor" stroke="none" fontSize="9" textAnchor="middle" fontFamily="var(--nf-mono)" letterSpacing="3">
          {label}
        </text>
      </g>
      <g data-ring>
        <circle cx="200" cy="200" r="70" strokeOpacity=".7" />
        <line x1="130" y1="200" x2="270" y2="200" strokeOpacity=".3" />
        <line x1="200" y1="130" x2="200" y2="270" strokeOpacity=".3" />
      </g>
      <circle cx="200" cy="200" r="4" fill="var(--accent)" stroke="none" />
    </svg>
  );
}

/** Barcode that reshuffles its bars every so often. */
export function Barcode({ className, bars = 38 }: { className?: string; bars?: number }) {
  const [seed, setSeed] = useState<number[]>(() => Array.from({ length: bars }, (_, i) => ((i * 7919) % 13) / 13));
  useEffect(() => {
    const id = setInterval(() => setSeed(Array.from({ length: bars }, () => Math.random())), 1400);
    return () => clearInterval(id);
  }, [bars]);
  return (
    <div className={`flex h-8 items-stretch gap-[2px] ${className ?? ""}`} aria-hidden>
      {seed.map((s, i) => (
        <span key={i} className="bg-current transition-all duration-500" style={{ width: s > 0.7 ? 3 : 1, opacity: 0.4 + s * 0.6 }} />
      ))}
    </div>
  );
}

/** Live sine readout; amplitude reacts to scroll speed. */
export function Waveform({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    let amp = 0.3;
    const tick = (t: number) => {
      if (c.width !== c.clientWidth * 2) c.width = c.clientWidth * 2;
      if (c.height !== c.clientHeight * 2) c.height = c.clientHeight * 2;
      const w = c.width;
      const h = c.height;
      amp += (0.3 + Math.min(Math.abs(scrollVelocity.get()) / 25, 0.6) - amp) * 0.08;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = css.getPropertyValue("--fg");
      ctx.globalAlpha = 0.15;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = css.getPropertyValue("--accent");
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = h / 2 + Math.sin(x * 0.02 + t * 3) * h * amp * 0.5 * Math.sin(x * 0.004 + t * 0.7);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);
  return <canvas ref={ref} className={className} aria-hidden />;
}

/** A column of hex values that keep ticking over. */
export function DataStream({ className, rows = 8 }: { className?: string; rows?: number }) {
  const [lines, setLines] = useState<string[]>(() => Array.from({ length: rows }, (_, i) => `0x${(i * 4099).toString(16).padStart(4, "0").toUpperCase()}`));
  useEffect(() => {
    const id = setInterval(
      () => setLines((l) => [...l.slice(1), `0x${Math.floor(Math.random() * 65535).toString(16).padStart(4, "0").toUpperCase()}  ${Math.random() > 0.5 ? "OK" : "··"}`]),
      260,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className={`font-mono text-[10px] leading-relaxed ${className ?? ""}`} aria-hidden>
      {lines.map((l, i) => (
        <div key={i} style={{ opacity: 0.25 + (i / rows) * 0.75 }}>
          {l}
        </div>
      ))}
    </div>
  );
}

/** Small live status chip. */
export function StatusDot({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`label inline-flex items-center gap-2 ${className ?? ""}`}>
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-accent" style={{ animation: "pulse-ring 1.6s ease-out infinite" }} />
        <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {label}
    </span>
  );
}
