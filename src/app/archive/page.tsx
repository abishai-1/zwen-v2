import type { Metadata } from "next";
import { TLink } from "@/motion/Transition";
import { HorizontalScroll, Parallax, Reveal, Scramble } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { Ornament, Sigil, WaxSeal } from "@/components/visuals/Codex";
import { Folio } from "@/components/blocks";
import { CATEGORIES, PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "ARCHIVE — Work",
  description: "Selected digital products, visual projects and creative work by ZWEN, with the thinking behind each one.",
};

export default function Archive() {
  const sealed = Math.max(0, 3 - PROJECTS.length);
  return (
    <div data-style="med">
      <Section style="med" label="Archive introduction" rail="Archive" className="relative flex min-h-svh flex-col justify-center pb-16 pt-32">
        <Parallax speed={0.35} className="pointer-events-none absolute right-0 top-24 w-[70vw] max-w-[620px] text-fg opacity-40 md:right-8">
          <Sigil className="aspect-square w-full" />
        </Parallax>
        <Eyebrow index="I">The Archive</Eyebrow>
        <h1 className="font-fraktur relative mt-6 text-[22vw] leading-[0.82] md:text-[14vw]">
          <Scramble text="Archive" hover={false} />
        </h1>
        <Ornament className="mt-4 h-8 w-full max-w-2xl text-fg" />
        <Lead className="mt-8">
          A chronicle of digital products, visual projects and creative work — each with the story of how it was made.
        </Lead>
      </Section>

      <Section style="med" label="Project categories" rail="Volumes" className="py-16">
        <p className="label muted mb-6">Volumes</p>
        <Reveal as="ul" className="flex flex-wrap gap-3" stagger={0.06} parallax={false}>
          {CATEGORIES.map((c, i) => (
            <li key={c} className="hud label px-5 py-3">
              <span className="text-accent">Vol. {["I", "II", "III", "IV", "V", "VI"][i]}</span> — {c}
            </li>
          ))}
        </Reveal>
      </Section>

      <Section style="med" label="Featured projects" rail="Folios" className="py-20">
        <div className="mb-12 flex items-end justify-between gap-6">
          <Heading className="text-5xl md:text-7xl">Featured folios</Heading>
          <WaxSeal letter="Z" className="hidden w-20 text-4xl md:grid" />
        </div>
        <HorizontalScroll>
          {PROJECTS.map((p, i) => (
            <Folio key={p.slug} project={p} index={i} />
          ))}
          {Array.from({ length: sealed }, (_, i) => (
            <Folio key={i} index={PROJECTS.length + i} />
          ))}
        </HorizontalScroll>
      </Section>

      <Section style="med" label="Project archive" rail="Ledger" className="py-24 md:py-36">
        <Eyebrow index="II">The ledger</Eyebrow>
        <Heading className="mt-6 text-5xl md:text-7xl">Every entry, recorded.</Heading>
        <Reveal as="ol" className="mt-12 border-t hairline" stagger={0.05} y={20} parallax={false}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className="border-b hairline">
              <TLink href={`/archive/${p.slug}`} data-cursor="OPEN" className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-6 md:grid-cols-[4rem_1fr_14rem_8rem_5rem]">
                <span className="label text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-fraktur text-3xl transition-transform duration-500 group-hover:translate-x-3 md:text-4xl">{p.title}</span>
                <span className="label muted col-start-2 md:col-start-auto">{p.category}</span>
                <span className="label col-start-2 text-accent md:col-start-auto">{p.status}</span>
                <span className="label muted col-start-2 md:col-start-auto">{p.year}</span>
              </TLink>
            </li>
          ))}
        </Reveal>
        <p className="muted mt-6 text-sm">More entries will be recorded as work is cleared for publication.</p>
      </Section>

      <Section style="med" label="Start a project" rail="Commission" className="py-28 text-center md:py-40">
        <Ornament className="mx-auto h-8 w-full max-w-md text-fg" />
        <Heading className="mx-auto mt-10 max-w-4xl text-5xl md:text-7xl">Have a project with similar goals?</Heading>
        <div className="mt-10 flex justify-center">
          <CTA href="/transmit" cursor="SEND">
            Let&apos;s discuss it
          </CTA>
        </div>
      </Section>
    </div>
  );
}
