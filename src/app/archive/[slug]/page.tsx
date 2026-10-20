import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { TLink } from "@/motion/Transition";
import { Parallax, Reveal, Scramble } from "@/motion/primitives";
import { CTA, Eyebrow, Heading, Section } from "@/components/ui";
import { Ornament, Sigil, WaxSeal } from "@/components/visuals/Codex";
import { AsciiField } from "@/components/visuals/AsciiField";
import { PROJECTS } from "@/content/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/archive/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — Archive`, description: p.summary } : {};
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV"];

function Chapter({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="grid gap-6 border-t hairline py-12 md:grid-cols-12" parallax={false}>
      <div className="md:col-span-4">
        <p className="label text-accent">Chapter {ROMAN[n - 1]}</p>
        <h2 className="font-fraktur mt-2 text-4xl md:text-5xl">{title}</h2>
      </div>
      <div className="text-lg leading-relaxed md:col-span-8">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span className="text-accent">✠</span>
          {i}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudy({ params }: PageProps<"/archive/[slug]">) {
  const { slug } = await params;
  const idx = PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) notFound();
  const p = PROJECTS[idx];
  const next = PROJECTS.length > 1 ? PROJECTS[(idx + 1) % PROJECTS.length] : null;
  let n = 0;
  const ch = () => ++n;

  return (
    <div data-style="med">
      <Section style="med" label="Project overview" rail="Folio" className="relative flex min-h-svh flex-col justify-end pb-16 pt-32">
        <Parallax speed={0.3} className="pointer-events-none absolute right-0 top-24 w-[60vw] max-w-[520px] text-fg opacity-30">
          <Sigil className="aspect-square w-full" />
        </Parallax>
        <TLink href="/archive" className="label muted mb-10 hover:text-accent">
          ← Back to the archive
        </TLink>
        <Eyebrow index={p.year}>{`${p.category} · ${p.status}`}</Eyebrow>
        <Heading as="h1" font="font-fraktur" className="mt-6 text-6xl md:text-[8vw]">
          {p.title}
        </Heading>
        <Ornament className="mt-4 h-8 w-full max-w-xl text-fg" />
        <p className="mt-8 max-w-2xl text-xl leading-relaxed">{p.summary}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {p.role.map((r) => (
            <span key={r} className="hud label px-3 py-2">
              {r}
            </span>
          ))}
        </div>
      </Section>

      <Section style="med" label="Visual" rail="Plate" className="py-10">
        <div className="hud relative aspect-[16/8] overflow-hidden">
          <AsciiField source={{ type: "text", text: p.title.split(" ")[0] }} glyphs="med" cell={10} className="h-full w-full" />
          <span className="label absolute bottom-4 left-4 text-accent">Plate I — {p.title}</span>
        </div>
      </Section>

      <Section style="med" label="Case study" rail="Chronicle" className="py-16">
        {p.context && (
          <Chapter n={ch()} title="Context">
            <p>{p.context}</p>
          </Chapter>
        )}
        {p.challenge && (
          <Chapter n={ch()} title="Challenge">
            <p>{p.challenge}</p>
          </Chapter>
        )}
        {p.objectives && (
          <Chapter n={ch()} title="Objectives">
            <List items={p.objectives} />
          </Chapter>
        )}
        {p.approach && (
          <Chapter n={ch()} title="Approach">
            <p>{p.approach}</p>
          </Chapter>
        )}
        {p.scope && (
          <Chapter n={ch()} title="Scope of work">
            <List items={p.scope} />
          </Chapter>
        )}
        {p.build && (
          <Chapter n={ch()} title="Design & development">
            <p>{p.build}</p>
          </Chapter>
        )}
        {p.stack && (
          <Chapter n={ch()} title="Technology & tools">
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="hud label px-3 py-2">
                  <Scramble text={s} />
                </span>
              ))}
            </div>
          </Chapter>
        )}
        {p.release && (
          <Chapter n={ch()} title="Infrastructure & release">
            <p>{p.release}</p>
          </Chapter>
        )}
        {p.liveUrl && (
          <Chapter n={ch()} title="Deliverables">
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-accent underline-offset-4 hover:underline">
              Visit the live project ↗
            </a>
          </Chapter>
        )}
        <Chapter n={ch()} title="Results">
          {p.results?.length ? <List items={p.results} /> : <p className="muted">Results will be recorded here once verified. We don&apos;t publish estimated or invented metrics.</p>}
        </Chapter>
        {p.credits && (
          <Chapter n={ch()} title="Credits">
            <List items={p.credits} />
          </Chapter>
        )}
      </Section>

      {next && next.slug !== p.slug && (
        <Section style="med" label="Next project" rail="Next" className="py-16">
          <TLink href={`/archive/${next.slug}`} data-cursor="NEXT" className="group hud flex items-center justify-between p-8">
            <span>
              <span className="label muted">Next folio</span>
              <span className="font-fraktur mt-2 block text-5xl">{next.title}</span>
            </span>
            <span className="text-4xl transition-transform group-hover:translate-x-2">→</span>
          </TLink>
        </Section>
      )}

      <Section style="med" label="Start a related project" rail="Commission" className="flex flex-col items-center py-28 text-center">
        <WaxSeal letter="Z" className="w-20 text-4xl" />
        <Heading className="mt-10 max-w-3xl text-5xl md:text-7xl">Planning something similar?</Heading>
        <div className="mt-10">
          <CTA href="/transmit" cursor="SEND">
            Start a related project
          </CTA>
        </div>
      </Section>
    </div>
  );
}
