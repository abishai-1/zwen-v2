"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";
import { lenisRef, pointer, reducedMotion, scrollVelocity } from "./store";

/** Lenis smooth scroll (artcraft-style lerp) synced to the GSAP ticker, plus global pointer + velocity feeds. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: reducedMotion() ? 1 : 0.12, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    let smoothed = 0;
    const tick = (time: number) => {
      lenis.raf(time * 1000);
      smoothed += (lenis.velocity - smoothed) * 0.12;
      scrollVelocity.set(Math.abs(smoothed) < 0.01 ? 0 : smoothed);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Everything marked data-velo skews and stretches with scroll speed.
    const skewTargets = new Map<Element, (v: number) => void>();
    const collect = () => {
      document.querySelectorAll("[data-velo]").forEach((el) => {
        if (!skewTargets.has(el)) skewTargets.set(el, gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" }));
      });
    };
    collect();
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });
    const offVel = scrollVelocity.subscribe((v) => {
      const skew = gsap.utils.clamp(-6, 6, v * 0.35);
      skewTargets.forEach((set, el) => (el.isConnected ? set(skew) : skewTargets.delete(el)));
    });

    const onMove = (e: PointerEvent) => {
      pointer.vx = e.clientX - pointer.px;
      pointer.vy = e.clientY - pointer.py;
      pointer.px = e.clientX;
      pointer.py = e.clientY;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      offVel();
      mo.disconnect();
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
