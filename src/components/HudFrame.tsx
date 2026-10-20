"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { activeStyle } from "@/motion/store";
import { STYLE_META, type StyleKey } from "@/lib/styles";

/** Persistent viewport HUD: corner brackets, mode readout and a live clock. */
export function HudFrame() {
  const [time, setTime] = useState("--:--:--");
  const mode = useSyncExternalStore<StyleKey>(activeStyle.subscribe, activeStyle.get, () => "ascii");

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  const meta = STYLE_META[mode];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65] hidden text-fg md:block">
      {["left-4 top-4 border-l border-t", "left-4 bottom-4 border-l border-b"].map((c) => (
        <span key={c} className={`absolute h-3 w-3 border-fg/40 ${c}`} />
      ))}
      <div className="label absolute bottom-6 left-8 flex items-center gap-5 text-[10px] opacity-60">
        <span className="text-accent">● {meta.code}</span>
        <span>{meta.label}</span>
        <span className="tabular-nums">{time}</span>
      </div>
    </div>
  );
}
