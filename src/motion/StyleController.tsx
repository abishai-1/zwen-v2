"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "./gsap";
import { activeStyle, onPageVisible } from "./store";
import type { StyleKey } from "@/lib/styles";

/**
 * Mirrors the active style onto <html data-style> (which animates the colour tokens)
 * and lets any [data-style] section in <main> take over the style while it's centred.
 */
export function StyleController() {
  const pathname = usePathname();

  useEffect(() => {
    const apply = (s: StyleKey) => (document.documentElement.dataset.style = s);
    apply(activeStyle.get());
    return activeStyle.subscribe(apply);
  }, []);

  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const off = onPageVisible(() => {
      triggers = Array.from(document.querySelectorAll<HTMLElement>("main [data-style]")).map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && activeStyle.set(el.dataset.style as StyleKey),
        }),
      );
    });
    return () => {
      off();
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}
