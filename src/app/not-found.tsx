import type { Metadata } from "next";
import { CTA, Eyebrow, Heading, Lead, Section } from "@/components/ui";
import { AsciiField } from "@/components/visuals/AsciiField";
import { TLink } from "@/motion/Transition";

export const metadata: Metadata = { title: "404 — Uncharted space" };

export default function NotFound() {
  return (
    <div data-style="ascii">
      <Section style="ascii" label="Page not found" rail="404" className="flex min-h-svh flex-col justify-center pb-16 pt-28">
        <AsciiField source={{ type: "text", text: "404" }} cell={10} radius={170} className="h-[38vh] w-full md:h-[48vh]" label="404" />
        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow index="ERR">Signal lost · 404</Eyebrow>
            <Heading as="h1" className="mt-6 text-5xl md:text-7xl">
              Looks like you&apos;ve entered an uncharted space.
            </Heading>
          </div>
          <div className="md:col-span-5">
            <Lead className="text-base">
              The page you asked for doesn&apos;t exist, has moved, or is no longer available. Nothing is broken on your side.
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/" cursor="HOME">
                Return to ZERO
              </CTA>
              <CTA href="/archive" variant="ghost" cursor="VIEW">
                Explore Selected Work
              </CTA>
            </div>
            <p className="label muted mt-6">
              Need help?{" "}
              <TLink href="/transmit" className="text-accent hover:underline">
                Transmit
              </TLink>{" "}
              ·{" "}
              <TLink href="/origin" className="text-accent hover:underline">
                Origin
              </TLink>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
