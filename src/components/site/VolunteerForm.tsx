"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { submitVolunteer } from "@/lib/submissions";

type Status = "idle" | "sending" | "done" | "error";

export function VolunteerForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot

    setStatus("sending");
    try {
      await submitVolunteer({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        message: String(fd.get("message") || ""),
        extra: {
          interests: String(fd.get("interests") || ""),
          country: String(fd.get("country") || ""),
          state: String(fd.get("state") || ""),
          languages: String(fd.get("languages") || ""),
        },
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
          Thank you for stepping up!
        </h3>
        <p className="mt-2 text-slate">
          We've received your application and will reach out about how you can help.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required maxLength={120} placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" placeholder="+234 …" />
        </div>
        <div>
          <Label htmlFor="interests">Area of interest</Label>
          <Input id="interests" name="interests" placeholder="e.g. outreach, education, logistics" />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="Nigeria" defaultValue="Nigeria" />
        </div>
        <div>
          <Label htmlFor="state">State / Region</Label>
          <Input id="state" name="state" placeholder="e.g. FCT, Kaduna" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="languages">Languages spoken</Label>
          <Input id="languages" name="languages" placeholder="e.g. English, Hausa, Yoruba" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">Why would you like to volunteer?</Label>
        <Textarea id="message" name="message" required maxLength={4000} placeholder="Tell us a little about yourself…" />
      </div>

      {status === "error" && (
        <p className="text-sm text-prelli-pink">Something went wrong. Please try again.</p>
      )}

      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Submitting…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> Submit application
          </>
        )}
      </Button>
    </form>
  );
}
