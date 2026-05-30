"use client";

import { useState } from "react";
import { CheckCircle2, HandHeart, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { submitPledge } from "@/lib/submissions";

type Status = "idle" | "sending" | "done" | "error";

export function PledgeForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("company")) return; // honeypot

    setStatus("sending");
    try {
      await submitPledge({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        amount: String(fd.get("amount") || ""),
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
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Thank you for your pledge!</h3>
        <p className="mt-2 text-slate">We&apos;ll be in touch with the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px]" aria-hidden />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="p-name">Your name</Label>
          <Input id="p-name" name="name" required maxLength={120} />
        </div>
        <div>
          <Label htmlFor="p-email">Email</Label>
          <Input id="p-email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="p-phone">Phone</Label>
          <Input id="p-phone" name="phone" type="tel" inputMode="tel" />
        </div>
        <div>
          <Label htmlFor="p-amount">Pledge (amount or items)</Label>
          <Input id="p-amount" name="amount" placeholder="e.g. ₦50,000 or 10 bags of rice" />
        </div>
      </div>
      <div>
        <Label htmlFor="p-message">Anything else?</Label>
        <Textarea id="p-message" name="message" maxLength={4000} className="min-h-[100px]" />
      </div>
      {status === "error" && <p className="text-sm text-prelli-pink">Something went wrong. Please try again.</p>}
      <Button type="submit" size="lg" disabled={status === "sending"}>
        {status === "sending" ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</> : <><HandHeart className="h-5 w-5" /> Make a pledge</>}
      </Button>
    </form>
  );
}
