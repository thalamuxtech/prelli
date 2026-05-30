"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Label, Input, Textarea } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { FormSuccess } from "@/components/site/FormSuccess";
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
        country: String(fd.get("country") || ""),
        state: String(fd.get("state") || ""),
        languages: String(fd.get("languages") || ""),
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
        title="Thank you!"
        message="We've received your inquiry and will reach out to explore how we can work together."
      />
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
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" placeholder="Nigeria" defaultValue="Nigeria" />
        </div>
        <div>
          <Label htmlFor="state">State / Region</Label>
          <Input id="state" name="state" placeholder="e.g. FCT, Lagos" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="languages">Languages spoken</Label>
          <Input id="languages" name="languages" placeholder="e.g. English, Hausa" />
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
