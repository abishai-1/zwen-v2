import type { ReactNode } from "react";
import { TLink } from "@/motion/Transition";
import { Scramble, SplitReveal, Reveal } from "@/motion/primitives";

/** "// 02 — APPROACH" style eyebrow. */
export function Eyebrow({ index, children, className }: { index?: string; children: string; className?: string }) {
  return (
    <p className={`label flex items-center gap-3 ${className ?? ""}`}>
      {index && <span className="text-accent">{index}</span>}
      <span className="h-px w-8 bg-current opacity-40" />
      <Scramble text={children} hover={false} />
    </p>
  );
}

export function Section({
  style,
  id,
  className,
  children,
  label,
  rail,
}: {
  style: "ascii" | "jp" | "med" | "cyber";
  id?: string;
  className?: string;
  children: ReactNode;
  label?: string;
  /** Short name shown on the ruler scrollbar. */
  rail?: string;
}) {
  return (
    <section data-style={style} data-rail={rail} id={id} aria-label={label} className={`relative mx-auto w-full max-w-[1400px] px-4 md:px-8 md:pr-24 xl:pr-44 ${className ?? ""}`}>
      {children}
    </section>
  );
}

export function Heading({
  children,
  className,
  as = "h2",
  font = "font-display",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  font?: "font-display" | "font-fraktur" | "font-jp";
}) {
  return (
    <SplitReveal as={as} className={`${font} leading-[0.95] tracking-tight ${className ?? "text-5xl md:text-7xl"}`}>
      {children}
    </SplitReveal>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal className={`max-w-xl text-lg leading-relaxed md:text-xl ${className ?? ""}`} parallax={false}>
      <p>{children}</p>
    </Reveal>
  );
}

/** Magnetic call-to-action with a fill sweep and scrambled label. */
export function CTA({ href, children, variant = "solid", cursor = "GO" }: { href: string; children: string; variant?: "solid" | "ghost"; cursor?: string }) {
  const base =
    "label group relative inline-flex items-center gap-3 overflow-hidden px-6 py-4 transition-colors duration-500";
  const look =
    variant === "solid"
      ? "bg-accent text-bone"
      : "border border-current/40 text-fg hover:text-bone";
  return (
    <TLink href={href} data-magnetic data-cursor={cursor} className={`${base} ${look}`}>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.2,.9,.2,1)] group-hover:scale-y-100 ${variant === "solid" ? "bg-fg" : "bg-accent"}`}
      />
      <span className={`relative ${variant === "solid" ? "group-hover:text-bg" : ""}`}>
        <Scramble text={children} />
      </span>
      <span aria-hidden className={`relative transition-transform duration-500 group-hover:translate-x-1 ${variant === "solid" ? "group-hover:text-bg" : ""}`}>
        →
      </span>
    </TLink>
  );
}

/** Coordinates/readout chip used across HUD layouts. */
export function Readout({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <div className={`label flex items-center justify-between gap-6 border-b hairline py-2 ${className ?? ""}`}>
      <span className="muted">{k}</span>
      <span>{v}</span>
    </div>
  );
}
