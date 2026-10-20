import { TLink } from "@/motion/Transition";
import { Marquee, Parallax, Reveal, Scramble } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { AsciiField } from "@/components/visuals/AsciiField";
import { Barcode, HudRing, StatusDot } from "@/components/visuals/Hud";
import { BrushStroke, Enso, Hanko } from "@/components/visuals/Ink";
import { Ornament, Sigil } from "@/components/visuals/Codex";
import { Dossier, Folio, Journey } from "@/components/blocks";
import { JOURNEY, PILLARS } from "@/content/services";
import { PROJECTS } from "@/content/projects";
import { TEAM } from "@/content/team";

export default function Zero() {
  const featured = PROJECTS.slice(0, 3);
  const sealed = Math.max(0, 3 - featured.length);

  return (
    <>
      {/* ── 01 HERO · ASCII ───────────────────────────── */}
      <Section style="ascii" label="Introduction" rail="ZWEN" className="flex min-h-svh flex-col pb-10 pt-28 md:pt-32">
        <div className="flex items-start justify-between gap-6">
          <Eyebrow index="00">Creative technology agency</Eyebrow>
          <StatusDot label="Signal online" className="hidden md:inline-flex" />
        </div>

        <div className="relative my-6 flex flex-1 items-center">
          <AsciiField source={{ type: "image", src: "/brand/zwen-mask.png" }} cell={9} radius={130} className="h-[34vh] w-full md:h-[48vh]" label="ZWEN" />
        </div>

        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Heading as="h1" className="text-[13vw] md:text-[6.4vw]">
              From idea to experience.
            </Heading>
          </div>
          <div className="md:col-span-5">
            <Lead className="text-base md:text-lg">
              ZWEN plans, builds and launches digital products, mobile applications and visual experiences — engineering and creativity in one studio.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/transmit">Start a Project</CTA>
              <CTA href="/archive" variant="ghost" cursor="VIEW">
                Explore Selected Work
              </CTA>
            </div>
          </div>
        </div>
      </Section>

      <Marquee className="relative z-10 my-10 border-y hairline py-4" speed={50}>
        {["Web applications", "Mobile apps", "Infrastructure", "3D & motion", "VFX", "Brand identity", "Content", "Deployment"].map((t) => (
          <span key={t} className="label flex items-center gap-8 px-8 text-sm">
            {t} <span className="text-accent">✦</span>
          </span>
        ))}
      </Marquee>

      {/* ── 02 APPROACH · CYBER ───────────────────────── */}
      <Section style="cyber" label="The ZWEN approach" rail="Approach" className="grid gap-16 py-32 md:grid-cols-12 md:py-48">
        <div className="relative md:col-span-5">
          <Parallax speed={0.3} className="mx-auto aspect-square w-full max-w-md text-fg">
            <HudRing className="h-full w-full" label="ZWEN // APPROACH" />
          </Parallax>
          <Barcode className="mt-6 text-fg opacity-60" />
        </div>
        <div className="md:col-span-7 md:pt-16">
          <Eyebrow index="01">The ZWEN approach</Eyebrow>
          <Heading className="mt-6 text-5xl md:text-7xl">Technology and creativity, one team.</Heading>
          <Lead className="mt-8">
            We connect software engineering with 3D, motion and brand work, so ideas don&apos;t get lost between disconnected vendors.
          </Lead>
          <Reveal className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { k: "MODE_A", t: "A single service", d: "One focused need — an app, an identity, a render, a deployment." },
              { k: "MODE_B", t: "A complete project", d: "Planning through engineering, launch and creative execution." },
            ].map((m) => (
              <div key={m.k} className="hud p-6">
                <p className="label text-accent">{m.k}</p>
                <h3 className="font-display mt-3 text-2xl">{m.t}</h3>
                <p className="muted mt-2 text-sm leading-relaxed">{m.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* ── 03 DISCIPLINES · JAPANESE ─────────────────── */}
      <Section style="jp" label="Our disciplines" rail="Disciplines" className="py-32 md:py-48">
        <Enso className="pointer-events-none absolute -right-10 top-10 w-[60vw] max-w-[640px] text-fg opacity-15" />
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow index="02">Our disciplines</Eyebrow>
            <Heading className="mt-6 text-6xl md:text-8xl">Three disciplines.<br />One studio.</Heading>
          </div>
          <Hanko text="三" className="hidden w-20 text-4xl md:grid" />
        </div>
        <Reveal className="mt-20 grid gap-px border-y hairline md:grid-cols-3">
          {PILLARS.map((p) => (
            <TLink key={p.no} href={`/systems#${p.anchor}`} data-cursor="EXPLORE" className="group relative flex min-h-[26rem] gap-6 p-6 md:p-8">
              <span className="vertical font-jp text-7xl leading-none opacity-90 transition-colors group-hover:text-accent md:text-8xl">{p.kanji}</span>
              <div className="flex flex-col">
                <span className="label text-accent">{p.no}</span>
                <h3 className="font-display mt-4 text-3xl leading-tight">{p.title}</h3>
                <p className="muted mt-4 text-sm leading-relaxed">{p.short}</p>
                <span className="label mt-auto pt-8">
                  Explore <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
              <BrushStroke className="pointer-events-none absolute bottom-3 left-6 h-4 w-1/2 text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
            </TLink>
          ))}
        </Reveal>
      </Section>

      {/* ── 04 SELECTED WORK · MEDIEVAL ───────────────── */}
      <Section style="med" label="Selected work" rail="Selected work" className="py-32 md:py-48">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <Eyebrow index="III">Selected work</Eyebrow>
            <h2 className="font-fraktur mt-6 text-7xl leading-[0.9] md:text-[9rem]">
              <Scramble text="The Archive" hover={false} />
            </h2>
            <Ornament className="mt-6 h-6 w-full max-w-lg text-fg" />
          </div>
          <Parallax speed={0.4} className="mx-auto w-48 text-fg md:col-span-4 md:w-64">
            <Sigil className="aspect-square w-full" />
          </Parallax>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {featured.map((p, i) => (
            <Folio key={p.slug} project={p} index={i} />
          ))}
          {Array.from({ length: sealed }, (_, i) => (
            <Folio key={`sealed-${i}`} index={featured.length + i} />
          ))}
        </div>
        <div className="mt-12">
          <CTA href="/archive" variant="ghost" cursor="ENTER">
            Enter the archive
          </CTA>
        </div>
      </Section>

      {/* ── 05 HOW WE WORK · CYBER ────────────────────── */}
      <Section style="cyber" label="How we work" rail="Process" className="grid gap-16 py-32 md:grid-cols-12 md:py-48">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Eyebrow index="04">How we work</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">The journey, adapted to you.</Heading>
            <Lead className="mt-8 text-base">
              Every engagement is different. This is the general shape — we adapt it to your scope rather than forcing one workflow on every project.
            </Lead>
            <div className="mt-10">
              <CTA href="/systems" variant="ghost" cursor="SPEC">
                See all systems
              </CTA>
            </div>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Journey steps={JOURNEY} />
        </div>
      </Section>

      {/* ── 06 STUDIO · JAPANESE ──────────────────────── */}
      <Section style="jp" label="Studio introduction" rail="Studio" className="py-32 md:py-48">
        <div className="grid gap-12 md:grid-cols-12">
          <Parallax speed={0.5} className="hidden md:col-span-2 md:block">
            <span className="vertical font-jp text-[9rem] leading-none">起源</span>
          </Parallax>
          <div className="md:col-span-8 md:col-start-4">
            <Eyebrow index="05">The studio</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">Built to take ideas all the way.</Heading>
            <BrushStroke className="mt-6 h-6 w-2/3 text-accent" />
            <Lead className="mt-8">
              ZWEN exists to help startups, businesses, brands and creators turn concepts into complete, usable products and compelling visual experiences.
            </Lead>
            <div className="mt-10">
              <CTA href="/origin" variant="ghost" cursor="READ">
                Our origin
              </CTA>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 07 TEAM · CYBER ───────────────────────────── */}
      <Section style="cyber" label="Team preview" rail="Unit" className="py-32 md:py-48">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow index="06">The unit</Eyebrow>
            <Heading className="mt-6 text-5xl md:text-7xl">The people behind it.</Heading>
          </div>
          <CTA href="/unit" variant="ghost" cursor="MEET">
            Meet the unit
          </CTA>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TEAM.map((m) => (
            <Dossier key={m.id} member={m} compact />
          ))}
        </div>
      </Section>

      {/* ── 08 CLOSING · ASCII ────────────────────────── */}
      <Section style="ascii" label="Start a project" rail="Start" className="grid min-h-[80svh] items-center gap-10 py-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow index="07">Transmission</Eyebrow>
          <Heading className="mt-6 text-6xl md:text-8xl">Have an idea? Let&apos;s make it real.</Heading>
          <div className="mt-10">
            <CTA href="/transmit" cursor="SEND">
              Start a Project
            </CTA>
          </div>
        </div>
        <AsciiField source={{ type: "text", text: "?" }} cell={10} className="h-[40vh] w-full md:col-span-5 md:h-[60vh]" />
      </Section>
    </>
  );
}
