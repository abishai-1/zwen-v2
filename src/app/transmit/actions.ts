"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { getDb } from "@/db/client";
import { enquiries } from "@/db/schema";
import { BUDGETS, ENQUIRY_TYPES, TIMELINES } from "@/content/services";

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null);

const Enquiry = z.object({
  name: z.string().trim().min(1, "Tell us your name.").max(120),
  email: z.email("Enter a valid email address.").max(200),
  company: optional(160),
  services: z.array(z.enum(ENQUIRY_TYPES)).min(1, "Pick at least one."),
  budget: z.enum(BUDGETS).nullable(),
  timeline: z.enum(TIMELINES).nullable(),
  description: z.string().trim().min(20, "A few more words, please (20+ characters).").max(5000),
  links: optional(1000),
  consent: z.literal("on", { error: "Please confirm so we can reply." }),
});

export type TransmitState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof Enquiry>, string>>;
};

// Best-effort per-instance throttle; pair with Turnstile for real protection.
const recent = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

async function verifyTurnstile(token: string | null, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

export async function transmit(_prev: TransmitState, form: FormData): Promise<TransmitState> {
  // Honeypot: bots fill hidden fields; pretend success.
  if (form.get("website")) return { status: "success" };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return { status: "error", message: "Too many transmissions. Please try again in a few minutes." };

  const parsed = Enquiry.safeParse({
    name: form.get("name") ?? "",
    email: form.get("email") ?? "",
    company: form.get("company") ?? "",
    services: form.getAll("services"),
    budget: form.get("budget") || null,
    timeline: form.get("timeline") || null,
    description: form.get("description") ?? "",
    links: form.get("links") ?? "",
    consent: form.get("consent") ?? undefined,
  });
  if (!parsed.success) {
    const errors: TransmitState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<TransmitState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Some fields need attention.", errors };
  }

  if (!(await verifyTurnstile(form.get("cf-turnstile-response") as string | null, ip))) {
    return { status: "error", message: "Spam check failed. Please try again." };
  }

  const { consent, ...data } = parsed.data;
  void consent;
  let stored = false;
  let emailed = false;

  const db = getDb();
  if (db) {
    try {
      await db.insert(enquiries).values(data);
      stored = true;
    } catch (e) {
      console.error("[transmit] db insert failed", e);
    }
  }

  const { RESEND_API_KEY, ENQUIRY_TO_EMAIL, ENQUIRY_FROM_EMAIL } = process.env;
  if (RESEND_API_KEY && ENQUIRY_TO_EMAIL && ENQUIRY_FROM_EMAIL) {
    try {
      const { error } = await new Resend(RESEND_API_KEY).emails.send({
        from: ENQUIRY_FROM_EMAIL,
        to: ENQUIRY_TO_EMAIL,
        replyTo: data.email,
        subject: `New enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Company: ${data.company ?? "—"}`,
          `Needs: ${data.services.join(", ")}`,
          `Budget: ${data.budget ?? "—"}`,
          `Timeline: ${data.timeline ?? "—"}`,
          `Links: ${data.links ?? "—"}`,
          "",
          data.description,
        ].join("\n"),
      });
      emailed = !error;
      if (error) console.error("[transmit] email failed", error);
    } catch (e) {
      console.error("[transmit] email failed", e);
    }
  }

  if (!stored && !emailed) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[transmit] (dev, no DB/email configured) received:", data);
      return { status: "success" };
    }
    return { status: "error", message: "Transmission failed on our side. Please try again later." };
  }
  return { status: "success" };
}
