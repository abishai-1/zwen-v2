import type Lenis from "lenis";
import { routeStyle, type StyleKey } from "@/lib/styles";

type Listener<T> = (value: T, prev: T) => void;

export function createSignal<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      const prev = value;
      value = next;
      listeners.forEach((l) => l(next, prev));
    },
    subscribe(l: Listener<T>) {
      listeners.add(l);
      return () => void listeners.delete(l);
    },
  };
}

/** The style currently on screen; drives CSS tokens and the glyph field. */
export const activeStyle = createSignal<StyleKey>(typeof window === "undefined" ? "ascii" : routeStyle(window.location.pathname));

/** False while the page-transition overlay covers the screen. */
export const pageVisible = createSignal<boolean>(false);

/** Smoothed scroll velocity (px/frame), shared by many effects. */
export const scrollVelocity = createSignal<number>(0);

export const lenisRef: { current: Lenis | null } = { current: null };

/** Normalised pointer, -1..1 on both axes, plus pixel coords. */
export const pointer = { x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0 };

/** Runs `cb` once the current page is revealed (immediately if it already is). */
export function onPageVisible(cb: () => void) {
  if (pageVisible.get()) {
    cb();
    return () => {};
  }
  const off = pageVisible.subscribe((v) => {
    if (v) {
      off();
      cb();
    }
  });
  return off;
}

export function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
