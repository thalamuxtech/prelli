"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/lib/submissions";

type Status = "idle" | "sending" | "done" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Honeypot — bots fill hidden fields (§8 spam protection)
    if (fd.get("company")) return;

    setStatus("sending");
    try {
      await submitContact({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        subject: String(fd.get("subject") || ""),
        message: String(fd.get("message") || ""),
      });
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-prelli-green/30 bg-prelli-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-prelli-green-600" />
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">
          Message sent — thank you!
        </h3>
        <p className="mt-2 text-slate">
          We've received your message and will get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-prelli-green-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot field (visually hidden) */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" required maxLength={120} placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="How can we help?" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required maxLength={4000} placeholder="Write your message…" />
      </div>

      {status === "error" && (
        <p className="text-sm text-prelli-pink">
          Something went wrong. Please try again or email us directly.
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Send message
          </>
        )}
      </Button>
    </form>
  );
}
