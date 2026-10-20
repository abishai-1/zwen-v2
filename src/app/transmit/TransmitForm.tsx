"use client";

import Script from "next/script";
import { startTransition, useActionState, useRef, useState } from "react";
import { gsap } from "@/motion/gsap";
import { useScene } from "@/motion/primitives";
import { reducedMotion } from "@/motion/store";
import { BUDGETS, ENQUIRY_TYPES, TIMELINES } from "@/content/services";
import { transmit, type TransmitState } from "./actions";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function Prompt({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div data-line className="grid gap-2 border-b hairline py-5 md:grid-cols-[14rem_1fr] md:items-baseline md:gap-6">
      <label htmlFor={id} className="font-mono text-sm uppercase tracking-wide">
        <span className="text-accent">&gt;</span> {label}
        {required ? <span className="text-accent"> *</span> : <span className="muted"> (optional)</span>}
      </label>
      <div>
        {children}
        {error && (
          <p id={`${id}-error`} role="alert" className="mt-2 font-mono text-xs text-red">
            ! {error}
          </p>
        )}
      </div>
    </div>
  );
}

export function TransmitForm() {
  const [state, action, pending] = useActionState<TransmitState, FormData>(transmit, { status: "idle" });
  const [filled, setFilled] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const e = state.errors ?? {};

  useScene(formRef, (el) => {
    if (reducedMotion()) return;
    gsap.from(el.querySelectorAll("[data-line]"), { x: -30, autoAlpha: 0, stagger: 0.06, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  const progress = () => {
    const f = formRef.current;
    if (!f) return;
    const d = new FormData(f);
    const checks = [!!d.get("name"), !!d.get("email"), d.getAll("services").length > 0, String(d.get("description") ?? "").length >= 20, !!d.get("consent")];
    setFilled(checks.filter(Boolean).length);
  };

  const bar = Math.round((filled / 5) * 24);

  if (state.status === "success") {
    return (
      <div className="hud p-8 font-mono md:p-12" role="status">
        <p className="text-accent">[ OK ] TRANSMISSION RECEIVED</p>
        <p className="mt-6 text-4xl md:text-6xl">TRANSMITTED.</p>
        <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed">
          Thank you — your message reached the studio. We review every enquiry personally and will reply by email to continue the conversation.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      // Submitted manually so React doesn't reset the fields when validation fails.
      onSubmit={(ev) => {
        ev.preventDefault();
        const data = new FormData(ev.currentTarget);
        startTransition(() => action(data));
      }}
      onChange={progress}
      noValidate
      className="font-mono"
    >
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Prompt id="name" label="Name" required error={e.name}>
        <input id="name" name="name" autoComplete="name" className="field" placeholder="type here_" aria-invalid={!!e.name} aria-describedby={e.name ? "name-error" : undefined} />
      </Prompt>
      <Prompt id="email" label="Email" required error={e.email}>
        <input id="email" name="email" type="email" autoComplete="email" className="field" placeholder="you@company.com" aria-invalid={!!e.email} aria-describedby={e.email ? "email-error" : undefined} />
      </Prompt>
      <Prompt id="company" label="Company / brand">
        <input id="company" name="company" autoComplete="organization" className="field" placeholder="—" />
      </Prompt>

      <fieldset data-line className="grid gap-2 border-b hairline py-5 md:grid-cols-[14rem_1fr] md:gap-6">
        <legend className="sr-only">What do you need?</legend>
        <span aria-hidden className="text-sm uppercase tracking-wide">
          <span className="text-accent">&gt;</span> What do you need<span className="text-accent"> *</span>
        </span>
        <div>
          <div className="flex flex-wrap gap-2">
            {ENQUIRY_TYPES.map((t) => (
              <label key={t} className="group relative cursor-pointer">
                <input type="checkbox" name="services" value={t} className="peer sr-only" />
                <span className="hud inline-block px-3 py-2 text-xs uppercase transition-colors peer-checked:bg-accent peer-checked:text-bone peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-accent group-hover:text-accent peer-checked:group-hover:text-bone">
                  [{" "}
                  {t}{" "}]
                </span>
              </label>
            ))}
          </div>
          {e.services && (
            <p role="alert" className="mt-2 text-xs text-red">
              ! {e.services}
            </p>
          )}
        </div>
      </fieldset>

      <Prompt id="budget" label="Budget range">
        <select id="budget" name="budget" className="field bg-bg" defaultValue="">
          <option value="">— select —</option>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Prompt>
      <Prompt id="timeline" label="Expected timeline">
        <select id="timeline" name="timeline" className="field bg-bg" defaultValue="">
          <option value="">— select —</option>
          {TIMELINES.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </Prompt>
      <Prompt id="description" label="Project description" required error={e.description}>
        <textarea
          id="description"
          name="description"
          rows={6}
          className="field resize-y"
          placeholder="What are you imagining? Goals, audience, constraints…"
          aria-invalid={!!e.description}
          aria-describedby={e.description ? "description-error" : undefined}
        />
      </Prompt>
      <Prompt id="links" label="Reference links">
        <textarea id="links" name="links" rows={2} className="field resize-y" placeholder="https://…" />
      </Prompt>

      <div data-line className="py-6">
        <label className="flex items-start gap-3 font-sans text-sm leading-relaxed">
          <input type="checkbox" name="consent" className="mt-1 accent-[var(--accent)]" aria-invalid={!!e.consent} />
          <span>
            I agree that ZWEN may use these details to respond to this enquiry and discuss my project. They aren&apos;t sold or shared, and you can ask us to delete them at any time.
          </span>
        </label>
        {e.consent && (
          <p role="alert" className="mt-2 text-xs text-red">
            ! {e.consent}
          </p>
        )}
      </div>

      {SITE_KEY && <div className="cf-turnstile my-4" data-sitekey={SITE_KEY} data-theme="dark" />}

      <div data-line className="mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-xs" aria-hidden>
          <span className="muted">SIGNAL </span>[<span className="text-accent">{"█".repeat(bar)}</span>
          <span className="muted">{"·".repeat(24 - bar)}</span>] {Math.round((filled / 5) * 100)}%
        </p>
        <button type="submit" disabled={pending} data-magnetic data-cursor="SEND" className="label group relative inline-flex items-center gap-3 overflow-hidden bg-accent px-8 py-4 text-bone disabled:opacity-60">
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-fg transition-transform duration-500 group-hover:scale-y-100" />
          <span className="relative group-hover:text-bg">{pending ? "Transmitting…" : "Transmit ▶"}</span>
        </button>
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="mt-4 text-sm text-red">
          ! {state.message}
        </p>
      )}
    </form>
  );
}
