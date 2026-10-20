import type { Metadata } from "next";
import { Reveal } from "@/motion/primitives";
import { Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { AsciiField } from "@/components/visuals/AsciiField";
import { TLink } from "@/motion/Transition";
import { CONTACT } from "@/lib/site";
import { TransmitForm } from "./TransmitForm";

export const metadata: Metadata = {
  title: "TRANSMIT — Contact",
  description: "Tell ZWEN what you're imagining: web or mobile applications, infrastructure, 3D and motion, branding and content.",
};

export default function Transmit() {
  return (
    <div data-style="ascii">
      <Section style="ascii" label="Contact" rail="Transmit" className="grid min-h-[80svh] items-end gap-10 pb-12 pt-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <Eyebrow index="TX">Transmit</Eyebrow>
          <Heading as="h1" className="mt-6 text-6xl md:text-[7vw]">
            Tell us what you&apos;re imagining.
          </Heading>
          <Lead className="mt-8">
            Applications, software, visual production, branding, content — or a combination. Share as much or as little as you know; we&apos;ll take it from there.
          </Lead>
        </div>
        <AsciiField source={{ type: "text", text: "TX" }} cell={9} className="h-[30vh] w-full md:col-span-5 md:h-[46vh]" />
      </Section>

      <Section style="ascii" label="Project enquiry form" rail="Enquiry" className="grid gap-16 py-16 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="label muted mb-4">{"// session open · fields marked * are required"}</p>
          <TransmitForm />
        </div>
        <aside className="space-y-12 md:col-span-4">
          <div>
            <p className="label text-accent">Direct line</p>
            {CONTACT.email ? (
              <a href={`mailto:${CONTACT.email}`} className="font-display mt-3 block text-2xl hover:text-accent">
                {CONTACT.email}
              </a>
            ) : (
              <p className="muted mt-3 text-sm">The official studio email will be listed here. For now, the form is the fastest route to us.</p>
            )}
            {CONTACT.socials.length > 0 && (
              <ul className="mt-4 space-y-1">
                {CONTACT.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="label hover:text-accent">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="label text-accent">What happens next</p>
            <Reveal as="ol" className="mt-4 space-y-4 font-mono text-sm" parallax={false}>
              {["We read your message and review the details.", "We reply by email to set up an initial conversation.", "Together we shape scope, timeline and next steps."].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </Reveal>
          </div>
          <div>
            <p className="label text-accent">Not ready yet?</p>
            <TLink href="/archive" className="label mt-3 inline-block hover:text-accent">
              Explore selected work →
            </TLink>
          </div>
        </aside>
      </Section>
    </div>
  );
}
