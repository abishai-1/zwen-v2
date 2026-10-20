"use client";

import { useRef } from "react";
import { gsap } from "@/motion/gsap";
import { useScene } from "@/motion/primitives";
import { reducedMotion } from "@/motion/store";
import { TLink } from "@/motion/Transition";
import { AsciiField } from "./visuals/AsciiField";
import { WaxSeal } from "./visuals/Codex";
import type { Project } from "@/content/projects";
import type { Member } from "@/content/team";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Medieval "folio" card for a project (or a sealed slot when no project is given). */
export function Folio({ project, index, variant = "med" }: { project?: Project; index: number; variant?: "med" | "cyber" }) {
  const med = variant === "med";
  const titleFont = med ? "font-fraktur" : "font-display";
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    gsap.from(el, { rotateX: -25, y: 80, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    gsap.to(el.querySelector("[data-plate]"), { yPercent: -12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 } });
  });
  const body = (
    <article ref={ref} className="hud group relative flex h-full w-full flex-col overflow-hidden bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] p-5 [perspective:900px] md:w-[30rem]">
      <div className="label flex items-center justify-between">
        <span className="text-accent">{med ? `Folio ${ROMAN[index] ?? index + 1}` : `FILE_${String(index + 1).padStart(3, "0")}`}</span>
        <span className="muted">{project ? project.year : "—"}</span>
      </div>
      <div className="relative my-5 aspect-[4/3] overflow-hidden border hairline">
        <div data-plate className="absolute -inset-y-[10%] inset-x-0">
          <AsciiField
            source={{ type: "text", text: project ? project.title.charAt(0) : "✠" }}
            glyphs={variant}
            cell={8}
            radius={90}
            scrollScatter={false}
            className="h-full w-full"
          />
        </div>
        {!project && (
          <div className="absolute inset-0 grid place-items-center">
            <WaxSeal letter="Z" className="w-20 text-4xl" />
          </div>
        )}
      </div>
      {project ? (
        <>
          <p className="label muted">
            {project.category} · <span className="text-accent">{project.status}</span>
          </p>
          <h3 className={`${titleFont} mt-2 text-4xl leading-none`}>{project.title}</h3>
          <p className="muted mt-3 text-sm leading-relaxed">{project.summary}</p>
          <p className="label mt-4">
            <span className="muted">Role — </span>
            {project.role.slice(0, 3).join(" · ")}
          </p>
          <span className="label mt-6 inline-flex items-center gap-2 text-accent">
            {med ? "Read the chronicle" : "Open case file"} <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </>
      ) : (
        <>
          <p className="label muted">Sealed</p>
          <h3 className={`${titleFont} mt-2 text-4xl leading-none`}>Case file in preparation</h3>
          <p className="muted mt-3 text-sm leading-relaxed">This folio stays sealed until the work and its story are ready to share.</p>
        </>
      )}
    </article>
  );
  return project ? (
    <TLink href={`/archive/${project.slug}`} data-cursor="OPEN" className="block">
      {body}
    </TLink>
  ) : (
    body
  );
}

/** Vertical process line that fills as you scroll; each node lights up as it is reached. */
export function Journey({ steps }: { steps: readonly { k: string; body: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useScene(ref, (el) => {
    const fill = el.querySelector("[data-fill]");
    gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
    el.querySelectorAll<HTMLElement>("[data-step]").forEach((s) => {
      gsap.fromTo(
        s,
        { opacity: 0.25, x: 0 },
        { opacity: 1, x: 12, ease: "none", scrollTrigger: { trigger: s, start: "top 75%", end: "top 55%", scrub: true } },
      );
      gsap.fromTo(
        s.querySelector("[data-node]"),
        { scale: 0.4, backgroundColor: "transparent" },
        { scale: 1, backgroundColor: "var(--accent)", ease: "none", scrollTrigger: { trigger: s, start: "top 72%", end: "top 60%", scrub: true } },
      );
    });
  });
  return (
    <ol ref={ref} className="relative ml-2 border-l hairline pl-10">
      <span data-fill aria-hidden className="absolute -left-px top-0 h-full w-px origin-top bg-accent" />
      {steps.map((s, i) => (
        <li key={s.k} data-step className="relative py-7">
          <span data-node aria-hidden className="absolute -left-[46px] top-9 h-3 w-3 rotate-45 border border-accent" />
          <p className="label text-accent">STEP {String(i + 1).padStart(2, "0")}</p>
          <h3 className="font-display mt-2 text-3xl md:text-4xl">{s.k}</h3>
          <p className="muted mt-2 max-w-md">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Cyber "SUBJECT" dossier card for a team member. */
export function Dossier({ member, compact = false }: { member: Member; compact?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useScene(ref, (el) => {
    if (reducedMotion()) return;
    const rows = el.querySelectorAll("[data-row]");
    gsap.from(el, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    gsap.from(rows, { x: -20, autoAlpha: 0, stagger: 0.07, duration: 0.6, delay: 0.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { transformPerspective: 900, rotateY: ((e.clientX - r.left) / r.width - 0.5) * 10, rotateX: -((e.clientY - r.top) / r.height - 0.5) * 10, duration: 0.6, ease: "power3" });
    };
    const onLeave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  });
  const initials = member.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <article ref={ref} className="hud relative bg-[color-mix(in_oklab,var(--fg)_3%,transparent)] p-4 [transform-style:preserve-3d]">
      <header className="label flex items-center justify-between border-b hairline pb-3">
        <span>SUBJECT {member.id}</span>
        <span className="text-accent idle-flicker">● ACTIVE</span>
      </header>
      <div className={`grid gap-4 pt-4 ${compact ? "" : "md:grid-cols-[1fr_1.2fr]"}`}>
        <div className="relative aspect-square overflow-hidden border hairline">
          <AsciiField source={{ type: "text", text: initials }} glyphs="cyber" cell={7} radius={80} scrollScatter={false} className="h-full w-full" label={`Generated glyph portrait for ${member.name}`} />
          <span className="label absolute bottom-2 left-2 text-[9px] text-accent">SCAN // {initials}</span>
        </div>
        <dl className="font-mono text-xs uppercase">
          {[
            ["Name", member.name],
            ["Function", member.role ?? "To be confirmed"],
            ["Unit", "ZWEN"],
            ["Status", "Operational"],
          ].map(([k, v]) => (
            <div data-row key={k} className="flex justify-between gap-4 border-b hairline py-2">
              <dt className="muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
          {!compact && (
            <div data-row className="py-3 normal-case">
              <dt className="label muted">Profile</dt>
              <dd className="mt-2 font-sans text-sm leading-relaxed">{member.bio ?? "Profile awaiting approval — details will be published once confirmed."}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
}
