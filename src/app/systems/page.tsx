import type { Metadata } from "next";
import { Parallax, Reveal, Scramble, Marquee } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { Barcode, DataStream, HudRing, StatusDot, Waveform } from "@/components/visuals/Hud";
import { Journey, Folio } from "@/components/blocks";
import { Faq } from "@/components/Faq";
import { BRAND, ENGAGEMENTS, ENGINEERING, PROCESS, VISUAL } from "@/content/services";
import { FAQS } from "@/content/faqs";
import { PROJECTS } from "@/content/projects";

export const metadata: Metadata = {
  title: "SYSTEMS — Services",
  description: "Complete web and mobile applications, infrastructure and deployment, 3D and motion, brand and content — from single services to end-to-end delivery.",
};

function Module({ code, title, items, lead, note }: { code: string; title: string; items: readonly string[]; lead?: string; note?: string }) {
  return (
    <article className="hud flex h-full flex-col p-6 md:p-8">
      <header className="label flex items-center justify-between border-b hairline pb-4">
        <span className="text-accent">MODULE {code}</span>
        <StatusDot label="Online" />
      </header>
      <h3 className="font-display mt-6 text-3xl leading-tight md:text-4xl">{title}</h3>
      {lead && <p className="mt-3 text-accent">{lead}</p>}
      <Reveal as="ul" className="mt-6 space-y-2 text-sm" stagger={0.04} y={14} parallax={false}>
        {items.map((it, i) => (
          <li key={it} className="flex gap-3 border-b hairline pb-2">
            <span className="label muted w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <span>{it}</span>
          </li>
        ))}
      </Reveal>
      {note && <p className="muted mt-6 border-l-2 border-accent pl-4 text-xs leading-relaxed">{note}</p>}
    </article>
  );
}

export default function Systems() {
  return (
    <div data-style="cyber">
      {/* Intro */}
      <Section style="cyber" label="Services introduction" rail="Systems" className="grid min-h-svh items-center gap-12 pb-20 pt-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow index="SYS">Systems / Services</Eyebrow>
          <Heading as="h1" className="mt-6 text-6xl md:text-[7.5vw]">
            Everything it takes to ship.
          </Heading>
          <Lead className="mt-8">
            ZWEN combines engineering and creative production to take ideas from first concept to delivery — and, where agreed, keep them running afterwards.
          </Lead>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              ["03", "Disciplines"],
              ["05", "Eng. modules"],
              ["07", "Process steps"],
            ].map(([n, k]) => (
              <div key={k} className="hud p-3">
                <p className="font-display text-3xl text-accent">{n}</p>
                <p className="label muted mt-1">{k}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative md:col-span-5">
          <Parallax speed={0.25} className="aspect-square w-full text-fg">
            <HudRing className="h-full w-full" label="SYSTEMS // INDEX" />
          </Parallax>
          <DataStream className="absolute -left-4 bottom-0 opacity-60" rows={7} />
        </div>
      </Section>

      <Marquee className="relative z-10 border-y hairline py-3" speed={70} reverse>
        {["Frontend", "Backend", "Databases", "APIs", "Auth", "CI/CD", "Cloud", "Play Store", "App Store", "3D", "VFX", "Identity"].map((t) => (
          <span key={t} className="label flex items-center gap-6 px-6">
            {t} <span className="text-accent">/</span>
          </span>
        ))}
      </Marquee>

      {/* Engineering */}
      <Section style="cyber" id="engineering" label="Engineering and digital products" rail="Engineering" className="py-28 md:py-40">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Eyebrow index="01">Engineering & digital products</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">Complete products — not just interfaces.</Heading>
          </div>
          <div className="md:col-span-4">
            <Waveform className="h-24 w-full" />
            <Barcode className="mt-3 text-fg opacity-50" />
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {ENGINEERING.map((m) => (
            <Module key={m.id} code={`ENG-${m.id}`} title={m.title} items={m.items} lead={"lead" in m ? m.lead : undefined} note={"note" in m ? m.note : undefined} />
          ))}
        </div>
      </Section>

      {/* Visual */}
      <Section style="cyber" id="visual" label="3D, motion and visual experiences" rail="Visual" className="grid gap-12 py-28 md:grid-cols-2 md:py-40">
        <div>
          <Eyebrow index="02">3D, motion & visual experiences</Eyebrow>
          <Heading className="mt-6 text-5xl md:text-6xl">Make it seen. Make it move.</Heading>
          <Lead className="mt-6 text-base">Product visualisation, animation and worlds built for advertising, launches and interactive experiences.</Lead>
        </div>
        <Module code="VIS-01" title="Visual production" items={VISUAL} />
      </Section>

      {/* Brand */}
      <Section style="cyber" id="brand" label="Brand, content and creative" rail="Brand" className="grid gap-12 py-28 md:grid-cols-2 md:py-40">
        <Module code="BRD-01" title="Brand & content" items={BRAND} />
        <div className="md:pl-10">
          <Eyebrow index="03">Brand, content & creative</Eyebrow>
          <Heading className="mt-6 text-5xl md:text-6xl">Give it a voice.</Heading>
          <Lead className="mt-6 text-base">Identity, creative direction and content that keep the product and the brand telling one story.</Lead>
        </div>
      </Section>

      {/* Engagement */}
      <Section style="cyber" label="Engagement models" rail="Engagement" className="py-28 md:py-40">
        <Eyebrow index="04">Engagement models</Eyebrow>
        <Heading className="mt-6 text-5xl md:text-7xl">Ways to work with us.</Heading>
        <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ENGAGEMENTS.map((e, i) => (
            <div key={e.title} className="hud group p-6 transition-colors hover:bg-accent hover:text-bone">
              <p className="label text-accent group-hover:text-bone">MODE_{String.fromCharCode(65 + i)}</p>
              <h3 className="font-display mt-10 text-2xl">
                <Scramble text={e.title} />
              </h3>
              <p className="mt-3 text-sm opacity-70">{e.body}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* Process */}
      <Section style="cyber" label="Process" rail="Process" className="grid gap-16 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Eyebrow index="05">Process</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">Seven steps, one signal.</Heading>
            <Lead className="mt-6 text-base">Support continues only as agreed in each engagement.</Lead>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Journey steps={PROCESS} />
        </div>
      </Section>

      {/* Relevant work */}
      <Section style="cyber" label="Relevant work" rail="Work" className="py-28 md:py-40">
        <Eyebrow index="06">Relevant work</Eyebrow>
        <Heading className="mt-6 text-5xl md:text-6xl">Systems in the field.</Heading>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PROJECTS.slice(0, 2).map((p, i) => (
            <Folio key={p.slug} project={p} index={i} variant="cyber" />
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section style="cyber" label="Frequently asked questions" rail="FAQ" className="grid gap-12 py-28 md:grid-cols-12 md:py-40">
        <div className="md:col-span-4">
          <Eyebrow index="07">Queries</Eyebrow>
          <Heading className="mt-6 text-5xl md:text-6xl">FAQ.</Heading>
        </div>
        <div className="md:col-span-8">
          <Faq items={FAQS} />
        </div>
      </Section>

      <Section style="cyber" label="Start a project" rail="Build" className="py-28 text-center md:py-40">
        <Heading className="mx-auto max-w-4xl text-5xl md:text-8xl">What do you want to build?</Heading>
        <div className="mt-10 flex justify-center">
          <CTA href="/transmit" cursor="SEND">
            Describe your project
          </CTA>
        </div>
      </Section>
    </div>
  );
}
