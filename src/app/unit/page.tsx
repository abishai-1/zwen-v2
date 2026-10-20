import type { Metadata } from "next";
import { Parallax, Reveal } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { DataStream, HudRing, Waveform } from "@/components/visuals/Hud";
import { Dossier } from "@/components/blocks";
import { DrawOnScroll } from "@/motion/primitives";
import { TEAM } from "@/content/team";

export const metadata: Metadata = {
  title: "UNIT — Team",
  description: "The people behind ZWEN and how design, engineering and creative production work together.",
};

const LANES = [
  { k: "DESIGN", d: "Experience, interface and visual systems." },
  { k: "ENGINEERING", d: "Architecture, build, infrastructure and release." },
  { k: "CREATIVE", d: "3D, motion, brand and content production." },
  { k: "COORDINATION", d: "Scope, timelines, communication and handover." },
];

export default function Unit() {
  return (
    <div data-style="cyber">
      <Section style="cyber" label="Team introduction" rail="Unit" className="grid min-h-[90svh] items-center gap-12 pb-16 pt-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow index="UNT">Unit / Team</Eyebrow>
          <Heading as="h1" className="mt-6 text-6xl md:text-[7vw]">
            A small unit with a wide range.
          </Heading>
          <Lead className="mt-8">Technical and creative minds working as one team — accountable, reachable and involved from first call to handover.</Lead>
        </div>
        <div className="relative md:col-span-5">
          <Parallax speed={0.3} className="aspect-square w-full text-fg">
            <HudRing className="h-full w-full" label={`UNIT // ${String(TEAM.length).padStart(2, "0")} ACTIVE`} />
          </Parallax>
          <DataStream className="absolute bottom-0 right-0 opacity-60" rows={6} />
        </div>
      </Section>

      <Section style="cyber" label="Core team" rail="Core team" className="py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <Eyebrow index="01">Core team</Eyebrow>
          <span className="label muted">Records: {String(TEAM.length).padStart(3, "0")}</span>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {TEAM.map((m) => (
            <Dossier key={m.id} member={m} />
          ))}
        </div>
      </Section>

      <Section style="cyber" label="How we collaborate" rail="Lanes" className="py-28 md:py-40">
        <Eyebrow index="02">How we collaborate</Eyebrow>
        <Heading className="mt-6 text-5xl md:text-7xl">Four lanes, one signal.</Heading>
        <div className="relative mt-16">
          <DrawOnScroll className="pointer-events-none absolute inset-0 hidden text-accent md:block">
            <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="h-full w-full" fill="none" stroke="currentColor">
              <path d="M0 100 C 150 20 250 180 400 100 S 650 20 800 100 S 950 180 1000 100" strokeWidth="1.5" />
            </svg>
          </DrawOnScroll>
          <Reveal className="relative grid gap-4 md:grid-cols-4">
            {LANES.map((l, i) => (
              <div key={l.k} className="hud bg-bg p-6">
                <p className="label text-accent">LANE {String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display mt-8 text-2xl">{l.k}</h3>
                <p className="muted mt-2 text-sm">{l.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
        <Waveform className="mt-12 h-20 w-full" />
      </Section>

      <Section style="cyber" label="Work with us" rail="Contact" className="py-28 text-center md:py-40">
        <Heading className="mx-auto max-w-4xl text-5xl md:text-8xl">Bring us your idea.</Heading>
        <div className="mt-10 flex justify-center">
          <CTA href="/transmit" cursor="SEND">
            Contact the unit
          </CTA>
        </div>
      </Section>
    </div>
  );
}
