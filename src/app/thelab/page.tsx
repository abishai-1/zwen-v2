import type { Metadata } from "next";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { AsciiField } from "@/components/visuals/AsciiField";
import { DataStream, StatusDot } from "@/components/visuals/Hud";
import { Marquee } from "@/motion/primitives";

export const metadata: Metadata = {
  title: "TheLab — Under construction",
  description: "ZWEN's space for experiments, prototypes and explorations. Currently being built.",
  robots: { index: false, follow: true },
};

export default function TheLab() {
  return (
    <div data-style="ascii">
      <Section style="ascii" label="TheLab" rail="TheLab" className="relative grid min-h-svh items-center gap-10 pb-16 pt-32 md:grid-cols-12">
        <div className="relative z-10 md:col-span-6">
          <div className="flex items-center gap-6">
            <Eyebrow index="LAB">TheLab</Eyebrow>
            <StatusDot label="Under construction" />
          </div>
          <Heading as="h1" className="mt-6 text-6xl md:text-[6.5vw]">
            TheLab is taking shape.
          </Heading>
          <Lead className="mt-8">
            A space for experiments, strange ideas, prototypes, and things we&apos;re not quite ready to explain yet. We&apos;re still building it.
          </Lead>
          <div className="mt-10 flex flex-wrap gap-3">
            <CTA href="/origin" cursor="BACK">
              Back to Origin
            </CTA>
            <CTA href="/archive" variant="ghost" cursor="VIEW">
              Explore Selected Work
            </CTA>
          </div>
        </div>
        <div className="relative md:col-span-6">
          <AsciiField source={{ type: "text", text: "LAB" }} cell={8} radius={160} className="h-[40vh] w-full md:h-[60vh]" />
          <DataStream className="absolute right-0 top-0 opacity-50" rows={9} />
        </div>
      </Section>
      <Marquee className="border-y hairline py-3" speed={40}>
        {["WebGL", "Shaders", "Creative coding", "Generative visuals", "Motion studies", "Prototypes", "Unconventional interfaces"].map((t) => (
          <span key={t} className="label flex items-center gap-6 px-6">
            {t} <span className="text-accent">{"// soon"}</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
