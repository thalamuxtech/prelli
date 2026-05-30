"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { FormSuccess } from "@/components/site/FormSuccess";
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
      <FormSuccess
        title="Message sent. Thank you!"
        message="We've received your message and will get back to you soon."
        onReset={() => setStatus("idle")}
        resetLabel="Send another message"
      />
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
