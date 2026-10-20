import type { Metadata } from "next";
import { HorizontalScroll, Parallax, Reveal } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { BrushStroke, Enso, Hanko } from "@/components/visuals/Ink";

export const metadata: Metadata = {
  title: "ORIGIN — Studio",
  description: "The story, purpose and philosophy behind ZWEN, and how the studio works with clients.",
};

const PRINCIPLES = [
  { k: "越", t: "Think beyond the interface", d: "A product is its systems, data and operations — not only its screens." },
  { k: "意", t: "Design with intention", d: "Every visual and interaction should earn its place." },
  { k: "用", t: "Build for real use", d: "Made to be used, maintained and grown — not just demoed." },
  { k: "細", t: "Details are the experience", d: "Small decisions add up to how something feels." },
  { k: "試", t: "Experiment, then validate", d: "Explore boldly, then prove what works." },
  { k: "明", t: "Communicate clearly", d: "Plain language, honest scope, no surprises." },
  { k: "責", t: "Deliver responsibly", d: "Secure, documented, and handed over properly." },
];

const VALUES = [
  { k: "好奇", t: "Curiosity" },
  { k: "明瞭", t: "Clarity" },
  { k: "匠", t: "Craft" },
  { k: "信頼", t: "Reliability" },
  { k: "実験", t: "Thoughtful experimentation" },
];

export default function Origin() {
  return (
    <div data-style="jp">
      <Section style="jp" label="Opening statement" rail="Origin" className="relative flex min-h-svh items-center pb-16 pt-32">
        <Enso className="pointer-events-none absolute left-1/2 top-1/2 w-[85vw] max-w-[760px] -translate-x-1/2 -translate-y-1/2 text-fg opacity-[0.12]" />
        <div className="relative grid w-full gap-10 md:grid-cols-12">
          <Parallax speed={0.4} className="hidden md:col-span-2 md:block">
            <span className="vertical font-jp text-[10rem] font-extrabold leading-none">起源</span>
          </Parallax>
          <div className="md:col-span-9 md:col-start-4">
            <Eyebrow index="起">Origin</Eyebrow>
            <Heading as="h1" className="mt-6 text-6xl md:text-[7vw]">
              Where technology, craft and execution meet.
            </Heading>
            <BrushStroke className="mt-6 h-8 w-3/4 text-red" />
          </div>
        </div>
      </Section>

      <Section style="jp" label="Our story" rail="Story" className="grid gap-12 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-4">
          <Eyebrow index="一">Our story</Eyebrow>
          <Hanko text="話" className="mt-10 w-16 text-3xl" />
        </div>
        <Reveal className="space-y-6 text-xl leading-relaxed md:col-span-7 md:text-2xl">
          <p>Too many ideas stall between the people who imagine them and the people who build them.</p>
          <p className="muted">
            ZWEN brings software engineering, mobile development, infrastructure, 3D, motion and brand work into one studio — so a concept can travel from first sketch to a launched, supported product without changing hands at every step.
          </p>
        </Reveal>
      </Section>

      <Section style="jp" label="Our purpose" rail="Purpose" className="py-28 md:py-40">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index="二">Our purpose</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">Turn ideas into things people use and remember.</Heading>
          </div>
          <Lead className="self-end md:col-span-5">
            We help startups, businesses, brands and creators turn concepts into complete digital products and compelling creative experiences.
          </Lead>
        </div>
      </Section>

      <Section style="jp" label="Our philosophy" rail="Philosophy" className="py-20">
        <Eyebrow index="三">Our philosophy</Eyebrow>
        <Heading className="mb-14 mt-6 text-5xl md:text-7xl">Seven principles.</Heading>
        <HorizontalScroll>
          {PRINCIPLES.map((p, i) => (
            <article key={p.t} className="relative flex min-h-[24rem] flex-col justify-between border-l-2 border-fg/80 bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] p-8 md:h-[60vh] md:w-[26rem]">
              <span className="label text-red">{String(i + 1).padStart(2, "0")} / 07</span>
              <span className="font-jp text-[9rem] font-extrabold leading-none">{p.k}</span>
              <div>
                <h3 className="font-jp text-3xl font-extrabold">{p.t}</h3>
                <p className="muted mt-3">{p.d}</p>
              </div>
            </article>
          ))}
        </HorizontalScroll>
      </Section>

      <Section style="jp" label="How we think" rail="Thinking" className="grid gap-12 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <Eyebrow index="四">How we think</Eyebrow>
          <Heading className="mt-6 text-5xl md:text-6xl">Disciplines that talk to each other.</Heading>
        </div>
        <Reveal className="grid gap-px border hairline sm:grid-cols-3 md:col-span-7">
          {[
            { k: "設計", t: "Design", d: "informs what engineering builds — and is shaped by what it can do." },
            { k: "技術", t: "Engineering", d: "makes the experience real, fast and dependable." },
            { k: "表現", t: "Creative", d: "gives the product a voice, a look and a story." },
          ].map((x) => (
            <div key={x.t} className="p-6">
              <p className="font-jp text-4xl font-extrabold text-red">{x.k}</p>
              <h3 className="font-jp mt-6 text-2xl font-extrabold">{x.t}</h3>
              <p className="muted mt-2 text-sm leading-relaxed">{x.d}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section style="jp" label="How we work" rail="Practice" className="py-28 md:py-40">
        <Eyebrow index="五">How we work</Eyebrow>
        <Heading className="mt-6 text-5xl md:text-7xl">In practice.</Heading>
        <Reveal className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            ["Communication", "One clear point of contact and regular updates in plain language."],
            ["Collaboration", "You see work early and often; reviews are built into each milestone."],
            ["Scope", "Deliverables, timelines and responsibilities agreed before work begins."],
            ["Reviews", "Structured feedback rounds so decisions are recorded, not lost."],
            ["Delivery", "Tested, deployed or delivered in the formats you need."],
            ["Handover", "Documentation, access and ownership transferred properly."],
          ].map(([t, d], i) => (
            <div key={t} className="border-t-2 border-fg pt-5">
              <p className="label text-red">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-jp mt-3 text-2xl font-extrabold">{t}</h3>
              <p className="muted mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      <Section style="jp" label="What we value" rail="Values" className="py-28 md:py-40">
        <Eyebrow index="六">What we value</Eyebrow>
        <Reveal as="ul" className="mt-10 border-t hairline" stagger={0.07}>
          {VALUES.map((v) => (
            <li key={v.t} className="group flex items-baseline justify-between gap-6 border-b hairline py-6">
              <span className="font-jp text-4xl font-extrabold transition-transform duration-500 group-hover:translate-x-4 md:text-7xl">{v.t}</span>
              <span className="font-jp text-2xl text-red md:text-4xl">{v.k}</span>
            </li>
          ))}
        </Reveal>
      </Section>

      <Section style="jp" label="Collaborate" rail="Together" className="relative flex flex-col items-center py-32 text-center md:py-48">
        <Hanko text="創" className="w-20 text-4xl" />
        <Heading className="mt-10 max-w-4xl text-5xl md:text-8xl">Let&apos;s make something together.</Heading>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CTA href="/transmit" cursor="SEND">
            Start a project
          </CTA>
          <CTA href="/unit" variant="ghost" cursor="MEET">
            Meet the unit
          </CTA>
        </div>
      </Section>
    </div>
  );
}
