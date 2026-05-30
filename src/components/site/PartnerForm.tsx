"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { submitPartner } from "@/lib/submissions";

type Status = "idle" | "sending" | "done" | "error";

export function PartnerForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot

    setStatus("sending");
    try {
      await submitPartner({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        organisation: String(fd.get("organisation") || ""),
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
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank you!</h3>
        <p className="mt-2 text-slate">
          We&apos;ve received your inquiry and will reach out to explore how we can work together.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Contact name</Label>
          <Input id="name" name="name" required maxLength={120} />
        </div>
        <div>
          <Label htmlFor="organisation">Organisation</Label>
          <Input id="organisation" name="organisation" placeholder="Company / organisation" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" inputMode="tel" />
        </div>
      </div>
      <div>
        <Label htmlFor="message">How would you like to partner?</Label>
        <Textarea id="message" name="message" required maxLength={4000} />
      </div>
      {status === "error" && <p className="text-sm text-prelli-pink">Something went wrong. Please try again.</p>}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</> : <><Send className="h-5 w-5" /> Submit inquiry</>}
      </Button>
    </form>
  );
}
