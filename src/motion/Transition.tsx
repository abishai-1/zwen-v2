"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type AnchorHTMLAttributes } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { activeStyle, lenisRef, pageVisible, reducedMotion } from "./store";
import { GLYPHS, STYLE_COLORS, STYLE_META, routeStyle, type StyleKey } from "@/lib/styles";
import { NAV } from "@/lib/site";

type Ctx = { go: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ go: () => {} });
export const useTransitionNav = () => useContext(TransitionCtx);

const COL_W = 18;
const ROW_H = 22;

function labelFor(href: string) {
  const path = href.split(/[?#]/)[0];
  const hit = [...NAV].reverse().find((n) => (n.href === "/" ? path === "/" : path.startsWith(n.href)));
  return hit?.label ?? "UNCHARTED";
}

/**
 * Owns route changes: glyph-cascade cover → router.push → style swap → uncover.
 * The canvas is also the boot preloader on first load.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ progress: 1, phase: "cover" as "cover" | "uncover", style: "ascii" as StyleKey, label: "ZWEN", sub: "BOOT", busy: true, pending: null as string | null, seeds: [] as number[] });
  const resolveCover = useRef<(() => void) | null>(null);

  // Draw loop for the overlay
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const cols = Math.ceil(window.innerWidth / COL_W);
      state.current.seeds = Array.from({ length: cols }, (_, i) => 0.55 * Math.random() + 0.25 * Math.sin(i * 0.21) ** 2);
    };
    resize();
    window.addEventListener("resize", resize);
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--nf-mono").trim() || "monospace";

    const draw = () => {
      const s = state.current;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      canvas.style.background = "transparent";
      if (s.progress <= 0 && s.phase === "uncover") {
        canvas.style.visibility = "hidden";
        return;
      }
      canvas.style.visibility = "visible";
      const c = STYLE_COLORS[s.style];
      const glyphs = GLYPHS[s.style];
      ctx.font = `14px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      s.seeds.forEach((seed, i) => {
        const local = gsap.utils.clamp(0, 1, (s.progress * 1.6 - seed) / 0.6);
        if (local <= 0) return;
        const x = i * COL_W;
        // cover grows from the top; uncover leaves from the top too, so the sheet "falls through"
        const top = s.phase === "cover" ? 0 : H * (1 - local);
        const h = H * local;
        ctx.fillStyle = c.bg;
        ctx.fillRect(x, top, COL_W + 0.5, h);
        const edge = s.phase === "cover" ? top + h : top;
        if (local < 1) {
          for (let k = 0; k < 5; k++) {
            const y = s.phase === "cover" ? edge - k * ROW_H - ROW_H / 2 : edge + k * ROW_H + ROW_H / 2;
            ctx.fillStyle = k === 0 ? c.accent : c.fg;
            ctx.globalAlpha = 1 - k / 5;
            ctx.fillText(glyphs[1 + Math.floor(Math.random() * 15)], x + COL_W / 2, y);
          }
          ctx.globalAlpha = 1;
        }
      });
      // Destination label
      if (s.progress > 0.6) {
        const a = gsap.utils.clamp(0, 1, (s.progress - 0.6) / 0.3);
        ctx.globalAlpha = a;
        ctx.fillStyle = c.fg;
        ctx.font = `600 ${Math.min(W * 0.09, 120)}px ${mono}`;
        ctx.fillText(scramble(s.label, a), W / 2, H / 2);
        ctx.font = `11px ${mono}`;
        ctx.fillStyle = c.accent;
        ctx.fillText(`[ ${s.sub} ]  ·  ${STYLE_META[s.style].code}  ·  ${STYLE_META[s.style].label}`, W / 2, H / 2 + Math.min(W * 0.06, 80));
        ctx.globalAlpha = 1;
      }
    };
    gsap.ticker.add(draw);
    return () => {
      gsap.ticker.remove(draw);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const animate = useCallback((phase: "cover" | "uncover", duration: number) => {
    const s = state.current;
    s.phase = phase;
    const quick = reducedMotion();
    return new Promise<void>((resolve) => {
      gsap.killTweensOf(s);
      gsap.fromTo(
        s,
        { progress: phase === "cover" ? 0 : 1 },
        { progress: phase === "cover" ? 1 : 0, duration: quick ? 0.2 : duration, ease: phase === "cover" ? "power2.in" : "power3.inOut", onComplete: resolve },
      );
    });
  }, []);

  const reveal = useCallback(async () => {
    const s = state.current;
    const style = routeStyle(window.location.pathname);
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    activeStyle.set(style);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    ScrollTrigger.refresh();
    pageVisible.set(true);
    await animate("uncover", 1.1);
    s.busy = false;
  }, [animate]);

  // First load: boot preloader
  useEffect(() => {
    const s = state.current;
    s.style = routeStyle(window.location.pathname);
    s.label = "ZWEN";
    s.sub = "INITIALISING";
    const counter = { v: 0 };
    gsap.to(counter, {
      v: 100,
      duration: reducedMotion() ? 0.1 : 1.4,
      ease: "power2.inOut",
      onUpdate: () => (s.sub = `LOADING ${String(Math.round(counter.v)).padStart(3, "0")}%`),
      onComplete: () => {
        s.label = labelFor(window.location.pathname);
        void document.fonts.ready.then(() => setTimeout(reveal, reducedMotion() ? 0 : 350));
      },
    });
  }, [reveal]);

  const go = useCallback(
    async (href: string) => {
      const s = state.current;
      const target = href.split(/[?#]/)[0];
      if (s.busy) return;
      if (target === window.location.pathname) {
        lenisRef.current?.scrollTo(0, { duration: 1.4 });
        return;
      }
      s.busy = true;
      s.pending = target;
      s.style = routeStyle(target);
      s.label = labelFor(target);
      s.sub = "TRANSMITTING";
      pageVisible.set(false);
      await animate("cover", 0.8);
      s.sub = "RECEIVED";
      router.push(href, { scroll: false });
      resolveCover.current = () => void reveal();
    },
    [animate, reveal, router],
  );

  // Route committed → reveal. Also handles browser back/forward (no cover was played).
  useEffect(() => {
    const s = state.current;
    if (s.pending && pathname === s.pending) {
      s.pending = null;
      resolveCover.current?.();
      resolveCover.current = null;
    } else if (!s.pending && !s.busy) {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      activeStyle.set(routeStyle(pathname));
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }
  }, [pathname]);

  return (
    <TransitionCtx.Provider value={{ go }}>
      {children}
      <canvas ref={canvasRef} aria-hidden style={{ background: "var(--bg)" }} className="pointer-events-none fixed inset-0 z-[85] h-full w-full" />
    </TransitionCtx.Provider>
  );
}

function scramble(text: string, t: number) {
  const chars = "!<>-_\\/[]{}=+*^?#ZWEN01";
  return text
    .split("")
    .map((ch, i) => (ch === " " || i / text.length < t * 1.2 - 0.2 ? ch : chars[Math.floor(Math.random() * chars.length)]))
    .join("");
}

type TLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children: ReactNode };

/** next/link that routes through the transition overlay. */
export function TLink({ href, children, ...rest }: TLinkProps) {
  const { go } = useTransitionNav();
  return (
    <Link
      href={href}
      {...rest}
      onNavigate={(e) => {
        e.preventDefault();
        void go(typeof href === "string" ? href : (href.pathname ?? "/"));
      }}
    >
      {children}
    </Link>
  );
}
